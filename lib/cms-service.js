import { getDb } from './mongodb';
import { ObjectId } from 'mongodb';
import { parsePageContent } from './cms-parser';
import path from 'path';
import fs from 'fs';

// Calculate SEO completeness score (0-100)
function calculateSeoScore(seo) {
  if (!seo) return 0;
  let score = 0;
  const checks = [
    { field: 'metaTitle', weight: 15 },
    { field: 'metaDescription', weight: 15 },
    { field: 'metaKeywords', weight: 5, isArray: true },
    { field: 'canonicalUrl', weight: 10 },
    { field: 'openGraph.title', weight: 10 },
    { field: 'openGraph.description', weight: 10 },
    { field: 'openGraph.image', weight: 5 },
    { field: 'twitterCard.title', weight: 5 },
    { field: 'twitterCard.description', weight: 5 },
    { field: 'schema.type', weight: 10 },
    { field: 'robots', weight: 5 },
    { field: 'sitemap.include', weight: 5 },
  ];

  for (const check of checks) {
    const parts = check.field.split('.');
    let value = seo;
    for (const part of parts) {
      value = value?.[part];
    }

    if (check.isArray) {
      if (Array.isArray(value) && value.length > 0) score += check.weight;
    } else if (value !== undefined && value !== null && value !== '') {
      score += check.weight;
    }
  }

  return Math.min(100, score);
}

// Get dashboard statistics
export async function getDashboardCounts() {
  const db = await getDb();
  const [appCount, contactCount, reviewCount, routesCount, mediaCount] = await Promise.all([
    db.collection('applications').countDocuments({}),
    db.collection('contact_submissions').countDocuments({}),
    db.collection('reviews').countDocuments({}),
    db.collection('cms_routes').countDocuments({ websiteId: 'default', path: { $ne: '/products/[category]' } }),
    db.collection('cms_media').countDocuments({ websiteId: 'default' }),
  ]);
  return {
    applicationCount: appCount,
    contactCount: contactCount,
    reviewCount: reviewCount,
    pagesCount: routesCount,
    mediaCount: mediaCount,
    websitesCount: 0,
  };
}

// List active routes
export async function getRoutesList() {
  const db = await getDb();
  const routes = await db.collection('cms_routes')
    .find({ websiteId: 'default' })
    .sort({ path: 1 })
    .toArray();

  return routes
    .filter(r => r.path !== '/products/[category]')
    .map(r => {
      if (r.parentPath === '/products/[category]') {
        return {
          ...r,
          _id: r._id.toString(),
          parentPath: '/products',
          depth: 2
        };
      }
      return {
        ...r,
        _id: r._id.toString(),
      };
    });
}

// Get SEO data for all pages
export async function getSeoList() {
  const db = await getDb();
  const seoEntries = await db.collection('cms_seo')
    .find({ websiteId: 'default' })
    .sort({ path: 1 })
    .toArray();

  const routes = await db.collection('cms_routes')
    .find({ websiteId: 'default', status: 'active' })
    .sort({ path: 1 })
    .toArray();

  return routes
    .filter(route => route.path !== '/products/[category]')
    .map(route => {
      const seo = seoEntries.find(s => s.routeId?.toString() === route._id.toString());
      return {
        _id: route._id.toString(),
        path: route.path,
        type: route.type,
        status: route.status,
        hasSeo: !!seo,
        seoScore: calculateSeoScore(seo),
        metaTitle: seo?.metaTitle || '',
        metaDescription: seo?.metaDescription || '',
        seoId: seo?._id?.toString() || null,
        updatedAt: seo?.updatedAt || null,
      };
    });
}

// Get single SEO entry
export async function getSeoEntry(routeId, websiteId = 'default') {
  const db = await getDb();
  const filter = { websiteId };
  if (routeId) {
    const ids = [routeId];
    if (ObjectId.isValid(routeId)) {
      ids.push(new ObjectId(routeId));
    }
    filter.routeId = { $in: ids };
  } else {
    return {
      seo: null,
      isNew: true,
      seoScore: 0
    };
  }

  const seo = await db.collection('cms_seo').findOne(filter);

  if (!seo) {
    return {
      seo: {
        metaTitle: '',
        metaDescription: '',
        metaKeywords: [],
        canonicalUrl: '',
        robots: { index: true, follow: true, noArchive: false, noSnippet: false },
        openGraph: { title: '', description: '', image: '', type: 'website', locale: 'en_AE' },
        twitterCard: { cardType: 'summary_large_image', title: '', description: '', image: '' },
        schema: { type: 'WebPage', customSchema: '' },
        sitemap: { include: true, priority: 0.5, changeFrequency: 'weekly' },
      },
      isNew: true,
      seoScore: 0,
    };
  }

  return {
    seo: { ...seo, _id: seo._id.toString() },
    seoScore: calculateSeoScore(seo),
    isNew: false,
  };
}

