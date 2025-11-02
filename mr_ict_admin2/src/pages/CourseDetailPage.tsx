import { useParams, Link } from 'react-router-dom'
import { 
  ArrowLeftIcon, 
  PencilIcon, 
  TrashIcon, 
  PlusIcon,
  EyeIcon,
  StarIcon,
  ClockIcon,
  UserGroupIcon,
  AcademicCapIcon,
} from '@heroicons/react/24/outline'
import { courses } from '../data/mockData'

export function CourseDetailPage() {
  const { id } = useParams()
  const course = courses.find((c) => c.id === id)

  if (!course) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Course not found</h1>
        <Link to="/courses" className="mt-4 inline-block text-primary-600 hover:text-primary-500">
          ← Back to courses
        </Link>
      </div>
    )
  }

  const totalLessons = course.modules.reduce((acc, module) => acc + module.lessons.length, 0)
  const avgRating = course.modules
    .flatMap((m) => m.lessons)
    .reduce((acc, l) => acc + l.avgRating, 0) / totalLessons || 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/courses"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{course.title}</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{course.subtitle}</p>
        </div>
        <div className="flex gap-2">
          <Link
            to={`/courses/${course.id}/edit`}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            <PencilIcon className="h-4 w-4" />
            Edit Course
          </Link>
          <button className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-700">
            <PlusIcon className="h-4 w-4" />
            Add Module
          </button>
        </div>
      </div>

      {/* Course Overview */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Course Info Card */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md dark:border-slate-700 dark:bg-slate-800">
            <img
              src={course.thumbnail}
              alt={course.title}
              className="h-64 w-full rounded-2xl object-cover"
            />
            <div className="mt-6 space-y-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">About this course</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {course.description}
                </p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {course.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-700 dark:bg-primary-900/30 dark:text-primary-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-700">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Instructors</p>
                  <div className="mt-2 space-y-1">
                    {course.instructors.map((instructor) => (
                      <p key={instructor} className="text-sm font-medium text-slate-900 dark:text-white">
                        {instructor}
                      </p>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Created</p>
                  <p className="mt-2 text-sm font-medium text-slate-900 dark:text-white">
                    {new Date(course.createdDate).toLocaleDateString()}
                  </p>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                    by {course.createdBy}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Modules & Lessons */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Course Content</h2>
              <span className="text-sm text-slate-600 dark:text-slate-400">
                {course.modules.length} modules · {totalLessons} lessons
              </span>
            </div>

            {course.modules.map((module, index) => (
              <div
                key={module.id}
                className="rounded-3xl border border-slate-200 bg-white shadow-md dark:border-slate-700 dark:bg-slate-800"
              >
                <div className="flex items-center justify-between border-b border-slate-200 p-6 dark:border-slate-700">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
                        {index + 1}
                      </span>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{module.title}</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{module.description}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button className="flex h-8 w-8 items-center justify-center rounded-full border border-red-200 bg-white text-red-600 transition hover:bg-red-50 dark:border-red-900 dark:bg-slate-800 dark:text-red-400 dark:hover:bg-red-900/20">
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="divide-y divide-slate-200 dark:divide-slate-700">
                  {module.lessons.map((lesson) => (
                    <div key={lesson.id} className="flex items-center justify-between p-4 transition hover:bg-slate-50 dark:hover:bg-slate-700/50">
                      <div className="flex items-center gap-4">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                          lesson.type === 'video' ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300' :
                          lesson.type === 'project' ? 'bg-accent-100 text-accent-700 dark:bg-accent-900/30 dark:text-accent-300' :
                          lesson.type === 'quiz' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' :
                          'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                        }`}>
                          {lesson.type === 'video' ? '▶' : lesson.type === 'project' ? '⚡' : lesson.type === 'quiz' ? '?' : '📄'}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">{lesson.title}</p>
                          <div className="mt-1 flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
                            <span className="flex items-center gap-1">
                              <ClockIcon className="h-3 w-3" />
                              {lesson.duration}
                            </span>
                            <span className="flex items-center gap-1">
                              <EyeIcon className="h-3 w-3" />
                              {lesson.views} views
                            </span>
                            {lesson.avgRating > 0 && (
                              <span className="flex items-center gap-1">
                                <StarIcon className="h-3 w-3 fill-amber-400 text-amber-400" />
                                {lesson.avgRating.toFixed(1)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          lesson.status === 'published'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                        }`}>
                          {lesson.status}
                        </span>
                        <button className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
                          <PencilIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-200 p-4 dark:border-slate-700">
                  <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-700/50 dark:text-slate-400 dark:hover:bg-slate-700">
                    <PlusIcon className="h-4 w-4" />
                    Add Lesson
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-6">
          {/* Status Card */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md dark:border-slate-700 dark:bg-slate-800">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Status</h3>
            <div className="mt-4 space-y-4">
              <div>
                <span className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ${
                  course.status === 'published'
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                    : course.status === 'draft'
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                    : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                }`}>
                  {course.status}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className={`inline-flex rounded-full px-3 py-1 font-semibold ${
                  course.level === 'Beginner' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                  course.level === 'Intermediate' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                  'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  {course.level}
                </span>
                <span className={`inline-flex rounded-full px-3 py-1 font-semibold ${
                  course.track === 'Web' ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300' :
                  course.track === 'Data' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:bg-emerald-400' :
                  'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                }`}>
                  {course.track}
                </span>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
              <div className="flex items-center gap-3">
                <UserGroupIcon className="h-8 w-8 text-primary-500" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Enrollments</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{course.enrollments.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
              <div className="flex items-center gap-3">
                <AcademicCapIcon className="h-8 w-8 text-emerald-500" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Completion Rate</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{course.completionRate}%</p>
                </div>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                <div className="h-full bg-emerald-500" style={{ width: `${course.completionRate}%` }} />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
              <div className="flex items-center gap-3">
                <StarIcon className="h-8 w-8 fill-amber-400 text-amber-400" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Avg Rating</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{avgRating.toFixed(1)}</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Duration</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{course.hours}h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">XP Reward</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{course.xp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Modules</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{course.modules.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Lessons</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{totalLessons}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <button className="flex w-full items-center justify-center gap-2 rounded-full bg-primary-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-700">
              Publish Course
            </button>
            <button className="flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
              Preview as Student
            </button>
            <button className="flex w-full items-center justify-center gap-2 rounded-full border border-red-200 bg-white px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-900 dark:bg-slate-800 dark:text-red-400 dark:hover:bg-red-900/20">
              <TrashIcon className="h-4 w-4" />
              Delete Course
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
