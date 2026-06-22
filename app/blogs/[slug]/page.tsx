import React from 'react';
import { getDb } from '@/lib/mongodb';
import Link from 'next/link';
import BlogCommentsSection from './BlogCommentsSection';
import { getApiBase } from '@/lib/api-helper';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Dynamic SEO Metadata Generator
export async function generateMetadata({ params }: any) {
  const { slug } = await params;
  try {
    const db = await getDb();
    const blog = await db.collection('cms_blogs').findOne({ slug, published: true });
    if (blog) {
      return {
        title: blog.metaTitle || `${blog.title} | Voltaria Global`,
        description: blog.metaDescription || blog.excerpt || 'Read the article on Voltaria Global Blog.',
        keywords: blog.keywords || '',
      };
    }
  } catch (err) {
    console.error('generateMetadata error for blog slug: ' + slug, err);
  }
  return { title: 'Blog Post' };
}

export default async function BlogDetailsPage({ params }: any) {
  const { slug } = await params;
  const apiBase = getApiBase();

  let blog: any = null;
  let comments: any[] = [];
  let recentBlogs: any[] = [];
  let popularTags: string[] = [];
  let categoriesList: any[] = [];

  try {
    const db = await getDb();

    // 1. Fetch Blog Data
    const blogDoc = await db.collection('cms_blogs').findOne({ slug, published: true });
    if (blogDoc) {
      blog = JSON.parse(JSON.stringify(blogDoc));
      
      // 2. Fetch Blog Comments
      const commentsDocs = await db.collection('cms_blog_comments')
        .find({ blogId: blog._id, approved: true })
        .sort({ createdAt: -1 })
        .toArray();
      comments = JSON.parse(JSON.stringify(commentsDocs));

      // 3. Fetch other blogs for sidebar widgets
      const allBlogsDocs = await db.collection('cms_blogs')
        .find({ published: true })
        .sort({ createdAt: -1 })
        .toArray();
      const allBlogs = JSON.parse(JSON.stringify(allBlogsDocs));

      // Filter out current blog
      recentBlogs = allBlogs.filter((b: any) => b._id !== blog._id).slice(0, 4);

      // Extract most popular tags
      const tagsList = allBlogs.flatMap((b: any) => b.tags || []);
      const tagCounts = tagsList.reduce((acc: { [key: string]: number }, t: string) => {
        acc[t] = (acc[t] || 0) + 1;
        return acc;
      }, {});
      popularTags = Object.keys(tagCounts)
        .sort((a, b) => tagCounts[b] - tagCounts[a])
        .slice(0, 10);

      // Extract categories and counts
      const categoryCounts = allBlogs.reduce((acc: { [key: string]: number }, b: any) => {
        if (b.category) {
          const cat = b.category.trim();
          acc[cat] = (acc[cat] || 0) + 1;
        }
        return acc;
      }, {} as { [key: string]: number });
      categoriesList = Object.entries(categoryCounts)
        .sort((a: any, b: any) => a[0].localeCompare(b[0]));
    }
  } catch (err) {
    console.error('Failed to fetch blog post details', err);
  }

  const companyPhone = '+971 4 354 0566';
  const companyEmail = 'info@voltariaglobal.com';

  if (!blog) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6 text-center">
        <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 max-w-md w-full">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
            ⚠
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Article Not Found</h2>
          <p className="text-gray-500 mb-6 text-sm">
            The article you are looking for has been removed, renamed, or is currently drafted.
          </p>
          <Link
            href="/blogs"
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow transition-all duration-200 text-sm"
          >
            Back to Articles
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-gray-800 pb-20">
      {/* Visual Top Header */}
      <div className="w-full bg-gradient-to-r from-red-950 to-zinc-950 py-16 text-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 md:px-6 text-left">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-red-400 hover:text-white uppercase tracking-wider mb-4 transition-colors"
          >
            ← Back to Articles
          </Link>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight max-w-4xl">
            {blog.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-300 font-semibold pt-4 mt-2">
            <span className="bg-white/10 px-2.5 py-1 rounded text-white">By {blog.author || 'Admin'}</span>
            {blog.category && (
              <>
                <span className="w-1 h-1 bg-white/20 rounded-full" />
                <span className="bg-red-500/20 text-red-400 px-2.5 py-1 rounded text-[10px] font-extrabold uppercase tracking-wider border border-red-500/30">{blog.category}</span>
              </>
            )}
            <span className="w-1 h-1 bg-white/20 rounded-full" />
            <span>
              {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString(undefined, {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              }) : 'N/A'}
            </span>
            {blog.readMinutes && (
              <>
                <span className="w-1 h-1 bg-white/20 rounded-full" />
                <span className="flex items-center gap-1">⏱ {blog.readMinutes} min read</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Content + Sidebar */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Main Content Column (9/12) */}
        <div className="lg:col-span-9 space-y-12 text-left">
          
          <article className="text-left space-y-6">
            {/* Cover Image */}
            <div className="w-full aspect-video rounded-xl overflow-hidden mb-8 bg-gray-55 relative border border-gray-100">
              {blog.coverImage ? (
                <img
                  src={blog.coverImage}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-red-50 flex items-center justify-center text-7xl">
                  ⚡
                </div>
              )}
            </div>

            {/* Excerpt Panel */}
            {blog.excerpt && (
              <div className="p-5 bg-red-50/20 border-l-4 border-red-600 text-gray-700 rounded-r-xl text-lg italic leading-relaxed text-left mb-8">
                {blog.excerpt}
              </div>
            )}

            {/* Tags (Inside Article) */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {blog.tags.map((tag: string, idx: number) => (
                  <Link
                    key={idx}
                    href={`/blogs?search=${encodeURIComponent(tag)}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-600 hover:bg-red-750 text-white rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-200 shadow-2xs"
                  >
                    <span className="text-white/60 select-none font-bold">#</span>
                    <span>{tag}</span>
                  </Link>
                ))}
              </div>
            )}

            {/* Rich HTML body text */}
            <div 
              className="prose max-w-none prose-red leading-relaxed text-gray-700 space-y-6 text-left select-text"
              style={{
                direction: 'ltr',
                textAlign: 'left'
              }}
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </article>

          {/* Comments integration */}
          <div className="pt-10 border-t border-gray-100">
            <BlogCommentsSection 
              blogId={blog._id} 
              initialComments={comments} 
              apiBase={apiBase} 
            />
          </div>
        </div>

        {/* Sidebar Column (3/12) */}
        <aside className="lg:col-span-3 space-y-8 text-left">
          
          {/* About Voltaria Global widget */}
          <div className="text-left space-y-4 pb-8 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-900">Voltaria Global</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              We are a leading global provider of clean energy solutions, high-performance batteries, electrical components, and industrial changeover devices.
            </p>
            <Link 
              href="/contact"
              className="inline-block px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg text-xs shadow-xs transition-all w-full text-center"
            >
              Contact Our Experts
            </Link>
          </div>

          {/* Categories Widget */}
          {categoriesList.length > 0 && (
            <div className="text-left space-y-4 pb-8 border-b border-gray-100">
              <div className="relative pb-2 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-900">Categories</h3>
                <div className="absolute bottom-0 left-0 w-8 h-[3px] bg-red-600 -mb-px" />
              </div>
              <div className="space-y-3 pt-2">
                {categoriesList.map(([cat, count]) => (
                  <Link
                    key={cat}
                    href={`/blogs?category=${encodeURIComponent(cat)}`}
                    className="block text-xs font-bold text-gray-800 hover:text-red-650 transition-colors uppercase tracking-wider"
                  >
                    {cat} <span className="text-gray-400 font-normal">({count})</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Recent Posts widget */}
          <div className="text-left space-y-4 pb-8 border-b border-gray-100">
            <div className="relative pb-2 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">Recent Posts</h3>
              <div className="absolute bottom-0 left-0 w-8 h-[3px] bg-red-600 -mb-px" />
            </div>
            
            {recentBlogs.length === 0 ? (
              <p className="text-xs text-gray-400 italic">No other articles available.</p>
            ) : (
              <div className="space-y-4 pt-2">
                {recentBlogs.map((b) => (
                  <div key={b._id} className="flex gap-3 group">
                    <Link href={`/blogs/${b.slug}`} className="w-20 aspect-[16/10] rounded-md overflow-hidden bg-gray-55 border border-gray-100 shrink-0 relative">
                      {b.coverImage ? (
                        <img 
                          src={b.coverImage} 
                          alt={b.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center text-xs">⚡</div>
                      )}
                    </Link>
                    <div className="min-w-0 space-y-0.5">
                      <Link 
                        href={`/blogs/${b.slug}`}
                        className="text-xs font-bold text-gray-800 hover:text-red-650 line-clamp-2 leading-tight"
                      >
                        {b.title}
                      </Link>
                      <span className="text-[10px] text-gray-400 block font-semibold">
                        {b.createdAt ? new Date(b.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric'
                        }) : ''}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Help/Support CTA card */}
          <div className="text-left space-y-4 pb-8 border-b border-gray-100">
            <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider block">
              Direct Help Desk
            </span>
            <h3 className="text-lg font-bold text-gray-900 leading-snug">Need Immediate Support?</h3>
            <p className="text-xs text-gray-650 leading-relaxed">
              Contact our support desk for bulk product orders, corporate distribution, and maintenance inquiries.
            </p>
            
            <div className="pt-2 space-y-2 text-xs">
              <a 
                href={`tel:${companyPhone}`}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 rounded-lg text-white font-semibold transition-all w-full"
              >
                📞 {companyPhone}
              </a>
              <a 
                href={`mailto:${companyEmail}`}
                className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 hover:bg-gray-55 rounded-lg text-gray-700 font-semibold transition-all bg-white w-full"
              >
                ✉ {companyEmail}
              </a>
            </div>
          </div>

          {/* Popular Tags cloud widget */}
          {popularTags.length > 0 && (
            <div className="text-left space-y-4">
              <div className="relative pb-2 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-900">Popular Tags</h3>
                <div className="absolute bottom-0 left-0 w-8 h-[3px] bg-red-600 -mb-px" />
              </div>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {popularTags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blogs?search=${tag}`}
                    className="px-2.5 py-1 bg-gray-50 hover:bg-red-50 text-xs font-semibold text-gray-650 hover:text-red-600 border border-gray-200 hover:border-red-200 rounded-md transition-all"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          )}

        </aside>
      </div>
    </main>
  );
}
