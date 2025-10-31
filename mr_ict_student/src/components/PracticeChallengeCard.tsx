import { SparklesIcon } from '@heroicons/react/24/outline'
import type { PracticeChallenge } from '../data/mockData'

export function PracticeChallengeCard({ challenge }: { challenge: PracticeChallenge }) {
  return (
    <div className="rounded-2xl border border-dashed border-primary-400/60 bg-primary-500/5 p-4 text-sm text-slate-600 dark:border-primary-300/60 dark:bg-primary-500/10 dark:text-slate-200">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-500 text-white shadow-glow">
          <SparklesIcon className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary-500">{challenge.difficulty} Challenge</p>
          <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100">{challenge.title}</h4>
          <p>{challenge.description}</p>
          <p className="text-xs text-slate-500 dark:text-slate-300">Est. {challenge.estimatedMinutes} minutes · {challenge.courseId}</p>
        </div>
      </div>
    </div>
  )
}
