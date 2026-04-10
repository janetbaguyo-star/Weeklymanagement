'use client';

import { useEffect, useState } from 'react';
import { getReport } from '@/lib/store';
import { Report } from '@/lib/types';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ViewReport() {
  const params = useParams();
  const router = useRouter();
  const [report, setReport] = useState<Report | null>(null);

  useEffect(() => {
    const r = getReport(params.id as string);
    if (r) setReport(r);
    else router.push('/reports');
  }, [params.id, router]);

  if (!report) return <div className="p-8">Loading...</div>;

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="p-8 max-w-5xl mx-auto pb-20">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-4xl font-bold text-text-dark">{report.title}</h1>
          <p className="text-text-muted mt-1">{report.companyName} &mdash; {report.department}</p>
          <p className="text-sm text-text-muted mt-1">{formatDate(report.weekStart)} - {formatDate(report.weekEnd)}</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/reports/${report.id}`} className="px-4 py-2.5 border border-border rounded-lg text-sm font-medium text-text-dark bg-white hover:bg-cream">
            Edit Report
          </Link>
          <button onClick={() => window.print()} className="px-4 py-2.5 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: 'var(--olive)' }}>
            Print / Export
          </button>
        </div>
      </div>

      {/* KPIs */}
      {report.kpis.length > 0 && (
        <section className="bg-white rounded-xl border border-border shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold text-text-dark mb-4">Key Performance Indicators</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {report.kpis.map(kpi => (
              <div key={kpi.id} className="p-4 bg-cream rounded-lg">
                <p className="text-xs text-text-muted font-medium">{kpi.metricName}</p>
                <p className="text-2xl font-bold text-text-dark mt-1">{kpi.value}</p>
                {kpi.target > 0 && <p className="text-xs text-text-muted">Target: {kpi.target}</p>}
                {kpi.trend !== 'none' && (
                  <span className={`text-xs font-medium ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {kpi.trend === 'up' ? '↑' : '↓'} Trending {kpi.trend}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Finance */}
      <ViewSection title="Finance" color="var(--green-accent)">
        {report.finance.revenueRows.length > 0 && (
          <>
            <h4 className="font-medium text-sm mb-2">Revenue</h4>
            <table className="w-full text-sm mb-4">
              <thead><tr className="border-b" style={{ borderColor: 'var(--border)' }}><th className="text-left py-2">#</th><th className="text-left py-2">Company</th><th className="text-left py-2">Amount (AED)</th></tr></thead>
              <tbody>
                {report.finance.revenueRows.map((row, i) => (
                  <tr key={row.id} className="border-b" style={{ borderColor: 'var(--border)' }}>
                    <td className="py-2">{i + 1}</td><td className="py-2">{row.company}</td><td className="py-2">{row.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
        {report.finance.reportableMatters.length > 0 && (
          <>
            <h4 className="font-medium text-sm mb-2">Reportable Matters</h4>
            <ul className="list-disc pl-5 text-sm text-text-dark space-y-1">
              {report.finance.reportableMatters.map(m => <li key={m.id}>{m.description}</li>)}
            </ul>
          </>
        )}
        {report.finance.revenueRows.length === 0 && report.finance.reportableMatters.length === 0 && <p className="text-sm text-text-muted italic">No finance data entered.</p>}
      </ViewSection>

      {/* People & Culture */}
      <ViewSection title="People & Culture" color="var(--blue-accent)">
        {report.peopleCulture.tasks.length > 0 ? (
          <div className="space-y-2">
            {report.peopleCulture.tasks.map(task => (
              <div key={task.id} className="flex justify-between items-center p-3 bg-cream rounded-lg">
                <div><p className="text-sm font-medium text-text-dark">{task.name}</p><p className="text-xs text-text-muted">{task.status}</p></div>
                {task.due && <span className="text-xs text-text-muted">Due: {task.due}</span>}
              </div>
            ))}
          </div>
        ) : <p className="text-sm text-text-muted italic">No tasks entered.</p>}
      </ViewSection>

      {/* Innovation and PMO */}
      <ViewSection title="Innovation and PMO" color="var(--orange-accent)">
        {report.innovationPMO.projects.length > 0 ? (
          <div className="space-y-3">
            {report.innovationPMO.projects.map(proj => (
              <div key={proj.id} className="p-3 bg-cream rounded-lg">
                <div className="flex justify-between items-start">
                  <div><p className="text-sm font-medium text-text-dark">{proj.name}</p><p className="text-xs text-text-muted">{proj.timeline}</p></div>
                  <span className="text-sm font-bold" style={{ color: 'var(--orange-accent)' }}>{proj.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2"><div className="h-1.5 rounded-full" style={{ width: `${proj.progress}%`, backgroundColor: 'var(--orange-accent)' }} /></div>
                {proj.due && <p className="text-xs text-text-muted mt-1">Due: {proj.due}</p>}
              </div>
            ))}
          </div>
        ) : <p className="text-sm text-text-muted italic">No projects entered.</p>}
      </ViewSection>

      {/* Operations */}
      <ViewSection title="Operations" color="var(--red-accent)">
        {report.operations.tasks.length > 0 ? (
          <div className="space-y-2">
            {report.operations.tasks.map(task => (
              <div key={task.id} className="flex justify-between items-center p-3 bg-cream rounded-lg">
                <div><p className="text-sm font-medium text-text-dark">{task.name}</p><p className="text-xs text-text-muted">{task.status}</p></div>
                {task.due && <span className="text-xs text-text-muted">Due: {task.due}</span>}
              </div>
            ))}
          </div>
        ) : <p className="text-sm text-text-muted italic">No tasks entered.</p>}
      </ViewSection>

      {/* TSH Rentals */}
      <ViewSection title="TSH Rentals" color="var(--teal-accent)">
        {report.tshRentals.weeks.length > 0 ? (
          <table className="w-full text-sm">
            <thead><tr className="border-b" style={{ borderColor: 'var(--border)' }}><th className="text-left py-2">Units</th><th className="text-left py-2">Reservations</th><th className="text-left py-2">Value (AED)</th><th className="text-left py-2">Comments</th></tr></thead>
            <tbody>
              {report.tshRentals.weeks.map(week => (
                <tr key={week.id} className="border-b" style={{ borderColor: 'var(--border)' }}>
                  <td className="py-2">{week.units}</td><td className="py-2">{week.reservations}</td><td className="py-2">{week.value.toLocaleString()}</td><td className="py-2">{week.comments}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <p className="text-sm text-text-muted italic">No rental data entered.</p>}
      </ViewSection>

      {/* Facility Management */}
      <ViewSection title="Facility Management" color="var(--olive)">
        {report.facility.updates.length > 0 ? (
          <ul className="space-y-2">
            {report.facility.updates.map(upd => (
              <li key={upd.id} className="p-3 bg-cream rounded-lg text-sm text-text-dark">{upd.description}</li>
            ))}
          </ul>
        ) : <p className="text-sm text-text-muted italic">No updates entered.</p>}
      </ViewSection>

      {/* Ventures */}
      <ViewSection title="Ventures" color="var(--gold)">
        {report.ventures.items.length > 0 ? (
          <div className="space-y-3">
            {report.ventures.items.map(item => (
              <div key={item.id} className="p-3 bg-cream rounded-lg">
                <div className="flex justify-between items-start">
                  <div><p className="text-sm font-medium text-text-dark">{item.name}</p><p className="text-xs text-text-muted">{item.status}</p></div>
                  <span className="text-sm font-bold" style={{ color: 'var(--gold)' }}>{item.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2"><div className="h-1.5 rounded-full" style={{ width: `${item.progress}%`, backgroundColor: 'var(--gold)' }} /></div>
                {item.due && <p className="text-xs text-text-muted mt-1">Due: {item.due}</p>}
              </div>
            ))}
          </div>
        ) : <p className="text-sm text-text-muted italic">No items entered.</p>}
      </ViewSection>
    </div>
  );
}

function ViewSection({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  return (
    <section className="bg-white rounded-xl border border-border shadow-sm overflow-hidden mb-6">
      <div className="h-1" style={{ backgroundColor: color }} />
      <div className="p-6">
        <h2 className="text-lg font-bold mb-4" style={{ color }}>{title}</h2>
        {children}
      </div>
    </section>
  );
}
