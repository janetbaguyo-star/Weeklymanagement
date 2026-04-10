import { getReportById, saveReport, deleteReport } from '@/app/actions/reports'
import Link from 'next/link'
import { ArrowLeft, Save, Trash2 } from 'lucide-react'
import { redirect } from 'next/navigation'

export default async function ReportEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const isNew = id === 'new'
  
  let report = null
  if (!isNew) {
    report = await getReportById(parseInt(id))
    if (!report) {
      redirect('/reports')
    }
  }

  async function deleteAction() {
    'use server'
    if (!isNew && report) {
      await deleteReport(report.id)
      redirect('/reports')
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/reports" className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-500">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            {isNew ? 'Create New Report' : 'Edit Report'}
          </h1>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <form action={async (formData) => {
          'use server'
          await saveReport(formData)
          redirect('/reports')
        }} className="p-8 space-y-8">
          
          {report && <input type="hidden" name="id" value={report.id} />}

          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-3 col-span-2 md:col-span-1">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Department / Project *</label>
              <input 
                name="department" 
                defaultValue={report?.department}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                placeholder="e.g. Engineering Team"
              />
            </div>

            <div className="space-y-3 col-span-2 md:col-span-1">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Status</label>
              <select 
                name="status"
                defaultValue={report?.status || 'Draft'}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all outline-none"
              >
                <option value="Draft">Draft</option>
                <option value="For Review">For Review</option>
                <option value="Submitted">Submitted</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Highlights</label>
            <textarea 
              name="highlights"
              defaultValue={report?.highlights}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all outline-none"
              placeholder="Key events or notable moments..."
            ></textarea>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Accomplishments</label>
            <textarea 
              name="accomplishments"
              defaultValue={report?.accomplishments}
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all outline-none"
              placeholder="What was achieved this week?"
            ></textarea>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Issues / Risks</label>
            <textarea 
              name="issues"
              defaultValue={report?.issues}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all outline-none"
              placeholder="Any blockers, risks, or issues?"
            ></textarea>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Action Plans</label>
            <textarea 
              name="actionPlans"
              defaultValue={report?.actionPlans}
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all outline-none"
              placeholder="Plan for the next week"
            ></textarea>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">KPIs Metrics</label>
            <input 
              name="kpis"
              defaultValue={report?.kpis}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all outline-none"
              placeholder="e.g. 95% SLA met, 20 bugs fixed"
            />
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-gray-700">
            {isNew ? <div /> : (
              <button formAction={deleteAction} className="flex items-center gap-2 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg font-medium transition-colors">
                <Trash2 size={18} />
                Delete Report
              </button>
            )}
            
            <button type="submit" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl shadow-md transition-transform active:scale-95 font-semibold">
              <Save size={20} />
              Save Report
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
