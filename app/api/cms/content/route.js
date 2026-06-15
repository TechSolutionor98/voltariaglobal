import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { parsePageContent, updatePageFiles } from '@/lib/cms-parser';
import path from 'path';
import fs from 'fs';
import { logActivity } from '@/lib/activity-logger';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_ADMIN_ORIGIN || '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

function jsonResponse(data, status = 200) {
  return NextResponse.json(data, { status, headers: CORS_HEADERS });
}

function getUserFromRequest(request) {
  const token = request.cookies.get("jwt")?.value;
  if (!token) return null;
  if (token === "demo-jwt-token") {
    return { role: "super_admin" };
  }
  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
    return decoded;
  } catch (e) {
    return null;
  }
}

// Default section templates
const SECTION_TEMPLATES = {
  hero: {
    sectionName: 'Hero Section',
    fields: {
      heading: { type: 'text', value: '', tag: 'h1', label: 'Main Heading' },
      subheading: { type: 'text', value: '', tag: 'h2', label: 'Sub Heading' },
      paragraph: { type: 'richtext', value: '', label: 'Description' },
      buttonText: { type: 'text', value: '', label: 'Button Text' },
      buttonLink: { type: 'url', value: '', label: 'Button Link' },
      image: { type: 'image', value: '', alt: '', title: '', label: 'Hero Image' },
    },
  },
  about: {
    sectionName: 'About Section',
    fields: {
      heading: { type: 'text', value: '', tag: 'h2', label: 'Section Heading' },
      paragraph: { type: 'richtext', value: '', label: 'About Text' },
      image: { type: 'image', value: '', alt: '', title: '', label: 'About Image' },
    },
  },
  services: {
    sectionName: 'Services Section',
    fields: {
      heading: { type: 'text', value: '', tag: 'h2', label: 'Section Heading' },
      subheading: { type: 'text', value: '', tag: 'h3', label: 'Sub Heading' },
      paragraph: { type: 'richtext', value: '', label: 'Description' },
    },
  },
  faq: {
    sectionName: 'FAQ Section',
    fields: {
      heading: { type: 'text', value: '', tag: 'h2', label: 'Section Heading' },
      items: { type: 'json', value: '[]', label: 'FAQ Items (JSON array)' },
    },
  },
  contact: {
    sectionName: 'Contact Section',
    fields: {
      heading: { type: 'text', value: '', tag: 'h2', label: 'Section Heading' },
      paragraph: { type: 'richtext', value: '', label: 'Description' },
      email: { type: 'text', value: '', label: 'Email' },
      phone: { type: 'text', value: '', label: 'Phone' },
      address: { type: 'richtext', value: '', label: 'Address' },
    },
  },
  custom: {
    sectionName: 'Custom Section',
    fields: {
      heading: { type: 'text', value: '', tag: 'h2', label: 'Heading' },
      paragraph: { type: 'richtext', value: '', label: 'Content' },
      image: { type: 'image', value: '', alt: '', title: '', label: 'Image' },
      buttonText: { type: 'text', value: '', label: 'Button Text' },
      buttonLink: { type: 'url', value: '', label: 'Button Link' },
    },
  },
};

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
  // Find the start of the next category
  for (let i = idx + 1; i < keys.length; i++) {
    const nextPos = getPos(keys[i]);
    if (nextPos !== -1 && nextPos > startPos) {
      endPos = nextPos;
      break;
    }
  }

  // If it's the last key (inverters), find the end of catalog
  if (idx === keys.length - 1) {
    const endOfCatalog = fileContent.indexOf('};', startPos);
    if (endOfCatalog !== -1) {
      endPos = endOfCatalog;
    }
  }

  return fileContent.substring(startPos, endPos);
}

