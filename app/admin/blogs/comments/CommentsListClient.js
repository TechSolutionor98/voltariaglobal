"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';

// Status config
const STATUS_CONFIG = {
  approved: {
    label: 'Approved',
    pill: 'bg-green-50 text-green-700 border-green-200',
    dot: 'bg-green-500',
  },
  pending: {
    label: 'Pending',
    pill: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    dot: 'bg-yellow-400',
  },
  rejected: {
    label: 'Rejected',
    pill: 'bg-red-50 text-red-600 border-red-200',
    dot: 'bg-red-500',
  },
};

function getStatus(c) {
  if (c.status) return c.status;
  return c.approved ? 'approved' : 'pending';
}

function formatDateTime(dateStr) {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr);
  const date = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const time = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  return { date, time };
}

// ---- Edit Modal ----
function EditModal({ comment, onClose, onSave }) {
  const [text, setText] = useState(comment.comment);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!text.trim()) return;
    setSaving(true);
    await onSave(comment._id, text.trim());
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-all duration-300">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden border border-gray-105 flex flex-col transform transition-transform duration-300 scale-100 text-gray-900">
        {/* Header */}
        <div className="bg-[#084032] px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-[#4ade80]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <h2 className="text-white font-extrabold text-lg tracking-wide">Edit Comment Content</h2>
          </div>
          <button 
            onClick={onClose} 
            className="text-white/80 hover:text-white transition-all text-xl font-bold p-1 hover:bg-white/10 rounded-lg cursor-pointer"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 flex-1 text-left">
          {/* Metadata info card */}
          <div className="bg-[#084032]/5 rounded-xl border border-[#084032]/10 p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Comment Author</span>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-8 h-8 bg-[#084032] text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {comment.authorName ? comment.authorName.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800 leading-tight">{comment.authorName}</p>
                  {comment.authorEmail && (
                    <p className="text-xs text-gray-505 font-mono select-all mt-0.5">{comment.authorEmail}</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="space-y-1 border-t md:border-t-0 md:border-l border-gray-200/60 pt-3 md:pt-0 md:pl-4">
              <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider font-sans">Associated Article</span>
              <p className="text-sm font-semibold text-[#084032] line-clamp-2 leading-tight mt-1" title={comment.blogTitle}>
                {comment.blogTitle || 'N/A'}
              </p>
            </div>
          </div>

          {/* Comment Editor Textarea */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Edit Comment text</label>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              rows={8}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-850 focus:outline-none focus:ring-2 focus:ring-[#084032]/50 focus:border-[#084032] transition bg-gray-55/30 focus:bg-white resize-y min-h-[160px]"
              placeholder="Write the comment text..."
            />
            <div className="flex justify-between items-center text-xs text-gray-400 mt-1.5 px-1">
              <span>Maximum length is moderated</span>
              <span className="font-semibold bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full font-mono">{text.length} characters</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-gray-50/80 border-t border-gray-105 flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-805 transition cursor-pointer font-semibold"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !text.trim()}
            className="px-6 py-2.5 bg-[#084032] hover:bg-[#0a5c48] text-white rounded-lg text-sm font-bold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-[#084032]/10"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---- Status Dropdown ----
function StatusDropdown({ comment, onStatusChange, loading }) {
  const [open, setOpen] = useState(false);
  const current = getStatus(comment);
  const cfg = STATUS_CONFIG[current] || STATUS_CONFIG.pending;

  const options = ['approved', 'pending', 'rejected'].filter(s => s !== current);

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setOpen(o => !o)}
        disabled={loading}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase cursor-pointer hover:shadow-sm transition ${cfg.pill}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}></span>
        {cfg.label}
        <svg className="w-2.5 h-2.5 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full mt-1.5 z-20 bg-white border border-gray-150 rounded-xl shadow-xl overflow-hidden min-w-[120px]">
            {options.map(status => {
              const c = STATUS_CONFIG[status];
              return (
                <button
                  key={status}
                  onClick={() => { onStatusChange(comment._id, status); setOpen(false); }}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold hover:bg-gray-50 transition cursor-pointer text-left ${c.pill.split(' ')[1]}`}
                >
                  <span className={`w-2 h-2 rounded-full ${c.dot}`}></span>
                  {c.label}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

// ---- Truncated Comment Cell ----
function CommentCell({ text }) {
  const [hovered, setHovered] = useState(false);
  const lines = text?.split('\n') || [];
  const isLong = text?.length > 120 || lines.length > 2;

  return (
    <div className="relative group max-w-sm text-left">
      <p
        className="text-gray-700 text-sm leading-5 break-words"
        style={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {text}
      </p>
      {isLong && (
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="absolute -top-1 left-0 w-full h-full cursor-default"
        >
          {hovered && (
            <div className="absolute z-30 left-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-2xl p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap break-words text-left">
              <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase mb-2">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Full Comment
              </div>
              {text}
            </div>
          )}
          <span className="text-[10px] text-[#084032] font-semibold opacity-0 group-hover:opacity-100 transition absolute bottom-0 right-0">
            hover to read more
          </span>
        </div>
      )}
    </div>
  );
}

export default function CommentsListClient({
  initialComments = [],
  apiBase = '',
  filterBlogId = null
}) {
  const [comments, setComments] = useState(initialComments);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [editingComment, setEditingComment] = useState(null);

  // Filter comments
  const filteredComments = useMemo(() => {
    return comments.filter(c => {
      const status = getStatus(c);

      if (search.trim()) {
        const query = search.toLowerCase();
        const matchesSearch =
          c.comment.toLowerCase().includes(query) ||
          c.authorName.toLowerCase().includes(query) ||
          (c.authorEmail && c.authorEmail.toLowerCase().includes(query)) ||
          (c.blogTitle && c.blogTitle.toLowerCase().includes(query));
        if (!matchesSearch) return false;
      }

      if (statusFilter !== 'all' && status !== statusFilter) return false;

      return true;
    });
  }, [comments, search, statusFilter]);

  // Refresh list
  const refresh = async () => {
    try {
      setLoading(true);
      const url = filterBlogId
        ? `${apiBase}/api/blogs/comments?all=true&blogId=${filterBlogId}`
        : `${apiBase}/api/blogs/comments?all=true`;
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

  // Change status: approved / pending / rejected
  const changeStatus = async (id, newStatus) => {
    try {
      setLoading(true);
      const res = await fetch(`${apiBase}/api/blogs/comments`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update status');
      // Optimistic update
      setComments(prev => prev.map(c =>
        c._id === id ? { ...c, status: newStatus, approved: newStatus === 'approved' } : c
      ));
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Edit comment text
  const saveEdit = async (id, newText) => {
    try {
      const res = await fetch(`${apiBase}/api/blogs/comments`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, comment: newText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update comment');
      // Optimistic update
      setComments(prev => prev.map(c =>
        c._id === id ? { ...c, comment: newText, editedAt: new Date().toISOString() } : c
      ));
      setEditingComment(null);
    } catch (err) {
      alert('Failed to save: ' + err.message);
    }
  };

  // Delete comment
  const deleteComment = async (id) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;
    try {
      setLoading(true);
      const res = await fetch(`${apiBase}/api/blogs/comments?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete');
      setComments(prev => prev.filter(c => c._id !== id));
    } catch (err) {
      alert('Failed to delete: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Status counts
  const counts = useMemo(() => {
    return comments.reduce((acc, c) => {
      const s = getStatus(c);
      acc[s] = (acc[s] || 0) + 1;
      acc.all = (acc.all || 0) + 1;
      return acc;
    }, {});
  }, [comments]);

  return (
    <div className="w-full flex flex-col min-h-[500px]">
      {/* Edit Modal */}
      {editingComment && (
        <EditModal
          comment={editingComment}
          onClose={() => setEditingComment(null)}
          onSave={saveEdit}
        />
      )}

      {/* Active blog filter */}
      {filterBlogId && comments.length > 0 && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-[#084032] rounded-lg text-sm flex items-center justify-between font-medium">
          <span>Showing comments for: <strong className="underline">{comments[0]?.blogTitle || 'Selected Blog'}</strong></span>
          <Link href="/admin/blogs/comments" className="text-xs px-2.5 py-1 bg-white border border-green-200 rounded hover:bg-green-100 transition font-semibold">
            Clear Filter
          </Link>
        </div>
      )}

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

          {/* Status filter tabs */}
          <div className="flex bg-gray-100 p-0.5 rounded-lg text-xs">
            {[
              { key: 'all', label: 'All' },
              { key: 'pending', label: 'Pending' },
              { key: 'approved', label: 'Approved' },
              { key: 'rejected', label: 'Rejected' },
            ].map(tab => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setStatusFilter(tab.key)}
                className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                  statusFilter === tab.key
                    ? tab.key === 'approved' ? 'bg-white text-green-700 shadow-sm'
                    : tab.key === 'pending' ? 'bg-white text-yellow-700 shadow-sm'
                    : tab.key === 'rejected' ? 'bg-white text-red-600 shadow-sm'
                    : 'bg-white text-[#084032] shadow-sm'
                    : 'text-gray-500 hover:text-black'
                }`}
              >
                {tab.label}
                {counts[tab.key] > 0 && (
                  <span className="bg-gray-250 text-gray-600 text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                    {counts[tab.key] || 0}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="w-full sm:w-72">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search comments, authors, blogs..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#084032] focus:border-[#084032] outline-none transition"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto w-full rounded-xl border border-gray-150 shadow-sm">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-[#084032] text-white text-left font-semibold">
              <th className="px-4 py-3">Blog Post</th>
              <th className="px-4 py-3">Author</th>
              <th className="px-4 py-3 min-w-[220px]">Comment</th>
              <th className="px-4 py-3 whitespace-nowrap">Date & Time</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {filteredComments.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-14 text-center text-gray-400 font-medium">
                  <div className="flex flex-col items-center gap-2 justify-center">
                    <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    {comments.length === 0 ? 'No comments yet.' : 'No matching comments found.'}
                  </div>
                </td>
              </tr>
            ) : (
              filteredComments.map((c) => {
                const dt = formatDateTime(c.createdAt);
                const edited = c.editedAt ? formatDateTime(c.editedAt) : null;

                return (
                  <tr key={c._id} className="hover:bg-green-50/20 transition-colors align-top">
                    {/* Blog Post */}
                    <td className="px-4 py-3 max-w-[180px] text-left">
                      <Link
                        href={`/admin/blogs/edit/${c.blogId}`}
                        className="font-bold text-gray-800 hover:text-[#084032] hover:underline block truncate text-sm"
                        title={c.blogTitle}
                      >
                        {c.blogTitle}
                      </Link>
                    </td>

                    {/* Author */}
                    <td className="px-4 py-3 whitespace-nowrap text-left">
                      <div className="font-semibold text-gray-800 text-sm">{c.authorName}</div>
                      {c.authorEmail && (
                        <div className="text-xs text-gray-400 font-mono truncate max-w-[140px]">{c.authorEmail}</div>
                      )}
                    </td>

                    {/* Comment */}
                    <td className="px-4 py-3 text-left">
                      <CommentCell text={c.comment} />
                      {edited && (
                        <span className="text-[9px] text-gray-400 mt-1 block">
                          ✏️ Edited {edited.date} {edited.time}
                        </span>
                      )}
                    </td>

                    {/* Date & Time */}
                    <td className="px-4 py-3 text-xs whitespace-nowrap text-left">
                      <div className="font-semibold text-gray-700">{dt.date}</div>
                      <div className="text-gray-400 mt-0.5">{dt.time}</div>
                    </td>

                    {/* Status Dropdown */}
                    <td className="px-4 py-3 text-left">
                      <StatusDropdown comment={c} onStatusChange={changeStatus} loading={loading} />
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Edit */}
                        <button
                          onClick={() => setEditingComment(c)}
                          className="px-3 py-1 text-xs font-semibold rounded border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition cursor-pointer flex items-center gap-1"
                        >
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => deleteComment(c._id)}
                          disabled={loading}
                          className="px-3 py-1 border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 rounded text-xs font-semibold transition cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer count */}
      {filteredComments.length > 0 && (
        <p className="text-xs text-gray-400 mt-3 text-right">
          Showing {filteredComments.length} of {comments.length} comments
        </p>
      )}
    </div>
  );
}