// Category splitting helper
function getCategoryBlock(fileContent, categoryId) {
  const keys = ['fans', 'batteries', 'fuses-breakers', 'changeovers', 'inverters'];
  const idx = keys.indexOf(categoryId);
  if (idx === -1) return fileContent;

  const getPos = (key) => {
    let pos = fileContent.indexOf(`${key}: {`);
    if (pos === -1) pos = fileContent.indexOf(`"${key}": {`);
    if (pos === -1) pos = fileContent.indexOf(`'${key}': {`);
    return pos;
  };

  const startPos = getPos(categoryId);
  if (startPos === -1) return '';

  let endPos = fileContent.length;
  for (let i = idx + 1; i < keys.length; i++) {
    const nextPos = getPos(keys[i]);
    if (nextPos !== -1 && nextPos > startPos) {
      endPos = nextPos;
      break;
    }
  }

  if (idx === keys.length - 1) {
    const endOfCatalog = fileContent.indexOf('};', startPos);
    if (endOfCatalog !== -1) {
      endPos = endOfCatalog;
    }
  }

  return fileContent.substring(startPos, endPos);
}

// Get page content with dynamic component code parsing
export async function getPageContent(routeId, websiteId = 'default') {
  const db = await getDb();
  const filter = { websiteId };
  const ids = [routeId];
  if (ObjectId.isValid(routeId)) {
    ids.push(new ObjectId(routeId));
  }
  filter.routeId = { $in: ids };

  const route = await db.collection('cms_routes').findOne({ _id: new ObjectId(routeId) });
  const isGlobalNavbar = route && route.path === '[Global] Navbar';
  const isGlobalFooter = route && route.path === '[Global] Footer';

  const shouldExcludeSection = (sectionId, sectionName) => {
    const sid = (sectionId || '').toLowerCase();
    const sname = (sectionName || '').toLowerCase();

    const isHomePage = route && route.path === '/';
    if (isHomePage && (sid === 'page_content' || sid === 'main' || sname === 'page content' || sname === 'main')) {
      return true;
    }

    if (isGlobalNavbar) {
      return sid !== 'navbar' && sname !== 'navbar';
    }

    if (isGlobalFooter) {
      return sid !== 'footer' && sname !== 'footer';
    }

    if (sid === 'navbar' || sname === 'navbar' || sid === 'footer' || sname === 'footer') {
      return true;
    }

    return false;
  };

  const content = await db.collection('cms_page_content').findOne(filter);

  if (content && Array.isArray(content.sections)) {
    content.sections = content.sections.filter(s => !shouldExcludeSection(s.sectionId, s.sectionName));
  }

  let parsedSections = [];
  if (route && route.filePath) {
    try {
      const absoluteFilePath = path.join(process.cwd(), route.filePath);
      parsedSections = parsePageContent(absoluteFilePath);
    } catch (parseErr) {
      console.error('Failed to parse page content dynamically:', parseErr);
    }
  }

  parsedSections = parsedSections.filter(s => !shouldExcludeSection(s.sectionId, s.sectionName));

  if (route && route.path) {
    const categoryMatch = route.path.match(/^\/products\/(fans|batteries|fuses-breakers|changeovers|inverters)$/);
    if (categoryMatch) {
      const categoryId = categoryMatch[1];
      const absoluteFilePath = path.join(process.cwd(), route.filePath);
      try {
        const fileContent = fs.readFileSync(absoluteFilePath, 'utf-8');
        const blockText = getCategoryBlock(fileContent, categoryId);

        const isValueInBlock = (val) => {
          if (val === undefined || val === null) return false;
          const cleanVal = String(val).trim();
          if (cleanVal.length < 2) return false;
          return blockText.includes(cleanVal);
        };

        const originalSection = parsedSections[0];
        if (originalSection) {
          const newSections = [];
          let currentSection = {
            sectionId: 'category_header',
            sectionName: 'Category Header',
            filePath: originalSection.filePath,
            fields: {}
          };

          const filteredFieldsEntries = Object.entries(originalSection.fields || {})
            .filter(([_, field]) => isValueInBlock(field.originalValue));

          let productIdx = 1;
          for (const [key, field] of filteredFieldsEntries) {
            const isProductName = key.startsWith('js_name_');
            if (isProductName) {
              if (Object.keys(currentSection.fields).length > 0) {
                newSections.push(currentSection);
              }
              const productName = field.value || `Product ${productIdx}`;
              currentSection = {
                sectionId: `product_${productIdx++}`,
                sectionName: productName,
                filePath: originalSection.filePath,
                fields: {}
              };
            }
            currentSection.fields[key] = field;
          }

          if (Object.keys(currentSection.fields).length > 0) {
            newSections.push(currentSection);
          }

          newSections.forEach((sec, idx) => {
            sec.order = idx + 1;
          });

          parsedSections = newSections;
        }
      } catch (readErr) {
        console.error('Failed to parse and split dynamic categories:', readErr);
      }
    }
  }

  let mergedSections = [];
  if (content && Array.isArray(content.sections)) {
    const isMatchingSection = (parsed, dbSec) => {
      const parsedId = parsed.sectionId.toLowerCase();
      const dbId = (dbSec.sectionId || '').toLowerCase();
      const parsedName = parsed.sectionName.toLowerCase();
      const dbName = (dbSec.sectionName || '').toLowerCase();
      
      return parsedId === dbId || 
             dbId.startsWith(parsedId + '_') || 
             parsedName === dbName || 
             dbName.includes(parsedName) || 
             parsedName.includes(dbName);
    };

    for (const parsedSec of parsedSections) {
      const existingSec = content.sections.find(s => isMatchingSection(parsedSec, s));

      if (!existingSec) {
        mergedSections.push(parsedSec);
      } else {
        const mergedSec = {
          ...parsedSec,
          sectionId: existingSec.sectionId || parsedSec.sectionId,
          sectionName: existingSec.sectionName || parsedSec.sectionName,
        };
        
        mergedSec.fields = { ...parsedSec.fields };
        for (const [key, parsedField] of Object.entries(parsedSec.fields || {})) {
          let dbField = null;
          if (existingSec.fields) {
            // Match by originalValue first
            const matchedDbEntry = Object.entries(existingSec.fields).find(([_, f]) => f && f.originalValue === parsedField.originalValue);
            if (matchedDbEntry) {
              dbField = matchedDbEntry[1];
            } else {
              // Fallback to key matching ONLY if legacy data has no originalValue or if originalValue matches
              const keyDbField = existingSec.fields[key];
              if (keyDbField && (!keyDbField.originalValue || keyDbField.originalValue === parsedField.originalValue)) {
                dbField = keyDbField;
              }
            }
          }

          if (!dbField) {
            mergedSec.fields[key] = { ...parsedField };
          } else {
            mergedSec.fields[key] = {
              ...parsedField,
              value: (dbField.value !== undefined && dbField.value !== null) ? dbField.value : parsedField.value,
              alt: dbField.alt !== undefined ? dbField.alt : parsedField.alt,
              title: dbField.title !== undefined ? dbField.title : parsedField.title,
              tag: dbField.tag !== undefined ? dbField.tag : parsedField.tag,
            };
          }
        }
        mergedSections.push(mergedSec);
      }
    }

    for (const dbSec of content.sections) {
      const existsInParsed = parsedSections.some(s => isMatchingSection(s, dbSec));
      if (!existsInParsed) {
        mergedSections.push(dbSec);
      }
    }
  } else {
    mergedSections = parsedSections;
  }

  mergedSections.forEach((s, idx) => {
    s.order = idx + 1;
  });

  const responseContent = {
    sections: mergedSections,
    status: content?.status || 'draft',
    version: content?.version || 1,
  };
  if (content && content._id) {
    responseContent._id = content._id.toString();
  }

  const templates = {
    hero: 'Hero Section',
    about: 'About Section',
    services: 'Services Section',
    faq: 'FAQ Section',
    contact: 'Contact Section',
    custom: 'Custom Section'
  };

  return {
    content: responseContent,
    isNew: !content,
    templates: Object.entries(templates).map(([id, name]) => ({
      id,
      name,
      fieldCount: 5,
    })),
    route: route ? { ...route, _id: route._id.toString() } : null,
  };
}

