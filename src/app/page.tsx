'use client';

import { useEffect, useState } from 'react';
import { getReports, createReport } from '@/lib/store';
import { Report } from '@/lib/types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [reports, setReports] = useState<Report[]>([]);
  const router = useRouter();

  useEffect(() => {
    setReports(getReports());
  }, []);

  const totalReports = reports.length;
  const publishedReports = reports.filter(r => r.status === 'published').length;
  const draftReports = reports.filter(r => r.status === 'draft').length;
  const completionRate = totalReports > 0 ? ((publishedReports / totalReports) * 100).toFixed(1) : '0.0';

  const now = new Date();
  const currentMonth = now.toLocaleString('default', { month: 'long' });
  const submittedThisMonth = reports.filter(r => {
    const d = new Date(r.createdAt);
    return r.status === 'published' && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  const recentReports = [...reports].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 3);

  const handleNewReport = () => {
    const report = createReport();
    router.push(`/reports/${report.id}`);
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-4xl font-bold text-text-dark">Dashboard</h1>
          <p className="text-text-muted mt-1">Report status and submission overview.</p>
        </div>
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

      <p className="text-xs font-semibold text-text-muted tracking-widest mb-4">REPORT OVERVIEW</p>
      <div className="grid grid-cols-4 gap-4 mb-10">
        <div className="bg-white rounded-xl p-5 border border-border shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: 'var(--olive)' }} />
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-sm text-text-dark">Total Reports (YTD)</h3>
              <p className="text-xs text-text-muted mt-0.5">Total reports created year-to-date</p>
            </div>
            <svg className="w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-4xl font-bold mt-3 text-text-dark">{totalReports}</p>
          <p className="text-xs text-text-muted mt-1">All reports created in {now.getFullYear()}</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-border shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: 'var(--blue-accent)' }} />
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-sm text-text-dark">Report Completion Rate</h3>
              <p className="text-xs text-text-muted mt-0.5">Published reports &divide; total reports</p>
            </div>
            <svg className="w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="text-4xl font-bold mt-3 text-text-dark">{completionRate}<span className="text-lg text-text-muted">%</span></p>
          <p className="text-xs text-text-muted mt-1">{publishedReports} published out of {totalReports} total</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-border shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: 'var(--orange-accent)' }} />
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-sm text-text-dark">Reports in Draft</h3>
              <p className="text-xs text-text-muted mt-0.5">Reports currently in draft status</p>
            </div>
            <svg className="w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <p className="text-4xl font-bold mt-3 text-text-dark">{draftReports}</p>
          <p className="text-xs text-text-muted mt-1">Awaiting review or completion</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-border shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: 'var(--teal-accent)' }} />
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-sm text-text-dark">Submitted This Month</h3>
              <p className="text-xs text-text-muted mt-0.5">Reports published this calendar month</p>
            </div>
            <svg className="w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </div>
          <p className="text-4xl font-bold mt-3 text-text-dark">{submittedThisMonth}</p>
          <p className="text-xs text-text-muted mt-1">Published reports in {currentMonth}</p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-text-dark">Recent Reports</h2>
        <Link href="/reports" className="text-sm font-medium" style={{ color: 'var(--olive)' }}>View all</Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recentReports.map(report => (
          <div key={report.id} className="bg-white rounded-xl p-6 border border-border shadow-sm">
            <h3 className="font-semibold text-lg text-text-dark">{report.title}</h3>
            <p className="text-text-muted text-sm mt-1">{report.department}</p>
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-text-muted">{formatDate(report.weekStart)} - {formatDate(report.weekEnd)}</p>
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                report.status === 'draft'
                  ? 'text-yellow-700 border'
                  : 'text-green-700 border border-green-200'
              }`} style={report.status === 'draft' ? { backgroundColor: 'var(--yellow-bg)', borderColor: 'var(--yellow-border)' } : { backgroundColor: '#f0fdf4' }}>
                {report.status}
              </span>
            </div>
            <hr className="my-4" style={{ borderColor: 'var(--border)' }} />
            <div className="flex gap-4">
              <Link href={`/reports/${report.id}`} className="flex items-center gap-1.5 text-sm font-medium text-text-muted hover:text-text-dark transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </Link>
              <Link href={`/reports/${report.id}/view`} className="flex items-center gap-1.5 text-sm font-medium text-text-muted hover:text-text-dark transition-colors">
                View &rarr;
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
