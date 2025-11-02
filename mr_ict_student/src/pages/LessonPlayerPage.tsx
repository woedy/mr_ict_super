import { useEffect, useMemo, useRef, useState } from 'react'
import { Editor } from '@monaco-editor/react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { useStudentJourney } from '../context/StudentJourneyContext'
import { useTheme } from '../context/ThemeContext'
import { courses, type LessonVersionMarker } from '../data/mockData'

const DEFAULT_INTERACTIVE_HTML = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Sunrise Learning Hub</title>
    <style>
      :root {
        color-scheme: light dark;
        font-family: 'Poppins', system-ui, sans-serif;
      }
      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        padding: 64px 24px;
        background: radial-gradient(circle at 12% 18%, rgba(59, 130, 246, 0.12), transparent 60%),
          radial-gradient(circle at 88% 12%, rgba(244, 114, 182, 0.16), transparent 55%),
          #0f172a;
        color: #f8fafc;
      }
      main {
        width: min(960px, 92vw);
        border-radius: 32px;
        padding: clamp(32px, 5vw, 56px);
        background: rgba(15, 23, 42, 0.86);
        border: 1px solid rgba(148, 163, 184, 0.25);
        box-shadow: 0 40px 120px rgba(15, 23, 42, 0.55);
      }
      h1 {
        margin: 0 0 12px;
        font-size: clamp(2.4rem, 5vw, 3.6rem);
        letter-spacing: -0.03em;
      }
      p {
        margin: 0;
        font-size: 1.05rem;
        line-height: 1.7;
        color: rgba(226, 232, 240, 0.88);
        max-width: 62ch;
      }
      .cta {
        margin-top: 2.75rem;
        display: inline-flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.85rem 1.8rem;
        border-radius: 999px;
        background: linear-gradient(135deg, #f97316, #facc15);
        color: #0f172a;
        font-weight: 600;
        text-decoration: none;
        box-shadow: 0 28px 55px rgba(249, 115, 22, 0.35);
      }
    </style>
  </head>
  <body>
    <main>
      <h1>Prototype an ICT Club Welcome Board</h1>
      <p>
        Remix the hero section with bold colour, Twi-friendly typography, and an offline notice so every student feels invited
        into your creative lab.
      </p>
      <a class="cta" href="#">Preview Kwame's build →</a>
    </main>
  </body>
</html>
`

const DEFAULT_VERSION_MARKERS: LessonVersionMarker[] = [
  { id: 'layout', label: 'Layout inspiration', timecode: '00:18', position: 12, type: 'comment' },
  { id: 'structure', label: 'HTML scaffold', timecode: '02:05', position: 34, type: 'commit' },
  { id: 'palette', label: 'Palette swap', timecode: '04:22', position: 57, type: 'commit' },
  { id: 'checkpoint', label: 'Checkpoint save', timecode: '06:31', position: 81, type: 'checkpoint' },
]

const markerStyles: Record<LessonVersionMarker['type'], string> = {
  comment: 'bg-amber-400 shadow-[0_0_18px_rgba(251,191,36,0.45)]',
  commit: 'bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.45)]',
  checkpoint: 'bg-sky-400 shadow-[0_0_18px_rgba(56,189,248,0.45)]',
}

function parseDurationToSeconds(duration: string | undefined) {
  if (!duration) return 0
  const [minutes, seconds] = duration.split(':').map((value) => Number.parseInt(value, 10))
  if (Number.isNaN(minutes) || Number.isNaN(seconds)) {
    return 0
  }
  return minutes * 60 + seconds
}

function formatSeconds(value: number) {
  const minutes = Math.floor(value / 60)
  const seconds = Math.max(0, Math.floor(value % 60))
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export function LessonPlayerPage() {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>()
  const navigate = useNavigate()
  const { recordLessonView } = useStudentJourney()
  const { theme } = useTheme()

  const { course, lesson, moduleIndex, lessonIndex } = useMemo(() => {
    const course = courses.find((item) => item.id === courseId)
    const moduleIndex = course?.modules.findIndex((module) => module.lessons.some((lesson) => lesson.id === lessonId)) ?? -1
    const currentModule = moduleIndex >= 0 ? course?.modules[moduleIndex] : undefined
    const lessonIndex = currentModule?.lessons.findIndex((item) => item.id === lessonId) ?? -1
    const lesson = lessonIndex >= 0 ? currentModule?.lessons[lessonIndex] : undefined
    return { course, lesson, moduleIndex, lessonIndex }
  }, [courseId, lessonId])

  const baseInteractiveCode = useMemo(() => lesson?.interactiveCode ?? DEFAULT_INTERACTIVE_HTML, [lesson?.interactiveCode])
  const versionMarkers = useMemo(
    () => (lesson?.versionMarkers && lesson.versionMarkers.length > 0 ? lesson.versionMarkers : DEFAULT_VERSION_MARKERS),
    [lesson?.versionMarkers, lesson?.id],
  )

  const previewImage = lesson?.previewImage ?? course?.heroImage

  const [code, setCode] = useState(baseInteractiveCode)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playerState, setPlayerState] = useState<'playing' | 'paused'>('paused')
  const [progress, setProgress] = useState(0)
  const [activeMarker, setActiveMarker] = useState<LessonVersionMarker | null>(null)
  const [activeFile, setActiveFile] = useState<'index.html' | 'styles.css' | 'notes'>('index.html')
  const [videoWindow, setVideoWindow] = useState({ minimized: false, fullscreen: false, x: 24, y: 400, width: 360, height: 240 })
  const [previewWindow, setPreviewWindow] = useState({ minimized: false, fullscreen: false, x: 800, y: 100, width: 480, height: 360 })
  const [isDraggingVideo, setIsDraggingVideo] = useState(false)
  const [isDraggingPreview, setIsDraggingPreview] = useState(false)
  const [isResizingPreview, setIsResizingPreview] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [showSubtitles, setShowSubtitles] = useState(true)

  const seekBarRef = useRef<HTMLDivElement>(null)
  const totalSeconds = useMemo(() => parseDurationToSeconds(lesson?.duration), [lesson?.duration])

  useEffect(() => {
    setCode(baseInteractiveCode)
  }, [baseInteractiveCode])

  useEffect(() => {
    const firstMarker = versionMarkers[0] ?? null
    setActiveMarker(firstMarker)
    setProgress(firstMarker?.position ?? 0)
    setPlayerState('paused')
    setIsPlaying(false)
    setActiveFile('index.html')
  }, [lesson?.id, versionMarkers])

  useEffect(() => {
    if (playerState !== 'playing') return

    const interval = window.setInterval(() => {
      setProgress((current) => {
        const next = Math.min(current + 0.6, 100)
        if (next >= 100) {
          window.clearInterval(interval)
          setPlayerState('paused')
        }
        return next
      })
    }, 180)

    return () => {
      window.clearInterval(interval)
    }
  }, [playerState])

  useEffect(() => {
    if (!versionMarkers.length) return
    const candidate = versionMarkers.reduce<LessonVersionMarker | null>((acc, marker) => {
      if (marker.position <= progress + 0.5) {
        return marker
      }
      return acc
    }, versionMarkers[0] ?? null)
    if (candidate && candidate.id !== activeMarker?.id) {
      setActiveMarker(candidate)
    }
  }, [progress, versionMarkers, activeMarker?.id])

  useEffect(() => {
    const { body } = document
    const previousOverflow = body.style.overflow
    if (isPlaying) {
      body.style.overflow = 'hidden'
    } else {
      body.style.overflow = previousOverflow
    }
    return () => {
      body.style.overflow = previousOverflow
    }
  }, [isPlaying])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingVideo) {
        setVideoWindow((s) => ({ ...s, x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y }))
      }
      if (isDraggingPreview) {
        setPreviewWindow((s) => ({ ...s, x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y }))
      }
      if (isResizingPreview) {
        setPreviewWindow((s) => ({
          ...s,
          width: Math.max(320, e.clientX - s.x),
          height: Math.max(240, e.clientY - s.y),
        }))
      }
    }

    const handleMouseUp = () => {
      setIsDraggingVideo(false)
      setIsDraggingPreview(false)
      setIsResizingPreview(false)
    }

    if (isDraggingVideo || isDraggingPreview || isResizingPreview) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDraggingVideo, isDraggingPreview, isResizingPreview, dragOffset])

  const handleMarkerSelect = (marker: LessonVersionMarker) => {
    setProgress(marker.position)
    setActiveMarker(marker)
    setPlayerState('paused')
  }

  const renderActiveFile = () => {
    if (activeFile === 'index.html') return code
    if (activeFile === 'styles.css') {
      return `body {\n  font-family: 'Poppins', sans-serif;\n  margin: 0;\n  background: radial-gradient(circle at 12% 18%, rgba(59,130,246,0.12), transparent 60%),\n    radial-gradient(circle at 88% 12%, rgba(244,114,182,0.16), transparent 55%),\n    #0f172a;\n  color: #f8fafc;\n}\n`
    }
    return `## Reflection Notes\n- Pair with Mentor Esi\n- Capture your layout ideas\n- Share progress clips`
  }

  const activeLanguage = activeFile === 'styles.css' ? 'css' : activeFile === 'notes' ? 'markdown' : 'html'

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

  const handlePlayRequest = () => {
    setIsPlaying(true)
    setPlayerState('playing')
    setProgress(0)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSeek = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!seekBarRef.current) return
    const rect = seekBarRef.current.getBoundingClientRect()
    const ratio = (event.clientX - rect.left) / rect.width
    const clamped = Math.min(Math.max(ratio, 0), 1)
    setProgress(clamped * 100)
    setPlayerState('paused')
  }

  if (isPlaying) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-50">
        <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-6 dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.32em] text-slate-600 dark:text-slate-400">
            <Link
              to={`/courses/${course.id}`}
              className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-medium uppercase tracking-[0.28em] text-slate-600 transition hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
            >
              ← Back to lessons
            </Link>
            <button
              type="button"
              onClick={() => setIsPlaying(false)}
              className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-medium uppercase tracking-[0.28em] text-slate-600 transition hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
            >
              ← Exit lesson studio
            </button>
            <span>{course.title}</span>
            <span className="text-slate-400 dark:text-slate-600">/</span>
            <span>{lesson.title}</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400">
            <span className="inline-flex items-center gap-2">
              <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              Autosave synced
            </span>
            <button
              type="button"
              onClick={handleComplete}
              className="rounded-full bg-primary-500 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.32em] text-white shadow-lg transition hover:bg-primary-400"
            >
              Mark complete
            </button>
          </div>
        </header>
        <div className="flex flex-1 overflow-hidden">
          <aside className="hidden w-64 flex-col border-r border-slate-200 bg-slate-100 px-4 py-6 text-xs uppercase tracking-[0.3em] text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 md:flex">
            <h2 className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">Files</h2>
            <nav className="mt-4 space-y-2">
              {[
                { id: 'index.html' as const, label: 'index.html', icon: '' },
                { id: 'styles.css' as const, label: 'styles.css', icon: '' },
                { id: 'notes' as const, label: 'playback.notes', icon: '' },
              ].map((file) => (
                <button
                  key={file.id}
                  type="button"
                  onClick={() => setActiveFile(file.id)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-[13px] font-medium tracking-normal transition ${
                    activeFile === file.id ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300' : 'hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <span className="text-base opacity-60">{file.icon}</span>
                  {file.label}
                </button>
              ))}
            </nav>
            <div className="mt-8 space-y-3 text-[11px] text-slate-600 dark:text-slate-400">
              <div>
                <p className="uppercase tracking-[0.34em] text-slate-500 dark:text-slate-500">Timeline</p>
                <div className="mt-3 space-y-2">
                  {versionMarkers.map((marker) => (
                    <button
                      key={marker.id}
                      type="button"
                      onClick={() => handleMarkerSelect(marker)}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-[12px] font-medium transition ${
                        activeMarker?.id === marker.id ? 'bg-slate-200 text-slate-900 dark:bg-slate-700 dark:text-white' : 'hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      <span>{marker.label}</span>
                      <span className="text-slate-500 dark:text-slate-500">{marker.timecode}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>
          <main className="flex flex-1 flex-col">
            <div className="flex flex-wrap items-center justify-between border-b border-slate-200 bg-slate-100 px-6 py-3 text-xs uppercase tracking-[0.3em] text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setPlayerState((state) => (state === 'playing' ? 'paused' : 'playing'))}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 bg-slate-200 text-base text-slate-700 transition hover:bg-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
                >
                  {playerState === 'playing' ? 'Ⅱ' : '▶'}
                </button>
                <button
                  type="button"
                  onClick={() => setProgress((value) => Math.max(value - 8, 0))}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 bg-slate-200 text-sm text-slate-700 transition hover:bg-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                >
                  «
                </button>
                <button
                  type="button"
                  onClick={() => setProgress((value) => Math.min(value + 8, 100))}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 bg-slate-200 text-sm text-slate-700 transition hover:bg-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                >
                  »
                </button>
                <span className="font-mono tracking-normal text-slate-700 dark:text-slate-300">{formatSeconds(totalSeconds * (progress / 100))}</span>
                <span className="text-slate-500 dark:text-slate-500">/ {lesson.duration}</span>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-semibold">
                <span className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <span className="h-2 w-2 rounded-full bg-amber-400" />
                  {activeMarker ? `${activeMarker.label}` : 'Exploring timeline'}
                </span>
                <span className="rounded-full bg-slate-200 px-3 py-1 text-[10px] uppercase tracking-[0.4em] text-slate-600 dark:bg-slate-700 dark:text-slate-400">
                  Version trail
                </span>
              </div>
            </div>
            <div className="flex flex-1 overflow-hidden">
              <section className="flex flex-1 flex-col">
                <div className="flex items-center gap-4 border-b border-slate-200 bg-slate-100 px-6 py-3 text-sm font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  <span className="uppercase tracking-[0.3em] text-slate-500 dark:text-slate-500">{activeFile}</span>
                </div>
                <div className="flex flex-1 flex-col bg-white dark:bg-slate-900">
                  <Editor
                    value={renderActiveFile()}
                    onChange={(value) => {
                      if (activeFile === 'index.html') {
                        setCode(value ?? '')
                      }
                    }}
                    language={activeLanguage}
                    theme={theme === 'dark' ? 'vs-dark' : 'light'}
                    options={{
                      fontSize: 15,
                      minimap: { enabled: false },
                      automaticLayout: true,
                      readOnly: activeFile !== 'index.html',
                      wordWrap: 'on',
                      smoothScrolling: true,
                      scrollBeyondLastLine: false,
                      padding: { top: 24 },
                    }}
                    loading={<div className="flex h-full items-center justify-center text-sm text-slate-600 dark:text-slate-400">Launching studio…</div>}
                    height="100%"
                  />
                </div>
                <div className="border-t border-slate-200 bg-slate-100 px-6 py-3 dark:border-slate-700 dark:bg-slate-800">
                  <div className="relative">
                    <div
                      ref={seekBarRef}
                      onClick={handleSeek}
                      className="group h-2 w-full cursor-pointer overflow-hidden rounded-full bg-white/10"
                    >
                      <div className="h-full bg-gradient-to-r from-amber-400 via-primary-400 to-sky-500" style={{ width: `${progress}%` }} />
                    </div>
                    {versionMarkers.map((marker) => (
                      <button
                        key={marker.id}
                        type="button"
                        onClick={() => handleMarkerSelect(marker)}
                        className="absolute top-1/2 -translate-y-1/2 group/marker"
                        style={{ left: `${marker.position}%` }}
                        title={`${marker.label} - ${marker.timecode}`}
                      >
                        <div className={`h-3 w-3 -translate-x-1/2 rounded-full ${markerStyles[marker.type]} transition-transform group-hover/marker:scale-125`} />
                      </button>
                    ))}
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[10px] uppercase tracking-[0.4em] text-white/40">
                    <span>Lesson timeline</span>
                    <span>{lesson.duration}</span>
                  </div>
                </div>
              </section>

              {/* Floating Video Window */}
              {!videoWindow.minimized && !videoWindow.fullscreen && (
                <div
                  className="absolute z-30 flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-900/95 shadow-2xl backdrop-blur"
                  style={{
                    left: videoWindow.x,
                    top: videoWindow.y,
                    width: videoWindow.width,
                    height: videoWindow.height,
                    cursor: isDraggingVideo ? 'grabbing' : 'default',
                  }}
                >
                  <div
                    className="flex cursor-grab items-center justify-between border-b border-white/10 px-3 py-2 text-xs text-white/70 active:cursor-grabbing"
                    onMouseDown={(e) => {
                      setIsDraggingVideo(true)
                      setDragOffset({ x: e.clientX - videoWindow.x, y: e.clientY - videoWindow.y })
                    }}
                  >
                    <span className="flex items-center gap-2">
                      <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-rose-400" />
                      Mentor Esi
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setVideoWindow((s) => ({ ...s, minimized: true }))}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/10 text-base text-white/70 transition hover:bg-white/25"
                        aria-label="Minimize video"
                      >
                        –
                      </button>
                      <button
                        type="button"
                        onClick={() => setVideoWindow((s) => ({ ...s, width: s.width === 360 ? 480 : 360, height: s.height === 240 ? 320 : 240 }))}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/10 text-xs text-white/70 transition hover:bg-white/25"
                        aria-label="Resize video"
                      >
                        ⤡
                      </button>
                      <button
                        type="button"
                        onClick={() => setVideoWindow((s) => ({ ...s, fullscreen: true }))}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/10 text-xs text-white/70 transition hover:bg-white/25"
                        aria-label="Fullscreen video"
                      >
                        ⤢
                      </button>
                    </div>
                  </div>
                  <div className="relative flex-1 overflow-hidden bg-slate-950">
                    {previewImage && <img src={previewImage} alt="Mentor feed" className="h-full w-full object-cover" />}
                    <div className="absolute inset-0 bg-slate-950/25" />
                    <button className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur transition hover:bg-white/30">
                      ▶
                    </button>
                  </div>
                </div>
              )}

              {videoWindow.minimized && (
                <button
                  type="button"
                  onClick={() => setVideoWindow((s) => ({ ...s, minimized: false }))}
                  className="absolute bottom-6 left-6 z-30 flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/90 px-4 py-2 text-xs font-medium text-white/80 shadow-xl backdrop-blur transition hover:bg-slate-900/95"
                >
                  ▶ Mentor feed
                </button>
              )}

              {/* Fullscreen Video Window */}
              {videoWindow.fullscreen && (
                <div className="absolute inset-0 z-40 flex flex-col bg-slate-950/98 p-8">
                  <div className="flex items-center justify-between rounded-t-3xl border-b border-white/10 bg-slate-900/60 px-6 py-4 text-sm text-white/70 backdrop-blur">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-2.5 w-2.5 rounded-full bg-rose-400" />
                      Live with Mentor Esi
                    </div>
                    <button
                      type="button"
                      onClick={() => setVideoWindow((s) => ({ ...s, fullscreen: false }))}
                      className="rounded-full border border-white/10 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-white/70 transition hover:bg-white/20"
                    >
                      Exit fullscreen
                    </button>
                  </div>
                  <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-b-3xl">
                    {previewImage && <img src={previewImage} alt="Expanded mentor feed" className="h-full w-full rounded-b-3xl object-cover" />}
                    <div className="absolute inset-0 rounded-b-3xl bg-slate-950/50" />
                    <button className="absolute flex items-center gap-2 rounded-full bg-white/15 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/25">
                      Pause mentor feed
                    </button>
                    <button
                      type="button"
                      onClick={() => setVideoWindow((s) => ({ ...s, fullscreen: false, minimized: true }))}
                      className="absolute bottom-8 left-8 rounded-full border border-white/10 bg-slate-900/90 px-4 py-2 text-xs font-medium text-white/80 shadow-xl backdrop-blur transition hover:bg-slate-900/95"
                    >
                      Minimize
                    </button>
                  </div>
                </div>
              )}

              {/* Floating Preview Window */}
              {!previewWindow.minimized && !previewWindow.fullscreen && (
                <div
                  className="absolute z-20 flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/95 text-slate-800 shadow-2xl backdrop-blur dark:bg-slate-900/95 dark:text-white/80"
                  style={{
                    left: previewWindow.x,
                    top: previewWindow.y,
                    width: previewWindow.width,
                    height: previewWindow.height,
                    cursor: isDraggingPreview ? 'grabbing' : 'default',
                  }}
                >
                  <div
                    className="flex cursor-grab items-center justify-between border-b border-slate-200/60 px-3 py-2 text-xs uppercase tracking-[0.3em] text-slate-500 active:cursor-grabbing dark:border-white/10 dark:text-white/60"
                    onMouseDown={(e) => {
                      setIsDraggingPreview(true)
                      setDragOffset({ x: e.clientX - previewWindow.x, y: e.clientY - previewWindow.y })
                    }}
                  >
                    <span>Browser preview</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setPreviewWindow((s) => ({ ...s, width: s.width === 480 ? 640 : 480, height: s.height === 360 ? 480 : 360 }))}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200/60 bg-white/70 text-[10px] font-semibold text-slate-600 transition hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-white/70"
                        aria-label="Resize preview"
                      >
                        ⟷
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreviewWindow((s) => ({ ...s, fullscreen: true }))}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200/60 bg-white/70 text-xs text-slate-600 transition hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-white/70"
                        aria-label="Fullscreen preview"
                      >
                        ⤢
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreviewWindow((s) => ({ ...s, minimized: true }))}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200/60 bg-white/70 text-base text-slate-600 transition hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-white/70"
                        aria-label="Minimize preview"
                      >
                        –
                      </button>
                    </div>
                  </div>
                  <iframe title="Live HTML preview" className="h-full flex-1 border-0 bg-white dark:bg-slate-950" srcDoc={code} sandbox="allow-same-origin" />
                  <div
                    className="absolute bottom-0 right-0 h-4 w-4 cursor-nwse-resize"
                    onMouseDown={(e) => {
                      e.stopPropagation()
                      setIsResizingPreview(true)
                    }}
                  >
                    <div className="absolute bottom-1 right-1 h-2 w-2 border-b-2 border-r-2 border-slate-400 dark:border-white/40" />
                  </div>
                </div>
              )}

              {/* Fullscreen Preview Window */}
              {previewWindow.fullscreen && (
                <div className="absolute inset-0 z-40 flex flex-col bg-white p-8 dark:bg-slate-950">
                  <div className="flex items-center justify-between rounded-t-3xl border-b border-slate-200 bg-white px-6 py-3 text-sm text-slate-700 shadow-sm dark:border-white/10 dark:bg-slate-900/60 dark:text-white/70">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => window.location.reload()}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-600 transition hover:bg-slate-100 dark:border-white/10 dark:bg-white/10 dark:text-white/70"
                        aria-label="Refresh"
                      >
                        ↻
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreviewWindow((s) => ({ ...s, fullscreen: false }))}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-600 transition hover:bg-slate-100 dark:border-white/10 dark:bg-white/10 dark:text-white/70"
                        aria-label="Back"
                      >
                        ←
                      </button>
                      <div className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-xs font-mono text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-white/50">
                        localhost:3000/preview
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPreviewWindow((s) => ({ ...s, fullscreen: false }))}
                      className="rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-slate-600 transition hover:bg-slate-100 dark:border-white/10 dark:bg-white/10 dark:text-white/70"
                    >
                      Exit fullscreen
                    </button>
                  </div>
                  <div className="flex-1 overflow-hidden rounded-b-3xl border border-t-0 border-slate-200 bg-white dark:border-white/10 dark:bg-slate-950">
                    <iframe title="Fullscreen HTML preview" className="h-full w-full border-0 bg-white dark:bg-slate-950" srcDoc={code} sandbox="allow-same-origin" />
                  </div>
                </div>
              )}

              {previewWindow.minimized && (
                <button
                  type="button"
                  onClick={() => setPreviewWindow((s) => ({ ...s, minimized: false }))}
                  className="absolute bottom-6 right-6 z-20 flex items-center gap-2 rounded-full border border-white/10 bg-white/90 px-4 py-2 text-xs font-semibold text-slate-700 shadow-xl backdrop-blur transition hover:bg-white dark:bg-slate-900/90 dark:text-white/80"
                >
                  ⧉ Open preview
                </button>
              )}

              {/* Subtitle Component */}
              {showSubtitles && activeMarker && (
                <div className="absolute bottom-20 left-1/2 z-10 flex max-w-3xl -translate-x-1/2 flex-col items-center gap-2">
                  <div className="rounded-2xl border border-white/10 bg-slate-950/90 px-6 py-3 text-center shadow-2xl backdrop-blur">
                    <p className="text-sm font-medium leading-relaxed text-white/90">
                      {activeMarker.label === 'Layout inspiration' && 'Start by exploring the layout structure—notice how the hero section uses flexbox to center content.'}
                      {activeMarker.label === 'HTML scaffold' && 'Build the semantic HTML structure with header, main, and footer elements for accessibility.'}
                      {activeMarker.label === 'Palette swap' && 'Experiment with African-inspired colors—try warm oranges and deep blues to reflect local culture.'}
                      {activeMarker.label === 'Checkpoint save' && 'Great progress! Your layout is taking shape. Save this version before moving to advanced styling.'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowSubtitles(false)}
                    className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium text-white/70 backdrop-blur transition hover:bg-white/20"
                  >
                    Hide subtitles
                  </button>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    )
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
        <div className="space-y-6">
          <section className="space-y-6 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900/90">
            <header className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-primary-500">Module {moduleIndex + 1} · Lesson {lessonIndex + 1}</p>
                <h1 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">{lesson.title}</h1>
                <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300">{lesson.summary}</p>
              </div>
              <div className="flex flex-col items-start gap-2 text-xs text-slate-500 dark:text-slate-300 sm:items-end">
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200/70 px-3 py-1.5 font-medium dark:border-white/10">
                  <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                  Autosave ready
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200/70 px-3 py-1.5 font-medium dark:border-white/10">
                  <span className="inline-flex h-2 w-2 rounded-full bg-primary-400" />
                  Pairing with Mentor Esi
                </span>
              </div>
            </header>
            {!isPlaying ? (
              <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-900 shadow-xl dark:border-slate-700">
                {previewImage && (
                  <img src={previewImage} alt="Lesson preview" className="h-full w-full object-cover opacity-70" />
                )}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/40 via-transparent to-slate-950/80" />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-white">
                  <button
                    type="button"
                    onClick={handlePlayRequest}
                    className="flex h-20 w-20 items-center justify-center rounded-full bg-white/10 text-3xl font-semibold text-white backdrop-blur transition hover:bg-white/25"
                  >
                    ▶
                  </button>
                  <p className="text-sm uppercase tracking-[0.38em] text-white/70">Launch interactive lesson</p>
                  <div className="flex items-center gap-3 rounded-full bg-white/10 px-5 py-2 text-xs uppercase tracking-[0.35em] text-white/60">
                    <span>Video · Code · Preview</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-2xl border border-slate-200/70 bg-slate-950 text-white shadow-2xl dark:border-slate-700/80">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3 text-xs uppercase tracking-[0.28em] text-white/60">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-white/10 px-3 py-1 font-medium text-white">index.html</span>
                      <span className="rounded-full bg-white/5 px-3 py-1 font-medium text-white/80">styles.css</span>
                      <span className="rounded-full bg-white/5 px-3 py-1 font-medium text-white/80">playback.notes</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1 font-medium text-emerald-300">
                        <span className="inline-flex h-2 w-2 rounded-full bg-emerald-300" />
                        Synced to studio cloud
                      </span>
                      <span className="inline-flex items-center gap-2 text-xs text-white/60">
                        <span className="inline-flex h-2 w-2 rounded-full bg-sky-400" />
                        Version trail active
                      </span>
                    </div>
                  </div>
                  <div className="space-y-4 px-4 pb-4 pt-5">
                    <div className="flex flex-wrap items-center justify-between gap-3 text-xs uppercase tracking-[0.24em] text-white/60">
                      <div className="flex items-center gap-3 text-sm font-medium">
                        <button
                          type="button"
                          onClick={() => setPlayerState((state) => (state === 'playing' ? 'paused' : 'playing'))}
                          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-base text-white transition hover:bg-white/15"
                        >
                          {playerState === 'playing' ? 'II' : '▶'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setProgress((value) => Math.max(value - 8, 0))}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs font-semibold text-white/80 transition hover:bg-white/15"
                        >
                          «
                        </button>
                        <button
                          type="button"
                          onClick={() => setProgress((value) => Math.min(value + 8, 100))}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs font-semibold text-white/80 transition hover:bg-white/15"
                        >
                          »
                        </button>
                        <span className="font-mono text-xs text-white/70">{formatSeconds(totalSeconds * (progress / 100))}</span>
                        <span className="text-white/40">/</span>
                        <span className="font-mono text-xs text-white/50">{lesson.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-medium text-white/60">
                        <span className="inline-flex h-2 w-2 rounded-full bg-amber-300" />
                        {activeMarker ? `${activeMarker.label} · ${activeMarker.timecode}` : 'Exploring timeline'}
                      </div>
                    </div>
                    <div className="relative">
                      <div
                        ref={seekBarRef}
                        onClick={handleSeek}
                        className="group h-2 w-full cursor-pointer overflow-hidden rounded-full bg-white/10"
                      >
                        <div
                          className="h-full bg-gradient-to-r from-amber-400 via-primary-400 to-sky-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      {versionMarkers.map((marker) => (
                        <button
                          key={marker.id}
                          type="button"
                          title={`${marker.label} – ${marker.timecode}`}
                          onClick={() => handleMarkerSelect(marker)}
                          className={`absolute -top-1.5 h-4 w-4 rounded-full border border-white/70 transition hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${markerStyles[marker.type]}`}
                          style={{ left: `calc(${marker.position}% - 8px)` }}
                        >
                          <span className="sr-only">Jump to {marker.label}</span>
                        </button>
                      ))}
                    </div>
                    {activeMarker && (
                      <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-white/70">
                        <div className="flex items-center gap-3">
                          <span className={`inline-flex h-3 w-3 rounded-full ${markerStyles[activeMarker.type]}`} />
                          <span className="font-semibold tracking-wide text-white/80">{activeMarker.label}</span>
                        </div>
                        <span className="font-mono text-white/60">{activeMarker.timecode}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="relative h-[520px] overflow-hidden rounded-2xl border border-white/10 bg-slate-950/85 shadow-[0_40px_120px_rgba(15,23,42,0.65)]">
                  <Editor
                    value={code}
                    onChange={(value) => setCode(value ?? '')}
                    language="html"
                    theme={theme === 'dark' ? 'vs-dark' : 'vs-light'}
                    options={{
                      fontSize: 15,
                      fontFamily: "'Fira Code', 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas",
                      minimap: { enabled: false },
                      smoothScrolling: true,
                      automaticLayout: true,
                      wordWrap: 'on',
                      scrollBeyondLastLine: false,
                      padding: { top: 24 },
                    }}
                    loading={<div className="flex h-full items-center justify-center text-sm text-white/60">Loading editor…</div>}
                    height="100%"
                  />
                </div>
              </div>
            )}
          </section>
          <section className="space-y-4 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-inner dark:border-slate-800 dark:bg-slate-900/80">
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
                  Code along to build the hero layout with responsive columns that adapt to projector or phone screens.
                </p>
              </li>
              <li className="rounded-2xl border border-slate-200 bg-white/80 p-4 dark:border-slate-700 dark:bg-slate-900/60">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary-500">Step 3 · Reflection</p>
                <p className="mt-2">
                  Capture your aha moments and how you might remix this layout for your school club website.
                </p>
              </li>
            </ol>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 text-sm text-slate-600 shadow-inner dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Code snapshot</h2>
            <pre className="mt-3 max-h-[320px] overflow-x-auto overflow-y-auto rounded-2xl bg-slate-950/80 p-4 text-xs text-primary-200">
{code}
            </pre>
            <button
              onClick={handleComplete}
              className="mt-4 rounded-full bg-primary-500 px-5 py-2 text-sm font-semibold text-white shadow-glow transition hover:bg-primary-400"
            >
              Mark step complete
            </button>
          </section>
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
