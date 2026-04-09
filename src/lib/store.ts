'use client';

import { Report, TeamMember } from './types';

const REPORTS_KEY = 'cgh_reports';
const MEMBERS_KEY = 'cgh_members';
const ADMIN_PIN = '1234';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

function getWeekStart(): string {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));
  return monday.toISOString().split('T')[0];
}

function getWeekEnd(): string {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? 0 : 7);
  const sunday = new Date(d.setDate(diff));
  return sunday.toISOString().split('T')[0];
}

function getDefaultMembers(): TeamMember[] {
  return [
    { id: '1', name: 'Mohammed Idais', email: 'mohammed@olivegreenholding.com', role: 'contributor', joinedAt: getToday() },
    { id: '2', name: 'Abdallah Taher', email: 'abdallah@olivegreenholding.com', role: 'contributor', joinedAt: getToday() },
    { id: '3', name: 'Janet Baguyo', email: 'janet@olivegreenholding.com', role: 'admin', joinedAt: getToday() },
  ];
}

function getDefaultReport(): Report {
  return {
    id: generateId(),
    title: 'Weekly Management Report',
    department: 'Business Support Update',
    companyName: 'Olive Green Holding',
    weekStart: getWeekStart(),
    weekEnd: getWeekEnd(),
    status: 'draft',
    createdAt: getToday(),
    kpis: [],
    finance: { revenueRows: [], reportableMatters: [], lastEdited: undefined },
    peopleCulture: {
      tasks: [
        { id: '1', name: 'Policy Governance - Salary Advance', status: 'Finalized – Feedback Phase' },
        { id: '2', name: 'Policy Governance - Teleworking', status: 'Finalized – Feedback Phase', due: '70' },
        { id: '3', name: 'HRIS & Data Integrity', status: 'In Progress' },
      ],
      lastEdited: undefined,
    },
    innovationPMO: {
      projects: [
        { id: '1', name: 'Waste Management', progress: 50, timeline: 'Q1 - Q2', due: 'Met TOMRA; waiting on proposal/solution' },
        { id: '2', name: 'TSH Website', progress: 10, timeline: 'Q1 - Q2' },
      ],
      lastEdited: undefined,
    },
    operations: {
      tasks: [
        { id: '1', name: 'Asset Management', status: 'Scheduled', due: '20/02/2026' },
      ],
      lastEdited: undefined,
    },
    tshRentals: { weeks: [], lastEdited: undefined },
    facility: {
      updates: [
        { id: '1', description: 'Meeting with LG and Dr. Fadi for the chiller issues was conducted. Building rectification due to wrong design — JEET MEP will conduct the work, deadline to be communicated shortly.' },
        { id: '2', description: 'Manhole and drainage cleaning for 51 apartments in TSH.' },
      ],
      lastEdited: undefined,
    },
    ventures: {
      items: [
        { id: '1', name: 'Tangents Dashboard Intake Form', progress: 75, status: 'Completed', due: 'April 30, 2026' },
        { id: '2', name: 'Twenty', progress: 50, status: 'Completed', due: 'April 30, 2026' },
      ],
      lastEdited: undefined,
    },
  };
}

export function getReports(): Report[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(REPORTS_KEY);
  if (!raw) {
    const defaults = [getDefaultReport()];
    localStorage.setItem(REPORTS_KEY, JSON.stringify(defaults));
    return defaults;
  }
  return JSON.parse(raw);
}

export function getReport(id: string): Report | undefined {
  return getReports().find(r => r.id === id);
}

export function saveReport(report: Report): void {
  const reports = getReports();
  const idx = reports.findIndex(r => r.id === report.id);
  if (idx >= 0) {
    reports[idx] = report;
  } else {
    reports.push(report);
  }
  localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
}

export function createReport(): Report {
  const report = getDefaultReport();
  report.peopleCulture.tasks = [];
  report.innovationPMO.projects = [];
  report.operations.tasks = [];
  report.facility.updates = [];
  report.ventures.items = [];
  saveReport(report);
  return report;
}

export function deleteReport(id: string): void {
  const reports = getReports().filter(r => r.id !== id);
  localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
}

export function getMembers(): TeamMember[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(MEMBERS_KEY);
  if (!raw) {
    const defaults = getDefaultMembers();
    localStorage.setItem(MEMBERS_KEY, JSON.stringify(defaults));
    return defaults;
  }
  return JSON.parse(raw);
}

export function saveMember(member: TeamMember): void {
  const members = getMembers();
  const idx = members.findIndex(m => m.id === member.id);
  if (idx >= 0) {
    members[idx] = member;
  } else {
    members.push(member);
  }
  localStorage.setItem(MEMBERS_KEY, JSON.stringify(members));
}

export function addMember(name: string, email: string, role: 'admin' | 'contributor'): TeamMember {
  const member: TeamMember = { id: generateId(), name, email, role, joinedAt: getToday() };
  saveMember(member);
  return member;
}

export function verifyPin(pin: string): boolean {
  return pin === ADMIN_PIN;
}

export { generateId };
