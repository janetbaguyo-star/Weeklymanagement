'use server'

import db from '@/lib/db'
import { revalidatePath } from 'next/cache'

export type Report = {
  id: number
  department: string
  highlights: string
  accomplishments: string
  issues: string
  actionPlans: string
  kpis: string
  status: 'Draft' | 'For Review' | 'Submitted' | 'Completed'
  createdAt: string
  updatedAt: string
}

export async function getReports(): Promise<Report[]> {
  const stmt = db.prepare('SELECT * FROM reports ORDER BY createdAt DESC')
  return stmt.all() as Report[]
}

export async function getReportById(id: number): Promise<Report | undefined> {
  const stmt = db.prepare('SELECT * FROM reports WHERE id = ?')
  return stmt.get(id) as Report | undefined
}

export async function saveReport(formData: FormData) {
  const id = formData.get('id') as string | null
  const data = {
    department: formData.get('department') as string,
    highlights: formData.get('highlights') as string,
    accomplishments: formData.get('accomplishments') as string,
    issues: formData.get('issues') as string,
    actionPlans: formData.get('actionPlans') as string,
    kpis: formData.get('kpis') as string,
    status: formData.get('status') as string,
  }

  if (id) {
    const stmt = db.prepare(`
      UPDATE reports
      SET department = @department,
          highlights = @highlights,
          accomplishments = @accomplishments,
          issues = @issues,
          actionPlans = @actionPlans,
          kpis = @kpis,
          status = @status,
          updatedAt = CURRENT_TIMESTAMP
      WHERE id = @id
    `)
    stmt.run({ ...data, id })
  } else {
    const stmt = db.prepare(`
      INSERT INTO reports (department, highlights, accomplishments, issues, actionPlans, kpis, status)
      VALUES (@department, @highlights, @accomplishments, @issues, @actionPlans, @kpis, @status)
    `)
    stmt.run(data)
  }

  revalidatePath('/')
  revalidatePath('/reports')
  
  return { success: true }
}

export async function deleteReport(id: number) {
  const stmt = db.prepare('DELETE FROM reports WHERE id = ?')
  stmt.run(id)
  revalidatePath('/')
  revalidatePath('/reports')
}
