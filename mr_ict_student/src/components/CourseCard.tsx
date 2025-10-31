import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'
import type { Course } from '../data/mockData'

export function CourseCard({ course }: { course: Course }) {
  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-lg shadow-primary-900/5 transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">
      <div className="relative h-40 w-full overflow-hidden">
        <img
          src={course.heroImage}
          alt={course.title}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent" />
        <span className="absolute left-4 top-4 inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700 backdrop-blur">
          {course.level} · {course.track}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-6">
        <div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{course.title}</h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{course.subtitle}</p>
        </div>
        <p className="flex-1 text-sm text-slate-500 dark:text-slate-400">{course.summary}</p>
        <div className="flex flex-wrap gap-2">
          {course.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-primary-500/10 px-3 py-1 text-xs font-medium text-primary-600 dark:text-primary-200"
            >
              #{tag}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-300">
          <div>
            <p className="font-semibold text-slate-700 dark:text-slate-200">{course.xp.toLocaleString()} XP</p>
            <p>{course.hours} learning hours</p>
          </div>
          <Link
            to={`/courses/${course.id}`}
            className="inline-flex items-center gap-2 rounded-full bg-primary-500 px-4 py-2 text-sm font-semibold text-white shadow-glow transition hover:bg-primary-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
          >
            Explore
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
