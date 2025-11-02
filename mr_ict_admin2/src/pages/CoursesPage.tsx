import { PlusIcon, FunnelIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { coursesApi } from '../lib/api'

export function CoursesPage() {
  const [filter, setFilter] = useState('all')
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadCourses()
  }, [])

  const loadCourses = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await coursesApi.getCourses()
      const coursesData = response.data?.courses || []
      setCourses(coursesData)
    } catch (err) {
      console.error('Failed to load courses:', err)
      setError('Failed to load courses. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const filteredCourses = courses.filter((course) => {
    if (filter === 'all') return true
    // Map backend status to filter
    if (filter === 'published') return course.is_published
    if (filter === 'draft') return !course.is_published && !course.is_archived
    if (filter === 'archived') return course.is_archived
    return true
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Course Management</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Create, edit, and publish courses for students
          </p>
        </div>
        <Link
          to="/courses/new"
          className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-primary-700"
        >
          <PlusIcon className="h-5 w-5" />
          Create Course
        </Link>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
        <div className="flex items-center gap-2">
          <FunnelIcon className="h-5 w-5 text-slate-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <div className="flex gap-2">
          <button className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
            Export
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
            <p className="mt-4 text-slate-600 dark:text-slate-400">Loading courses...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20">
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <button
            onClick={loadCourses}
            className="mt-4 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Stats */}
      {!loading && !error && (
        <>
          <div className="grid gap-4 sm:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Total Courses</p>
              <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{courses.length}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Published</p>
              <p className="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {courses.filter(c => c.is_published).length}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Draft</p>
              <p className="mt-2 text-2xl font-bold text-amber-600 dark:text-amber-400">
                {courses.filter(c => !c.is_published && !c.is_archived).length}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Archived</p>
              <p className="mt-2 text-2xl font-bold text-slate-600 dark:text-slate-400">
                {courses.filter(c => c.is_archived).length}
              </p>
            </div>
          </div>

          {/* Empty State */}
          {filteredCourses.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-800">
              <p className="text-slate-600 dark:text-slate-400">No courses found</p>
            </div>
          )}

          {/* Courses Grid */}
          {filteredCourses.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredCourses.map((course) => (
          <div key={course.course_id || course.id} className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-md transition hover:shadow-lg dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-start justify-between">
              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                course.is_published ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                course.is_archived ? 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300' :
                'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
              }`}>
                {course.is_published ? 'Published' : course.is_archived ? 'Archived' : 'Draft'}
              </span>
              <span className="inline-flex rounded-full px-3 py-1 text-xs font-semibold bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">
                {course.level || 'Beginner'}
              </span>
            </div>
            
            <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">{course.title}</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{course.summary || course.description}</p>
            
            <div className="mt-4 flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400">
              <span>{course.level || 'Beginner'}</span>
              <span>•</span>
              <span>{Math.round((course.estimated_duration_minutes || 60) / 60)}h</span>
              <span>•</span>
              <span>{course.modules?.length || 0} modules</span>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-400">Enrollments</span>
                <span className="font-semibold text-slate-900 dark:text-white">{course.enrollment_count || 0}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-400">Tags</span>
                <span className="font-semibold text-slate-900 dark:text-white">{course.tags?.length || 0}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Course ID: <span className="font-mono text-slate-900 dark:text-white">{course.course_id}</span>
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
                Updated {new Date(course.updated_at || course.created_at).toLocaleDateString()}
              </p>
            </div>

            <div className="mt-4 flex gap-2">
              <button className="flex-1 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
                Edit
              </button>
              <Link
                to={`/courses/${course.course_id || course.id}`}
                className="flex flex-1 items-center justify-center rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-700"
              >
                View
              </Link>
            </div>
          </div>
        ))}
      </div>
          )}
        </>
      )}
    </div>
  )
}
