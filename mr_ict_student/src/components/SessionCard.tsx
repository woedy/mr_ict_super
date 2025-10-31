import { PlayCircleIcon } from '@heroicons/react/24/outline'

type Session = {
  id: string
  title: string
  mentor: string
  schedule: string
}

export function SessionCard({ session }: { session: Session }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white/80 px-5 py-4 shadow-sm transition hover:border-primary-400 dark:border-slate-800 dark:bg-slate-900/60">
      <div>
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{session.title}</p>
        <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{session.schedule}</p>
        <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">{session.mentor}</p>
      </div>
      <button className="inline-flex items-center gap-2 rounded-full border border-primary-500 px-4 py-2 text-sm font-semibold text-primary-600 transition hover:bg-primary-50 dark:border-primary-300 dark:text-primary-200 dark:hover:bg-primary-500/10">
        <PlayCircleIcon className="h-5 w-5" />
        RSVP
      </button>
    </div>
  )
}
