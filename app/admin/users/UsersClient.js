"use client";
import React, { useState } from 'react';
import { FiPlus, FiUsers, FiEdit2, FiTrash2, FiShield, FiCheckCircle, FiAlertCircle, FiX, FiUserCheck, FiUserX } from 'react-icons/fi';

const ROLES = [
  { value: 'super_admin', label: 'Super Admin',   color: 'bg-red-100 text-red-700',    desc: 'Full access to everything' },
  { value: 'admin',       label: 'Admin',          color: 'bg-orange-100 text-orange-700', desc: 'All content & management' },
  { value: 'client',      label: 'Client',         color: 'bg-blue-100 text-blue-700',  desc: 'Own website management' },
  { value: 'seo',         label: 'SEO Specialist', color: 'bg-purple-100 text-purple-700', desc: 'SEO Manager & URL Redirects only' },
  { value: 'blog',        label: 'Blog Manager',   color: 'bg-teal-100 text-teal-700',  desc: 'Blogs section only' },
  { value: 'editor',      label: 'Content Editor', color: 'bg-green-100 text-green-700', desc: 'Pages, Redirects & Media' },
  { value: 'viewer',      label: 'Viewer',         color: 'bg-gray-100 text-gray-700',  desc: 'Pages & SEO view only' },
];

