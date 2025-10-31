import { ArrowLongRightIcon } from '@heroicons/react/24/outline'
import { journeyTimeline } from '../data/mockData'

export function JourneyTimeline() {
  return (
    <ol className="space-y-6">
      {journeyTimeline.map((moment, index) => (
        <li key={moment.id} className="relative rounded-2xl border border-slate-200 bg-white/80 p-4 dark:border-slate-800 dark:bg-slate-900/60">
          {index !== journeyTimeline.length - 1 ? (
            <span className="absolute left-6 top-full h-6 w-px bg-gradient-to-b from-primary-400 to-transparent" aria-hidden />
          ) : null}
          <div className="flex items-start gap-4">
            <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-primary-500/10 text-primary-500">
              <ArrowLongRightIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{moment.timestamp}</p>
              <h4 className="mt-1 text-base font-semibold text-slate-900 dark:text-slate-100">{moment.label}</h4>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{moment.description}</p>
            </div>
          </div>
        </li>
      ))}
    </ol>
  )
}
