/**
 * CMS Frontend Integration Helper
 * 
 * Use this in your page server components to fetch CMS content and SEO data.
 * CMS data is an overlay — if it exists, it overrides defaults. If not, originals render.
 * 
 * Usage:
 *   import { getCmsData, getCmsSeo, getCmsContent } from '@/lib/cms-fetch';
 *   
 *   export default async function Page() {
 *     const cms = await getCmsData('/products/laptops');
 *     return <h1>{cms.content?.hero?.heading || "Default Heading"}</h1>;
 *   }
 *   
 *   export async function generateMetadata() {
 *     const seo = await getCmsSeo('/products/laptops');
 *     return {
 *       title: seo.metaTitle || 'Default Title',
 *       description: seo.metaDescription || 'Default description',
 *     };
 *   }
 */

import { getDb } from '@/lib/mongodb';

/**
 * Fetch CMS SEO data for a given path
 * @param {string} path - Route path (e.g., '/products/laptops')
 * @param {string} websiteId - Website ID (default: 'default')
 * @returns {Object|null} SEO data or null
 */
export async function getCmsSeo(path, websiteId = 'default') {
  try {
    const db = await getDb();
    let seo = await db.collection('cms_seo').findOne({
      path,
      websiteId,
    });

    if (!seo) {
      // Fallback search by route lookup if path didn't directly match
      const route = await db.collection('cms_routes').findOne({ path, websiteId });
      if (route) {
        const ids = [route._id.toString()];
        try {
          ids.push(route._id);
        } catch (e) {}
        seo = await db.collection('cms_seo').findOne({
          routeId: { $in: ids },
          websiteId,
        });
      }
    }
    return seo || null;
  } catch (err) {
    console.error(`getCmsSeo error for ${path}:`, err);
    return null;
  }
}

/**
 * Fetch JSON-LD schema markup for a given path
 * @param {string} path - Route path
 * @param {string} websiteId - Website ID
 * @returns {Object|null} Schema object or null
 */
export async function getCmsJsonLd(path, websiteId = 'default') {
  try {
    const seo = await getCmsSeo(path, websiteId);
    if (!seo || !seo.schema) return null;

    if (seo.schema.customSchema && seo.schema.customSchema.trim()) {
      try {
        return JSON.parse(seo.schema.customSchema);
      } catch (e) {
        console.error(`Invalid custom JSON-LD schema for ${path}:`, e);
      }
    }

    // Auto-generate basic JSON-LD based on schema.type if metaTitle exists
    if (!seo.metaTitle) return null;

    const schemaType = seo.schema.type || 'WebPage';
    const pageTitle = seo.metaTitle || 'Voltaria Global';
    const pageDesc = seo.metaDescription || '';
    const pageUrl = seo.canonicalUrl || `https://voltariaglobal.com${path === '/' ? '' : path}`;

    return {
      '@context': 'https://schema.org',
      '@type': schemaType,
      name: pageTitle,
      description: pageDesc,
      url: pageUrl,
    };
  } catch (err) {
    console.error(`getCmsJsonLd error for ${path}:`, err);
    return null;
  }
}

/**
 * Fetch both CMS content and SEO data in one call
 * @param {string} path - Route path
 * @param {string} websiteId - Website ID
 * @returns {Object} { content, seo }
 */
export async function getCmsData(path, websiteId = 'default') {
  const [content, seo] = await Promise.all([
    getCmsContent(path, websiteId),
    getCmsSeo(path, websiteId),
  ]);

  return { content, seo };
}

/**
 * Generate Next.js metadata from CMS SEO data
 * Merges CMS data with defaults, CMS values override defaults
 * 
 * @param {string} path - Route path
 * @param {Object} defaults - Default metadata
 * @param {string} websiteId - Website ID
 * @returns {Object} Next.js metadata object
 */
export async function generateCmsMetadata(path, defaults = {}, websiteId = 'default') {
  const seo = await getCmsSeo(path, websiteId);

  if (!seo) return defaults;

  const metadata = { ...defaults };

  if (seo.metaTitle) {
    metadata.title = seo.metaTitle;
  }
  if (seo.metaDescription) {
    metadata.description = seo.metaDescription;
  }

  // Keywords
  if (seo.metaKeywords?.length) {
    metadata.keywords = seo.metaKeywords;
  }

  // Canonical
  if (seo.canonicalUrl) {
    metadata.alternates = { canonical: seo.canonicalUrl };
  }

  // Robots
  if (seo.robots) {
    metadata.robots = {
      index: seo.robots.index !== false,
      follow: seo.robots.follow !== false,
      noarchive: seo.robots.noArchive || false,
      nosnippet: seo.robots.noSnippet || false,
    };
  }

  // Open Graph
  if (seo.openGraph) {
    metadata.openGraph = {
      title: seo.openGraph.title || seo.metaTitle || defaults.title,
      description: seo.openGraph.description || seo.metaDescription || defaults.description,
      type: seo.openGraph.type || 'website',
      locale: seo.openGraph.locale || 'en_AE',
    };
    if (seo.openGraph.image) {
      metadata.openGraph.images = [{ url: seo.openGraph.image }];
    }
  }

  // Twitter
  if (seo.twitterCard) {
    metadata.twitter = {
      card: seo.twitterCard.cardType || 'summary_large_image',
      title: seo.twitterCard.title || seo.metaTitle || defaults.title,
      description: seo.twitterCard.description || seo.metaDescription || defaults.description,
    };
    if (seo.twitterCard.image) {
      metadata.twitter.images = [seo.twitterCard.image];
    }
  }

  return metadata;
}