// GET /api/cms/content → Get content for a page
export async function GET(request) {
  try {
    const url = new URL(request.url);
    const routeId = url.searchParams.get('routeId');
    const pathParam = url.searchParams.get('path');
    const websiteId = url.searchParams.get('websiteId') || 'default';
    const listAll = url.searchParams.get('all') === 'true';

    const db = await getDb();
    const collection = db.collection('cms_page_content');

    if (listAll) {
      const contents = await collection
        .find({ websiteId })
        .sort({ path: 1 })
        .toArray();

      // Also get routes
      const routes = await db.collection('cms_routes')
        .find({ websiteId, status: 'active' })
        .sort({ path: 1 })
        .toArray();

      const merged = routes.map(route => {
        const content = contents.find(c => c.routeId === route._id.toString());
        return {
          _id: route._id.toString(),
          path: route.path,
          type: route.type,
          hasContent: !!content,
          sectionsCount: content?.sections?.length || 0,
          status: content?.status || 'none',
          updatedAt: content?.updatedAt || null,
        };
      });

      return jsonResponse({ total: merged.length, pages: merged });
    }

    // Get single page content
    let filter = { websiteId };
    if (routeId) {
      const ids = [routeId];
      if (ObjectId.isValid(routeId)) {
        ids.push(new ObjectId(routeId));
      }
      filter.routeId = { $in: ids };
    } else if (pathParam) {
      filter.path = pathParam;
    } else {
      return jsonResponse({ error: 'routeId or path required' }, 400);
    }

    // Look up the route from the database to get its filePath
    let route = null;
    if (routeId && ObjectId.isValid(routeId)) {
      route = await db.collection('cms_routes').findOne({ _id: new ObjectId(routeId) });
    } else if (filter.path) {
      route = await db.collection('cms_routes').findOne({ path: filter.path, websiteId });
    }

    const isGlobalNavbar = route && route.path === '[Global] Navbar';
    const isGlobalFooter = route && route.path === '[Global] Footer';

    const shouldExcludeSection = (sectionId, sectionName) => {
      const sid = (sectionId || '').toLowerCase();
      const sname = (sectionName || '').toLowerCase();

      // Exclude page content/main only on the Home page (/) to clean up old DB remnants
      const isHomePage = route && route.path === '/';
      if (isHomePage && (sid === 'page_content' || sid === 'main' || sname === 'page content' || sname === 'main')) {
        return true;
      }

      if (isGlobalNavbar) {
        // Only keep Navbar section in Global Navbar page
        return sid !== 'navbar' && sname !== 'navbar';
      }

      if (isGlobalFooter) {
        // Only keep Footer section in Global Footer page
        return sid !== 'footer' && sname !== 'footer';
      }

      // For standard pages, exclude navbar and footer sections so they don't leak into them
      if (sid === 'navbar' || sname === 'navbar' || sid === 'footer' || sname === 'footer') {
        return true;
      }

      return false;
    };

    const content = await collection.findOne(filter);

    // Filter out restricted/excluded sections from DB sections
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

    // Filter out restricted/excluded sections from parsed sections
    parsedSections = parsedSections.filter(s => !shouldExcludeSection(s.sectionId, s.sectionName));

    // Dynamic category page filtering and sub-section splitting
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

    // Merge strategy: populate empty DB fields with static file content, maintaining code layout order
    let mergedSections = [];
    if (content && Array.isArray(content.sections)) {
      // Helper to match parsed sections with DB sections robustly
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

      // 1. Process all parsed sections in their actual code layout order
      for (const parsedSec of parsedSections) {
        const existingSec = content.sections.find(s => isMatchingSection(parsedSec, s));

        if (!existingSec) {
          mergedSections.push(parsedSec);
        } else {
          // Merge database values into the parsed section structure
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

      // 2. Append any sections that exist in the DB but are not found in the parsed files
      for (const dbSec of content.sections) {
        const existsInParsed = parsedSections.some(s => isMatchingSection(s, dbSec));
        if (!existsInParsed) {
          mergedSections.push(dbSec);
        }
      }
    } else {
      mergedSections = parsedSections;
    }

    // Assign final order sequencing
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

    return jsonResponse({
      content: responseContent,
      isNew: !content,
      templates: Object.entries(SECTION_TEMPLATES).map(([id, tmpl]) => ({
        id,
        name: tmpl.sectionName,
        fieldCount: Object.keys(tmpl.fields).length,
      })),
    });
  } catch (err) {
    console.error('GET /api/cms/content error:', err);
    try {
      fs.writeFileSync(path.join(process.cwd(), 'debug-api.log'), `ERROR: ${err.message}\nSTACK: ${err.stack}`, 'utf-8');
    } catch (logErr) {}
    return jsonResponse({ error: 'Failed to fetch content' }, 500);
  }
}

// POST /api/cms/content → Save page content
export async function POST(request) {
  try {
    const user = getUserFromRequest(request);
    if (user && user.role === 'viewer') {
      return jsonResponse({ error: 'Access denied. Viewers cannot edit content.' }, 403);
    }
    const body = await request.json();
    const { routeId, path, websiteId = 'default', sections, status = 'draft' } = body;

    if (!routeId && !path) {
      return jsonResponse({ error: 'routeId or path required' }, 400);
    }

    const db = await getDb();
    const collection = db.collection('cms_page_content');
    const now = new Date().toISOString();

    const filter = { websiteId };
    if (routeId) {
      const ids = [routeId];
      if (ObjectId.isValid(routeId)) {
        ids.push(new ObjectId(routeId));
      }
      filter.routeId = { $in: ids };
    } else {
      filter.path = path;
    }

    const existing = await collection.findOne(filter);
    const version = existing ? (existing.version || 1) + 1 : 1;

    // Update JSX files on disk with the new values
    if (Array.isArray(sections)) {
      try {
        updatePageFiles(sections);
        
        // Update originalValue to match the newly written value in files
        for (const section of sections) {
          for (const field of Object.values(section.fields || {})) {
            field.originalValue = field.value;
          }
        }
      } catch (fileErr) {
        console.error('Failed to update page component files:', fileErr);
      }
    }

    const contentData = {
      routeId: routeId || null,
      path: path || null,
      websiteId,
      sections: Array.isArray(sections) ? sections : [],
      status,
      version,
      publishedAt: status === 'published' ? now : (existing?.publishedAt || null),
      updatedAt: now,
      createdAt: existing?.createdAt || now,
    };

    await collection.replaceOne(
      filter,
      contentData,
      { upsert: true }
    );

    await logActivity(request, 'update_content', path || `Route ID: ${routeId}`, { status, version });

    return jsonResponse({ ok: true, version });
  } catch (err) {
    console.error('POST /api/cms/content error:', err);
    return jsonResponse({ error: 'Failed to save content' }, 500);
  }
}

// PUT /api/cms/content → Add a section template to a page
export async function PUT(request) {
  try {
    const user = getUserFromRequest(request);
    if (user && user.role === 'viewer') {
      return jsonResponse({ error: 'Access denied. Viewers cannot add content.' }, 403);
    }
    const body = await request.json();
    const { routeId, path, websiteId = 'default', templateId, customName } = body;

    if (!templateId || !SECTION_TEMPLATES[templateId]) {
      return jsonResponse({ error: 'Invalid template ID' }, 400);
    }

    const template = SECTION_TEMPLATES[templateId];
    const newSection = {
      sectionId: `${templateId}_${Date.now()}`,
      sectionName: customName || template.sectionName,
      order: 0,
      fields: { ...template.fields },
    };

    const db = await getDb();
    const collection = db.collection('cms_page_content');

    const filter = { websiteId };
    if (routeId) {
      const ids = [routeId];
      if (ObjectId.isValid(routeId)) {
        ids.push(new ObjectId(routeId));
      }
      filter.routeId = { $in: ids };
    } else if (path) {
      filter.path = path;
    }

    const existing = await collection.findOne(filter);

    if (existing) {
      newSection.order = (existing.sections?.length || 0) + 1;
      await collection.updateOne(
        filter,
        {
          $push: { sections: newSection },
          $set: { updatedAt: new Date().toISOString() },
        }
      );
    } else {
      newSection.order = 1;
      await collection.insertOne({
        routeId: routeId || null,
        path: path || null,
        websiteId,
        sections: [newSection],
        status: 'draft',
        version: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    await logActivity(request, 'update_content', path || `Route ID: ${routeId}`, { action: 'add_section', sectionName: newSection.sectionName });

    return jsonResponse({ ok: true, section: newSection });
  } catch (err) {
    console.error('PUT /api/cms/content error:', err);
    return jsonResponse({ error: 'Failed to add section' }, 500);
  }
}
