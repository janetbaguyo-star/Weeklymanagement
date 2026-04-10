import { getReports } from '@/app/actions/reports'
import Link from 'next/link'
import { FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react'

export default async function DashboardPage() {
  const reports = await getReports()
  
  const total = reports.length
  const completed = reports.filter(r => r.status === 'Completed').length
  const drafts = reports.filter(r => r.status === 'Draft').length
  const inReview = reports.filter(r => r.status === 'For Review').length
  const submitted = reports.filter(r => r.status === 'Submitted').length

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

  const recentReports = reports.slice(0, 5)

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Dashboard Overview
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Here is a summary of your weekly reports system.</p>
        </div>
        <Link href="/reports/new" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-sm transition-all font-medium">
          Create Report
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Reports */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center space-x-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-xl">
            <FileText size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Reports (YTD)</p>
            <h3 className="text-3xl font-bold mt-1 text-gray-900 dark:text-white">{total}</h3>
          </div>
        </div>

        {/* Completion Rate */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center space-x-4">
          <div className="p-4 bg-green-50 dark:bg-green-900/40 text-green-600 dark:text-green-400 rounded-xl">
            <CheckCircle size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Completion Rate</p>
            <h3 className="text-3xl font-bold mt-1 text-gray-900 dark:text-white">{completionRate}%</h3>
          </div>
        </div>

        {/* Action Needed */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center space-x-4">
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/40 text-yellow-600 dark:text-yellow-400 rounded-xl">
            <AlertCircle size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Reports in Draft</p>
            <h3 className="text-3xl font-bold mt-1 text-gray-900 dark:text-white">{drafts}</h3>
          </div>
        </div>

        {/* In Review */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center space-x-4">
          <div className="p-4 bg-purple-50 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 rounded-xl">
            <Clock size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">For Review</p>
            <h3 className="text-3xl font-bold mt-1 text-gray-900 dark:text-white">{inReview}</h3>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Activity</h3>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {recentReports.length === 0 ? (
            <div className="p-8 text-center text-gray-500 font-medium">No recent reports found. Get started by creating one!</div>
          ) : (
            recentReports.map(report => (
              <Link href={`/reports/${report.id}`} key={report.id} className="flex items-center justify-between p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-lg">{report.department}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Status: <span className="font-medium text-gray-700 dark:text-gray-300">{report.status}</span> • Updated {new Date(report.updatedAt).toLocaleDateString()}</p>
                </div>
                <div className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
                  View / Edit
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
