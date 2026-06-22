"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function BlogFormClient({ 
  initialData = null, 
  isEdit = false, 
  apiBase = process.env.NEXT_PUBLIC_API_URL || '' 
}) {
  const router = useRouter();
  
  // Basic states
  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || '');
  const [author, setAuthor] = useState(initialData?.author || 'Admin');
  const [tagsInput, setTagsInput] = useState(initialData?.tags?.join(', ') || '');
  const [published, setPublished] = useState(initialData?.published ?? false);
  const [readMinutes, setReadMinutes] = useState(initialData?.readMinutes || '');
  const [category, setCategory] = useState(initialData?.category || '');

  // SEO states
  const [metaTitle, setMetaTitle] = useState(initialData?.metaTitle || '');
  const [metaDescription, setMetaDescription] = useState(initialData?.metaDescription || '');
  const [keywords, setKeywords] = useState(initialData?.keywords || '');

  // UI control states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('visual'); // 'visual' | 'code'
  
  // Media Library Modal states
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [mediaList, setMediaList] = useState([]);
  const [loadingMedia, setLoadingMedia] = useState(false);
  const [mediaSearch, setMediaSearch] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [mediaTarget, setMediaTarget] = useState('cover'); // 'cover' | 'editor'
  const [mediaModalTab, setMediaModalTab] = useState('library'); // 'library' | 'url'
  const [inputUrl, setInputUrl] = useState('');

  const editorRef = useRef(null);
  const savedRangeRef = useRef(null);

  // Selection range saving and restoring helpers
  const saveSelection = () => {
    if (typeof window !== 'undefined') {
      const sel = window.getSelection();
      if (sel.rangeCount > 0) {
        savedRangeRef.current = sel.getRangeAt(0);
      }
    }
  };

  const restoreSelection = () => {
    if (typeof window !== 'undefined' && savedRangeRef.current) {
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(savedRangeRef.current);
    }
  };

  const handleEditorBlur = () => {
    saveSelection();
    handleEditorChange();
  };

  const handleMediaSelect = (url) => {
    if (mediaTarget === 'editor') {
      restoreSelection();
      executeCommand('insertImage', url);
    } else {
      setCoverImage(url);
    }
    setShowMediaModal(false);
  };

  // Prefill editor on load
  useEffect(() => {
    if (editorRef.current && initialData?.content) {
      editorRef.current.innerHTML = initialData.content;
    }
  }, [initialData]);

  // Set logged-in user name as default author if not editing and available
  useEffect(() => {
    if (!isEdit && typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          if (user?.name) setAuthor(user.name);
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, [isEdit]);

  // Handle title change and auto slug generation
  const handleTitleChange = (e) => {
    const val = e.target.value;
    setTitle(val);
    if (!isEdit) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setSlug(generatedSlug);
    }
  };

  // Sync contenteditable text with content state
  const handleEditorChange = () => {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  // Run document formatting commands
  const executeCommand = (command, value = null) => {
    if (typeof document !== 'undefined') {
      restoreSelection();
      if (editorRef.current) {
        editorRef.current.focus();
      }
      document.execCommand(command, false, value);
      handleEditorChange();
      saveSelection();
    }
  };

  // Handle visual vs HTML editor tab change
  const handleTabChange = (tab) => {
    if (tab === 'visual') {
      // Sync HTML code textarea edits back to contenteditable div
      setActiveTab('visual');
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.innerHTML = content;
        }
      }, 50);
    } else {
      setActiveTab('code');
    }
  };

  // Fetch media items for the Media Picker Modal
  const fetchMedia = async () => {
    try {
      setLoadingMedia(true);
      const res = await fetch(`${apiBase}/api/cms/media?websiteId=default&limit=60&search=${encodeURIComponent(mediaSearch)}`);
      if (res.ok) {
        const data = await res.json();
        setMediaList(data.media || []);
      }
    } catch (err) {
      console.error('Failed to fetch media library', err);
    } finally {
      setLoadingMedia(false);
    }
  };

  useEffect(() => {
    if (showMediaModal) {
      fetchMedia();
    }
  }, [showMediaModal, mediaSearch]);

  // Upload image to Cloudinary directly from the blog form
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('websiteId', 'default');
      formData.append('folder', 'blogs');

      const res = await fetch(`${apiBase}/api/cms/media`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      
      if (data.media?.url) {
        handleMediaSelect(data.media.url);
      }
    } catch (err) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!title) {
      setError('Title is required');
      return;
    }
    if (!content || content === '<br>' || content === '<div><br></div>') {
      setError('Content is required');
      return;
    }

    const tagsArray = tagsInput
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    const payload = {
      title,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      excerpt,
      content,
      coverImage,
      author,
      tags: tagsArray,
      published,
      metaTitle,
      metaDescription,
      keywords,
      readMinutes: readMinutes ? parseInt(readMinutes, 10) : null,
      category: category || null,
    };

    setLoading(true);

    try {
      let res;
      if (isEdit) {
        payload.id = initialData._id;
        res = await fetch(`${apiBase}/api/blogs`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`${apiBase}/api/blogs`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Failed to save blog post');
      }

      router.push('/admin/blogs');
      router.refresh();
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 max-w-5xl mx-auto text-gray-900">
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title & Slug */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Blog Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="Enter blog title"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#084032] focus:border-[#084032] outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Slug (URL suffix)
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9\-]+/g, ''))}
              placeholder="e.g. my-first-blog"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#084032] focus:border-[#084032] outline-none transition-all bg-gray-50"
            />
          </div>
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Short Excerpt / Summary
          </label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="A brief overview of the blog post (shown on listing pages)..."
            rows={2}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#084032] focus:border-[#084032] outline-none transition-all"
          />
        </div>

        {/* Cover Image URL & Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Cover Image
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="Image URL (HTTPS)"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#084032] focus:border-[#084032] outline-none transition-all"
            />
            <button
              type="button"
              onClick={() => {
                setMediaTarget('cover');
                setMediaModalTab('library');
                setShowMediaModal(true);
              }}
              className="px-4 py-2 bg-gray-100 border border-gray-300 hover:bg-gray-200 text-gray-700 font-medium rounded-lg text-sm transition-all"
            >
              Browse Library
            </button>
          </div>
          {coverImage && (
            <div className="mt-3 relative w-48 h-28 border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
              <img
                src={coverImage}
                alt="Cover Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}
        </div>

        {/* Content Rich Text Editor */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-semibold text-gray-700">
              Blog Content <span className="text-red-500">*</span>
            </label>
            
            {/* visual/code tabs */}
            <div className="flex bg-gray-100 p-0.5 rounded-lg text-xs">
              <button
                type="button"
                onClick={() => handleTabChange('visual')}
                className={`px-3 py-1 rounded-md font-semibold transition-all ${
                  activeTab === 'visual' ? 'bg-white text-[#084032] shadow-sm' : 'text-gray-500 hover:text-black'
                }`}
              >
                Visual Editor
              </button>
              <button
                type="button"
                onClick={() => handleTabChange('code')}
                className={`px-3 py-1 rounded-md font-semibold transition-all ${
                  activeTab === 'code' ? 'bg-white text-[#084032] shadow-sm' : 'text-gray-500 hover:text-black'
                }`}
              >
                HTML Code
              </button>
            </div>
          </div>

          {activeTab === 'visual' ? (
            <div className="border border-gray-300 rounded-lg overflow-hidden flex flex-col">
              <div className="bg-gray-50 border-b border-gray-200 p-2.5 flex flex-wrap gap-1.5 items-center">
                {/* Style Dropdown */}
                <select
                  onChange={(e) => {
                    executeCommand('formatBlock', e.target.value);
                  }}
                  defaultValue="<p>"
                  className="bg-white border border-gray-300 rounded px-2.5 py-1.5 text-xs font-semibold outline-none cursor-pointer text-gray-700 hover:bg-gray-50 focus:ring-1 focus:ring-[#084032] mr-1"
                >
                  <option value="<p>">Normal Text</option>
                  <option value="<h1>">Heading 1</option>
                  <option value="<h2>">Heading 2</option>
                  <option value="<h3>">Heading 3</option>
                  <option value="<h4>">Heading 4</option>
                </select>

                <div className="h-5 w-px bg-gray-300 mx-1" />

                {/* B I U Buttons */}
                <button
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); executeCommand('bold'); }}
                  className="p-1.5 text-xs font-bold bg-white border border-gray-200 rounded hover:bg-gray-100 text-gray-750 shadow-xs cursor-pointer flex items-center justify-center min-w-8 h-8"
                  title="Bold"
                >
                  B
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); executeCommand('italic'); }}
                  className="p-1.5 text-xs italic bg-white border border-gray-200 rounded hover:bg-gray-100 text-gray-750 shadow-xs cursor-pointer flex items-center justify-center min-w-8 h-8"
                  title="Italic"
                >
                  I
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); executeCommand('underline'); }}
                  className="p-1.5 text-xs underline bg-white border border-gray-200 rounded hover:bg-gray-100 text-gray-750 shadow-xs cursor-pointer flex items-center justify-center min-w-8 h-8"
                  title="Underline"
                >
                  U
                </button>

                <div className="h-5 w-px bg-gray-300 mx-1" />

                {/* List Buttons */}
                <button
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); executeCommand('insertUnorderedList'); }}
                  className="p-1.5 bg-white border border-gray-200 rounded hover:bg-gray-100 text-gray-750 shadow-xs cursor-pointer flex items-center justify-center w-8 h-8"
                  title="Bullet List"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <line x1="8" y1="6" x2="21" y2="6"></line>
                    <line x1="8" y1="12" x2="21" y2="12"></line>
                    <line x1="8" y1="18" x2="21" y2="18"></line>
                    <line x1="3" y1="6" x2="3.01" y2="6"></line>
                    <line x1="3" y1="12" x2="3.01" y2="12"></line>
                    <line x1="3" y1="18" x2="3.01" y2="18"></line>
                  </svg>
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); executeCommand('insertOrderedList'); }}
                  className="p-1.5 bg-white border border-gray-200 rounded hover:bg-gray-100 text-gray-750 shadow-xs cursor-pointer flex items-center justify-center w-8 h-8"
                  title="Numbered List"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <line x1="10" y1="6" x2="21" y2="6"></line>
                    <line x1="10" y1="12" x2="21" y2="12"></line>
                    <line x1="10" y1="18" x2="21" y2="18"></line>
                    <path d="M4 6h1v4"></path>
                    <path d="M4 10h2"></path>
                    <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"></path>
                  </svg>
                </button>

                <div className="h-5 w-px bg-gray-300 mx-1" />

                {/* Alignment Buttons */}
                <button
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); executeCommand('justifyLeft'); }}
                  className="p-1.5 bg-white border border-gray-200 rounded hover:bg-gray-100 text-gray-750 shadow-xs cursor-pointer flex items-center justify-center w-8 h-8"
                  title="Align Left"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <line x1="17" y1="10" x2="3" y2="10"></line>
                    <line x1="21" y1="6" x2="3" y2="6"></line>
                    <line x1="21" y1="14" x2="3" y2="14"></line>
                    <line x1="17" y1="18" x2="3" y2="18"></line>
                  </svg>
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); executeCommand('justifyCenter'); }}
                  className="p-1.5 bg-white border border-gray-200 rounded hover:bg-gray-100 text-gray-750 shadow-xs cursor-pointer flex items-center justify-center w-8 h-8"
                  title="Align Center"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <line x1="18" y1="10" x2="6" y2="10"></line>
                    <line x1="21" y1="6" x2="3" y2="6"></line>
                    <line x1="21" y1="14" x2="3" y2="14"></line>
                    <line x1="18" y1="18" x2="6" y2="18"></line>
                  </svg>
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); executeCommand('justifyRight'); }}
                  className="p-1.5 bg-white border border-gray-200 rounded hover:bg-gray-100 text-gray-750 shadow-xs cursor-pointer flex items-center justify-center w-8 h-8"
                  title="Align Right"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <line x1="21" y1="10" x2="7" y2="10"></line>
                    <line x1="21" y1="6" x2="3" y2="6"></line>
                    <line x1="21" y1="14" x2="3" y2="14"></line>
                    <line x1="21" y1="18" x2="7" y2="18"></line>
                  </svg>
                </button>

                <div className="h-5 w-px bg-gray-300 mx-1" />

                {/* Media Buttons */}
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    saveSelection();
                    setMediaTarget('editor');
                    setMediaModalTab('library');
                    setInputUrl('');
                    setShowMediaModal(true);
                  }}
                  className="p-1.5 bg-white border border-gray-200 rounded hover:bg-gray-100 text-[#084032] shadow-xs cursor-pointer flex items-center justify-center w-8 h-8"
                  title="Insert Image"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                  </svg>
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    const url = prompt('Enter YouTube Video URL:');
                    if (url) {
                      let embedUrl = url;
                      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
                      const match = url.match(regExp);
                      if (match && match[2].length === 11) {
                        embedUrl = `https://www.youtube.com/embed/${match[2]}`;
                      }
                      const iframeHtml = `<div class="aspect-video w-full my-4 relative overflow-hidden rounded-lg"><iframe src="${embedUrl}" class="absolute inset-0 w-full h-full" frameborder="0" allowfullscreen></iframe></div>`;
                      executeCommand('insertHTML', iframeHtml);
                    }
                  }}
                  className="p-1.5 bg-white border border-gray-200 rounded hover:bg-gray-100 text-[#084032] shadow-xs cursor-pointer flex items-center justify-center w-8 h-8"
                  title="Insert YouTube Video"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M23 7l-7 5 7 5V7z"></path>
                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                  </svg>
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    const url = prompt('Enter link URL:');
                    if (url) executeCommand('createLink', url);
                  }}
                  className="p-1.5 bg-white border border-gray-200 rounded hover:bg-gray-100 text-[#084032] shadow-xs cursor-pointer flex items-center justify-center w-8 h-8"
                  title="Insert Link"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                  </svg>
                </button>

                <button
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); executeCommand('removeFormat'); }}
                  className="px-2.5 py-1.5 text-xs bg-white border border-gray-200 rounded hover:bg-red-50 text-red-600 shadow-xs ml-auto cursor-pointer font-semibold"
                  title="Clear formatting"
                >
                  Clear
                </button>
              </div>

              <div
                ref={editorRef}
                contentEditable
                onBlur={handleEditorBlur}
                onInput={handleEditorChange}
                onKeyUp={saveSelection}
                onMouseUp={saveSelection}
                className="w-full p-4 min-h-[350px] outline-none prose max-w-none focus:ring-0 overflow-y-auto bg-white"
                style={{ direction: 'left', textAlign: 'left' }}
              />
            </div>
          ) : (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste HTML source code here..."
              rows={16}
              className="w-full p-4 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-[#084032] focus:border-[#084032] outline-none"
            />
          )}
        </div>

        {/* Category & Read Minutes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Blog Category
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Technology, Tutorials, Insights"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#084032] focus:border-[#084032] outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Read Minutes
            </label>
            <input
              type="number"
              min="0"
              value={readMinutes}
              onChange={(e) => setReadMinutes(e.target.value)}
              placeholder="e.g. 5"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#084032] focus:border-[#084032] outline-none transition-all"
            />
          </div>
        </div>

        {/* Author & Tags */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Author
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="e.g. Admin or Writer Name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#084032] focus:border-[#084032] outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="e.g. Technology, Business, Excel"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#084032] focus:border-[#084032] outline-none transition-all"
            />
          </div>
        </div>

        {/* SEO Management Panel */}
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
          <div className="p-4 bg-gray-100 border-b border-gray-200 font-semibold text-sm text-gray-700 flex justify-between items-center">
            <span>SEO Meta Configuration (Optional)</span>
            <span className="text-xs text-gray-400">Controls head tags for search engines</span>
          </div>
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Meta Title</label>
              <input
                type="text"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                placeholder="Defaults to blog title if left blank"
                className="w-full bg-white px-3 py-1.5 border border-gray-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-[#084032]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Meta Description</label>
              <textarea
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                placeholder="A compelling, keyword-rich summary of less than 160 characters for search listings..."
                rows={2}
                className="w-full bg-white px-3 py-1.5 border border-gray-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-[#084032]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Keywords</label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="e.g. excel dashboard, crown excel templates, reporting"
                className="w-full bg-white px-3 py-1.5 border border-gray-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-[#084032]"
              />
            </div>
          </div>
        </div>

        {/* Published Toggle */}
        <div className="flex items-center gap-3 py-2">
          <input
            type="checkbox"
            id="published"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="w-5 h-5 accent-[#084032] border-gray-300 rounded focus:ring-[#084032]"
          />
          <label htmlFor="published" className="text-sm font-semibold text-gray-700 select-none cursor-pointer">
            Publish Post immediately (uncheck to save as draft)
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={() => router.push('/admin/blogs')}
            className="px-5 py-2 border border-gray-300 hover:bg-gray-100 text-gray-700 font-semibold rounded-lg transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 bg-[#084032] hover:bg-[#00a63e] text-white font-semibold rounded-lg shadow disabled:opacity-60 transition-all cursor-pointer"
          >
            {loading ? 'Saving...' : isEdit ? 'Update Post' : 'Create Post'}
          </button>
        </div>
      </form>

      {/* Media Library Selection Modal */}
      {showMediaModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[85vh] flex flex-col overflow-hidden border border-gray-100">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800">
                {mediaTarget === 'editor' ? 'Insert Image' : 'Select Cover Image'}
              </h3>
              <button
                type="button"
                onClick={() => setShowMediaModal(false)}
                className="text-gray-500 hover:text-black font-bold text-xl cursor-pointer"
              >
                &times;
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 bg-gray-50 px-6">
              <button
                type="button"
                onClick={() => setMediaModalTab('library')}
                className={`py-3 px-4 text-sm font-semibold border-b-2 transition-all ${
                  mediaModalTab === 'library'
                    ? 'border-[#084032] text-[#084032]'
                    : 'border-transparent text-gray-550 hover:text-[#084032]'
                }`}
              >
                Media Library
              </button>
              <button
                type="button"
                onClick={() => setMediaModalTab('url')}
                className={`py-3 px-4 text-sm font-semibold border-b-2 transition-all ${
                  mediaModalTab === 'url'
                    ? 'border-[#084032] text-[#084032]'
                    : 'border-transparent text-gray-550 hover:text-[#084032]'
                }`}
              >
                Insert from URL
              </button>
            </div>

            {mediaModalTab === 'url' ? (
              <div className="flex-1 overflow-y-auto p-8 bg-gray-50 flex items-center justify-center min-h-[350px]">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm max-w-lg w-full space-y-4">
                  <h4 className="text-sm font-bold text-gray-800">Insert Image from External URL</h4>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Image Link (HTTPS)</label>
                    <input
                      type="url"
                      value={inputUrl}
                      onChange={(e) => setInputUrl(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#084032] focus:border-[#084032] outline-none transition-all"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setInputUrl('')}
                      className="px-4 py-2 border border-gray-300 hover:bg-gray-100 text-gray-700 font-semibold rounded-lg text-sm transition-all"
                    >
                      Clear
                    </button>
                    <button
                      type="button"
                      disabled={!inputUrl}
                      onClick={() => {
                        if (inputUrl) {
                          handleMediaSelect(inputUrl);
                          setInputUrl('');
                        }
                      }}
                      className="px-5 py-2 bg-[#084032] hover:bg-[#00a63e] disabled:opacity-50 text-white font-semibold rounded-lg text-sm shadow transition-all cursor-pointer"
                    >
                      Insert Image
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Upload & Search controls */}
                <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row gap-4 items-center justify-between bg-white">
                  <div className="relative w-full sm:w-72">
                    <input
                      type="text"
                      value={mediaSearch}
                      onChange={(e) => setMediaSearch(e.target.value)}
                      placeholder="Search media..."
                      className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#084032] outline-none"
                    />
                  </div>

                  <div className="flex gap-2 w-full sm:w-auto justify-end">
                    <label className="cursor-pointer px-4 py-2 bg-[#084032] hover:bg-[#00a63e] text-white font-semibold rounded-lg text-sm transition-all text-center">
                      {uploadingImage ? 'Uploading...' : 'Upload New Image'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Media Grid */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50 min-h-[300px]">
                  {loadingMedia ? (
                    <div className="flex items-center justify-center h-48">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#084032]"></div>
                    </div>
                  ) : mediaList.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 text-gray-500">
                      <span className="mb-2">No media found.</span>
                      <span className="text-xs">Upload images using the upload button above.</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
                      {mediaList.map((media) => (
                        <div
                          key={media._id}
                          onClick={() => {
                            handleMediaSelect(media.url);
                          }}
                          className="group cursor-pointer border border-gray-200 hover:border-[#084032] rounded-lg overflow-hidden bg-white shadow-xs hover:shadow transition-all relative flex flex-col"
                        >
                          <div className="w-full aspect-square bg-gray-100 relative overflow-hidden">
                            <img
                              src={media.thumbnailUrl || media.url}
                              alt={media.alt || media.originalName}
                              className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                            />
                          </div>
                          <div className="p-2 border-t border-gray-100 text-[10px] text-gray-500 truncate">
                            {media.originalName}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
              <button
                type="button"
                onClick={() => setShowMediaModal(false)}
                className="px-4 py-2 border border-gray-300 hover:bg-gray-150 text-gray-700 font-semibold rounded-lg text-sm transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
