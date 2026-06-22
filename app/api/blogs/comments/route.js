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

// GET /api/blogs/comments -> list comments (by blog or all for admin)
export async function GET(req) {
  try {
    const url = new URL(req.url);
    const blogId = url.searchParams.get('blogId');
    const all = url.searchParams.get('all') === 'true'; // admin views all (approved and unapproved)

    const db = await getDb();
    const col = db.collection('cms_blog_comments');

    const filter = {};
    if (blogId) {
      filter.blogId = blogId;
    }
    if (!all) {
      filter.approved = true; // client only sees approved comments
    }

    const cursor = col.find(filter).sort({ createdAt: -1 });
    const comments = await cursor.toArray();

    // Map comments and attach blog title
    const blogsCol = db.collection('cms_blogs');
    const enrichedComments = await Promise.all(comments.map(async (c) => {
      let blogTitle = 'Deleted Blog';
      if (c.blogId) {
        try {
          const blog = await blogsCol.findOne({ _id: new ObjectId(c.blogId) });
          if (blog) {
            blogTitle = blog.title;
          }
        } catch (err) {
          // Maybe blogId is not ObjectId format
          const blog = await blogsCol.findOne({ slug: c.blogId });
          if (blog) {
            blogTitle = blog.title;
          }
        }
      }

      return {
        ...c,
        _id: c._id.toString(),
        blogTitle,
      };
    }));

    return jsonResponse(enrichedComments);
  } catch (err) {
    console.error('GET /api/blogs/comments error', err);
    return jsonResponse({ error: 'Internal server error' }, 500);
  }
}

// POST /api/blogs/comments -> submit a new comment
export async function POST(req) {
  try {
    const body = await req.json();
    const blogId = (body.blogId || '').toString().trim();
    const authorName = (body.authorName || '').toString().trim();
    const authorEmail = (body.authorEmail || '').toString().trim();
    const comment = (body.comment || '').toString().trim();

    if (!blogId || !authorName || !comment) {
      return jsonResponse({ error: 'blogId, authorName, and comment are required' }, 400);
    }

    const db = await getDb();
    
    // Verify blog exists
    const blogsCol = db.collection('cms_blogs');
    let blog = null;
    try {
      blog = await blogsCol.findOne({ _id: new ObjectId(blogId) });
    } catch (e) {
      blog = await blogsCol.findOne({ slug: blogId });
    }
    
    if (!blog) {
      return jsonResponse({ error: 'Referenced blog post not found' }, 404);
    }

    const doc = {
      blogId: blog._id.toString(),
      authorName,
      authorEmail: authorEmail || null,
      comment,
      approved: false, // Moderated by default
      createdAt: new Date(),
    };

    const col = db.collection('cms_blog_comments');
    const result = await col.insertOne(doc);

    await logActivity(req, 'create_comment', authorName, { blogId: doc.blogId, id: result.insertedId.toString() });

    return jsonResponse({ ...doc, _id: result.insertedId.toString() }, 201);
  } catch (err) {
    console.error('POST /api/blogs/comments error', err);
    return jsonResponse({ error: 'Internal server error' }, 500);
  }
}

// PATCH /api/blogs/comments -> update comment (status and/or text)
export async function PATCH(req) {
  try {
    const body = await req.json();
    const id = body.id;
    if (!id) return jsonResponse({ error: 'id is required' }, 400);
    if (!ObjectId.isValid(id)) return jsonResponse({ error: 'Invalid ID format' }, 400);

    const db = await getDb();
    const col = db.collection('cms_blog_comments');

    const updateFields = {};

    // Status update: approved | pending | rejected
    if (body.status !== undefined) {
      const validStatuses = ['approved', 'pending', 'rejected'];
      if (!validStatuses.includes(body.status)) {
        return jsonResponse({ error: 'Invalid status. Must be: approved, pending, rejected' }, 400);
      }
      updateFields.status = body.status;
      updateFields.approved = body.status === 'approved';
    }

    // Comment text edit
    if (body.comment !== undefined) {
      const trimmed = body.comment.toString().trim();
      if (!trimmed) return jsonResponse({ error: 'Comment text cannot be empty' }, 400);
      updateFields.comment = trimmed;
      updateFields.editedAt = new Date();
    }

    if (Object.keys(updateFields).length === 0) {
      return jsonResponse({ error: 'No fields to update' }, 400);
    }

    const result = await col.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    );

    if (result.matchedCount === 0) {
      return jsonResponse({ error: 'Comment not found' }, 404);
    }

    await logActivity(req, 'update_comment', id, updateFields);

    return jsonResponse({ ok: true });
  } catch (err) {
    console.error('PATCH /api/blogs/comments error', err);
    return jsonResponse({ error: 'Internal server error' }, 500);
  }
}

// DELETE /api/blogs/comments?id=... -> delete a comment
export async function DELETE(req) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (!id) return jsonResponse({ error: 'id is required' }, 400);
    if (!ObjectId.isValid(id)) return jsonResponse({ error: 'Invalid ID format' }, 400);

    const db = await getDb();
    const col = db.collection('cms_blog_comments');

    const result = await col.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return jsonResponse({ error: 'Comment not found' }, 404);
    }

    await logActivity(req, 'delete_comment', id);

    return jsonResponse({ ok: true });
  } catch (err) {
    console.error('DELETE /api/blogs/comments error', err);
    return jsonResponse({ error: 'Internal server error' }, 500);
  }
}
