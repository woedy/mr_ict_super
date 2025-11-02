import { useParams, Link } from 'react-router-dom'
import { 
  ArrowLeftIcon, 
  PencilIcon, 
  TrashIcon,
  EnvelopeIcon,
  MapPinIcon,
  AcademicCapIcon,
  TrophyIcon,
  CalendarIcon,
  ShieldCheckIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline'
import { users, courses } from '../data/mockData'

export function UserDetailPage() {
  const { id } = useParams()
  const user = users.find((u) => u.id === id)

  if (!user) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">User not found</h1>
        <Link to="/users" className="mt-4 inline-block text-primary-600 hover:text-primary-500">
          ← Back to users
        </Link>
      </div>
    )
  }

  // Mock enrolled courses
  const enrolledCourses = courses.slice(0, user.coursesEnrolled)

  // Mock activity data
  const recentActivity = [
    { id: '1', action: 'Completed lesson', item: 'CSS Fundamentals', date: '2 hours ago' },
    { id: '2', action: 'Started course', item: 'Data Storytelling', date: '1 day ago' },
    { id: '3', action: 'Earned badge', item: 'Web Developer', date: '3 days ago' },
    { id: '4', action: 'Submitted project', item: 'Community Website', date: '5 days ago' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/users"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">User Profile</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Manage user account and activity</p>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
            <PencilIcon className="h-4 w-4" />
            Edit Profile
          </button>
          {user.status === 'active' ? (
            <button className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white px-4 py-2 text-sm font-semibold text-amber-600 transition hover:bg-amber-50 dark:border-amber-900 dark:bg-slate-800 dark:text-amber-400 dark:hover:bg-amber-900/20">
              <XCircleIcon className="h-4 w-4" />
              Suspend User
            </button>
          ) : (
            <button className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-600 transition hover:bg-emerald-50 dark:border-emerald-900 dark:bg-slate-800 dark:text-emerald-400 dark:hover:bg-emerald-900/20">
              <ShieldCheckIcon className="h-4 w-4" />
              Activate User
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Profile Card */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-start gap-6">
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="h-24 w-24 rounded-2xl object-cover"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{user.name}</h2>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{user.email}</p>
                  </div>
                  <span className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ${
                    user.status === 'active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                    user.status === 'suspended' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                    'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                  }`}>
                    {user.status}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <MapPinIcon className="h-4 w-4" />
                    {user.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <AcademicCapIcon className="h-4 w-4" />
                    {user.school}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <CalendarIcon className="h-4 w-4" />
                    Joined {new Date(user.joinedDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <EnvelopeIcon className="h-4 w-4" />
                    {user.email}
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-4">
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                    user.role === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                    user.role === 'instructor' ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400' :
                    'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                  }`}>
                    {user.role}
                  </span>
                  <span className="text-xs text-slate-600 dark:text-slate-400">
                    User ID: {user.id}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Enrolled Courses */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Enrolled Courses</h3>
              <span className="text-sm text-slate-600 dark:text-slate-400">{user.coursesEnrolled} courses</span>
            </div>
            <div className="mt-6 space-y-4">
              {enrolledCourses.map((course) => (
                <div
                  key={course.id}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-700"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="h-16 w-16 rounded-xl object-cover"
                    />
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{course.title}</p>
                      <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                        {course.level} · {course.track}
                      </p>
                      <div className="mt-2 h-1.5 w-32 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-600">
                        <div
                          className="h-full bg-primary-500"
                          style={{ width: `${Math.random() * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <Link
                    to={`/courses/${course.id}`}
                    className="text-sm font-semibold text-primary-600 hover:text-primary-500 dark:text-primary-400"
                  >
                    View →
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md dark:border-slate-700 dark:bg-slate-800">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Recent Activity</h3>
            <div className="mt-6 space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-700"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
                    ✓
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{activity.action}</p>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{activity.item}</p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">{activity.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Stats */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md dark:border-slate-700 dark:bg-slate-800">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Statistics</h3>
            <div className="mt-4 space-y-4">
              <div className="flex items-center gap-3">
                <TrophyIcon className="h-8 w-8 text-amber-500" />
                <div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Total XP</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{user.xp.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <AcademicCapIcon className="h-8 w-8 text-primary-500" />
                <div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Courses Enrolled</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{user.coursesEnrolled}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md dark:border-slate-700 dark:bg-slate-800">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Quick Actions</h3>
            <div className="mt-4 space-y-2">
              <button className="flex w-full items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600">
                <EnvelopeIcon className="h-4 w-4" />
                Send Email
              </button>
              <button className="flex w-full items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600">
                <TrophyIcon className="h-4 w-4" />
                Award Badge
              </button>
              <button className="flex w-full items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600">
                <AcademicCapIcon className="h-4 w-4" />
                Enroll in Course
              </button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="rounded-3xl border border-red-200 bg-white p-6 shadow-md dark:border-red-900 dark:bg-slate-800">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-red-600 dark:text-red-400">Danger Zone</h3>
            <div className="mt-4 space-y-2">
              <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700 transition hover:bg-amber-100 dark:border-amber-900 dark:bg-amber-900/20 dark:text-amber-400 dark:hover:bg-amber-900/30">
                <XCircleIcon className="h-4 w-4" />
                Suspend Account
              </button>
              <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-100 dark:border-red-900 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30">
                <TrashIcon className="h-4 w-4" />
                Delete Account
              </button>
            </div>
          </div>

          {/* Account Info */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md dark:border-slate-700 dark:bg-slate-800">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Account Info</h3>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Last Login</span>
                <span className="font-semibold text-slate-900 dark:text-white">2 hours ago</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Login Count</span>
                <span className="font-semibold text-slate-900 dark:text-white">247</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">IP Address</span>
                <span className="font-mono text-xs font-semibold text-slate-900 dark:text-white">192.168.1.1</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Device</span>
                <span className="font-semibold text-slate-900 dark:text-white">Chrome/Windows</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
