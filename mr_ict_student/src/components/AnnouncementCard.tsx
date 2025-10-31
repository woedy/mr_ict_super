import type { Announcement } from '../data/mockData'

export function AnnouncementCard({ announcement }: { announcement: Announcement }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-primary-400/60 dark:border-slate-800 dark:bg-slate-900/70">
      <div className="flex items-start gap-3">
        <div className="text-2xl">{announcement.icon}</div>
        <div>
          <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100">{announcement.title}</h4>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{announcement.body}</p>
          <p className="mt-2 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {announcement.date}
          </p>
          {announcement.link ? (
            <a
              href={announcement.link}
              className="mt-3 inline-flex items-center text-xs font-semibold text-primary-600 hover:text-primary-500 dark:text-primary-300"
            >
              View details →
            </a>
          ) : null}
        </div>
      </div>
    </article>
  )
}
