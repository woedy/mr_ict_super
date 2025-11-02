import { useEffect, useMemo, useState } from 'react'
import { CourseCard } from '../components/CourseCard'
import { coursesApi } from '../lib/api'
import { adaptCourses } from '../lib/adapters'
import type { Course } from '../data/mockData'

const tracks = ['All tracks', 'Web', 'Data', 'Design']

export function CatalogPage() {
  const [search, setSearch] = useState('')
  const [track, setTrack] = useState('All tracks')
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadCourses()
  }, [])

  const loadCourses = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await coursesApi.getCatalog({ page: 1, page_size: 50 })
      const backendCourses = response.data.courses || []
      setCourses(adaptCourses(backendCourses))
    } catch (err) {
      console.error('Failed to load courses:', err)
      setError('Failed to load courses. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch = course.title.toLowerCase().includes(search.toLowerCase())
      // Note: track filtering would need a track field from backend
      return matchesSearch
    })
  }, [courses, search])

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900/80 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">Course catalog</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Explore creative coding stories, data storytelling pathways, and immersive media studios crafted for JHS and SHS learners across Ghana and Africa.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by title"
            className="w-64 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          />
          <select
            value={track}
            onChange={(event) => setTrack(event.target.value)}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            {tracks.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
      </header>
      {loading ? (
        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse rounded-3xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900">
              <div className="h-48 w-full rounded-2xl bg-slate-200 dark:bg-slate-800" />
              <div className="mt-4 h-6 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="mt-2 h-4 w-full rounded bg-slate-200 dark:bg-slate-800" />
              <div className="mt-2 h-4 w-5/6 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="mt-4 flex gap-2">
                <div className="h-6 w-16 rounded-full bg-slate-200 dark:bg-slate-800" />
                <div className="h-6 w-16 rounded-full bg-slate-200 dark:bg-slate-800" />
              </div>
            </div>
          ))}
        </section>
      ) : error ? (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-10 text-center dark:border-red-900 dark:bg-red-950">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          <button
            onClick={loadCourses}
            className="mt-4 rounded-full bg-red-600 px-6 py-2 text-sm font-semibold text-white hover:bg-red-500"
          >
            Try again
          </button>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white/60 p-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300">
          {courses.length === 0
            ? 'No courses available yet. Check back soon—new stories are added weekly.'
            : 'No courses match your search. Try different keywords.'}
        </div>
      ) : (
        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </section>
      )}
    </div>
  )
}
