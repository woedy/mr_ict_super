import { AnnouncementCard } from '../components/AnnouncementCard'
import { CommunityThreadCard } from '../components/CommunityThreadCard'
import { announcements, communityThreads } from '../data/mockData'

export function CommunityPage() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="space-y-6 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900/80">
        <header className="space-y-3">
          <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">Community studio</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Share wins, ask for feedback, and celebrate inclusive ICT storytelling across Ghana and Africa.
          </p>
        </header>
        <div className="space-y-4">
          {communityThreads.map((thread) => (
            <CommunityThreadCard key={thread.id} thread={thread} />
          ))}
        </div>
      </section>
      <aside className="space-y-6 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900/80">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Announcements</h2>
          {announcements.map((announcement) => (
            <AnnouncementCard key={announcement.id} announcement={announcement} />
          ))}
        </div>
        <div className="rounded-3xl border border-dashed border-primary-400/60 bg-primary-500/10 p-5 text-sm text-primary-600 dark:border-primary-300/60 dark:text-primary-200">
          Hosting an ICT club showcase? Share details so mentors can join virtually.
        </div>
      </aside>
    </div>
  )
}
