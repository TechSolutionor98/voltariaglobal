import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { logActivity } from '@/lib/activity-logger';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,PATCH,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

function jsonResponse(data, status = 200) {
  return NextResponse.json(data, { status, headers: CORS_HEADERS });
}

// GET /api/blogs -> list all or get single by id or slug
export async function GET(req) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    const slug = url.searchParams.get('slug');
    const all = url.searchParams.get('all') === 'true'; // admin views all (published & drafts)

    const db = await getDb();
    const col = db.collection('cms_blogs');

    // Single item by ID
    if (id) {
      if (!ObjectId.isValid(id)) {
        return jsonResponse({ error: 'Invalid ID format' }, 400);
      }
      const blog = await col.findOne({ _id: new ObjectId(id) });
      if (!blog) {
        return jsonResponse({ error: 'Blog not found' }, 404);
      }
      return jsonResponse({
        ...blog,
        _id: blog._id.toString(),
      });
    }

    // Single item by slug
    if (slug) {
      const blog = await col.findOne({ slug });
      if (!blog) {
        return jsonResponse({ error: 'Blog not found' }, 404);
      }
      // If client requests slug but it's not published, restrict it unless admin
      if (!blog.published && !all) {
        return jsonResponse({ error: 'Blog not published' }, 403);
      }
      return jsonResponse({
        ...blog,
        _id: blog._id.toString(),
      });
    }

    // List blogs
    const filter = all ? {} : { published: true };
    const cursor = col.find(filter).sort({ createdAt: -1 });
    const rows = await cursor.toArray();
    
    // For each blog, let's count comments
    const commentsCol = db.collection('cms_blog_comments');
    const blogsWithCommentCounts = await Promise.all(rows.map(async (blog) => {
      const commentCount = await commentsCol.countDocuments({ 
        blogId: blog._id.toString() 
      });
      
      return {
        ...blog,
        _id: blog._id.toString(),
        commentCount,
      };
    }));

    return jsonResponse(blogsWithCommentCounts);
  } catch (err) {
    console.error('GET /api/blogs error', err);
    return jsonResponse({ error: 'Internal server error' }, 500);
  }
}

// POST /api/blogs -> create a blog
export async function POST(req) {
  try {
    const body = await req.json();
    const title = (body.title || '').toString().trim();
    let slug = (body.slug || '').toString().trim().toLowerCase();
    const excerpt = (body.excerpt || '').toString().trim();
    const content = (body.content || '').toString().trim();
    const coverImage = (body.coverImage || '').toString().trim();
    const author = (body.author || 'Admin').toString().trim();
    const tags = Array.isArray(body.tags) ? body.tags : [];
    const published = !!body.published;
    const readMinutes = body.readMinutes !== undefined && body.readMinutes !== null ? parseInt(body.readMinutes, 10) || null : null;
    const category = (body.category || '').toString().trim() || null;
    
    // SEO fields
    const metaTitle = (body.metaTitle || '').toString().trim();
    const metaDescription = (body.metaDescription || '').toString().trim();
    const keywords = (body.keywords || '').toString().trim();

    if (!title || !content) {
      return jsonResponse({ error: 'Title and content are required' }, 400);
    }

    // Generate slug if empty
    if (!slug) {
      slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    const db = await getDb();
    const col = db.collection('cms_blogs');

    // Check if slug is unique
    const existing = await col.findOne({ slug });
    if (existing) {
      // Append unique timestamp suffix to make slug unique
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const doc = {
      title,
      slug,
      excerpt,
      content,
      coverImage: coverImage || null,
      author,
      tags,
      published,
      readMinutes,
      category,
      metaTitle: metaTitle || null,
      metaDescription: metaDescription || null,
      keywords: keywords || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await col.insertOne(doc);
    await logActivity(req, 'create_blog', title, { slug, id: result.insertedId.toString() });

    return jsonResponse({ ...doc, _id: result.insertedId.toString() }, 201);
  } catch (err) {
    console.error('POST /api/blogs error', err);
    return jsonResponse({ error: 'Internal server error' }, 500);
  }
}

// PATCH /api/blogs -> update a blog
export async function PATCH(req) {
  try {
    const body = await req.json();
    const id = body.id;
    if (!id) return jsonResponse({ error: 'id is required' }, 400);
    if (!ObjectId.isValid(id)) return jsonResponse({ error: 'Invalid ID format' }, 400);

    const db = await getDb();
    const col = db.collection('cms_blogs');

    const existing = await col.findOne({ _id: new ObjectId(id) });
    if (!existing) return jsonResponse({ error: 'Blog not found' }, 404);

    const updateFields = { updatedAt: new Date() };
    
    if (body.title !== undefined) updateFields.title = body.title.toString().trim();
    if (body.slug !== undefined) {
      let newSlug = body.slug.toString().trim().toLowerCase();
      // Ensure slug uniqueness if changed
      if (newSlug !== existing.slug) {
        const slugConflict = await col.findOne({ slug: newSlug });
        if (slugConflict) {
          newSlug = `${newSlug}-${Date.now().toString().slice(-4)}`;
        }
      }
      updateFields.slug = newSlug;
    }
    if (body.excerpt !== undefined) updateFields.excerpt = body.excerpt.toString().trim();
    if (body.content !== undefined) updateFields.content = body.content.toString().trim();
    if (body.coverImage !== undefined) updateFields.coverImage = body.coverImage.toString().trim() || null;
    if (body.author !== undefined) updateFields.author = body.author.toString().trim() || 'Admin';
    if (body.tags !== undefined) updateFields.tags = Array.isArray(body.tags) ? body.tags : [];
    if (body.published !== undefined) updateFields.published = !!body.published;
    
    // SEO fields
    if (body.metaTitle !== undefined) updateFields.metaTitle = body.metaTitle.toString().trim() || null;
    if (body.metaDescription !== undefined) updateFields.metaDescription = body.metaDescription.toString().trim() || null;
    if (body.keywords !== undefined) updateFields.keywords = body.keywords.toString().trim() || null;

    // Custom fields
    if (body.readMinutes !== undefined) updateFields.readMinutes = body.readMinutes !== null ? parseInt(body.readMinutes, 10) || null : null;
    if (body.category !== undefined) updateFields.category = body.category !== null ? body.category.toString().trim() || null : null;

    const result = await col.updateOne({ _id: new ObjectId(id) }, { $set: updateFields });
    await logActivity(req, 'update_blog', updateFields.title || existing.title, { id });

    return jsonResponse({ ok: true });
  } catch (err) {
    console.error('PATCH /api/blogs error', err);
    return jsonResponse({ error: 'Internal server error' }, 500);
  }
}

// DELETE /api/blogs?id=... -> delete a blog and its comments
export async function DELETE(req) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (!id) return jsonResponse({ error: 'id is required' }, 400);
    if (!ObjectId.isValid(id)) return jsonResponse({ error: 'Invalid ID format' }, 400);

    const db = await getDb();
    const col = db.collection('cms_blogs');
    const existing = await col.findOne({ _id: new ObjectId(id) });
    if (!existing) return jsonResponse({ error: 'Blog not found' }, 404);

    // Delete comments associated with this blog
    const commentsCol = db.collection('cms_blog_comments');
    await commentsCol.deleteMany({ blogId: id });

    // Delete the blog itself
    await col.deleteOne({ _id: new ObjectId(id) });

    await logActivity(req, 'delete_blog', existing.title, { id });

    return jsonResponse({ ok: true });
  } catch (err) {
    console.error('DELETE /api/blogs error', err);
    return jsonResponse({ error: 'Internal server error' }, 500);
  }
}
