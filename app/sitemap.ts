import { MetadataRoute } from 'next';
import { getDb } from '@/lib/mongodb';

export const revalidate = 3600; // Revalidate sitemap every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://voltariaglobal.com';
  const sitemapItems: MetadataRoute.Sitemap = [];

  try {
    const db = await getDb();

    // 1. Fetch active routes from cms_routes
    const routes = await db.collection('cms_routes')
      .find({ websiteId: 'default', status: 'active' })
      .toArray();

    // 2. Fetch SEO configurations from cms_seo
    const seoEntries = await db.collection('cms_seo')
      .find({ websiteId: 'default' })
      .toArray();

    // Default static routes if database routes are empty
    const defaultPaths = ['/', '/about', '/contact', '/products', '/appointments', '/blogs'];
    const activePaths = new Set<string>(
      routes
        .map((r: any) => r.path)
        .filter(
          (p: any) =>
            p &&
            !p.startsWith('[Global]') &&
            p !== '/products/[category]' &&
            p !== '/blogs/[slug]'
        )
    );

    // Ensure core default paths exist in set
    for (const dPath of defaultPaths) {
      activePaths.add(dPath);
    }

    // Process all active paths
    for (const routePath of Array.from(activePaths)) {
      const seo = seoEntries.find((s: any) => s.path === routePath);

      // Check if excluded in Sitemap settings
      if (seo?.sitemap?.include === false) {
        continue;
      }

      const priority = seo?.sitemap?.priority !== undefined ? Number(seo.sitemap.priority) : (routePath === '/' ? 1.0 : 0.7);
      const changeFrequency = (seo?.sitemap?.changeFrequency || (routePath === '/' ? 'daily' : 'weekly')) as
        | 'always'
        | 'hourly'
        | 'daily'
        | 'weekly'
        | 'monthly'
        | 'yearly'
        | 'never';

      sitemapItems.push({
        url: `${baseUrl}${routePath === '/' ? '' : routePath}`,
        lastModified: seo?.updatedAt ? new Date(seo.updatedAt) : new Date(),
        changeFrequency,
        priority,
      });
    }

    // 3. Dynamic Product Categories
    const categories = ['fans', 'fuses-breakers', 'changeovers', 'inverters'];
    for (const cat of categories) {
      const catPath = `/products/${cat}`;
      if (!activePaths.has(catPath)) {
        const seo = seoEntries.find((s: any) => s.path === catPath);
        if (seo?.sitemap?.include !== false) {
          sitemapItems.push({
            url: `${baseUrl}${catPath}`,
            lastModified: seo?.updatedAt ? new Date(seo.updatedAt) : new Date(),
            changeFrequency: (seo?.sitemap?.changeFrequency || 'weekly') as any,
            priority: seo?.sitemap?.priority !== undefined ? Number(seo.sitemap.priority) : 0.8,
          });
        }
      }
    }

    // 4. Fetch published blogs
    const blogs = await db.collection('cms_blogs')
      .find({ published: true })
      .toArray();

    for (const blog of blogs) {
      if (blog.slug) {
        const blogPath = `/blogs/${blog.slug}`;
        const seo = seoEntries.find((s: any) => s.path === blogPath);

        if (seo?.sitemap?.include === false) {
          continue;
        }

        sitemapItems.push({
          url: `${baseUrl}${blogPath}`,
          lastModified: blog.updatedAt || blog.createdAt ? new Date(blog.updatedAt || blog.createdAt) : new Date(),
          changeFrequency: (seo?.sitemap?.changeFrequency || 'weekly') as any,
          priority: seo?.sitemap?.priority !== undefined ? Number(seo.sitemap.priority) : 0.6,
        });
      }
    }
  } catch (err) {
    console.error('Failed to generate sitemap:', err);
  }

  return sitemapItems;
}
