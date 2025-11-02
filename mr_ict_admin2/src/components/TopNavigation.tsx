import { useState } from 'react'
import { BellIcon, MagnifyingGlassIcon, UserCircleIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../context/AuthContext'

export function TopNavigation() {
  const { signOut } = useAuth()
  const [showMenu, setShowMenu] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-700 dark:bg-slate-800/95">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex flex-1 items-center gap-4">
          <div className="relative w-full max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Search users, courses, posts..."
              className="w-full rounded-full border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-500 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder-slate-400"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="relative flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            <BellIcon className="h-5 w-5" />
            <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-accent-500" />
          </button>
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 transition"
            >
              <UserCircleIcon className="h-6 w-6 text-slate-600 dark:text-slate-300" />
              <div className="text-left">
                <p className="text-xs font-semibold text-slate-900 dark:text-white">Admin User</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Super Admin</p>
              </div>
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">
                <button
                  onClick={() => {
                    setShowMenu(false)
                    signOut()
                  }}
                  className="flex w-full items-center gap-2 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700 rounded-xl transition"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
