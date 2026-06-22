"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface BlogListingClientProps {
  initialBlogs?: any[];
}

export default function BlogListingClient({ initialBlogs = [] }: BlogListingClientProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  // Sync with URL query parameters on initial mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const catParam = params.get('category');
      const searchParam = params.get('search');
      if (catParam) setCategory(catParam);
      if (searchParam) setSearch(searchParam);
    }
  }, []);

  // Update URL search parameters silently when state changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams();
      if (category) params.set('category', category);
      if (search) params.set('search', search);

      const newRelativePathQuery = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
      window.history.pushState(null, '', newRelativePathQuery);
    }
  }, [search, category]);

  // Filter blogs list in real-time
  const filteredBlogs = initialBlogs.filter((blog) => {
    if (category) {
      if (blog.category?.trim().toLowerCase() !== category.trim().toLowerCase()) {
        return false;
      }
    }
    if (search) {
      const q = search.trim().toLowerCase();
      const titleLower = blog.title?.trim().toLowerCase() || '';
      if (!titleLower.startsWith(q)) {
        return false;
      }
    }
    return true;
  });

  // Calculate dynamic categories and counts from complete list of blogs
  const categoryCounts = initialBlogs.reduce((acc: { [key: string]: number }, b) => {
    if (b.category) {
      const cat = b.category.trim();
      acc[cat] = (acc[cat] || 0) + 1;
    }
    return acc;
  }, {} as { [key: string]: number });
  const categoriesList = Object.entries(categoryCounts).sort((a, b) => a[0].localeCompare(b[0]));

  // Calculate recent posts (unfiltered list of top 4 blogs)
  const recentPosts = initialBlogs.slice(0, 4);

  const companyPhone = "+971 4 354 0566";
  const companyEmail = "info@voltariaglobal.com";

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 py-16 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

      {/* Main Listing Column (9/12) */}
      <div className="lg:col-span-9 space-y-8">

        {/* Search Input Bar (types in real-time) */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-b border-gray-200 pb-6">
          <h2 className="text-xl font-bold text-gray-900">Articles & Insights</h2>

          <div className="relative w-full sm:w-80">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search articles in real-time..."
              className="w-full pl-9 pr-4 py-2 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#E70812] focus:border-[#E70812] outline-none transition-all bg-white"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-3.5 w-3.5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-black font-bold text-sm"
              >
                &times;
              </button>
            )}
          </div>
        </div>

        {/* Blog Cards Grid */}
        {filteredBlogs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100 max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-red-50 text-[#E70812] rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
              📰
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Articles Found</h2>
            <p className="text-gray-500 max-w-md mx-auto px-4 text-sm">
              We couldn't find any articles matching your search query or selected category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredBlogs.map((blog) => (
              <article
                key={blog._id}
                className="bg-white rounded-2xl overflow-hidden shadow-xs border border-gray-150 flex flex-col"
              >
                {/* Cover Image Wrapper */}
                <Link href={`/blogs/${blog.slug}`} className="block relative aspect-[16/10] bg-gray-100 overflow-hidden">
                  {blog.coverImage ? (
                    <img
                      src={blog.coverImage}
                      alt={blog.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-red-50 flex items-center justify-center text-5xl text-[#E70812]">
                      ⚡
                    </div>
                  )}
                </Link>

                {/* Article Body */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    {/* Meta Info */}
                    <div className="flex justify-between items-center text-xs text-gray-500 font-semibold w-full">
                      <span className="text-gray-700">By {blog.author || 'Admin'}</span>
                      <span>
                        {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        }) : 'N/A'}
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-bold text-gray-900 hover:text-[#E70812] leading-snug line-clamp-1">
                      <Link href={`/blogs/${blog.slug}`} className="hover:text-[#E70812] transition-colors">
                        {blog.title}
                      </Link>
                    </h2>

                    {/* Excerpt */}
                    <p className="text-gray-550 text-sm leading-relaxed line-clamp-2">
                      {blog.excerpt || 'Read this article to learn more about this topic from our tech experts...'}
                    </p>
                  </div>

                  {/* Footer links on card */}
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-sm">
                    <Link
                      href={`/blogs/${blog.slug}`}
                      className="font-bold text-[#E70812] flex items-center gap-1 hover:text-[#c90710] transition-colors"
                    >
                      Read Article <span className="text-base">→</span>
                    </Link>

                    {blog.readMinutes && (
                      <span className="text-xs text-gray-400 font-semibold flex items-center gap-1">
                        ⏱ {blog.readMinutes} min read
                      </span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Sidebar Column (3/12) */}
      <aside className="lg:col-span-3 lg:sticky lg:top-10 space-y-8 text-left">

        {/* About Voltaria widget in sidebar */}
        <div className="text-left space-y-4 pb-8 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">Voltaria Global</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            We are a leading global provider of clean energy solutions, high-performance batteries, electrical components, and industrial changeover devices.
          </p>
          <Link
            href="/contact"
            className="inline-block px-4 py-2.5 bg-[#E70812] hover:bg-[#c90710] text-white font-semibold rounded-lg text-xs shadow-xs transition-all w-full text-center"
          >
            Contact Our Team
          </Link>
        </div>

        {/* Categories widget in sidebar */}
        {categoriesList.length > 0 && (
          <div className="text-left space-y-4 pb-8 border-b border-gray-100">
            <div className="relative pb-2 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">Categories</h3>
              <div className="absolute bottom-0 left-0 w-8 h-[3px] bg-[#E70812] -mb-px" />
            </div>
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={() => setCategory('')}
                className={`block text-xs font-bold text-left uppercase tracking-wider transition-colors w-full ${!category ? 'text-[#E70812]' : 'text-gray-800 hover:text-[#E70812]'
                  }`}
              >
                All Posts <span className="text-gray-400 font-normal">({initialBlogs.length})</span>
              </button>
              {categoriesList.map(([cat, count]) => {
                const isActive = category?.toLowerCase() === cat.toLowerCase();
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(isActive ? '' : cat)}
                    className={`block text-xs font-bold text-left uppercase tracking-wider transition-colors w-full ${isActive ? 'text-[#E70812]' : 'text-gray-800 hover:text-[#E70812]'
                      }`}
                  >
                    {cat} <span className="text-gray-400 font-normal">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Recent Posts widget */}
        <div className="text-left space-y-4 pb-8 border-b border-gray-100">
          <div className="relative pb-2 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">Recent Posts</h3>
            <div className="absolute bottom-0 left-0 w-8 h-[3px] bg-[#E70812] -mb-px" />
          </div>

          {recentPosts.length === 0 ? (
            <p className="text-xs text-gray-400 italic">No articles available.</p>
          ) : (
            <div className="space-y-4 pt-2">
              {recentPosts.map((b) => (
                <div key={b._id} className="flex gap-3 group">
                  <Link href={`/blogs/${b.slug}`} className="w-20 aspect-[16/10] rounded-md overflow-hidden bg-gray-55 border border-gray-100 shrink-0 relative">
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
        <div className="text-left space-y-4">
          <span className="text-[10px] font-bold text-[#E70812] uppercase tracking-wider block">
            Direct Help Desk
          </span>
          <h3 className="text-lg font-bold text-gray-900 leading-snug">Need Immediate Support?</h3>
          <p className="text-xs text-gray-650 leading-relaxed">
            Contact our desk for product inquiries, bulk orders, and customer service support.
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
              className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 hover:bg-gray-50 rounded-lg text-gray-700 font-semibold transition-all bg-white w-full"
            >
              ✉ {companyEmail}
            </a>
          </div>
        </div>

      </aside>
    </section>
  );
}
