'use client';

import { useEffect, useState } from 'react';
import { getMembers, addMember, verifyPin } from '@/lib/store';
import { TeamMember } from '@/lib/types';

export default function UsersPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [showPinDialog, setShowPinDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<'admin' | 'contributor'>('contributor');

  useEffect(() => {
    setMembers(getMembers());
  }, []);

  const handleAddClick = () => {
    setShowPinDialog(true);
    setPin('');
    setPinError('');
  };

  const handlePinSubmit = () => {
    if (verifyPin(pin)) {
      setShowPinDialog(false);
      setShowAddDialog(true);
      setNewName('');
      setNewEmail('');
      setNewRole('contributor');
    } else {
      setPinError('Invalid PIN. Please try again.');
    }
  };

  const handleAddMember = () => {
    if (newName && newEmail) {
      addMember(newName, newEmail, newRole);
      setMembers(getMembers());
      setShowAddDialog(false);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h1 className="text-4xl font-bold text-text-dark">Team Members</h1>
          <p className="text-text-muted mt-1">View all team members</p>
        </div>
        <button
          onClick={handleAddClick}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-white font-medium"
          style={{ backgroundColor: 'var(--olive)' }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Add Member
        </button>
      </div>

      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden mt-6">
        <table className="w-full">
          <thead>
            <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
              <th className="text-left px-6 py-4 text-sm font-medium text-text-muted">Name</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-text-muted">Email</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-text-muted">Role</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-text-muted">Joined</th>
            </tr>
          </thead>
          <tbody>
            {members.map(member => (
              <tr key={member.id} className="border-b last:border-b-0" style={{ borderColor: 'var(--border)' }}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                      {getInitials(member.name)}
                    </div>
                    <span className="text-sm font-medium text-text-dark">{member.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-text-muted">{member.email}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-3 py-1 rounded-full font-medium border ${
                    member.role === 'admin'
                      ? 'text-olive border-olive/30 bg-olive/5'
                      : 'text-text-dark border-border bg-cream-dark'
                  }`}>
                    {member.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-text-muted">{formatDate(member.joinedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PIN Dialog */}
      {showPinDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-xl">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <h2 className="text-xl font-bold text-text-dark">Admin Access Required</h2>
              </div>
              <button onClick={() => setShowPinDialog(false)} className="text-text-muted hover:text-text-dark text-xl">&times;</button>
            </div>
            <p className="text-sm text-text-muted mb-6">Managing team members requires admin access.</p>
            <label className="block text-sm font-medium text-text-dark mb-2">Admin PIN</label>
            <input
              type="password"
              value={pin}
              onChange={e => { setPin(e.target.value); setPinError(''); }}
              placeholder="Enter PIN"
              className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-olive/30 mb-1"
              onKeyDown={e => e.key === 'Enter' && handlePinSubmit()}
            />
            {pinError && <p className="text-red-500 text-xs mt-1">{pinError}</p>}
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowPinDialog(false)} className="flex-1 px-4 py-2.5 border border-border rounded-lg text-sm font-medium text-text-dark hover:bg-cream">Cancel</button>
              <button onClick={handlePinSubmit} className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: 'var(--olive)' }}>Unlock</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Member Dialog */}
      {showAddDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-xl">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-bold text-text-dark">Add Team Member</h2>
              <button onClick={() => setShowAddDialog(false)} className="text-text-muted hover:text-text-dark text-xl">&times;</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-dark mb-1">Full Name</label>
                <input value={newName} onChange={e => setNewName(e.target.value)} className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-olive/30" placeholder="Enter name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-dark mb-1">Email</label>
                <input value={newEmail} onChange={e => setNewEmail(e.target.value)} type="email" className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-olive/30" placeholder="Enter email" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-dark mb-1">Role</label>
                <select value={newRole} onChange={e => setNewRole(e.target.value as 'admin' | 'contributor')} className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-olive/30">
                  <option value="contributor">Contributor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAddDialog(false)} className="flex-1 px-4 py-2.5 border border-border rounded-lg text-sm font-medium text-text-dark hover:bg-cream">Cancel</button>
              <button onClick={handleAddMember} className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: 'var(--olive)' }}>Add Member</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
