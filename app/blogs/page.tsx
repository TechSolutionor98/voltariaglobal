import React from 'react';
import BlogListingClient from './BlogListingClient';
import { getBlogsList } from '@/lib/cms-service';

export const metadata = {
  title: 'Blog - Voltaria Global',
  description: 'Read the latest updates, news, and expert articles on solar energy, batteries, fans, and power solutions.',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ClientBlogsPage() {
  let blogs = [];
  try {
    const list = await getBlogsList(false); // Only published blogs
    blogs = JSON.parse(JSON.stringify(list)) || [];
  } catch (err) {
    console.error('Failed to load public blogs list', err);
  }

  return (
    <main className="min-h-screen bg-gray-50 text-gray-800">
      {/* Premium Hero Banner */}
      <section className="bg-gradient-to-br from-red-950 via-red-900 to-zinc-950 text-white py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(220,38,38,0.1),transparent)]" />
        <div className="max-w-6xl mx-auto text-center relative z-10 space-y-4">
          <span className="inline-block px-4 py-1.5 bg-red-500/10 border border-red-500/30 text-red-500 rounded-full text-xs font-bold uppercase tracking-wider">
            Our Insights
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight max-w-4xl mx-auto">
            The Voltaria Blog
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
            Stay updated with expert guides, industry news, solar energy insights, and product updates from Voltaria Global.
          </p>
        </div>
      </section>

      {/* Real-time Client-side Blog Listing & Sidebar Widgets */}
      <BlogListingClient initialBlogs={blogs} />
    </main>
  );
}
