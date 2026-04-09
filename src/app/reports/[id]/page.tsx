'use client';

import { useEffect, useState, useCallback } from 'react';
import { getReport, saveReport, generateId } from '@/lib/store';
import { Report } from '@/lib/types';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EditReport() {
  const params = useParams();
  const router = useRouter();
  const [report, setReport] = useState<Report | null>(null);

  useEffect(() => {
    const r = getReport(params.id as string);
    if (r) setReport(r);
    else router.push('/reports');
  }, [params.id, router]);

  const update = useCallback((updater: (r: Report) => void) => {
    setReport(prev => {
      if (!prev) return prev;
      const copy = JSON.parse(JSON.stringify(prev)) as Report;
      updater(copy);
      saveReport(copy);
      return copy;
    });
  }, []);

  const now = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

  if (!report) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto pb-20">
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <div>
          <h1 className="text-4xl font-bold text-text-dark">Edit Report</h1>
          <p className="text-text-muted mt-1">Fill out each department section below. Changes save automatically.</p>
        </div>
        <div className="flex gap-2 flex-col items-end">
          <div className="flex gap-2">
            <button onClick={() => { saveReport(report); alert('Details saved!'); }} className="flex items-center gap-2 px-4 py-2.5 border border-border rounded-lg text-sm font-medium text-text-dark bg-white hover:bg-cream">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
              Save Details
            </button>
            <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/reports/${report.id}/view`); alert('Share link copied!'); }} className="flex items-center gap-2 px-4 py-2.5 border border-border rounded-lg text-sm font-medium text-text-dark bg-white hover:bg-cream">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
              Share
            </button>
          </div>
          <Link href={`/reports/${report.id}/view`} className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-white font-medium text-sm" style={{ backgroundColor: 'var(--olive)' }}>
            Generate Report &rarr;
          </Link>
        </div>
      </div>

      {/* Report Details */}
      <section className="bg-white rounded-xl border border-border shadow-sm p-6 mt-6">
        <h2 className="text-lg font-bold text-text-dark mb-4">Report Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-dark mb-1">Report Title</label>
            <input value={report.title} onChange={e => update(r => { r.title = e.target.value; })} className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-olive/30" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-dark mb-1">Primary Department / Team</label>
            <input value={report.department} onChange={e => update(r => { r.department = e.target.value; })} className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-olive/30" />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-text-dark mb-1">Company Name</label>
          <input value={report.companyName} onChange={e => update(r => { r.companyName = e.target.value; })} className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-olive/30 max-w-md" />
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-text-dark mb-1">Week Start</label>
            <input type="date" value={report.weekStart} onChange={e => update(r => { r.weekStart = e.target.value; })} className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-olive/30" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-dark mb-1">Week End</label>
            <input type="date" value={report.weekEnd} onChange={e => update(r => { r.weekEnd = e.target.value; })} className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-olive/30" />
          </div>
        </div>
      </section>

      {/* KPIs */}
      <section className="bg-white rounded-xl border border-border shadow-sm p-6 mt-6">
        <h2 className="text-lg font-bold text-text-dark mb-4">Key Performance Indicators</h2>
        {report.kpis.map((kpi, i) => (
          <div key={kpi.id} className="flex gap-3 items-end mb-3">
            <div className="flex-1"><input value={kpi.metricName} onChange={e => update(r => { r.kpis[i].metricName = e.target.value; })} placeholder="Metric name" className="w-full border border-border rounded-lg px-3 py-2 text-sm" /></div>
            <div className="w-20"><input type="number" value={kpi.value} onChange={e => update(r => { r.kpis[i].value = Number(e.target.value); })} className="w-full border border-border rounded-lg px-3 py-2 text-sm" /></div>
            <div className="w-20"><input type="number" value={kpi.target} onChange={e => update(r => { r.kpis[i].target = Number(e.target.value); })} className="w-full border border-border rounded-lg px-3 py-2 text-sm" /></div>
            <div className="w-24">
              <select value={kpi.trend} onChange={e => update(r => { r.kpis[i].trend = e.target.value as 'up' | 'down' | 'none'; })} className="w-full border border-border rounded-lg px-3 py-2 text-sm">
                <option value="none">None</option><option value="up">Up</option><option value="down">Down</option>
              </select>
            </div>
            <button onClick={() => update(r => { r.kpis.splice(i, 1); })} className="text-red-400 hover:text-red-600 p-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          </div>
        ))}
        <div className="flex gap-3 items-end">
          <div className="flex-1"><label className="block text-xs text-text-muted mb-1">Metric Name</label><input id="kpi-name" placeholder="e.g. Revenue" className="w-full border border-border rounded-lg px-3 py-2 text-sm" /></div>
          <div className="w-20"><label className="block text-xs text-text-muted mb-1">Value</label><input id="kpi-value" type="number" defaultValue={0} className="w-full border border-border rounded-lg px-3 py-2 text-sm" /></div>
          <div className="w-20"><label className="block text-xs text-text-muted mb-1">Target (Opt)</label><input id="kpi-target" type="number" defaultValue={0} className="w-full border border-border rounded-lg px-3 py-2 text-sm" /></div>
          <div className="w-24"><label className="block text-xs text-text-muted mb-1">Trend (Opt)</label><select id="kpi-trend" className="w-full border border-border rounded-lg px-3 py-2 text-sm"><option value="none">None</option><option value="up">Up</option><option value="down">Down</option></select></div>
          <button onClick={() => {
            const name = (document.getElementById('kpi-name') as HTMLInputElement).value;
            if (!name) return;
            update(r => { r.kpis.push({ id: generateId(), metricName: name, value: Number((document.getElementById('kpi-value') as HTMLInputElement).value), target: Number((document.getElementById('kpi-target') as HTMLInputElement).value), trend: (document.getElementById('kpi-trend') as HTMLSelectElement).value as 'up' | 'down' | 'none' }); });
            (document.getElementById('kpi-name') as HTMLInputElement).value = '';
          }} className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-white text-sm font-medium whitespace-nowrap" style={{ backgroundColor: 'var(--olive)' }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m6-6H6" /></svg>
            Add
          </button>
        </div>
      </section>

      {/* Finance */}
      <DepartmentSection title="Finance" color="var(--green-accent)" description="Revenue performance by company and reportable financial matters" lastEdited={report.finance.lastEdited || `Current User at ${now}`}>
        <h4 className="font-medium text-sm text-text-dark mb-2">Revenue Table</h4>
        <table className="w-full text-sm mb-3">
          <thead><tr className="border-b" style={{ borderColor: 'var(--border)' }}><th className="text-left py-2 px-2 text-text-muted">#</th><th className="text-left py-2 px-2 text-text-muted">Company</th><th className="text-left py-2 px-2 text-text-muted">Amount (AED)</th><th></th></tr></thead>
          <tbody>
            {report.finance.revenueRows.map((row, i) => (
              <tr key={row.id} className="border-b" style={{ borderColor: 'var(--border)' }}>
                <td className="py-2 px-2 text-text-muted">{i + 1}</td>
                <td className="py-2 px-2"><input value={row.company} onChange={e => update(r => { r.finance.revenueRows[i].company = e.target.value; r.finance.lastEdited = `Current User at ${now}`; })} className="border border-border rounded px-2 py-1 text-sm w-full" /></td>
                <td className="py-2 px-2"><input type="number" value={row.amount} onChange={e => update(r => { r.finance.revenueRows[i].amount = Number(e.target.value); r.finance.lastEdited = `Current User at ${now}`; })} className="border border-border rounded px-2 py-1 text-sm w-32" /></td>
                <td className="py-2 px-2"><button onClick={() => update(r => { r.finance.revenueRows.splice(i, 1); })} className="text-red-400 hover:text-red-600"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={() => update(r => { r.finance.revenueRows.push({ id: generateId(), company: '', amount: 0 }); })} className="text-sm font-medium px-3 py-1.5 rounded border border-border hover:bg-cream" style={{ color: 'var(--olive)' }}>Add Revenue Row</button>

        <h4 className="font-medium text-sm text-text-dark mb-2 mt-6">Reportable Matters</h4>
        {report.finance.reportableMatters.map((m, i) => (
          <div key={m.id} className="flex gap-2 mb-2">
            <input value={m.description} onChange={e => update(r => { r.finance.reportableMatters[i].description = e.target.value; })} className="flex-1 border border-border rounded px-3 py-1.5 text-sm" />
            <button onClick={() => update(r => { r.finance.reportableMatters.splice(i, 1); })} className="text-red-400 hover:text-red-600"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
          </div>
        ))}
        <button onClick={() => update(r => { r.finance.reportableMatters.push({ id: generateId(), description: '' }); })} className="text-sm font-medium px-3 py-1.5 rounded border border-border hover:bg-cream" style={{ color: 'var(--olive)' }}>Add Reportable Matter</button>
      </DepartmentSection>

      {/* People & Culture */}
      <DepartmentSection title="People & Culture" color="var(--blue-accent)" description="HR policies, HRIS updates, employee relations, payroll" lastEdited={report.peopleCulture.lastEdited || `Current User at ${now}`}>
        {report.peopleCulture.tasks.map((task, i) => (
          <div key={task.id} className="flex gap-3 items-center mb-3 p-3 bg-cream/50 rounded-lg">
            <div className="flex-1">
              <input value={task.name} onChange={e => update(r => { r.peopleCulture.tasks[i].name = e.target.value; })} className="font-medium text-sm text-text-dark bg-transparent border-none focus:outline-none w-full" />
              <input value={task.status} onChange={e => update(r => { r.peopleCulture.tasks[i].status = e.target.value; })} className="text-xs text-text-muted bg-transparent border-none focus:outline-none w-full mt-0.5" placeholder="Status" />
            </div>
            {task.due && <span className="text-xs text-text-muted">Due: {task.due}</span>}
            <button onClick={() => update(r => { r.peopleCulture.tasks.splice(i, 1); })} className="text-red-400 hover:text-red-600"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
          </div>
        ))}
        <button onClick={() => update(r => { r.peopleCulture.tasks.push({ id: generateId(), name: '', status: '' }); })} className="text-sm font-medium px-3 py-1.5 rounded border border-border hover:bg-cream" style={{ color: 'var(--olive)' }}>Add Task / Initiative</button>
      </DepartmentSection>

      {/* Innovation and PMO */}
      <DepartmentSection title="Innovation and PMO" color="var(--orange-accent)" description="Digital projects, website, app development, vendor updates" lastEdited={report.innovationPMO.lastEdited || `Current User at ${now}`}>
        {report.innovationPMO.projects.map((proj, i) => (
          <div key={proj.id} className="flex gap-3 items-center mb-3 p-3 bg-cream/50 rounded-lg">
            <div className="flex-1">
              <input value={proj.name} onChange={e => update(r => { r.innovationPMO.projects[i].name = e.target.value; })} className="font-medium text-sm text-text-dark bg-transparent border-none focus:outline-none w-full" />
              <div className="flex gap-4 mt-1">
                <div className="flex items-center gap-1">
                  <input type="number" value={proj.progress} onChange={e => update(r => { r.innovationPMO.projects[i].progress = Number(e.target.value); })} className="w-12 text-xs bg-transparent border border-border rounded px-1 py-0.5" />
                  <span className="text-xs text-text-muted">%</span>
                </div>
                <input value={proj.timeline} onChange={e => update(r => { r.innovationPMO.projects[i].timeline = e.target.value; })} className="text-xs text-text-muted bg-transparent border-none focus:outline-none" placeholder="Timeline" />
              </div>
            </div>
            {proj.due && <span className="text-xs text-text-muted max-w-[200px]">Due: {proj.due}</span>}
            <button onClick={() => update(r => { r.innovationPMO.projects.splice(i, 1); })} className="text-red-400 hover:text-red-600"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
          </div>
        ))}
        <button onClick={() => update(r => { r.innovationPMO.projects.push({ id: generateId(), name: '', progress: 0, timeline: '' }); })} className="text-sm font-medium px-3 py-1.5 rounded border border-border hover:bg-cream" style={{ color: 'var(--olive)' }}>Add Project</button>
      </DepartmentSection>

      {/* Operations */}
      <DepartmentSection title="Operations" color="var(--red-accent)" description="Asset management, safety, procurement, policies, gap analysis" lastEdited={report.operations.lastEdited || `Current User at ${now}`}>
        {report.operations.tasks.map((task, i) => (
          <div key={task.id} className="flex gap-3 items-center mb-3 p-3 bg-cream/50 rounded-lg">
            <div className="flex-1">
              <input value={task.name} onChange={e => update(r => { r.operations.tasks[i].name = e.target.value; })} className="font-medium text-sm text-text-dark bg-transparent border-none focus:outline-none w-full" />
              <input value={task.status} onChange={e => update(r => { r.operations.tasks[i].status = e.target.value; })} className="text-xs text-text-muted bg-transparent border-none focus:outline-none w-full mt-0.5" placeholder="Status" />
            </div>
            {task.due && <span className="text-xs text-text-muted">Due: {task.due}</span>}
            <button onClick={() => update(r => { r.operations.tasks.splice(i, 1); })} className="text-red-400 hover:text-red-600"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
          </div>
        ))}
        <button onClick={() => update(r => { r.operations.tasks.push({ id: generateId(), name: '', status: '' }); })} className="text-sm font-medium px-3 py-1.5 rounded border border-border hover:bg-cream" style={{ color: 'var(--olive)' }}>Add Task</button>
      </DepartmentSection>

      {/* TSH Rentals */}
      <DepartmentSection title="TSH Rentals" color="var(--teal-accent)" description="Weekly rental units, reservations, and revenue data" lastEdited={report.tshRentals.lastEdited || `Current User at ${now}`}>
        <table className="w-full text-sm mb-3">
          <thead><tr className="border-b" style={{ borderColor: 'var(--border)' }}><th className="text-left py-2 px-2 text-text-muted">Units</th><th className="text-left py-2 px-2 text-text-muted">No. of Reservations</th><th className="text-left py-2 px-2 text-text-muted">Value (AED)</th><th className="text-left py-2 px-2 text-text-muted">Comments / Period</th><th></th></tr></thead>
          <tbody>
            {report.tshRentals.weeks.map((week, i) => (
              <tr key={week.id} className="border-b" style={{ borderColor: 'var(--border)' }}>
                <td className="py-2 px-2"><input type="number" value={week.units} onChange={e => update(r => { r.tshRentals.weeks[i].units = Number(e.target.value); })} className="border border-border rounded px-2 py-1 text-sm w-20" /></td>
                <td className="py-2 px-2"><input type="number" value={week.reservations} onChange={e => update(r => { r.tshRentals.weeks[i].reservations = Number(e.target.value); })} className="border border-border rounded px-2 py-1 text-sm w-20" /></td>
                <td className="py-2 px-2"><input type="number" value={week.value} onChange={e => update(r => { r.tshRentals.weeks[i].value = Number(e.target.value); })} className="border border-border rounded px-2 py-1 text-sm w-28" /></td>
                <td className="py-2 px-2"><input value={week.comments} onChange={e => update(r => { r.tshRentals.weeks[i].comments = e.target.value; })} className="border border-border rounded px-2 py-1 text-sm w-full" /></td>
                <td className="py-2 px-2"><button onClick={() => update(r => { r.tshRentals.weeks.splice(i, 1); })} className="text-red-400 hover:text-red-600"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={() => update(r => { r.tshRentals.weeks.push({ id: generateId(), units: 0, reservations: 0, value: 0, comments: '' }); })} className="text-sm font-medium px-3 py-1.5 rounded border border-border hover:bg-cream" style={{ color: 'var(--olive)' }}>Add Week Row</button>
      </DepartmentSection>

      {/* Facility Management */}
      <DepartmentSection title="Facility Management" color="var(--olive)" description="Building issues, maintenance, chiller, drainage updates" lastEdited={report.facility.lastEdited || `Current User at ${now}`}>
        {report.facility.updates.map((upd, i) => (
          <div key={upd.id} className="flex gap-2 mb-3">
            <textarea value={upd.description} onChange={e => update(r => { r.facility.updates[i].description = e.target.value; })} rows={2} className="flex-1 border border-border rounded-lg px-3 py-2 text-sm resize-none" />
            <button onClick={() => update(r => { r.facility.updates.splice(i, 1); })} className="text-red-400 hover:text-red-600 self-start mt-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
          </div>
        ))}
        <button onClick={() => update(r => { r.facility.updates.push({ id: generateId(), description: '' }); })} className="text-sm font-medium px-3 py-1.5 rounded border border-border hover:bg-cream" style={{ color: 'var(--olive)' }}>Add Update</button>
      </DepartmentSection>

      {/* Ventures */}
      <DepartmentSection title="Ventures" color="var(--gold)" description="New business, partnerships, events, startup initiatives" lastEdited={report.ventures.lastEdited || `Current User at ${now}`}>
        {report.ventures.items.map((item, i) => (
          <div key={item.id} className="flex gap-3 items-center mb-3 p-3 bg-cream/50 rounded-lg">
            <div className="flex-1">
              <input value={item.name} onChange={e => update(r => { r.ventures.items[i].name = e.target.value; })} className="font-medium text-sm text-text-dark bg-transparent border-none focus:outline-none w-full" />
              <div className="flex gap-4 mt-1">
                <div className="flex items-center gap-1">
                  <input type="number" value={item.progress} onChange={e => update(r => { r.ventures.items[i].progress = Number(e.target.value); })} className="w-12 text-xs bg-transparent border border-border rounded px-1 py-0.5" />
                  <span className="text-xs text-text-muted">%</span>
                </div>
                <input value={item.status} onChange={e => update(r => { r.ventures.items[i].status = e.target.value; })} className="text-xs text-text-muted bg-transparent border-none focus:outline-none" placeholder="Status" />
              </div>
            </div>
            {item.due && <span className="text-xs text-text-muted">Due: {item.due}</span>}
            <button onClick={() => update(r => { r.ventures.items.splice(i, 1); })} className="text-red-400 hover:text-red-600"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
          </div>
        ))}
        <button onClick={() => update(r => { r.ventures.items.push({ id: generateId(), name: '', progress: 0, status: '', due: '' }); })} className="text-sm font-medium px-3 py-1.5 rounded border border-border hover:bg-cream" style={{ color: 'var(--olive)' }}>Add Item</button>
      </DepartmentSection>
    </div>
  );
}

function DepartmentSection({ title, color, description, lastEdited, children }: { title: string; color: string; description: string; lastEdited: string; children: React.ReactNode }) {
  return (
    <section className="bg-white rounded-xl border border-border shadow-sm overflow-hidden mt-6">
      <div className="h-1" style={{ backgroundColor: color }} />
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-lg font-bold" style={{ color }}>{title}</h2>
            <p className="text-xs text-text-muted mt-0.5">{description}</p>
          </div>
          <span className="text-xs text-text-muted">Last edited by {lastEdited}</span>
        </div>
        {children}
      </div>
    </section>
  );
}
