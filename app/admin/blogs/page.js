import React from 'react';
import BlogsListClient from './BlogsListClient';
import { getApiBase } from '@/lib/api-helper';
import { getBlogsList } from '@/lib/cms-service';

export const metadata = { title: 'Blogs - Admin' };
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function BlogsPage() {
  const apiBase = getApiBase();
  let blogs = [];
  try {
    blogs = await getBlogsList(true);
    // Ensure serialization
    blogs = JSON.parse(JSON.stringify(blogs)) || [];
  } catch (err) { 
    console.error('Failed to fetch blogs', err); 
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[30px] font-bold text-gray-800 font-sans">BLOG POSTS</h1>
          <p className="text-sm text-gray-500">
            Create, edit, moderate comments, and manage blog articles.
          </p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 mt-6">
        <BlogsListClient initialData={blogs} apiBase={apiBase} />
      </div>
    </div>
  );
}
