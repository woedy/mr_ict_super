import { ArrowRightIcon, PlayIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'
import { ThemeToggle } from '../components/ThemeToggle'

const features = [
  {
    title: 'Interactive video lessons crafted across Ghana and Africa',
    description:
      'Follow mentors from Accra to Tamale and beyond as they pair code walkthroughs with storytelling and community projects.',
  },
  {
    title: 'Offline friendly student journeys',
    description:
      'Download lesson bundles, sync progress when you reconnect, and keep your ICT club learning anywhere.',
  },
  {
    title: 'Project-based portfolio challenges',
    description: 'Produce real artefacts for NSS placement and community innovation fairs.',
  },
]

const testimonials = [
  {
    quote:
      '“Mr ICT helped our girls club storyboard their first coding lesson in Twi. The interactive playback made revision fun.”',
    name: 'Adwoa Addai',
    role: 'ICT Coach · Kumasi Girls SHS',
  },
  {
    quote: '“The sandbox challenges mirror local exams but feel like creative studio time. My NSS supervisor is impressed.”',
    name: 'Kojo Ahiable',
    role: 'Student · Koforidua Technical University',
  },
]

export function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-500 text-lg font-semibold text-white">
            ICT
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">Mr ICT</p>
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">Student</p>
          </div>
        </Link>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link
            to="/signin"
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-primary-400 hover:text-primary-600 dark:border-slate-700 dark:text-slate-300"
          >
            Sign in
          </Link>
          <Link
            to="/signup"
            className="hidden rounded-full bg-primary-500 px-4 py-2 text-sm font-semibold text-white shadow-glow transition hover:bg-primary-400 sm:block"
          >
            Create free account
          </Link>
        </div>
      </header>
      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-accent-500/5 to-transparent" />
          <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-16 lg:flex-row lg:items-center">
            <div className="w-full space-y-6 lg:w-1/2">
              <span className="inline-flex items-center rounded-full bg-primary-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-600 dark:text-primary-200">
                Made in Ghana for Africa · Interactive coding studio
              </span>
              <h1 className="text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl">
                Empower ICT students with immersive coding stories.
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300">
                Experience interactive video walkthroughs, local mentors, and collaborative sandboxes designed for JHS and SHS labs,
                university cohorts, and community learning hubs across Ghana and Africa.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-2 rounded-full bg-primary-500 px-6 py-3 text-sm font-semibold text-white shadow-glow transition hover:bg-primary-400"
                >
                  Join the beta cohort
                  <ArrowRightIcon className="h-5 w-5" />
                </Link>
                <Link
                  to="/signin"
                  className="inline-flex items-center gap-2 rounded-full border border-primary-500 px-6 py-3 text-sm font-semibold text-primary-600 transition hover:bg-primary-50 dark:border-primary-300 dark:text-primary-200"
                >
                  Preview the journey
                  <PlayIcon className="h-5 w-5" />
                </Link>
              </div>
              <dl className="grid grid-cols-2 gap-6 text-sm text-slate-500 dark:text-slate-300 sm:grid-cols-4">
                <div>
                  <dt className="font-semibold text-slate-900 dark:text-slate-100">120+</dt>
                  <dd>Interactive lessons</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-900 dark:text-slate-100">35</dt>
                  <dd>Student-built projects</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-900 dark:text-slate-100">18</dt>
                  <dd>Partner schools & hubs</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-900 dark:text-slate-100">∞</dt>
                  <dd>Inspiration from Africa</dd>
                </div>
              </dl>
            </div>
            <div className="relative w-full lg:w-1/2">
              <div className="rounded-[2.5rem] bg-slate-900/90 p-6 text-white shadow-2xl shadow-primary-500/20">
                <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/80 p-6">
                  <p className="text-sm uppercase tracking-widest text-primary-200">Demo playback</p>
                  <h2 className="mt-3 text-2xl font-semibold">Narrating code and culture</h2>
                  <p className="mt-3 text-sm text-slate-300">
                    Students remix a landing page for a Cape Coast innovation hub while their mentor pauses the video to explain
                    CSS layouts and highlight offline-first options.
                  </p>
                  <div className="mt-6 space-y-4">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-widest text-primary-200">Step 4 · Live coding</p>
                      <p className="mt-2 text-sm text-slate-200">
                        “Notice how we optimise media for labs where Wi-Fi blinks. Use `loading=\"lazy\"` and fallback copy in
                        Twi.”
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-widest text-primary-200">Code snapshot</p>
                      <pre className="mt-2 overflow-x-auto rounded-xl bg-slate-950/70 p-4 text-xs text-primary-100">
{`<section className="bg-gradient-to-br from-primary-500 via-orange-400 to-amber-300">
  <h2 className="text-2xl font-semibold text-white">
    Innovation hub tour
  </h2>
  <p className="text-white/80">
    Invite parents to experience your students' first interactive lesson.
  </p>
</section>`}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -right-8 bottom-6 hidden w-40 rounded-3xl border border-white/20 bg-white/80 p-4 text-slate-700 shadow-lg dark:bg-slate-900/80 dark:text-slate-200 sm:block">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary-500">Offline pack</p>
                <p className="mt-1 text-sm">Download 3 lessons for ICT Club Friday.</p>
                <div className="mt-2 flex items-center justify-between text-xs">
                  <span>Size</span>
                  <span>120 MB</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">Designed for JHS and SHS classrooms.</h2>
              <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
                Mr ICT Student blends design thinking, cultural inspiration, and empathy for bandwidth realities so every learner
                can join the story.
              </p>
              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                {features.map((feature) => (
                  <div key={feature.title} className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{feature.title}</h3>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-dashed border-primary-400/50 bg-primary-500/5 p-8 shadow-inner">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">How the journey flows</h3>
              <ol className="mt-6 space-y-4 text-sm text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-3">
                  <span className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary-500 text-xs font-bold text-white">
                    1
                  </span>
                  <p>
                    Create your student profile, share accessibility needs, and pick a preferred learning language.
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary-500 text-xs font-bold text-white">
                    2
                  </span>
                  <p>
                    Onboard with the interactive primer to understand the coding timeline player and offline packs.
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary-500 text-xs font-bold text-white">
                    3
                  </span>
                  <p>
                    Dive into the dashboard to resume your lesson, join a study circle, or practise in the sandbox.
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary-500 text-xs font-bold text-white">
                    4
                  </span>
                  <p>Collect XP, badges, and community kudos as you publish projects for innovation fairs.</p>
                </li>
              </ol>
              <Link
                to="/signup"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary-500 px-6 py-3 text-sm font-semibold text-white shadow-glow transition hover:bg-primary-400"
              >
                Start your story today
                <ArrowRightIcon className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 py-16 text-white">
          <div className="mx-auto grid max-w-6xl gap-8 px-6 md:grid-cols-2">
            {testimonials.map((testimonial) => (
              <figure key={testimonial.name} className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl">
                <blockquote className="text-lg leading-relaxed">{testimonial.quote}</blockquote>
                <figcaption className="mt-4 text-sm uppercase tracking-wide text-primary-200">
                  {testimonial.name} · {testimonial.role}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      </main>
      <footer className="border-t border-slate-200 bg-white/70 py-6 text-center text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-950/90 dark:text-slate-400">
        Made in Ghana for Africa · Celebrating digital literacy for JHS and SHS students
      </footer>
    </div>
  )
}
