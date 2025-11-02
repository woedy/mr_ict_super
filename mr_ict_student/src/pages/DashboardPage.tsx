import { PlayCircleIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'
import { AssessmentCard } from '../components/AssessmentCard'
import { AnnouncementCard } from '../components/AnnouncementCard'
import { JourneyTimeline } from '../components/JourneyTimeline'
import { PracticeChallengeCard } from '../components/PracticeChallengeCard'
import { SessionCard } from '../components/SessionCard'
import { useStudentJourney } from '../context/StudentJourneyContext'
import {
  announcements,
  assessments,
  courses,
  dailyFocus,
  practiceChallenges,
  upcomingSessions,
} from '../data/mockData'
import { formatNumber } from '../utils/format'

export function DashboardPage() {
  const { student, enrollments } = useStudentJourney()

  const enrolledCourses = courses.filter((course) => enrollments.some((item) => item.courseId === course.id))
  const nextCourse = enrolledCourses[0]

  return (
    <div className="space-y-6">
      {/* Hero Welcome Section */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-md dark:border-slate-700 dark:bg-slate-800">
        <div className="relative z-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Welcome back! 👋</p>
              <h1 className="mt-1 text-4xl font-bold text-slate-900 dark:text-white">{student?.firstName}</h1>
              <p className="mt-2 text-base text-slate-600 dark:text-slate-400">Ready to level up your ICT skills today?</p>
            </div>
            <Link
              to="/onboarding"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
            >
              ⚙️ Settings
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-md transition hover:shadow-lg dark:border-slate-700 dark:bg-slate-800">
          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Total XP</p>
            <p className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">{formatNumber(student?.xp ?? 0)}</p>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">Keep learning to earn more!</p>
          </div>
        </div>
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-md transition hover:shadow-lg dark:border-slate-700 dark:bg-slate-800">
          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">🔥 Streak</p>
            <p className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">{student?.streak ?? 0} days</p>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">Don't break the chain!</p>
          </div>
        </div>
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-md transition hover:shadow-lg dark:border-slate-700 dark:bg-slate-800">
          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">🏆 Badges</p>
            <p className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">{student?.badges ?? 0}</p>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">Achievements unlocked</p>
          </div>
        </div>
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-md transition hover:shadow-lg dark:border-slate-700 dark:bg-slate-800">
          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">⚡ Offline Packs</p>
            <p className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">3</p>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">Ready to sync</p>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Continue Learning Card */}
          {nextCourse ? (
            <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-md transition hover:shadow-lg dark:border-slate-700 dark:bg-slate-800">
              <div className="relative z-10">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">📚 Continue Learning</p>
                    <h2 className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">{nextCourse.title}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{nextCourse.spotlight}</p>
                  </div>
                </div>
                <Link
                  to={`/courses/${nextCourse.id}`}
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary-600 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-primary-700"
                >
                  <PlayCircleIcon className="h-5 w-5" />
                  Resume Lesson
                </Link>
              </div>
            </div>
          ) : null}

          {/* Assessments Section */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">📝 Assessments</h2>
              <Link to="/assessments" className="text-sm font-semibold text-primary-600 hover:text-primary-500 dark:text-primary-400">
                View all →
              </Link>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {assessments.map((assessment) => (
                <AssessmentCard key={assessment.id} assessment={assessment} />
              ))}
            </div>
          </div>

          {/* Practice Challenges */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md dark:border-slate-700 dark:bg-slate-800">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">⚡ Practice Challenges</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {practiceChallenges.map((challenge) => (
                <PracticeChallengeCard key={challenge.id} challenge={challenge} />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Daily Focus Card */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md dark:border-slate-700 dark:bg-slate-800">
            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">✨ Daily Focus</p>
            <h2 className="mt-2 text-lg font-bold text-slate-900 dark:text-slate-100">{dailyFocus.date}</h2>
            <div className="mt-4 space-y-3">
              <div className="rounded-xl bg-slate-100 p-3 dark:bg-slate-700">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">🎉 Today's Win</p>
                <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{dailyFocus.win}</p>
              </div>
              <div className="rounded-xl bg-slate-100 p-3 dark:bg-slate-700">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">🎯 Focus Area</p>
                <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{dailyFocus.intention}</p>
              </div>
              <div className="rounded-xl bg-slate-100 p-3 dark:bg-slate-700">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">💪 Encouragement</p>
                <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{dailyFocus.encouragement}</p>
              </div>
            </div>
          </div>

          {/* Journey Timeline */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md dark:border-slate-700 dark:bg-slate-800">
            <JourneyTimeline />
          </div>

          {/* Live Sessions */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">🎥 Live Sessions</h2>
              <Link to="/community" className="text-sm font-semibold text-primary-600 hover:text-primary-500 dark:text-primary-400">
                Join →
              </Link>
            </div>
            <div className="mt-6 space-y-4">
              {upcomingSessions.map((session) => (
                <SessionCard key={session.id} session={session} />
              ))}
            </div>
          </div>

          {/* Announcements */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md dark:border-slate-700 dark:bg-slate-800">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">📢 Announcements</h3>
            <div className="mt-4 space-y-3">
              {announcements.map((announcement) => (
                <AnnouncementCard key={announcement.id} announcement={announcement} />
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
