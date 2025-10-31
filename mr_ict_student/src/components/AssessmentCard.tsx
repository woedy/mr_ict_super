import { ClockIcon, TrophyIcon } from '@heroicons/react/24/outline'
import type { Assessment } from '../data/mockData'

export function AssessmentCard({ assessment }: { assessment: Assessment }) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-primary-500">{assessment.type}</p>
        <h3 className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">{assessment.title}</h3>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{assessment.focus}</p>
      </div>
      <dl className="grid grid-cols-2 gap-4 text-sm text-slate-500 dark:text-slate-300">
        <div className="flex items-center gap-2">
          <ClockIcon className="h-5 w-5 text-primary-500" />
          <div>
            <dt className="font-medium text-slate-700 dark:text-slate-200">Duration</dt>
            <dd>{assessment.duration}</dd>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <TrophyIcon className="h-5 w-5 text-accent-500" />
          <div>
            <dt className="font-medium text-slate-700 dark:text-slate-200">Reward</dt>
            <dd>{assessment.xp} XP</dd>
          </div>
        </div>
      </dl>
      <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
        <span>{assessment.dueDate}</span>
        <span>{assessment.attemptsLeft} attempts left</span>
      </div>
      <button className="rounded-full border border-primary-500 px-4 py-2 text-sm font-semibold text-primary-600 transition hover:bg-primary-50 dark:border-primary-300 dark:text-primary-200 dark:hover:bg-primary-500/10">
        Start Preview
      </button>
    </div>
  )
}
