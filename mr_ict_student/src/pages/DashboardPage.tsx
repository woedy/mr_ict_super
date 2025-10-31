import { BoltIcon, PlayCircleIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'
import { AssessmentCard } from '../components/AssessmentCard'
import { AnnouncementCard } from '../components/AnnouncementCard'
import { JourneyTimeline } from '../components/JourneyTimeline'
import { PracticeChallengeCard } from '../components/PracticeChallengeCard'
import { SessionCard } from '../components/SessionCard'
import { StatCard } from '../components/StatCard'
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
    <div className="space-y-10">
      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900/80">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Good to see you,</p>
              <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">{student?.firstName}</h1>
            </div>
            <Link
              to="/onboarding"
              className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-primary-400 hover:text-primary-600 dark:border-slate-700 dark:text-slate-300"
            >
              Update preferences
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Total XP"
              value={`${formatNumber(student?.xp ?? 0)} XP`}
              helper="Across lessons, projects, and workshops"
            />
            <StatCard label="Streak" value={`${student?.streak ?? 0} days`} helper="Keep learning daily" accent="accent" />
            <StatCard label="Badges" value={`${student?.badges ?? 0}`} helper="Earned from community kudos" />
            <StatCard
              label="Offline packs"
              value="3 ready"
              helper="Sync to your ICT lab device"
              icon={<BoltIcon className="h-8 w-8" />}
              accent="midnight"
            />
          </div>
          {nextCourse ? (
            <div className="rounded-3xl border border-dashed border-primary-400/60 bg-primary-500/5 p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary-500">Resume learning</p>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{nextCourse.title}</h2>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{nextCourse.spotlight}</p>
                </div>
                <Link
                  to={`/courses/${nextCourse.id}`}
                  className="inline-flex items-center gap-2 rounded-full bg-primary-500 px-5 py-2 text-sm font-semibold text-white shadow-glow transition hover:bg-primary-400"
                >
                  Continue lesson
                  <PlayCircleIcon className="h-5 w-5" />
                </Link>
              </div>
            </div>
          ) : null}
        </div>
        <div className="flex h-full flex-col justify-between gap-6 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900/80">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-primary-500">Daily reflection</p>
            <h2 className="mt-1 text-xl font-semibold text-slate-900 dark:text-slate-100">{dailyFocus.date}</h2>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
              <span className="font-semibold text-primary-600 dark:text-primary-200">Win:</span> {dailyFocus.win}
            </p>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
              <span className="font-semibold text-primary-600 dark:text-primary-200">Focus:</span> {dailyFocus.intention}
            </p>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
              <span className="font-semibold text-primary-600 dark:text-primary-200">Encouragement:</span>{' '}
              {dailyFocus.encouragement}
            </p>
          </div>
          <JourneyTimeline />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900/80">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Assessments & checkpoints</h2>
            <Link to="/assessments" className="text-sm font-semibold text-primary-600 hover:text-primary-500 dark:text-primary-300">
              View all
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {assessments.map((assessment) => (
              <AssessmentCard key={assessment.id} assessment={assessment} />
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {practiceChallenges.map((challenge) => (
              <PracticeChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </div>
        </div>
        <div className="space-y-6 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900/80">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Upcoming live sessions</h2>
            <Link to="/community" className="text-sm font-semibold text-primary-600 hover:text-primary-500 dark:text-primary-300">
              Join community
            </Link>
          </div>
          <div className="space-y-4">
            {upcomingSessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Announcements</h3>
            {announcements.map((announcement) => (
              <AnnouncementCard key={announcement.id} announcement={announcement} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
