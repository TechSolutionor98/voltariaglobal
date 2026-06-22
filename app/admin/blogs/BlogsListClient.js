"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';

export default function BlogsListClient({ initialData = [], apiBase = '' }) {
  const [blogs, setBlogs] = useState(initialData);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  // Filter blogs based on search query
  const filteredBlogs = useMemo(() => {
    if (!search.trim()) return blogs;
    const query = search.toLowerCase();
    return blogs.filter(b => 
      b.title.toLowerCase().includes(query) ||
      (b.excerpt && b.excerpt.toLowerCase().includes(query)) ||
      (b.author && b.author.toLowerCase().includes(query)) ||
      (b.tags && b.tags.some(t => t.toLowerCase().includes(query)))
    );
  }, [blogs, search]);

  // Refresh data list
  const refresh = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${apiBase}/api/blogs?all=true`);
      if (!res.ok) throw new Error('Fetch failed');
      const data = await res.json();
      setBlogs(data);
    } catch (err) {
      alert('Failed to refresh blogs: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Toggle Publish/Draft state
  const togglePublish = async (id, currentPublished) => {
    try {
      setLoading(true);
      const res = await fetch(`${apiBase}/api/blogs`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, published: !currentPublished }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to toggle publish status');
      await refresh();
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete Blog Post
  const deleteBlog = async (id, title) => {
    if (!confirm(`Are you sure you want to delete the blog post "${title}"? This will also delete all comments on this post.`)) return;

    try {
      setLoading(true);
      const res = await fetch(`${apiBase}/api/blogs?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete blog post');
      await refresh();
    } catch (err) {
      alert('Failed to delete post: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Action Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Link
            href="/admin/blogs/add"
            className="px-4 py-2 bg-[#084032] hover:bg-[#00a63e] text-white font-semibold rounded-lg shadow transition-all duration-200 text-sm cursor-pointer"
          >
            Add Blog Post
          </Link>
          <button
            onClick={refresh}
            disabled={loading}
            className={`px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-700 font-semibold rounded-lg text-sm shadow-xs transition-all duration-200 cursor-pointer ${
              loading ? 'opacity-60' : ''
            }`}
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {/* Search */}
        <div className="w-full sm:w-72">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search blogs, authors, tags..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#084032] focus:border-[#084032] outline-none transition-all"
          />
        </div>
      </div>

      {/* Blogs Table */}
      <div className="overflow-x-auto w-full rounded-lg border border-gray-150 shadow-xs">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-[#084032] text-white text-left font-semibold">
              <th className="px-4 py-3">Cover</th>
              <th className="px-4 py-3">Title & Info</th>
              <th className="px-4 py-3">Author</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Comments</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {filteredBlogs.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-gray-500 font-medium">
                  {blogs.length === 0 ? 'No blog posts found. Click "Add Blog Post" to get started!' : 'No matching blog posts found.'}
                </td>
              </tr>
            ) : (
              filteredBlogs.map((blog) => (
                <tr key={blog._id} className="hover:bg-green-50/30 transition-colors">
                  {/* Cover */}
                  <td className="px-4 py-3 align-middle">
                    <div className="w-16 h-10 rounded-md border border-gray-100 bg-gray-50 overflow-hidden relative">
                      {blog.coverImage ? (
                        <img
                          src={blog.coverImage}
                          alt={blog.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-[10px] text-gray-400 font-semibold uppercase">
                          No Img
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Title & Info */}
                  <td className="px-4 py-3 align-middle max-w-xs">
                    <div className="font-bold text-gray-800 truncate" title={blog.title}>
                      {blog.title}
                    </div>
                    <div className="text-xs text-gray-400 truncate font-mono">
                      /{blog.slug}
                    </div>
                    {blog.createdAt && (
                      <div className="text-[10px] text-gray-400 mt-0.5">
                        Created: {new Date(blog.createdAt).toLocaleDateString()}
                      </div>
                    )}
                  </td>

                  {/* Author */}
                  <td className="px-4 py-3 align-middle text-gray-600 font-medium">
                    {blog.author || 'Admin'}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3 align-middle">
                    <button
                      onClick={() => togglePublish(blog._id, blog.published)}
                      disabled={loading}
                      className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all border cursor-pointer ${
                        blog.published
                          ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                          : 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100'
                      }`}
                      title="Click to toggle status"
                    >
                      {blog.published ? 'Published' : 'Draft'}
                    </button>
                  </td>

                  {/* Comments Count */}
                  <td className="px-4 py-3 align-middle">
                    <Link
                      href={`/admin/blogs/comments?blogId=${blog._id}`}
                      className="px-2 py-1 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded text-xs font-semibold text-gray-700 inline-flex items-center gap-1 transition-all"
                    >
                      <span>💬</span>
                      <span>{blog.commentCount || 0}</span>
                    </Link>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 align-middle text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/blogs/edit/${blog._id}`}
                        className="px-3 py-1 bg-[#084032] hover:bg-[#00a63e] text-white rounded text-xs font-semibold shadow-xs transition-all"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => deleteBlog(blog._id, blog.title)}
                        disabled={loading}
                        className="px-3 py-1 border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 rounded text-xs font-semibold transition-all cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
