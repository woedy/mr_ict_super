import type { CommunityThread } from '../data/mockData'
import { Avatar } from './Avatar'

export function CommunityThreadCard({ thread }: { thread: CommunityThread }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm transition hover:border-primary-400/60 dark:border-slate-800 dark:bg-slate-900/60">
      <div className="flex items-start gap-3">
        <Avatar name={thread.author} src={thread.avatar} size="sm" />
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{thread.title}</h3>
            <span className="rounded-full bg-primary-500/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-primary-600 dark:text-primary-200">
              {thread.replies} replies
            </span>
          </div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {thread.courseId} · {thread.lastActivity}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-300">{thread.excerpt}</p>
          <div className="flex flex-wrap gap-2 text-xs text-primary-500 dark:text-primary-200">
            {thread.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-primary-500/10 px-2 py-1">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  )
}
