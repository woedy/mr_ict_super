import { Link } from 'react-router-dom'

export function LearningFooter() {
  return (
    <footer className="mt-8 w-full shrink-0 flex flex-col items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-gradient-to-br from-white/95 via-primary-50/80 to-white/95 px-6 py-6 text-center text-sm text-slate-600 shadow-lg dark:border-slate-800 dark:from-slate-900/80 dark:via-slate-900/60 dark:to-slate-900/80 dark:text-slate-300 md:flex-row md:gap-6 md:text-left">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary-500 dark:text-primary-200">Keep exploring</p>
        <p className="mt-2 text-base font-medium text-slate-900 dark:text-slate-100">
          Your studio streak is building momentum—bookmark your wins and share a highlight with your club today.
        </p>
      </div>
      <div className="flex flex-col items-center gap-3 md:items-end">
        <Link
          to="/community"
          className="inline-flex items-center gap-2 rounded-full bg-primary-500 px-5 py-2 text-sm font-semibold text-white shadow-glow transition hover:bg-primary-400"
        >
          Visit community
          <span aria-hidden className="text-lg leading-none">↗</span>
        </Link>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          Need a breather? Jot reflections in your notes—autosave has you covered.
        </span>
      </div>
    </footer>
  )
}
