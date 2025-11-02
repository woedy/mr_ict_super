import { useState } from 'react'
import { practiceChallenges } from '../data/mockData'

const starterCode = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Innovation Hub Grid</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <section class="hero">
      <h1>Afrofuturist Innovation Hub</h1>
      <p>Spotlight projects from Cape Coast & Tamale clubs.</p>
      <button>Join showcase</button>
    </section>
  </body>
</html>`

export function SandboxPage() {
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'output'>('html')
  const [code] = useState(starterCode)

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="space-y-6 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900/80">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-primary-500">Interactive sandbox</p>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Studio: Design a School Landing Page Grid</h1>
          </div>
          <div className="flex gap-2 text-xs">
            <button className="rounded-full border border-slate-200 px-4 py-2 font-semibold text-slate-600 transition hover:border-primary-400 hover:text-primary-600 dark:border-slate-700 dark:text-slate-300">
              Reset files
            </button>
            <button className="rounded-full bg-primary-500 px-4 py-2 font-semibold text-white shadow-glow transition hover:bg-primary-400">
              Run with tests
            </button>
          </div>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-slate-950 p-4 text-sm text-slate-200 shadow-inner dark:border-slate-700">
          <div className="flex gap-2 pb-3">
            {['html', 'css', 'output'].map((tab) => (
              <button
                key={tab}
                className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                  activeTab === tab
                    ? 'bg-primary-500 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-primary-500/20 hover:text-primary-200'
                }`}
                onClick={() => setActiveTab(tab as typeof activeTab)}
              >
                {tab}
              </button>
            ))}
          </div>
          <pre className="mt-3 h-64 overflow-auto rounded-2xl bg-slate-900/70 p-4 text-xs">
            {activeTab === 'html' ? code : null}
            {activeTab === 'css'
              ? `:root {\n  --accent: #ffb151;\n}\n\n.hero {\n  display: grid;\n  place-items: start;\n  padding: 4rem;\n  background: linear-gradient(135deg, #1f8f7a, #ffb151);\n  color: #fff;\n}\n\n.hero button {\n  background: #fff;\n  color: #1f8f7a;\n  border-radius: 9999px;\n  padding: 0.75rem 1.5rem;\n}`
              : null}
            {activeTab === 'output'
              ? `Preview your layout here. Imagine the live reload with your African-inspired gradients and typography.`
              : null}
          </pre>
        </div>
        <div className="grid gap-4 text-sm text-slate-600 dark:text-slate-300 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-inner dark:border-slate-700 dark:bg-slate-900/70">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Tests expected</h2>
            <ul className="mt-3 space-y-2 text-xs">
              <li>✓ Layout uses CSS Grid with responsive columns</li>
              <li>✓ Buttons have accessible hover and focus states</li>
              <li>✓ Provide offline-friendly assets under 200 KB</li>
            </ul>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-inner dark:border-slate-700 dark:bg-slate-900/70">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Mentor tip</h2>
            <p className="mt-2 text-xs">
              “Design for crowded ICT labs. Use large hit targets, high-contrast text, and supportive Twi/English copy.”
            </p>
          </div>
        </div>
      </section>
      <aside className="space-y-6 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900/80">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Recommended practice</h2>
        <div className="space-y-4">
          {practiceChallenges.map((challenge) => (
            <div key={challenge.id} className="rounded-3xl border border-slate-200 bg-white/80 p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary-500">{challenge.difficulty} • {challenge.estimatedMinutes} mins</p>
              <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">{challenge.title}</p>
              <p className="mt-1 text-xs">{challenge.description}</p>
            </div>
          ))}
        </div>
        <div className="rounded-3xl border border-dashed border-primary-400/60 bg-primary-500/10 p-5 text-sm text-primary-600 dark:border-primary-300/60 dark:text-primary-200">
          Ready to publish? Upload your assets for mentor review and share with your ICT club.
        </div>
      </aside>
    </div>
  )
}
