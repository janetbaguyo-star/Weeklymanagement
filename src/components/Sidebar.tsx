'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, FileText, LogOut } from 'lucide-react'
import { logoutAction } from '@/app/actions/auth'

export default function Sidebar() {
  const pathname = usePathname()

  const links = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Reports', href: '/reports', icon: FileText },
  ]

  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex-col justify-between hidden md:flex h-full">
      <div>
        <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Weekly Report
          </h1>
        </div>
        <nav className="p-4 space-y-1">
          {links.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 font-medium'
                    : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-blue-600 dark:text-blue-400' : ''} />
                {link.name}
              </Link>
            )
          })}
        </nav>
      </div>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <form action={logoutAction}>
          <button className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors">
            <LogOut size={20} />
            Sign Out
          </button>
        </form>
      </div>
    </div>
  )
}
