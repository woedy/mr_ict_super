import clsx from 'clsx'
import type { ReactNode } from 'react'

export type StatCardProps = {
  label: string
  value: string
  helper?: string
  icon?: ReactNode
  accent?: 'primary' | 'accent' | 'midnight'
}

const accentMap = {
  primary: 'from-primary-500/10 to-primary-500/5 text-primary-700 dark:text-primary-200',
  accent: 'from-accent-500/10 to-accent-500/5 text-accent-700 dark:text-accent-200',
  midnight: 'from-slate-900/70 to-slate-900/40 text-white',
}

export function StatCard({ label, value, helper, icon, accent = 'primary' }: StatCardProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/80 bg-white/70 p-5 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/60">
      <div className={clsx('absolute inset-0 -z-10 bg-gradient-to-br', accentMap[accent])} />
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-slate-100">{value}</p>
          {helper ? <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{helper}</p> : null}
        </div>
        {icon ? <div className="text-3xl text-primary-500 dark:text-primary-300">{icon}</div> : null}
      </div>
    </div>
  )
}
