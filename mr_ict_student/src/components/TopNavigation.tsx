import { BellAlertIcon, ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'
import { useStudentJourney } from '../context/StudentJourneyContext'
import { Avatar } from './Avatar'

export function TopNavigation() {
  const { student, notifications, signOut } = useStudentJourney()

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <form className="hidden flex-1 items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm transition focus-within:border-primary-400 lg:flex dark:border-slate-700 dark:bg-slate-900">
          <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" />
          <input
            type="search"
            placeholder="Search lessons, mentors, or practice challenges"
            className="w-full border-none bg-transparent text-sm text-slate-600 placeholder:text-slate-400 focus:outline-none dark:text-slate-200"
          />
        </form>
        <div className="ml-4 flex items-center gap-4">
          <button className="relative flex h-10 w-10 items-center justify-center rounded-full bg-primary-500/10 text-primary-500 transition hover:bg-primary-500/20">
            <BellAlertIcon className="h-5 w-5" />
            {notifications ? (
              <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-accent-500 px-1 text-[10px] font-bold text-white">
                {notifications}
              </span>
            ) : null}
          </button>
          <Link to="/profile" className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-2 py-1 pr-3 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-primary-400 hover:text-primary-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
            <Avatar name={student?.fullName ?? 'Student'} src={student?.avatarUrl} size="sm" />
            <span>{student?.firstName ?? 'Student'}</span>
            <ChevronDownIcon className="h-4 w-4" />
          </Link>
          <button
            onClick={signOut}
            className="hidden rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-primary-400 hover:text-primary-600 dark:border-slate-700 dark:text-slate-300 dark:hover:text-primary-200 md:block"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  )
}
