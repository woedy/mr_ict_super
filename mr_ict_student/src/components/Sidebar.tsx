import {
  AcademicCapIcon,
  BoltIcon,
  ChatBubbleLeftRightIcon,
  HomeModernIcon,
  PlayCircleIcon,
  RectangleGroupIcon,
  SparklesIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline'
import { NavLink } from 'react-router-dom'
import { useStudentJourney } from '../context/StudentJourneyContext'
import { ThemeToggle } from './ThemeToggle'

const navigation = [
  { name: 'Dashboard', to: '/dashboard', icon: HomeModernIcon },
  { name: 'Catalog', to: '/catalog', icon: RectangleGroupIcon },
  { name: 'Assessments', to: '/assessments', icon: AcademicCapIcon },
  { name: 'Sandbox', to: '/sandbox', icon: BoltIcon },
  { name: 'Community', to: '/community', icon: ChatBubbleLeftRightIcon },
  { name: 'Learning Path', to: '/roadmap', icon: SparklesIcon },
  { name: 'Profile', to: '/profile', icon: UserCircleIcon },
  { name: 'Lesson Player', to: '/courses/foundations-web/lessons/welcome', icon: PlayCircleIcon },
]

export function Sidebar() {
  const { student } = useStudentJourney()

  return (
    <aside className="hidden h-full w-72 flex-shrink-0 flex-col justify-between border-r border-slate-200 bg-white px-6 py-8 dark:border-slate-700 dark:bg-slate-800 lg:flex">
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-500 text-lg font-semibold text-white shadow-glow">
            ICT
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">Mr ICT</p>
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">Student Studio</p>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-600 dark:bg-slate-700">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">Welcome back</p>
          <p className="mt-1 text-base font-bold text-slate-900 dark:text-white">{student?.firstName}!</p>
          <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">
            Continue shaping digital classrooms with your next lesson.
          </p>
        </div>
        <nav className="space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? 'bg-primary-600 text-white'
                    : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700'
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="flex items-center justify-between">
        <ThemeToggle />
        <div className="text-xs text-slate-500 dark:text-slate-400">
          <p>Ghana Time · GMT</p>
          <p className="mt-1">For JHS & SHS learners</p>
        </div>
      </div>
    </aside>
  )
}
