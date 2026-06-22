import React from 'react';
import BlogFormClient from '../../components/BlogFormClient';
import { getApiBase } from '@/lib/api-helper';
import { getBlogEntry } from '@/lib/cms-service';
import Link from 'next/link';

export const metadata = { title: 'Edit Blog - Admin' };
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function EditBlogPage({ params }) {
  const { id } = await params;
  const apiBase = getApiBase();

  let blog = null;
  try {
    const entry = await getBlogEntry(id);
    blog = JSON.parse(JSON.stringify(entry)) || null;
  } catch (err) {
    console.error('Failed to fetch blog post', err);
  }

  if (!blog) {
    return (
      <div className="text-center py-20 bg-white rounded-xl border border-gray-150">
        <h2 className="text-xl font-bold text-gray-700 mb-2">Blog Post Not Found</h2>
        <p className="text-gray-500 text-sm mb-6">The blog post you are trying to edit does not exist or has been deleted.</p>
        <Link href="/admin/blogs" className="px-4 py-2 bg-[#084032] text-white rounded font-medium hover:bg-[#0a5c48]">
          Back to Blog List
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[30px] font-bold text-gray-800 font-sans">EDIT BLOG POST</h1>
          <p className="text-sm text-gray-500">
            Modify the content, cover image, tags, or SEO settings for this article.
          </p>
        </div>
      </div>
      
      <BlogFormClient initialData={blog} apiBase={apiBase} isEdit={true} />
    </div>
  );
}