// Get activity logs
export async function getActivityLogs(limit = 50) {
  const db = await getDb();
  const logs = await db.collection('cms_activity')
    .find({})
    .sort({ timestamp: -1 })
    .limit(limit)
    .toArray();
  const total = await db.collection('cms_activity').countDocuments({});
  
  return {
    logs: logs.map(l => ({ ...l, _id: l._id.toString() })),
    total,
  };
}

// Get media library
export async function getMediaLibrary(limit = 24) {
  const db = await getDb();
  const collection = db.collection('cms_media');
  
  const total = await collection.countDocuments({ websiteId: 'default' });
  const media = await collection
    .find({ websiteId: 'default' })
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();

  const folders = await collection.distinct('folder', { websiteId: 'default' });

  return {
    media: media.map(m => ({ ...m, _id: m._id.toString() })),
    total,
    folders: folders.filter(Boolean),
  };
}

// Get active users
export async function getUsersList() {
  const db = await getDb();
  const users = await db.collection('cms_users')
    .find({})
    .sort({ createdAt: -1 })
    .project({ passwordHash: 0 })
    .toArray();

  return users.map(u => ({
    ...u,
    _id: u._id.toString(),
    assignedWebsites: (u.assignedWebsites || []).map(id => id.toString()),
  }));
}

