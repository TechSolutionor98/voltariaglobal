"use client";

import React, { useState } from 'react';
import OtpModal from '@/components/OtpModal';

interface Comment {
  _id: string;
  authorName: string;
  authorEmail: string;
  comment: string;
  createdAt?: string;
}

interface BlogCommentsSectionProps {
  blogId: string;
  initialComments?: Comment[];
  apiBase?: string;
}

export default function BlogCommentsSection({ 
  blogId, 
  initialComments = [], 
  apiBase = '' 
}: BlogCommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [authorName, setAuthorName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showOtpModal, setShowOtpModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!authorName.trim() || !authorEmail.trim() || !commentText.trim()) {
      setError('Name, Email, and Comment are required.');
      return;
    }

    // Open OtpModal to verify email before posting
    setShowOtpModal(true);
  };

  const handleCommentSubmit = async () => {
    setShowOtpModal(false);
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const res = await fetch(`${apiBase}/api/blogs/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blogId,
          authorName: authorName.trim(),
          authorEmail: authorEmail.trim(),
          comment: commentText.trim(),
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Failed to submit comment');
      }

      setSuccess(true);
      setAuthorName('');
      setAuthorEmail('');
      setCommentText('');
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* Comments List */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <span>Comments</span>
          <span className="text-sm px-2.5 py-0.5 bg-gray-100 text-gray-600 rounded-full font-semibold">
            {comments.length}
          </span>
        </h3>

        {comments.length === 0 ? (
          <p className="text-gray-500 italic bg-gray-50 border border-gray-100 rounded-xl p-6 text-center">
            No approved comments yet. Be the first to share your thoughts!
          </p>
        ) : (
          <div className="space-y-4">
            {comments.map((c) => (
              <div 
                key={c._id} 
                className="bg-white p-5 rounded-xl border border-gray-150 shadow-xs flex flex-col space-y-2 text-left"
              >
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-gray-800 text-sm">{c.authorName}</span>
                  <span className="text-gray-400">
                    {c.createdAt ? new Date(c.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    }) : ''}
                  </span>
                </div>
                <p className="text-gray-700 text-sm whitespace-pre-wrap leading-relaxed">
                  {c.comment}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Leave a Comment Form */}
      <div className="bg-white space-y-6 text-left">
        <div className="space-y-1">
          <h4 className="text-xl font-bold text-gray-800">Leave a Comment</h4>
          <p className="text-xs text-gray-400">Your email address will not be published. Required fields are marked *</p>
        </div>

        {success && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-semibold">
            ✓ Thank you! Your comment has been submitted and is pending moderation before it appears live.
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium">
            ⚠ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="John Doe"
                required
                className="w-full bg-white px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-red-650 focus:border-red-600 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={authorEmail}
                onChange={(e) => setAuthorEmail(e.target.value)}
                placeholder="john@example.com"
                required
                className="w-full bg-white px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-red-650 focus:border-red-600 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-650 mb-1">
              Comment <span className="text-red-500">*</span>
            </label>
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write your comment here..."
              rows={4}
              required
              className="w-full bg-white px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-red-650 focus:border-red-600 outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow disabled:opacity-60 transition-all cursor-pointer"
          >
            {loading ? 'Submitting...' : 'Post Comment'}
          </button>
        </form>
      </div>

      <OtpModal
        isOpen={showOtpModal}
        email={authorEmail}
        onVerified={handleCommentSubmit}
        onClose={() => setShowOtpModal(false)}
      />
    </div>
  );
}