export default function UsersClient({ initialUsers = [], websites = [], apiBase }) {
  const [users, setUsers] = useState(initialUsers);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null); // user being edited
  const [editForm, setEditForm] = useState({ name: '', email: '', password: '' });
  const [editLoading, setEditLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'editor', assignedWebsites: [] });

  const showMsg = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 4000);
  };

  const handleCreate = async () => {
    if (!form.name || !form.email || !form.password) {
      showMsg('Please fill all required fields', 'error');
      return;
    }
    try {
      const res = await fetch(`${apiBase}/api/cms/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(prev => [data.user, ...prev]);
        showMsg('User created successfully!', 'success');
        setShowModal(false);
        setForm({ name: '', email: '', password: '', role: 'editor', assignedWebsites: [] });
      } else {
        showMsg(data.error || 'Failed to create user', 'error');
      }
    } catch (err) {
      showMsg('Error: ' + err.message, 'error');
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await fetch(`${apiBase}/api/cms/users`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, role: newRole }),
      });
      if (res.ok) {
        setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: newRole } : u));
        showMsg('Role updated', 'success');
      }
    } catch (err) {
      showMsg('Failed to update role', 'error');
    }
  };

  const openEdit = (user) => {
    setEditUser(user);
    setEditForm({ name: user.name || '', email: user.email || '', password: '' });
  };

  const handleEdit = async () => {
    if (!editForm.name || !editForm.email) {
      showMsg('Name and Email are required', 'error');
      return;
    }
    setEditLoading(true);
    try {
      const body = { id: editUser._id, name: editForm.name, email: editForm.email };
      if (editForm.password.trim()) body.password = editForm.password.trim();
      const res = await fetch(`${apiBase}/api/cms/users`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(prev => prev.map(u =>
          u._id === editUser._id
            ? { ...u, name: editForm.name, email: editForm.email }
            : u
        ));
        showMsg('User updated successfully!', 'success');
        setEditUser(null);
      } else {
        showMsg(data.error || 'Failed to update user', 'error');
      }
    } catch (err) {
      showMsg('Error: ' + err.message, 'error');
    }
    setEditLoading(false);
  };

  const handleDelete = async (userId) => {
    if (!confirm('Are you sure you want to permanently delete this user?')) return;
    try {
      const res = await fetch(`${apiBase}/api/cms/users?id=${userId}`, { method: 'DELETE' });
      if (res.ok) {
        setUsers(prev => prev.filter(u => u._id !== userId));
        showMsg('User deleted successfully', 'success');
      } else {
        showMsg('Failed to delete user', 'error');
      }
    } catch (err) {
      showMsg('Failed to delete user', 'error');
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    if (!confirm(`Are you sure you want to ${newStatus === 'active' ? 'activate' : 'deactivate'} this user?`)) return;
    try {
      const res = await fetch(`${apiBase}/api/cms/users`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, status: newStatus }),
      });
      if (res.ok) {
        setUsers(prev => prev.map(u => u._id === userId ? { ...u, status: newStatus } : u));
        showMsg(`User ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`, 'success');
      } else {
        showMsg('Failed to update status', 'error');
      }
    } catch (err) {
      showMsg('Failed to update status', 'error');
    }
  };

  const getRoleStyle = (role) => {
    const r = ROLES.find(r => r.value === role);
    return r ? r.color : 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-6">
      {message && (
        <div className={`rounded-md px-4 py-3 text-sm font-medium flex items-center gap-2
          ${messageType === 'success' ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-red-100 text-red-700 border border-red-300'}`}>
          {messageType === 'success' ? <FiCheckCircle /> : <FiAlertCircle />}
          {message}
        </div>
      )}

      {/* Stats + Add */}
      <div className="flex items-center justify-between">
        <div className="flex gap-4 text-sm text-gray-500">
          <span>{users.length} total users</span>
          <span>{users.filter(u => u.status === 'active').length} active</span>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#084032] text-white text-sm font-semibold rounded-md hover:bg-[#0a5c48] transition"
        >
          <FiPlus /> Add User
        </button>
      </div>

      {/* Users Table */}
      {users.length === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow text-center">
          <FiUsers className="mx-auto text-4xl text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No Users</h3>
          <p className="text-sm text-gray-400">Create your first user account.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">User</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Role</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Websites</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Created</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map(user => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#084032] flex items-center justify-center text-white text-sm font-bold">
                        {user.name?.charAt(0).toUpperCase() || '?'}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer ${getRoleStyle(user.role)}`}
                    >
                      {ROLES.map(r => (
                        <option key={r.value} value={r.value}>{r.label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-gray-500">
                      {user.assignedWebsites?.length || 0} websites
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-gray-500">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      {/* Edit Button */}
                      <button
                        onClick={() => openEdit(user)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Edit User"
                      >
                        <FiEdit2 size={15} />
                      </button>
                      {user.status === 'active' ? (
                        <button
                          onClick={() => handleToggleStatus(user._id, 'active')}
                          className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors"
                          title="Deactivate User"
                        >
                          <FiUserX size={15} />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleToggleStatus(user._id, 'inactive')}
                          className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                          title="Activate User"
                        >
                          <FiUserCheck size={15} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete User"
                      >
                        <FiTrash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Role Permissions Matrix */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
          <FiShield size={15} className="text-[#084032]" />
          <h3 className="text-sm font-semibold text-gray-700">Role Permissions — What each role can access</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide w-44">Module / Feature</th>
                <th className="px-3 py-3 text-center"><span className="inline-flex flex-col items-center gap-1"><span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-semibold text-[10px]">Super Admin</span><span className="text-[9px] text-gray-400 font-normal">Full control</span></span></th>
                <th className="px-3 py-3 text-center"><span className="inline-flex flex-col items-center gap-1"><span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 font-semibold text-[10px]">Admin</span><span className="text-[9px] text-gray-400 font-normal">All content</span></span></th>
                <th className="px-3 py-3 text-center"><span className="inline-flex flex-col items-center gap-1"><span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-semibold text-[10px]">Client</span><span className="text-[9px] text-gray-400 font-normal">Own website</span></span></th>
                <th className="px-3 py-3 text-center"><span className="inline-flex flex-col items-center gap-1"><span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-semibold text-[10px]">SEO</span><span className="text-[9px] text-gray-400 font-normal">SEO only</span></span></th>
                <th className="px-3 py-3 text-center"><span className="inline-flex flex-col items-center gap-1"><span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-700 font-semibold text-[10px]">Blog Mgr</span><span className="text-[9px] text-gray-400 font-normal">Blogs only</span></span></th>
                <th className="px-3 py-3 text-center"><span className="inline-flex flex-col items-center gap-1"><span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-semibold text-[10px]">Editor</span><span className="text-[9px] text-gray-400 font-normal">Pages+Media</span></span></th>
                <th className="px-3 py-3 text-center"><span className="inline-flex flex-col items-center gap-1"><span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-semibold text-[10px]">Viewer</span><span className="text-[9px] text-gray-400 font-normal">View only</span></span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[
                {
                  group: '⚙️ Management',
                  rows: [
                    { label: 'Dashboard',             super_admin:true,  admin:true,  client:true,  seo:true,  blog:true,  editor:true,  viewer:true  },
                    { label: 'Job Applications',       super_admin:true,  admin:true,  client:true,  seo:false, blog:false, editor:false, viewer:false },
                    { label: 'Inquiry Form (Contact)', super_admin:true,  admin:true,  client:true,  seo:false, blog:false, editor:false, viewer:false },
                    { label: 'Reviews',                super_admin:true,  admin:true,  client:true,  seo:false, blog:false, editor:false, viewer:false },
                    { label: 'Business Settings',      super_admin:true,  admin:true,  client:true,  seo:false, blog:false, editor:false, viewer:false },
                    { label: 'Users Management',       super_admin:true,  admin:true,  client:false, seo:false, blog:false, editor:false, viewer:false },
                    { label: 'Activity Logs',          super_admin:true,  admin:true,  client:false, seo:false, blog:false, editor:false, viewer:false },
                  ],
                },
                {
                  group: '🗂️ CMS',
                  rows: [
                    { label: 'Pages & Routes',         super_admin:true,  admin:true,  client:true,  seo:true,  blog:false, editor:true,  viewer:true  },
                    { label: 'SEO Manager',            super_admin:true,  admin:true,  client:true,  seo:true,  blog:false, editor:false, viewer:true  },
                    { label: 'URL Redirects',          super_admin:true,  admin:true,  client:true,  seo:true,  blog:false, editor:true,  viewer:true  },
                    { label: 'Media Library',          super_admin:true,  admin:true,  client:true,  seo:false, blog:false, editor:true,  viewer:false },
                  ],
                },
                {
                  group: '✍️ Blogs',
                  rows: [
                    { label: 'List Blogs',             super_admin:true,  admin:true,  client:true,  seo:false, blog:true,  editor:false, viewer:false },
                    { label: 'Add Blog',               super_admin:true,  admin:true,  client:true,  seo:false, blog:true,  editor:false, viewer:false },
                    { label: 'Comment List',           super_admin:true,  admin:true,  client:true,  seo:false, blog:true,  editor:false, viewer:false },
                  ],
                },
                {
                  group: '📅 Scheduling',
                  rows: [
                    { label: 'Appointment Links',      super_admin:true,  admin:true,  client:true,  seo:false, blog:false, editor:false, viewer:false },
                  ],
                },
              ].map(section => (
                <React.Fragment key={section.group}>
                  <tr className="bg-[#f8faf9]">
                    <td colSpan={8} className="px-4 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      {section.group}
                    </td>
                  </tr>
                  {section.rows.map((row, i) => (
                    <tr key={row.label} className={i % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-gray-50/50 hover:bg-gray-50'}>
                      <td className="px-4 py-2.5 text-xs text-gray-700 font-medium">{row.label}</td>
                      {['super_admin','admin','client','seo','blog','editor','viewer'].map(role => (
                        <td key={role} className="px-3 py-2.5 text-center">
                          {row[role] ? (
                            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-100 text-green-600" title="Access granted">
                              <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                            </span>
                          ) : (
                            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-50 text-red-300" title="No access">
                              <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                            </span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 flex flex-wrap items-center gap-5 text-[10px] text-gray-400">
          <span className="flex items-center gap-1.5"><span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-green-100 text-green-600"><svg viewBox="0 0 20 20" fill="currentColor" className="w-2.5 h-2.5"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg></span>Access granted</span>
          <span className="flex items-center gap-1.5"><span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-red-50 text-red-300"><svg viewBox="0 0 20 20" fill="currentColor" className="w-2.5 h-2.5"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg></span>No access</span>
          <span className="ml-auto">Super Admin has full access to everything. Roles define exactly what each user can see in the sidebar.</span>
        </div>
      </div>


      {/* ── Edit User Modal ────────────────────────────────────────────── */}
      {editUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setEditUser(null)}>
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Edit User</h3>
                <p className="text-xs text-gray-400 mt-0.5">Updating: {editUser.name}</p>
              </div>
              <button onClick={() => setEditUser(null)} className="p-1 hover:bg-gray-100 rounded"><FiX /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Name *</label>
                <input
                  value={editForm.name}
                  onChange={(e) => setEditForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="Full name"
                  className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-[#084032] focus:ring-2 focus:ring-[#00a63e] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm(p => ({ ...p, email: e.target.value }))}
                  placeholder="user@example.com"
                  className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-[#084032] focus:ring-2 focus:ring-[#00a63e] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  New Password
                  <span className="ml-1 text-xs font-normal text-gray-400">(khali choro agar change nahi karna)</span>
                </label>
                <input
                  type="password"
                  value={editForm.password}
                  onChange={(e) => setEditForm(p => ({ ...p, password: e.target.value }))}
                  placeholder="Leave blank to keep current password"
                  className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-[#084032] focus:ring-2 focus:ring-[#00a63e] outline-none"
                />
              </div>
              <button
                onClick={handleEdit}
                disabled={editLoading}
                className="w-full px-4 py-2.5 bg-[#084032] text-white text-sm font-semibold rounded-md hover:bg-[#0a5c48] transition disabled:opacity-60"
              >
                {editLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Create User Modal ────────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Create User</h3>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded"><FiX /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Name *</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="John Doe"
                  className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-[#084032] focus:ring-2 focus:ring-[#00a63e] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))}
                  placeholder="user@example.com"
                  className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-[#084032] focus:ring-2 focus:ring-[#00a63e] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Password *</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm(p => ({ ...p, password: e.target.value }))}
                  placeholder="Min 8 characters"
                  className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-[#084032] focus:ring-2 focus:ring-[#00a63e] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Role</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm(p => ({ ...p, role: e.target.value }))}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 focus:border-[#084032] focus:ring-2 focus:ring-[#00a63e] outline-none"
                >
                  {ROLES.map(r => (
                    <option key={r.value} value={r.value}>{r.label} — {r.desc}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleCreate}
                className="w-full px-4 py-2.5 bg-[#084032] text-white text-sm font-semibold rounded-md hover:bg-[#0a5c48] transition"
              >
                Create User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
