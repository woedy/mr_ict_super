import { useState } from 'react'
import { Avatar } from '../components/Avatar'
import { useStudentJourney } from '../context/StudentJourneyContext'

export function ProfilePage() {
  const { student } = useStudentJourney()
  const [bio, setBio] = useState(
    'Interactive coding student passionate about inclusive design and telling technology stories for Ghanaian classrooms.',
  )

  if (!student) {
    return null
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900/80 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Avatar name={student.fullName} src={student.avatarUrl} size="lg" />
          <div>
            <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">{student.fullName}</h1>
            <p className="text-sm text-slate-600 dark:text-slate-300">{student.location}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{student.school}</p>
          </div>
        </div>
        <div className="rounded-3xl border border-primary-400/60 bg-primary-500/10 px-6 py-4 text-sm text-primary-600 dark:border-primary-300/60 dark:text-primary-200">
          Track: {student.track} · Preferred mode: {student.preferredMode}
        </div>
      </header>
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900/80">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">About</h2>
            <textarea
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              rows={4}
              className="mt-3 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-inner focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Learning preferences</h2>
            <dl className="mt-3 grid gap-4 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-2">
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Language</dt>
                <dd className="text-base font-semibold text-slate-900 dark:text-slate-100">{student.language}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Availability</dt>
                <dd className="text-base font-semibold text-slate-900 dark:text-slate-100">{student.availability}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Accessibility needs</dt>
                <dd className="mt-1 flex flex-wrap gap-2">
                  {student.accessibility.map((item) => (
                    <span key={item} className="rounded-full bg-primary-500/10 px-3 py-1 text-xs font-semibold text-primary-600 dark:text-primary-200">
                      {item}
                    </span>
                  ))}
                </dd>
              </div>
            </dl>
          </div>
        </div>
        <aside className="space-y-6 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900/80">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Interests</h2>
            <ul className="mt-2 space-y-2 text-sm text-slate-600 dark:text-slate-300">
              {student.interests.map((interest) => (
                <li key={interest} className="rounded-3xl border border-slate-200 bg-white/80 p-3 dark:border-slate-700 dark:bg-slate-900/70">
                  {interest}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-dashed border-primary-400/60 bg-primary-500/10 p-5 text-sm text-primary-600 dark:border-primary-300/60 dark:text-primary-200">
            Tip: Share this profile with your mentor to align on goals for your next live studio session.
          </div>
        </aside>
      </section>
    </div>
  )
}
