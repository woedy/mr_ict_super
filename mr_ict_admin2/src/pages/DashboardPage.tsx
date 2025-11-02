import { UserGroupIcon, AcademicCapIcon, ChartBarIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline'
import { platformStats, users, courses, communityPosts } from '../data/mockData'

export function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Platform Dashboard</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Overview of Mr ICT platform activity and metrics
        </p>
      </div>

      {/* Stats Grid */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Total Users</p>
              <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{platformStats.totalUsers.toLocaleString()}</p>
              <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">↑ {platformStats.activeUsers} active</p>
            </div>
            <UserGroupIcon className="h-12 w-12 text-primary-500" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Courses</p>
              <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{platformStats.publishedCourses}</p>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">{platformStats.totalCourses} total</p>
            </div>
            <AcademicCapIcon className="h-12 w-12 text-accent-500" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Enrollments</p>
              <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{platformStats.totalEnrollments.toLocaleString()}</p>
              <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">{platformStats.avgCompletionRate}% avg completion</p>
            </div>
            <ChartBarIcon className="h-12 w-12 text-emerald-500" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Community Posts</p>
              <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{platformStats.totalPosts.toLocaleString()}</p>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">{platformStats.totalChallenges} challenges</p>
            </div>
            <ChatBubbleLeftRightIcon className="h-12 w-12 text-sky-500" />
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="grid gap-6 lg:grid-cols-2">
        {/* Recent Users */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recent Users</h2>
            <a href="/users" className="text-sm font-semibold text-primary-600 hover:text-primary-500 dark:text-primary-400">
              View all →
            </a>
          </div>
          <div className="mt-6 space-y-4">
            {users.slice(0, 5).map((user) => (
              <div key={user.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-700">
                <div className="flex items-center gap-3">
                  <img src={user.avatarUrl} alt={user.name} className="h-10 w-10 rounded-full" />
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{user.name}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{user.school}</p>
                  </div>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  user.status === 'active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-slate-200 text-slate-700 dark:bg-slate-600 dark:text-slate-300'
                }`}>
                  {user.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Courses */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Course Performance</h2>
            <a href="/courses" className="text-sm font-semibold text-primary-600 hover:text-primary-500 dark:text-primary-400">
              View all →
            </a>
          </div>
          <div className="mt-6 space-y-4">
            {courses.map((course) => (
              <div key={course.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-700">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{course.title}</p>
                    <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">{course.enrollments} enrollments</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    course.status === 'published' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                  }`}>
                    {course.status}
                  </span>
                </div>
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                    <span>Completion Rate</span>
                    <span className="font-semibold">{course.completionRate}%</span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-600">
                    <div className="h-full bg-primary-500" style={{ width: `${course.completionRate}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Activity */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md dark:border-slate-700 dark:bg-slate-800">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recent Community Activity</h2>
          <a href="/community" className="text-sm font-semibold text-primary-600 hover:text-primary-500 dark:text-primary-400">
            View all →
          </a>
        </div>
        <div className="mt-6 space-y-4">
          {communityPosts.map((post) => (
            <div key={post.id} className="flex items-start justify-between rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-700">
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{post.title}</p>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                  by {post.author} · {post.replies} replies · {post.views} views
                </p>
                <div className="mt-2 flex gap-2">
                  {post.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-primary-100 px-2 py-1 text-xs font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">{post.lastActivity}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
