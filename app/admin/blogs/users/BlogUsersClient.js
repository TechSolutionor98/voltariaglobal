"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';

function formatDateTime(dateStr) {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr);
  const date = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const time = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  return { date, time };
}

export default function BlogUsersClient({ initialComments = [], apiBase = '' }) {
  const [comments, setComments] = useState(initialComments);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  // Group comments into unique users
  const usersList = useMemo(() => {
    const userMap = {};

    comments.forEach(comment => {
      const email = (comment.authorEmail || '').trim().toLowerCase();
      const name = (comment.authorName || '').trim();
      
      // Use email if present, otherwise group by name
      const key = email ? `email:${email}` : `name:${name.toLowerCase()}`;
      
      if (!userMap[key]) {
        userMap[key] = {
          id: comment._id,
          name: name,
          email: comment.authorEmail ? comment.authorEmail.trim() : 'N/A',
          commentsCount: 0,
          lastCommentDate: comment.createdAt,
          blogs: new Set(),
        };
      }
      
      userMap[key].commentsCount += 1;
      if (comment.blogTitle) {
        userMap[key].blogs.add(comment.blogTitle);
      }
      
      // Keep track of the most recent comment date
      if (new Date(comment.createdAt) > new Date(userMap[key].lastCommentDate)) {
        userMap[key].lastCommentDate = comment.createdAt;
      }
    });

    return Object.values(userMap).map(u => ({
      ...u,
      blogsList: Array.from(u.blogs),
    }));
  }, [comments]);

  // Filter users based on search
  const filteredUsers = useMemo(() => {
    return usersList.filter(user => {
      if (search.trim()) {
        const query = search.toLowerCase();
        return (
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user.blogsList.some(blog => blog.toLowerCase().includes(query))
        );
      }
      return true;
    });
  }, [usersList, search]);

  // Refresh data from api
  const refresh = async () => {
    try {
      setLoading(true);
      const url = `${apiBase}/api/blogs/comments?all=true`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Fetch failed');
      const data = await res.json();
      setComments(data);
    } catch (err) {
      alert('Failed to refresh: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Download CSV logic
  const downloadCSV = () => {
    if (filteredUsers.length === 0) {
      alert('No user data available to download.');
      return;
    }

    const headers = ['Name', 'Email', 'Comments Count', 'Last Comment Date', 'Blogs Commented On'];
    
    const rows = filteredUsers.map(u => {
      const dt = formatDateTime(u.lastCommentDate);
      const dateStr = dt === 'N/A' ? 'N/A' : `${dt.date} ${dt.time}`;
      return [
        `"${u.name.replace(/"/g, '""')}"`,
        `"${u.email.replace(/"/g, '""')}"`,
        u.commentsCount,
        `"${dateStr}"`,
        `"${u.blogsList.join(', ').replace(/"/g, '""')}"`
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `blog_comment_users_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full flex flex-col" style={{ minHeight: 'calc(100vh - 350px)' }}>
      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Refresh */}
          <button
            onClick={refresh}
            disabled={loading}
            className={`flex items-center gap-1.5 px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-700 font-semibold rounded-lg text-sm transition cursor-pointer ${loading ? 'opacity-60' : ''}`}
          >
            <svg className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {loading ? 'Loading...' : 'Refresh'}
          </button>

          {/* Download CSV Button */}
          <button
            onClick={downloadCSV}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#084032] hover:bg-[#0a5c48] text-white font-semibold rounded-lg text-sm transition cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download CSV
          </button>
        </div>

        {/* Search */}
        <div className="w-full sm:w-72">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, email, or blog..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#084032] focus:border-[#084032] outline-none transition"
          />
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto w-full rounded-xl border border-gray-150 shadow-sm min-h-[300px]">
        <table className="min-w-full text-sm">
          <thead className="sticky top-0 z-10 bg-[#084032] shadow-sm">
            <tr className="bg-[#084032] text-white text-left font-semibold">
              <th className="px-4 py-3 bg-[#084032]">User Name</th>
              <th className="px-4 py-3 bg-[#084032]">Email Address</th>
              <th className="px-4 py-3 bg-[#084032] text-center">Comments Count</th>
              <th className="px-4 py-3 bg-[#084032]">Blogs Commented On</th>
              <th className="px-4 py-3 bg-[#084032] whitespace-nowrap">Last Comment Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-14 text-center text-gray-400 font-medium">
                  <div className="flex flex-col items-center gap-2">
                    <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {usersList.length === 0 ? 'No commenter users found.' : 'No matching users found.'}
                  </div>
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => {
                const dt = formatDateTime(u.lastCommentDate);
                return (
                  <tr key={u.id} className="hover:bg-green-50/20 transition-colors align-top">
                    {/* User Name */}
                    <td className="px-4 py-3 font-semibold text-gray-800">
                      {u.name}
                    </td>

                    {/* Email */}
                    <td className="px-4 py-3 font-mono text-xs text-gray-600">
                      {u.email}
                    </td>

                    {/* Comment Count */}
                    <td className="px-4 py-3 text-center font-bold text-[#084032]">
                      {u.commentsCount}
                    </td>

                    {/* Blogs */}
                    <td className="px-4 py-3 max-w-xs md:max-w-md">
                      <div className="text-gray-600 text-xs flex flex-wrap gap-1">
                        {u.blogsList.map((blog, idx) => (
                          <span key={idx} className="bg-gray-100 border border-gray-200 text-gray-700 px-2 py-0.5 rounded text-[11px] font-medium inline-block max-w-[180px] truncate" title={blog}>
                            {blog}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Last Comment Date */}
                    <td className="px-4 py-3 text-xs whitespace-nowrap">
                      {dt === 'N/A' ? (
                        <span className="text-gray-400">N/A</span>
                      ) : (
                        <>
                          <div className="font-semibold text-gray-700">{dt.date}</div>
                          <div className="text-gray-400 mt-0.5">{dt.time}</div>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer count */}
      {filteredUsers.length > 0 && (
        <p className="text-xs text-gray-400 mt-3 text-right">
          Showing {filteredUsers.length} of {usersList.length} unique commenters
        </p>
      )}
    </div>
  );
}
