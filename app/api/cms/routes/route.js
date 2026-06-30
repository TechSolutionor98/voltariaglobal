import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_ADMIN_ORIGIN || '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

function jsonResponse(data, status = 200) {
  return NextResponse.json(data, { status, headers: CORS_HEADERS });
}

/**
 * Build a tree structure from flat routes array
 */
function buildRouteTree(routes) {
  const routeMap = {};
  const tree = [];

  // First pass: create map
  for (const route of routes) {
    routeMap[route.path] = { ...route, _id: route._id.toString(), children: [] };
  }

  // Second pass: build tree
  for (const route of routes) {
    const node = routeMap[route.path];
    if (route.parentPath && route.parentPath !== '/' && routeMap[route.parentPath]) {
      routeMap[route.parentPath].children.push(node);
    } else {
      tree.push(node);
    }
  }

  return tree;
}

// GET /api/cms/routes → List all routes
export async function GET(request) {
  try {
    const url = new URL(request.url);
    const websiteId = url.searchParams.get('websiteId') || 'default';
    const status = url.searchParams.get('status'); // active | archived | draft
    const treeView = url.searchParams.get('tree') === 'true';
    const search = url.searchParams.get('search') || '';

    const db = await getDb();
    const collection = db.collection('cms_routes');

    const filter = { websiteId };
    if (status) filter.status = status;
    if (search) {
      filter.path = { $regex: search, $options: 'i' };
    }

    const routes = await collection
      .find(filter)
      .sort({ path: 1 })
      .toArray();

    const filteredRoutes = routes
      .filter(r => r.path !== '/products/[category]' && r.path !== '/blogs' && !r.path.startsWith('/blogs/') && r.path !== '/products/batteries' && r.status !== 'archived')
      .map(r => {
        if (r.parentPath === '/products/[category]') {
          return {
            ...r,
            _id: r._id.toString(),
            parentPath: '/products',
            depth: 2
          };
        }
        return {
          ...r,
          _id: r._id.toString(),
        };
      });

    if (treeView) {
      const tree = buildRouteTree(filteredRoutes);
      return jsonResponse({ total: filteredRoutes.length, routes: tree });
    }

    return jsonResponse({ total: filteredRoutes.length, routes: filteredRoutes });
  } catch (err) {
    console.error('GET /api/cms/routes error:', err);
    return jsonResponse({ error: 'Failed to fetch routes' }, 500);
  }
}

// PATCH /api/cms/routes → Update route status or metadata
export async function PATCH(request) {
  try {
    const body = await request.json();
    const { id, status, customName } = body;

    if (!id) return jsonResponse({ error: 'id is required' }, 400);

    const db = await getDb();
    const collection = db.collection('cms_routes');

    const updateFields = { updatedAt: new Date().toISOString() };
    if (status) updateFields.status = status;
    if (customName !== undefined) updateFields.customName = customName;

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    );

    if (result.matchedCount === 0) {
      return jsonResponse({ error: 'Route not found' }, 404);
    }

    return jsonResponse({ ok: true });
  } catch (err) {
    console.error('PATCH /api/cms/routes error:', err);
    return jsonResponse({ error: 'Failed to update route' }, 500);
  }
}

// DELETE /api/cms/routes → Archive a route (soft delete)
export async function DELETE(request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) return jsonResponse({ error: 'id is required' }, 400);

    const db = await getDb();
    const collection = db.collection('cms_routes');

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: 'archived', updatedAt: new Date().toISOString() } }
    );

    if (result.matchedCount === 0) {
      return jsonResponse({ error: 'Route not found' }, 404);
    }

    return jsonResponse({ ok: true });
  } catch (err) {
    console.error('DELETE /api/cms/routes error:', err);
    return jsonResponse({ error: 'Failed to archive route' }, 500);
  }
}
