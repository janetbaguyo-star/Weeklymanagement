import { getReports } from '@/app/actions/reports'
import Link from 'next/link'
import { Plus, Clock, FileText } from 'lucide-react'

export default async function ReportsPage() {
  const reports = await getReports()

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Report Management
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Manage and review all weekly reports</p>
        </div>
        <Link href="/reports/new" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-sm transition-all font-medium">
          <Plus size={20} />
          Create Report
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        {reports.length === 0 ? (
           <div className="p-12 text-center flex flex-col items-center">
             <div className="h-20 w-20 bg-blue-50 dark:bg-gray-700 rounded-full flex items-center justify-center text-blue-500 mb-4">
                <FileText size={40} />
             </div>
             <h3 className="text-xl font-medium text-gray-900 dark:text-white">No Reports Yet</h3>
             <p className="text-gray-500 mt-2">Click Create Report to get started.</p>
           </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900/50 text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 text-sm tracking-wider uppercase">
                  <th className="p-4 font-semibold">Department / Project</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Last Updated</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700 text-gray-800 dark:text-gray-200">
                {reports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="p-4 font-medium">{report.department}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold
                        ${report.status === 'Completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' : ''}
                        ${report.status === 'Draft' ? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400' : ''}
                        ${report.status === 'For Review' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400' : ''}
                        ${report.status === 'Submitted' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400' : ''}
                      `}>
                        {report.status}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Clock size={16} />
                        {new Date(report.updatedAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <Link href={`/reports/${report.id}`} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
                        Edit / View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
