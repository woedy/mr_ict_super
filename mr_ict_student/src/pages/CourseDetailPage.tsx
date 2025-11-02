import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { coursesApi } from '../lib/api'
import { adaptCourse } from '../lib/adapters'
import type { Course } from '../data/mockData'

export function CourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>()
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (courseId) {
      loadCourse()
    }
  }, [courseId])

  const loadCourse = async () => {
    if (!courseId) return
    
    try {
      setLoading(true)
      setError(null)
      const response = await coursesApi.getCourseDetail(courseId)
      setCourse(adaptCourse(response.data))
    } catch (err) {
      console.error('Failed to load course:', err)
      setError('Failed to load course details.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-10">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
          <div className="h-60 w-full bg-slate-200 dark:bg-slate-800" />
          <div className="grid gap-6 px-8 py-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-4">
              <div className="h-10 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-6 w-full rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-4 w-5/6 rounded bg-slate-200 dark:bg-slate-800" />
            </div>
            <div className="h-64 rounded-3xl bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white/70 p-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300">
        {error || 'Course not found.'} Return to the <Link to="/catalog" className="font-semibold text-primary-600">catalog</Link> to explore other learning paths.
      </div>
    )
  }

  return (
    <article className="space-y-10">
      <header className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <div className="relative h-60 w-full">
          <img src={course.heroImage} alt={course.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/60 to-transparent" />
          <div className="absolute left-6 top-6 inline-flex rounded-full bg-white/80 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700">
            {course.level} · {course.track}
          </div>
        </div>
        <div className="grid gap-6 px-8 py-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold text-slate-900 dark:text-slate-100">{course.title}</h1>
            <p className="text-lg text-slate-600 dark:text-slate-300">{course.subtitle}</p>
            <p className="text-sm text-slate-600 dark:text-slate-300">{course.summary}</p>
            <div className="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-wide text-primary-500">
              {course.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-primary-500/10 px-3 py-1">
                  #{tag}
                </span>
              ))}
            </div>
            <Link
              to={`/courses/${course.id}/lessons/${course.modules[0]?.lessons[0]?.id ?? ''}`}
              className="inline-flex items-center gap-2 rounded-full bg-primary-500 px-6 py-3 text-sm font-semibold text-white shadow-glow transition hover:bg-primary-400"
            >
              Enter lesson player
            </Link>
          </div>
          <aside className="space-y-4 rounded-3xl border border-slate-200 bg-white/80 p-6 text-sm text-slate-600 shadow-inner dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300">
            <p>
              <span className="font-semibold text-slate-900 dark:text-slate-100">XP Reward:</span> {course.xp} XP ·{' '}
              <span className="font-semibold text-slate-900 dark:text-slate-100">Estimated time:</span> {course.hours} hrs
            </p>
            <p className="text-slate-600 dark:text-slate-300">{course.spotlight}</p>
            <div className="space-y-3">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Mentor crew</h2>
              {course.instructors.map((mentor) => (
                <div key={mentor.name} className="flex items-center gap-3">
                  <img
                    src={mentor.avatar}
                    alt={mentor.name}
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-primary-500/40"
                  />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{mentor.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{mentor.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </header>
      <section className="space-y-8 rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-lg dark:border-slate-800 dark:bg-slate-900/80">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Modules & lessons</h2>
        <div className="space-y-6">
          {course.modules.map((module) => (
            <div key={module.id} className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-inner dark:border-slate-700 dark:bg-slate-900/70">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{module.title}</h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
                {module.lessons.map((lesson) => (
                  <li key={lesson.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{lesson.title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{lesson.summary}</p>
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-wide text-primary-500">
                      {lesson.type} · {lesson.duration}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </article>
  )
}
