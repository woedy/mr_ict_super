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
    <aside className="hidden w-72 flex-shrink-0 flex-col justify-between border-r border-slate-200 bg-gradient-to-b from-white/80 via-white/60 to-white/80 px-6 py-8 shadow-sm dark:border-slate-800 dark:from-slate-900/90 dark:via-slate-950/90 dark:to-slate-900/90 lg:flex">
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
        <div className="rounded-3xl bg-gradient-to-br from-primary-500 via-primary-400 to-accent-400 p-[1px]">
          <div className="rounded-3xl bg-white/95 p-4 dark:bg-slate-950/90">
            <p className="text-xs uppercase tracking-wide text-primary-500">Welcome back</p>
            <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{student?.firstName}!</p>
            <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">
              Continue shaping digital classrooms with your next lesson.
            </p>
          </div>
        </div>
        <nav className="space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? 'bg-primary-500 text-white shadow-glow'
                    : 'text-slate-600 hover:bg-primary-500/10 hover:text-primary-600 dark:text-slate-300 dark:hover:text-primary-200'
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
          <p className="mt-1">Crafted for student storytellers</p>
        </div>
      </div>
    </aside>
  )
}
