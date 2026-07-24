import React from 'react';
import { getDb } from '@/lib/mongodb';
import Link from 'next/link';
import BlogCommentsSection from './BlogCommentsSection';
import { getApiBase } from '@/lib/api-helper';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getPublishedContent } from '@/lib/cms-service';
import { generateCmsMetadata } from '@/lib/cms-fetch';
import JsonLdScript from '@/components/JsonLdScript';

export const revalidate = 60;

// Dynamic SEO Metadata Generator
export async function generateMetadata({ params }: any) {
  const { slug } = await params;
  let fallbackTitle = 'Blog Post';
  let fallbackDesc = 'Read the article on Voltaria Global Blog.';
  let fallbackKeywords = '';
  let blogOgImage = '';

  try {
    const db = await getDb();
    const blog = await db.collection('cms_blogs').findOne({ slug, published: true });
    if (blog) {
      fallbackTitle = blog.metaTitle || `${blog.title} | Voltaria Global`;
      fallbackDesc = blog.metaDescription || blog.excerpt || fallbackDesc;
      fallbackKeywords = blog.keywords || '';
      blogOgImage = blog.coverImage || '';
    }
  } catch (err) {
    console.error('generateMetadata error for blog slug: ' + slug, err);
  }

  const defaults: any = {
    title: fallbackTitle,
    description: fallbackDesc,
  };
  if (fallbackKeywords) defaults.keywords = fallbackKeywords;
  if (blogOgImage) {
    defaults.openGraph = {
      title: fallbackTitle,
      description: fallbackDesc,
      images: [{ url: blogOgImage }],
    };
  }

  return generateCmsMetadata(`/blogs/${slug}`, defaults);
}

