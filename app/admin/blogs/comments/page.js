import React from 'react';
import CommentsListClient from './CommentsListClient';
import { getApiBase } from '@/lib/api-helper';
import { getBlogCommentsList } from '@/lib/cms-service';

export const metadata = { title: 'Blog Comments - Admin' };
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function CommentsPage() {
  const apiBase = getApiBase();

  let comments = [];
  try {
    const list = await getBlogCommentsList(true);
    comments = JSON.parse(JSON.stringify(list)) || [];
  } catch (err) {
    console.error('Failed to fetch comments', err);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[30px] font-bold text-gray-800 font-sans">BLOG COMMENTS</h1>
          <p className="text-sm text-gray-500">
            Moderate, approve, reject, or edit user comments on blog posts.
          </p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 mt-6">
        <CommentsListClient initialComments={comments} apiBase={apiBase} />
      </div>
    </div>
  );
}
