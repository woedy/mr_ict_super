import { courses, journeyTimeline } from '../data/mockData'

export function RoadmapPage() {
  return (
    <div className="space-y-8">
      <header className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900/80">
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">Learning roadmap</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Chart your progress from onboarding to capstones, and choose what to explore next.
        </p>
      </header>
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900/80">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Milestones</h2>
          <ol className="space-y-4">
            {journeyTimeline.map((moment) => (
              <li key={moment.id} className="rounded-3xl border border-slate-200 bg-white/80 p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary-500">{moment.timestamp}</p>
                <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">{moment.label}</p>
                <p className="mt-1">{moment.description}</p>
              </li>
            ))}
          </ol>
        </div>
        <aside className="space-y-4 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900/80">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Upcoming modules</h2>
          <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
            {courses.map((course) => (
              <li key={course.id} className="rounded-3xl border border-slate-200 bg-white/80 p-4 dark:border-slate-700 dark:bg-slate-900/70">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary-500">{course.track} track</p>
                <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">{course.title}</p>
                <p className="text-xs">{course.subtitle}</p>
              </li>
            ))}
          </ul>
        </aside>
      </section>
    </div>
  )
}