export default async function BlogDetailsPage({ params }: any) {
  const { slug } = await params;
  const apiBase = getApiBase();

  // Fetch Navbar & Footer components
  const [navbarCms, footerCms] = await Promise.all([
    getPublishedContent("[Global] Navbar"),
    getPublishedContent("[Global] Footer")
  ]);

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
      <div className="min-h-screen flex flex-col bg-gray-50 font-sans antialiased text-black">
        <Navbar cms={navbarCms} />
        <main className="flex-grow flex items-center justify-center p-6 text-center">
          <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 max-w-md w-full">
            <div className="w-16 h-16 bg-red-50 text-[#E70812] rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
              ⚠
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Article Not Found</h2>
            <p className="text-gray-500 mb-6 text-sm">
              The article you are looking for has been removed, renamed, or is currently drafted.
            </p>
            <Link
              href="/blogs"
              className="px-5 py-2.5 bg-[#E70812] hover:bg-[#c90710] text-white font-semibold rounded-lg shadow transition-all duration-200 text-sm"
            >
              Back to Articles
            </Link>
          </div>
        </main>
        <Footer cms={footerCms} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans antialiased text-black">
      <JsonLdScript path={`/blogs/${slug}`} />
      <Navbar cms={navbarCms} />

      <main className="flex-grow pb-20">
        {/* Main Grid: Content + Sidebar */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 pt-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Main Content Column (9/12) */}
          <div className="lg:col-span-9 space-y-8 text-left bg-white">
            
            {/* Back link */}
            <Link
              href="/blogs"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-555 hover:text-[#E70812] uppercase tracking-wider transition-colors"
            >
              ← Back to Articles
            </Link>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight text-gray-900">
              {blog.title}
            </h1>

            {/* Metadata Badges */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="bg-gray-150 border border-gray-250 text-gray-700 px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-2xs">
                👤 By {blog.author || 'Admin'}
              </span>

              {blog.category && (
                <span className="bg-red-50 text-[#E70812] border border-red-100 px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-2xs">
                  📁 {blog.category}
                </span>
              )}

              <span className="bg-gray-150 border border-gray-250 text-gray-700 px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-2xs">
                📅 {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString(undefined, {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                }) : 'N/A'}
              </span>

              {blog.readMinutes && (
                <span className="bg-gray-150 border border-gray-250 text-gray-700 px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-2xs">
                  ⏱ {blog.readMinutes} min read
                </span>
              )}
            </div>
            
            <article className="text-left space-y-6 pt-4">
              {/* Cover Image */}
              <div className="w-full aspect-video rounded-xl overflow-hidden mb-8 bg-gray-50 relative border border-gray-100">
                {blog.coverImage ? (
                  <img
                    src={blog.coverImage}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-red-50 flex items-center justify-center text-7xl text-[#E70812]">
                    ⚡
                  </div>
                )}
              </div>

              {/* Rich Text Editor Styling (Custom Isolated) */}
              <style dangerouslySetInnerHTML={{ __html: `
                .blog-content-rich {
                  font-size: 1.125rem;
                  line-height: 1.8;
                  color: #374151;
                }
                .blog-content-rich p {
                  margin-bottom: 1.5rem;
                }
                .blog-content-rich h1 {
                  font-size: 2rem;
                  font-weight: 800;
                  color: #111827;
                  margin-top: 2rem;
                  margin-bottom: 1rem;
                  line-height: 1.25;
                }
                .blog-content-rich h2 {
                  font-size: 1.6rem;
                  font-weight: 700;
                  color: #111827;
                  margin-top: 2rem;
                  margin-bottom: 1rem;
                  line-height: 1.3;
                }
                .blog-content-rich h3 {
                  font-size: 1.35rem;
                  font-weight: 600;
                  color: #111827;
                  margin-top: 1.75rem;
                  margin-bottom: 0.75rem;
                  line-height: 1.4;
                }
                .blog-content-rich a {
                  color: #E70812;
                  text-decoration: underline;
                  font-weight: 500;
                }
                .blog-content-rich a:hover {
                  color: #c90710;
                }
                .blog-content-rich strong {
                  font-weight: 700;
                  color: #111827;
                }
                .blog-content-rich em {
                  font-style: italic;
                }
                .blog-content-rich blockquote {
                  border-left: 4px solid #E70812;
                  padding: 1rem 1.5rem;
                  font-style: italic;
                  color: #4b5563;
                  margin: 1.75rem 0;
                  background-color: #fef2f2;
                  border-radius: 0 0.5rem 0.5rem 0;
                }
                .blog-content-rich ul {
                  list-style-type: disc !important;
                  padding-left: 1.75rem !important;
                  margin-bottom: 1.5rem !important;
                  margin-top: 0.5rem !important;
                }
                .blog-content-rich ol {
                  list-style-type: decimal !important;
                  padding-left: 1.75rem !important;
                  margin-bottom: 1.5rem !important;
                  margin-top: 0.5rem !important;
                }
                .blog-content-rich li {
                  margin-bottom: 0.5rem;
                  padding-left: 0.25rem;
                }
                .blog-content-rich img {
                  border-radius: 0.75rem;
                  margin: 2rem auto;
                  max-width: 100%;
                  height: auto;
                  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
                }
                .blog-content-rich table {
                  width: 100%;
                  border-collapse: collapse;
                  margin: 2rem 0;
                  font-size: 0.95rem;
                }
                .blog-content-rich th, .blog-content-rich td {
                  border: 1px solid #e5e7eb;
                  padding: 0.75rem 1rem;
                  text-align: left;
                }
                .blog-content-rich th {
                  background-color: #f9fafb;
                  font-weight: 600;
                  color: #111827;
                }
              ` }} />

              {/* Rich HTML body text */}
              <div 
                className="blog-content-rich leading-relaxed select-text"
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
          <aside className="lg:col-span-3 space-y-8 text-left bg-white">
            
            {/* About Voltaria Global widget */}
            <div className="bg-white text-left space-y-4 pb-8 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">Voltaria Global</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                We are a leading global provider of clean energy solutions, high-performance batteries, electrical components, and industrial changeover devices.
              </p>
              <Link 
                href="/contact"
                className="inline-block px-4 py-2.5 bg-[#E70812] hover:bg-[#c90710] text-white font-semibold rounded-lg text-xs shadow-xs transition-all w-full text-center"
              >
                Contact Our Experts
              </Link>
            </div>

            {/* Categories Widget */}
            {categoriesList.length > 0 && (
              <div className="bg-white text-left space-y-4 pb-8 border-b border-gray-100">
                <div className="relative pb-2 border-b border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900">Categories</h3>
                  <div className="absolute bottom-0 left-0 w-8 h-[3px] bg-[#E70812] -mb-px" />
                </div>
                <div className="space-y-3 pt-2">
                  {categoriesList.map(([cat, count]) => (
                    <Link
                      key={cat}
                      href={`/blogs?category=${encodeURIComponent(cat)}`}
                      className="block text-xs font-bold text-gray-800 hover:text-[#E70812] transition-colors uppercase tracking-wider"
                    >
                      {cat} <span className="text-gray-400 font-normal">({count})</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Posts widget */}
            <div className="bg-white text-left space-y-4 pb-8 border-b border-gray-100">
              <div className="relative pb-2 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-900">Recent Posts</h3>
                <div className="absolute bottom-0 left-0 w-8 h-[3px] bg-[#E70812] -mb-px" />
              </div>
              
              {recentBlogs.length === 0 ? (
                <p className="text-xs text-gray-400 italic">No other articles available.</p>
              ) : (
                <div className="space-y-4 pt-2">
                  {recentBlogs.map((b) => (
                    <div key={b._id} className="flex gap-3 group">
                      <Link href={`/blogs/${b.slug}`} className="w-20 aspect-video rounded-md overflow-hidden bg-gray-55 border border-gray-100 shrink-0 relative">
                        {b.coverImage ? (
                          <img 
                            src={b.coverImage} 
                            alt={b.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-xs text-[#E70812]">⚡</div>
                        )}
                      </Link>
                      <div className="min-w-0 space-y-0.5">
                        <Link 
                          href={`/blogs/${b.slug}`}
                          className="text-xs font-bold text-gray-800 hover:text-[#E70812] line-clamp-2 leading-tight"
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
            <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100 text-left space-y-4 shadow-2xs">
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                Direct Help Desk
              </span>
              <h3 className="text-lg font-bold text-emerald-900 leading-snug">Need Immediate Support?</h3>
              <p className="text-xs text-emerald-800 leading-relaxed">
                Contact our support desk for bulk product orders, corporate distribution, and maintenance inquiries.
              </p>
              
              <div className="pt-2 space-y-2 text-xs">
                <a 
                  href={`tel:${companyPhone}`}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#E70812] hover:bg-[#c90710] rounded-lg text-white font-semibold transition-all w-full"
                >
                  📞 {companyPhone}
                </a>
                <a 
                  href={`mailto:${companyEmail}`}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 hover:bg-white rounded-lg text-gray-700 font-semibold transition-all bg-white/80 w-full"
                >
                  ✉ {companyEmail}
                </a>
              </div>
            </div>

            {/* Popular Tags cloud widget */}
            {popularTags.length > 0 && (
              <div className="bg-white text-left space-y-4">
                <div className="relative pb-2 border-b border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900">Popular Tags</h3>
                  <div className="absolute bottom-0 left-0 w-8 h-[3px] bg-[#E70812] -mb-px" />
                </div>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {popularTags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/blogs?search=${tag}`}
                      className="px-2.5 py-1 bg-gray-50 hover:bg-red-50 text-xs font-semibold text-gray-650 hover:text-[#E70812] border border-gray-200 hover:border-[#E70812] rounded-md transition-all"
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

      <Footer cms={footerCms} />
    </div>
  );
}
