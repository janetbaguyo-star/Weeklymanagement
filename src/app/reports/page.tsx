'use client';

import { useEffect, useState } from 'react';
import { getReports, saveReport, deleteReport, createReport } from '@/lib/store';
import { Report } from '@/lib/types';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AllReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setReports(getReports());
  }, []);

  const handleNewReport = () => {
    const report = createReport();
    router.push(`/reports/${report.id}`);
  };

  const handleStatusChange = (id: string, status: 'draft' | 'published') => {
    const report = reports.find(r => r.id === id);
    if (report) {
      report.status = status;
      saveReport(report);
      setReports(getReports());
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this report?')) {
      deleteReport(id);
      setReports(getReports());
    }
  };

  const formatDateRange = (start: string, end: string) => {
    const s = new Date(start + 'T00:00:00');
    const e = new Date(end + 'T00:00:00');
    return `${s.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${e.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  };

  const copyLink = (id: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/reports/${id}/view`);
    alert('Link copied!');
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-start mb-8">
        <h1 className="text-4xl font-bold text-text-dark">All Reports</h1>
        <button
          onClick={handleNewReport}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-white font-medium"
          style={{ backgroundColor: 'var(--olive)' }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          New Report
        </button>
      </div>

      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
              <th className="text-left px-6 py-4 text-sm font-medium text-text-muted">Title</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-text-muted">Department</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-text-muted">Date Range</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-text-muted">Status</th>
              <th className="text-right px-6 py-4 text-sm font-medium text-text-muted">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map(report => (
              <tr key={report.id} className="border-b last:border-b-0 hover:bg-cream/50" style={{ borderColor: 'var(--border)' }}>
                <td className="px-6 py-4 text-sm font-medium text-text-dark">{report.title}</td>
                <td className="px-6 py-4 text-sm text-text-muted">{report.department}</td>
                <td className="px-6 py-4 text-sm text-text-muted">{formatDateRange(report.weekStart, report.weekEnd)}</td>
                <td className="px-6 py-4">
                  <select
                    value={report.status}
                    onChange={(e) => handleStatusChange(report.id, e.target.value as 'draft' | 'published')}
                    className={`text-xs px-3 py-1.5 rounded-full font-medium border cursor-pointer appearance-none pr-6 ${
                      report.status === 'draft'
                        ? 'text-yellow-700 border-yellow-300'
                        : 'text-green-700 border-green-300'
                    }`}
                    style={report.status === 'draft' ? { backgroundColor: 'var(--yellow-bg)' } : { backgroundColor: '#f0fdf4' }}
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => copyLink(report.id)} className="p-1.5 text-text-muted hover:text-text-dark transition-colors" title="Copy link">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    </button>
                    <div className="relative">
                      <button onClick={() => setMenuOpen(menuOpen === report.id ? null : report.id)} className="p-1.5 text-text-muted hover:text-text-dark transition-colors">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <circle cx="12" cy="5" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="12" cy="19" r="2" />
                        </svg>
                      </button>
                      {menuOpen === report.id && (
                        <div className="absolute right-0 mt-1 bg-white border border-border rounded-lg shadow-lg py-1 z-10 min-w-[120px]">
                          <Link href={`/reports/${report.id}`} className="block px-4 py-2 text-sm text-text-dark hover:bg-cream">Edit</Link>
                          <Link href={`/reports/${report.id}/view`} className="block px-4 py-2 text-sm text-text-dark hover:bg-cream">View</Link>
                          <button onClick={() => handleDelete(report.id)} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Delete</button>
                        </div>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
            {reports.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-text-muted">No reports yet. Create your first report.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
