export interface KPI {
  id: string;
  metricName: string;
  value: number;
  target: number;
  trend: 'up' | 'down' | 'none';
}

export interface RevenueRow {
  id: string;
  company: string;
  amount: number;
}

export interface ReportableMatter {
  id: string;
  description: string;
}

export interface FinanceSection {
  revenueRows: RevenueRow[];
  reportableMatters: ReportableMatter[];
  lastEdited?: string;
}

export interface HRTask {
  id: string;
  name: string;
  status: string;
  due?: string;
}

export interface PeopleCultureSection {
  tasks: HRTask[];
  lastEdited?: string;
}

export interface PMOProject {
  id: string;
  name: string;
  progress: number;
  timeline: string;
  due?: string;
}

export interface InnovationPMOSection {
  projects: PMOProject[];
  lastEdited?: string;
}

export interface OpsTask {
  id: string;
  name: string;
  status: string;
  due?: string;
}

export interface OperationsSection {
  tasks: OpsTask[];
  lastEdited?: string;
}

export interface RentalWeek {
  id: string;
  units: number;
  reservations: number;
  value: number;
  comments: string;
}

export interface TSHRentalsSection {
  weeks: RentalWeek[];
  lastEdited?: string;
}

export interface FacilityUpdate {
  id: string;
  description: string;
}

export interface FacilitySection {
  updates: FacilityUpdate[];
  lastEdited?: string;
}

export interface VentureItem {
  id: string;
  name: string;
  progress: number;
  status: string;
  due?: string;
}

export interface VenturesSection {
  items: VentureItem[];
  lastEdited?: string;
}

export interface Report {
  id: string;
  title: string;
  department: string;
  companyName: string;
  weekStart: string;
  weekEnd: string;
  status: 'draft' | 'published';
  createdAt: string;
  kpis: KPI[];
  finance: FinanceSection;
  peopleCulture: PeopleCultureSection;
  innovationPMO: InnovationPMOSection;
  operations: OperationsSection;
  tshRentals: TSHRentalsSection;
  facility: FacilitySection;
  ventures: VenturesSection;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'contributor';
  joinedAt: string;
}
