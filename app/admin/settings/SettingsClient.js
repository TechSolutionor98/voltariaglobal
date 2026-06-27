"use client"
import React, { useState } from 'react';
import { BarChart3, Code, Blocks, Plus, Trash2 } from 'lucide-react';

const PixelCard = ({ icon, iconBg, iconColor, title, subtitle, inputLabel, fieldName, fieldValue, headFieldName, headFieldValue, bodyFieldName, bodyFieldValue, placeholder, helperText, handleChange, active }) => (
  <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col mb-6">
    <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg ${iconBg} ${iconColor} flex items-center justify-center font-bold text-lg`}>
          {icon}
        </div>
        <div>
          <h3 className="font-bold text-gray-800 text-base">{title}</h3>
          <p className="text-xs text-gray-500">{subtitle}</p>
        </div>
      </div>
      {active ? (
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          ACTIVE
        </div>
      ) : (
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-400 border border-gray-200">
          <span className="w-2 h-2 rounded-full bg-gray-400"></span>
          INACTIVE
        </div>
      )}
    </div>

    <div className="w-full md:w-1/2 mb-4">
      <label htmlFor={fieldName} className="block text-xs font-bold text-gray-700 mb-1.5">
        {inputLabel}
      </label>
      <input
        id={fieldName}
        type="text"
        value={fieldValue || ''}
        onChange={(e) => handleChange(fieldName, e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 shadow-sm
                   focus:border-[#084032] focus:ring-2 focus:ring-[#FF333E] focus:outline-none transition bg-white"
      />
      {helperText && <span className="text-[10px] text-gray-400 mt-1 block">{helperText}</span>}
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 pt-4 border-t border-gray-100">
      <div className="w-full">
        <label htmlFor={headFieldName} className="block text-xs font-bold text-gray-700 mb-1.5">
          Header Code
        </label>
        <textarea
          id={headFieldName}
          value={headFieldValue || ''}
          onChange={(e) => handleChange(headFieldName, e.target.value)}
          placeholder="<!-- Paste <head> script here -->"
          rows={10}
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 shadow-sm font-mono
                     focus:border-[#084032] focus:ring-2 focus:ring-[#FF333E] focus:outline-none transition bg-gray-50 resize-y"
        />
      </div>
      <div className="w-full">
        <label htmlFor={bodyFieldName} className="block text-xs font-bold text-gray-700 mb-1.5">
          Body Code
        </label>
        <textarea
          id={bodyFieldName}
          value={bodyFieldValue || ''}
          onChange={(e) => handleChange(bodyFieldName, e.target.value)}
          placeholder="<!-- Paste <body> noscript/script here -->"
          rows={10}
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 shadow-sm font-mono
                     focus:border-[#084032] focus:ring-2 focus:ring-[#FF333E] focus:outline-none transition bg-gray-50 resize-y"
        />
      </div>
    </div>
  </div>
);

const SocialInput = ({ platform, field, settings, handleChange }) => (
  <div className="flex flex-col">
    <label htmlFor={field} className="block text-sm font-semibold text-gray-700 mb-2">{platform} URL</label>
    <input
      id={field}
      type="url"
      value={settings[field] || ''}
      onChange={(e) => handleChange(field, e.target.value)}
      placeholder={`https://${platform.toLowerCase()}.com/yourpage`}
      className="rounded-md border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 shadow-sm
                 focus:border-[#084032] focus:ring-2 focus:ring-[#FF333E] focus:outline-none transition"
    />
  </div>
);

export default function SettingsClient({ initialSettings = {}, apiBase = process.env.NEXT_PUBLIC_API_URL }) {
  const [settings, setSettings] = useState(initialSettings);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const addApp = () => {
    const newApp = { id: Date.now().toString(), name: '', appId: '', headCode: '', bodyCode: '', active: true };
    setSettings(prev => ({
      ...prev,
      thirdPartyApps: [...(prev.thirdPartyApps || []), newApp]
    }));
  };

  const updateApp = (id, field, value) => {
    setSettings(prev => ({
      ...prev,
      thirdPartyApps: prev.thirdPartyApps.map(app => app.id === id ? { ...app, [field]: value } : app)
    }));
  };

  const removeApp = (id) => {
    setSettings(prev => ({
      ...prev,
      thirdPartyApps: prev.thirdPartyApps.filter(app => app.id !== id)
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch(`${apiBase}/api/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.error || 'Failed to save settings');
      }

      setMessage('Settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setMessage('Failed to save settings: ' + err.message);
      setTimeout(() => setMessage(''), 5000);
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="w-full p-6 bg-white rounded-xl shadow-lg">
      {message && (
        <div
          className={`mb-6 rounded-md px-4 py-3 text-center font-medium
                      ${message.includes('successfully')
              ? 'bg-green-100 text-green-700 border border-green-300'
              : 'bg-red-100 text-red-700 border border-red-300'}`}
          role="alert"
        >
          {message}
        </div>
      )}

      <section className="mb-10 hidden">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-2">Contact Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
            <input
              id="phone"
              type="text"
              value={settings.phone || ''}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="+971 4-354 0566"
              className="rounded-md border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 shadow-sm
                         focus:border-[#084032] focus:ring-2 focus:ring-[#FF333E] focus:outline-none transition"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
            <input
              id="email"
              type="email"
              value={settings.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="contact@voltariaglobal.com"
              className="rounded-md border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 shadow-sm
                         focus:border-[#084032] focus:ring-2 focus:ring-[#FF333E] focus:outline-none transition"
            />
          </div>

          <div className="md:col-span-2 flex flex-col">
            <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
            <textarea
              id="address"
              value={settings.address || ''}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="Al Jahra Building, 2nd floor, 18th St – Al Raffa – Dubai"
              rows={3}
              className="rounded-md border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 shadow-sm resize-none
                         focus:border-[#084032] focus:ring-2 focus:ring-[#FF333E] focus:outline-none transition"
            />
          </div>
        </div>
      </section>

      <section className="mb-8 hidden">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-2">Social Media Links</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <SocialInput platform="Facebook" field="facebook" settings={settings} handleChange={handleChange} />
          <SocialInput platform="Twitter" field="twitter" settings={settings} handleChange={handleChange} />
          <SocialInput platform="Instagram" field="instagram" settings={settings} handleChange={handleChange} />
          <SocialInput platform="LinkedIn" field="linkedin" settings={settings} handleChange={handleChange} />
          <SocialInput platform="YouTube" field="youtube" settings={settings} handleChange={handleChange} />
          <SocialInput platform="TikTok" field="tiktok" settings={settings} handleChange={handleChange} />
          <SocialInput platform="Pinterest" field="pinterest" settings={settings} handleChange={handleChange} />
          <SocialInput platform="WhatsApp" field="whatsapp" settings={settings} handleChange={handleChange} />
          <SocialInput platform="Telegram" field="telegram" settings={settings} handleChange={handleChange} />
          <SocialInput platform="Reddit" field="reddit" settings={settings} handleChange={handleChange} />
          <SocialInput platform="Threads" field="threads" settings={settings} handleChange={handleChange} />
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-3 flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-[#084032]" />
          Analytics & Marketing Pixels
        </h2>

        <div className="flex flex-col gap-2">
          <PixelCard
            icon="G"
            iconBg="bg-orange-100"
            iconColor="text-orange-600"
            title="Google Analytics & Tag Manager"
            subtitle="Track site traffic and manage custom event tags"
            inputLabel="GA4 Measurement ID"
            fieldName="googleAnalyticsId"
            fieldValue={settings.googleAnalyticsId}
            headFieldName="googleAnalyticsHeadCode"
            headFieldValue={settings.googleAnalyticsHeadCode}
            bodyFieldName="googleAnalyticsBodyCode"
            bodyFieldValue={settings.googleAnalyticsBodyCode}
            placeholder="G-XXXXXXXXXX"
            helperText='Starting with "G-"'
            handleChange={handleChange}
            active={!!settings.googleAnalyticsId || !!settings.googleAnalyticsHeadCode}
          />

          <PixelCard
            icon="GTM"
            iconBg="bg-blue-100"
            iconColor="text-blue-600"
            title="Google Tag Manager"
            subtitle="Manage custom event tags and triggers"
            inputLabel="GTM Container ID"
            fieldName="googleTagManagerId"
            fieldValue={settings.googleTagManagerId}
            headFieldName="googleTagManagerHeadCode"
            headFieldValue={settings.googleTagManagerHeadCode}
            bodyFieldName="googleTagManagerBodyCode"
            bodyFieldValue={settings.googleTagManagerBodyCode}
            placeholder="GTM-XXXXXXX"
            helperText='Starting with "GTM-"'
            handleChange={handleChange}
            active={!!settings.googleTagManagerId || !!settings.googleTagManagerHeadCode}
          />

          <PixelCard
            icon="f"
            iconBg="bg-blue-100"
            iconColor="text-blue-600"
            title="Facebook Pixel"
            subtitle="Track Meta advertising conversion events"
            inputLabel="Pixel ID"
            fieldName="facebookPixelId"
            fieldValue={settings.facebookPixelId}
            headFieldName="facebookPixelHeadCode"
            headFieldValue={settings.facebookPixelHeadCode}
            bodyFieldName="facebookPixelBodyCode"
            bodyFieldValue={settings.facebookPixelBodyCode}
            placeholder="1234567890"
            helperText="Numeric identifier from Meta Ads manager"
            handleChange={handleChange}
            active={!!settings.facebookPixelId || !!settings.facebookPixelHeadCode}
          />

          {/* Third-Party Apps Header */}
          <div className="flex items-center justify-between mb-4 mt-6 pb-3 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <Plus className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-base">Third-Party Apps & Integrations</h3>
                <p className="text-xs text-gray-500">Add Microsoft Clarity, Chat Widgets, and other scripts.</p>
              </div>
            </div>
            <button
              onClick={addApp}
              className="px-4 py-2 text-sm font-semibold text-white bg-[#084032] hover:bg-[#0a5c48] rounded-md shadow-sm transition flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Add App
            </button>
          </div>

          <div className="space-y-6 mb-8">
            {(!settings.thirdPartyApps || settings.thirdPartyApps.length === 0) && (
              <div className="text-center py-8 text-sm text-gray-500 bg-gray-50 border border-dashed border-gray-300 rounded-xl">
                No 3rd party apps added yet. Click "Add App" to integrate one.
              </div>
            )}
            
            {settings.thirdPartyApps?.map((app) => (
              <div key={app.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col relative transition-all">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-3 w-full md:w-1/2">
                    <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg shrink-0">
                      {app.name ? app.name.charAt(0).toUpperCase() : <Code size={20} />}
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                      <input
                        type="text"
                        value={app.name}
                        onChange={(e) => updateApp(app.id, 'name', e.target.value)}
                        placeholder="App Name (e.g. Microsoft Clarity)"
                        className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm font-bold text-gray-800 focus:border-[#084032] focus:ring-1 focus:ring-[#FF333E] outline-none"
                      />
                      <input
                        type="text"
                        value={app.appId || ''}
                        onChange={(e) => updateApp(app.id, 'appId', e.target.value)}
                        placeholder="App ID (Optional, e.g. clarity-123)"
                        className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 focus:border-[#084032] focus:ring-1 focus:ring-[#FF333E] outline-none"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <label className="flex items-center cursor-pointer gap-2">
                      <span className="text-xs font-semibold text-gray-500">{app.active ? 'ACTIVE' : 'INACTIVE'}</span>
                      <div className="relative">
                        <input 
                          type="checkbox" 
                          className="sr-only" 
                          checked={app.active}
                          onChange={(e) => updateApp(app.id, 'active', e.target.checked)}
                        />
                        <div className={`block w-10 h-6 rounded-full transition ${app.active ? 'bg-[#084032]' : 'bg-gray-300'}`}></div>
                        <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition ${app.active ? 'transform translate-x-4' : ''}`}></div>
                      </div>
                    </label>
                    <button 
                      onClick={() => removeApp(app.id)}
                      className="text-red-400 hover:text-red-600 transition p-2 rounded-full hover:bg-red-50"
                      title="Remove App"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div className="w-full">
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Header Code</label>
                    <textarea
                      value={app.headCode || ''}
                      onChange={(e) => updateApp(app.id, 'headCode', e.target.value)}
                      placeholder="<!-- Paste <head> script here -->"
                      rows={8}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm font-mono focus:border-[#084032] focus:ring-2 focus:ring-[#FF333E] outline-none resize-y bg-gray-50"
                    />
                  </div>
                  <div className="w-full">
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Body Code</label>
                    <textarea
                      value={app.bodyCode || ''}
                      onChange={(e) => updateApp(app.id, 'bodyCode', e.target.value)}
                      placeholder="<!-- Paste <body> noscript/script here -->"
                      rows={8}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm font-mono focus:border-[#084032] focus:ring-2 focus:ring-[#FF333E] outline-none resize-y bg-gray-50"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      <div className="pt-6 border-t flex justify-end">
        <button
          onClick={handleSave}
          disabled={loading}
          className={`px-8 py-3 rounded-md text-white font-semibold transition
                      ${loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-[#E7000B] hover:bg-[#318d74] focus:outline-none focus:ring-2 focus:ring-[#FF333E]'}`}
        >
          {loading ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}
