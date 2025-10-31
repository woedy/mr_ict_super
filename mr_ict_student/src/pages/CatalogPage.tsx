import { useMemo, useState } from 'react'
import { CourseCard } from '../components/CourseCard'
import { courses } from '../data/mockData'

const tracks = ['All tracks', 'Web', 'Data', 'Design']

export function CatalogPage() {
  const [search, setSearch] = useState('')
  const [track, setTrack] = useState('All tracks')

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesTrack = track === 'All tracks' || course.track === (track as typeof course.track)
      const matchesSearch = course.title.toLowerCase().includes(search.toLowerCase())
      return matchesTrack && matchesSearch
    })
  }, [search, track])

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900/80 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">Course catalog</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Explore creative coding stories, data storytelling pathways, and immersive media studios crafted for Ghanaian learners.
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
      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </section>
      {filteredCourses.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white/60 p-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300">
          No courses match your filters yet. Check back soon—new Ghanaian stories are added weekly.
        </div>
      ) : null}
    </div>
  )
}
