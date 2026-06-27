import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { logActivity } from '@/lib/activity-logger';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_ADMIN_ORIGIN || '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

async function getSettings() {
  const db = await getDb();
  const settings = await db.collection('settings').findOne({ _id: 'website_settings' });
  return settings || {};
}

async function saveSettings(data) {
  const db = await getDb();
  const settingsData = {
    _id: 'website_settings',
    phone: data.phone || '',
    email: data.email || '',
    address: data.address || '',
    facebook: data.facebook || '',
    twitter: data.twitter || '',
    instagram: data.instagram || '',
    linkedin: data.linkedin || '',
    youtube: data.youtube || '',
    pinterest: data.pinterest || '',
    tiktok: data.tiktok || '',
    telegram: data.telegram || '',
    snapchat: data.snapchat || '',
    whatsapp: data.whatsapp || '',
    reddit: data.reddit || '',
    threads: data.threads || '',
    googleAnalyticsId: data.googleAnalyticsId || '',
    googleAnalyticsHeadCode: data.googleAnalyticsHeadCode || '',
    googleAnalyticsBodyCode: data.googleAnalyticsBodyCode || '',
    googleTagManagerId: data.googleTagManagerId || '',
    googleTagManagerHeadCode: data.googleTagManagerHeadCode || '',
    googleTagManagerBodyCode: data.googleTagManagerBodyCode || '',
    facebookPixelId: data.facebookPixelId || '',
    facebookPixelHeadCode: data.facebookPixelHeadCode || '',
    facebookPixelBodyCode: data.facebookPixelBodyCode || '',
    customHeadScript: data.customHeadScript || '',
    customBodyScript: data.customBodyScript || '',
    thirdPartyApps: Array.isArray(data.thirdPartyApps) ? data.thirdPartyApps : [],
    updatedAt: new Date().toISOString()
  };

  await db.collection('settings').replaceOne(
    { _id: 'website_settings' },
    settingsData,
    { upsert: true }
  );
  
  return settingsData;
}

export async function GET() {
  try {
    const settings = await getSettings();
    return NextResponse.json(settings, { headers: CORS_HEADERS });
  } catch (err) {
    console.error('Error fetching settings:', err);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500, headers: CORS_HEADERS });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const settings = await saveSettings(body);
    await logActivity(request, 'update_settings', 'Global Settings', { keys: Object.keys(body) });
    return NextResponse.json({ ok: true, settings }, { status: 200, headers: CORS_HEADERS });
  } catch (err) {
    console.error('Error saving settings:', err);
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500, headers: CORS_HEADERS });
  }
}