// Get website settings
export async function getSettings() {
  const db = await getDb();
  const settings = await db.collection('cms_settings').findOne({ websiteId: 'default' });
  if (settings) {
    settings._id = settings._id.toString();
  }
  return settings || null;
}

// Get reviews
export async function getReviewsList() {
  const db = await getDb();
  const col = db.collection('reviews');
  const rows = await col.find({}).sort({ createdAt: -1 }).limit(200).toArray();
  return rows.map(r => ({
    ...r,
    _id: r._id.toString(),
    createdAt: r.createdAt ? (new Date(r.createdAt)).toISOString() : null,
    avatar: r.avatar || null,
    email: r.email || null,
    title: r.title || null,
  }));
}

// Get job applications
export async function getApplicationsList() {
  const db = await getDb();
  const data = await db.collection('applications').find({}).toArray();
  return data.map(app => ({
    ...app,
    _id: app._id.toString(),
    id: app._id.toString()
  }));
}

// Get contact submissions
export async function getContactSubmissionsList() {
  const db = await getDb();
  const data = await db.collection('contact_submissions').find().sort({ _id: -1 }).toArray();
  return data.map(s => ({
    id: s._id?.toString?.() || s.id,
    name: s.name,
    email: s.email,
    businessType: s.businessType || s.service || '',
    otherBusinessType: s.otherBusinessType || '',
    companyName: s.companyName || s.subject || '',
    businessInfo: s.businessInfo || s.phone || '',
    message: s.message || s.comments || '',
    createdAt: s.createdAt
  }));
}

// Get logo url
export async function getLogo() {
  const db = await getDb();
  const logo = await db.collection('cms_logos').findOne({ websiteId: 'default' });
  return logo?.url || '/Images/footerlogo.png';
}

// Fetch published content for a given path
export async function getPublishedContent(pathParam, websiteId = 'default') {
  try {
    const db = await getDb();
    const content = await db.collection('cms_page_content').findOne({
      path: pathParam,
      websiteId,
      status: 'published',
    });
    if (content) {
      return JSON.parse(JSON.stringify(content));
    }
    return null;
  } catch (err) {
    console.error(`getPublishedContent error for ${pathParam}:`, err);
    return null;
  }
}

// Map database value over original value if present
export function getCmsVal(content, originalValue) {
  if (!content || !Array.isArray(content.sections)) return originalValue;
  for (const section of content.sections) {
    for (const field of Object.values(section.fields || {})) {
      if (field.originalValue === originalValue) {
        return field.value;
      }
    }
  }
  return originalValue;
}
