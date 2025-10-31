import { useMemo } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useStudentJourney } from '../context/StudentJourneyContext'
import { courses } from '../data/mockData'

export function LessonPlayerPage() {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>()
  const navigate = useNavigate()
  const { recordLessonView } = useStudentJourney()

  const { course, lesson, moduleIndex, lessonIndex } = useMemo(() => {
    const course = courses.find((item) => item.id === courseId)
    const moduleIndex = course?.modules.findIndex((module) => module.lessons.some((lesson) => lesson.id === lessonId)) ?? -1
    const currentModule = moduleIndex >= 0 ? course?.modules[moduleIndex] : undefined
    const lessonIndex = currentModule?.lessons.findIndex((item) => item.id === lessonId) ?? -1
    const lesson = lessonIndex >= 0 ? currentModule?.lessons[lessonIndex] : undefined
    return { course, lesson, moduleIndex, lessonIndex }
  }, [courseId, lessonId])

  if (!course || !lesson) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white/80 p-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-300">
        We couldn’t load this lesson.{' '}
        <Link to={`/courses/${courseId ?? ''}`} className="font-semibold text-primary-600">
          Return to course overview
        </Link>
        .
      </div>
    )
  }

  const currentModule = course.modules[moduleIndex]
  const nextLesson = currentModule.lessons[lessonIndex + 1] ?? course.modules[moduleIndex + 1]?.lessons[0]

  const handleComplete = () => {
    recordLessonView(course.id, lesson.id, 100)
    if (nextLesson) {
      navigate(`/courses/${course.id}/lessons/${nextLesson.id}`)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
        <Link to="/dashboard" className="text-primary-600 hover:text-primary-500">
          Dashboard
        </Link>
        <span>/</span>
        <Link to={`/courses/${course.id}`} className="text-primary-600 hover:text-primary-500">
          {course.title}
        </Link>
        <span>/</span>
        <span>{lesson.title}</span>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900/90">
          <div className="relative overflow-hidden rounded-[2rem] bg-slate-900">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/40 via-transparent to-slate-950/60" />
            <div className="aspect-video w-full">
              <img
                src={course.heroImage}
                alt="Lesson preview"
                className="h-full w-full rounded-[2rem] object-cover opacity-70"
              />
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white">
              <button className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur transition hover:bg-white/40">
                ▶
              </button>
              <p className="text-sm uppercase tracking-[0.35em]">Interactive playback</p>
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 text-sm text-slate-600 shadow-inner dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300">
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{lesson.title}</h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{lesson.summary}</p>
            <dl className="mt-4 grid grid-cols-2 gap-4 text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
              <div>
                <dt>Duration</dt>
                <dd className="text-sm text-slate-700 dark:text-slate-200">{lesson.duration}</dd>
              </div>
              <div>
                <dt>Lesson type</dt>
                <dd className="text-sm text-slate-700 dark:text-slate-200">{lesson.type}</dd>
              </div>
            </dl>
          </div>
          <div className="space-y-4 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-inner dark:border-slate-700 dark:bg-slate-900/70">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Timeline steps</h2>
            <ol className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <li className="rounded-2xl border border-primary-400/60 bg-primary-500/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary-500">Step 1 · Scene setup</p>
                <p className="mt-2">
                  Meet your mentor Esi inside the innovation lab as she sketches layout ideas with sticky notes and Adinkra symbols.
                </p>
              </li>
              <li className="rounded-2xl border border-slate-200 bg-white/80 p-4 dark:border-slate-700 dark:bg-slate-900/60">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary-500">Step 2 · Live coding</p>
                <p className="mt-2">
                  Code along to build the grid layout with responsive columns that adapt to projector or phone screens.
                </p>
              </li>
              <li className="rounded-2xl border border-slate-200 bg-white/80 p-4 dark:border-slate-700 dark:bg-slate-900/60">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary-500">Step 3 · Reflection</p>
                <p className="mt-2">
                  Capture your aha moments and how you might remix this layout for your school club website.
                </p>
              </li>
            </ol>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 text-sm text-slate-600 shadow-inner dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Code snapshot</h2>
            <pre className="mt-3 overflow-x-auto rounded-2xl bg-slate-950/80 p-4 text-xs text-primary-200">
{`<main className="grid gap-6 md:grid-cols-[2fr_1fr]">
  <article className="rounded-3xl bg-white/80 p-6 shadow">
    <h2 className="text-xl font-semibold text-slate-900">Adinkra-inspired hero</h2>
    <p className="text-sm text-slate-600">Pair vibrant gradients with high contrast text for bright classrooms.</p>
  </article>
  <aside className="rounded-3xl bg-slate-900/80 p-6 text-white">
    <h3 className="text-sm uppercase tracking-wide text-amber-300">Offline Tip</h3>
    <p className="text-sm text-white/80">
      Use ` + '`prefers-reduced-data` media queries to serve lighter imagery.' + `
    </p>
  </aside>
</main>`}
            </pre>
            <button
              onClick={handleComplete}
              className="mt-4 rounded-full bg-primary-500 px-5 py-2 text-sm font-semibold text-white shadow-glow transition hover:bg-primary-400"
            >
              Mark step complete
            </button>
          </div>
        </div>
        <aside className="space-y-6 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900/80">
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Lesson resources</h2>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li className="rounded-2xl border border-slate-200 bg-white/80 p-3 dark:border-slate-700 dark:bg-slate-900/60">
                📄 Worksheet: Grid planning guide
              </li>
              <li className="rounded-2xl border border-slate-200 bg-white/80 p-3 dark:border-slate-700 dark:bg-slate-900/60">
                🎵 Audio recap in Twi (downloadable)
              </li>
              <li className="rounded-2xl border border-slate-200 bg-white/80 p-3 dark:border-slate-700 dark:bg-slate-900/60">
                💡 Peer prompts for your ICT club review
              </li>
            </ul>
          </section>
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Next up</h2>
            {nextLesson ? (
              <Link
                to={`/courses/${course.id}/lessons/${nextLesson.id}`}
                className="flex items-center justify-between rounded-3xl border border-primary-400/60 bg-primary-500/10 p-4 text-sm text-primary-600 transition hover:bg-primary-500/20 dark:border-primary-300/60 dark:text-primary-200"
              >
                <span>{nextLesson.title}</span>
                <span className="text-xs uppercase tracking-wide">{nextLesson.duration}</span>
              </Link>
            ) : (
              <p className="rounded-3xl border border-dashed border-slate-300 bg-white/70 p-4 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300">
                You’ve completed every lesson in this module! Celebrate with your community.
              </p>
            )}
          </section>
        </aside>
      </div>
    </div>
  )
}
