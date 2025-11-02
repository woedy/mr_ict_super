import { useState } from 'react'
import Editor from '@monaco-editor/react'
import { 
  PlayIcon, 
  PauseIcon, 
  StopIcon, 
  VideoCameraIcon,
  MicrophoneIcon,
  BookmarkIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
} from '@heroicons/react/24/outline'
import { useTheme } from '../context/ThemeContext'

type RecordingState = 'idle' | 'recording' | 'paused'
type Marker = {
  id: string
  label: string
  timecode: string
  position: number
}

export function RecordingStudioPage() {
  const { theme } = useTheme()
  const [recordingState, setRecordingState] = useState<RecordingState>('idle')
  const [activeFile, setActiveFile] = useState<'index.html' | 'styles.css' | 'notes'>('index.html')
  const [code, setCode] = useState(`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Interactive Lesson Recording</title>
    <link rel="stylesheet" href="styles.css">
  </head>
  <body>
    <div class="container">
      <h1>Welcome to Mr ICT</h1>
      <p>This is an interactive coding lesson for JHS and SHS students across Ghana and Africa.</p>
      <button class="cta">Start Learning</button>
    </div>
  </body>
</html>`)
  const [css] = useState(`.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

h1 {
  color: #1f8f7a;
  font-size: 2.5rem;
}

.cta {
  background: #1f8f7a;
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 9999px;
  cursor: pointer;
}`)
  const [notes] = useState(`# Lesson Notes

## Learning Objectives
- Understand HTML structure
- Apply CSS styling
- Create interactive elements

## Key Concepts
- Semantic HTML
- CSS selectors
- Responsive design`)

  const [markers, setMarkers] = useState<Marker[]>([
    { id: '1', label: 'Introduction', timecode: '00:00', position: 0 },
    { id: '2', label: 'HTML Structure', timecode: '02:30', position: 25 },
    { id: '3', label: 'CSS Styling', timecode: '05:00', position: 50 },
    { id: '4', label: 'Final Review', timecode: '07:30', position: 75 },
  ])
  const [duration, setDuration] = useState('00:00')
  const [cameraEnabled, setCameraEnabled] = useState(true)
  const [micEnabled, setMicEnabled] = useState(true)

  const handleRecordToggle = () => {
    if (recordingState === 'idle') {
      setRecordingState('recording')
    } else if (recordingState === 'recording') {
      setRecordingState('paused')
    } else {
      setRecordingState('recording')
    }
  }

  const handleStop = () => {
    setRecordingState('idle')
    setDuration('00:00')
  }

  const addMarker = () => {
    const newMarker: Marker = {
      id: Date.now().toString(),
      label: `Marker ${markers.length + 1}`,
      timecode: duration,
      position: Math.random() * 100,
    }
    setMarkers([...markers, newMarker])
  }

  const renderActiveFile = () => {
    if (activeFile === 'index.html') return code
    if (activeFile === 'styles.css') return css
    return notes
  }

  const activeLanguage = activeFile === 'styles.css' ? 'css' : activeFile === 'notes' ? 'markdown' : 'html'

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6 dark:border-slate-700 dark:bg-slate-800">
        <div className="flex items-center gap-4">
          <VideoCameraIcon className="h-6 w-6 text-primary-600" />
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">Recording Studio</h1>
            <p className="text-xs text-slate-600 dark:text-slate-400">Interactive Lesson Recording</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-mono text-slate-600 dark:text-slate-400">{duration}</span>
          <button
            onClick={() => window.history.back()}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            Exit Studio
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 border-r border-slate-200 bg-slate-100 p-4 dark:border-slate-700 dark:bg-slate-800">
          <div className="space-y-6">
            {/* Recording Controls */}
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Recording</h2>
              <div className="mt-3 space-y-2">
                <button
                  onClick={handleRecordToggle}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    recordingState === 'recording'
                      ? 'bg-red-500 text-white'
                      : 'bg-white text-slate-700 hover:bg-slate-50 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
                  }`}
                >
                  {recordingState === 'recording' ? (
                    <><PauseIcon className="h-5 w-5" /> Pause</>
                  ) : (
                    <><PlayIcon className="h-5 w-5" /> {recordingState === 'paused' ? 'Resume' : 'Start'}</>
                  )}
                </button>
                <button
                  onClick={handleStop}
                  disabled={recordingState === 'idle'}
                  className="flex w-full items-center gap-3 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                >
                  <StopIcon className="h-5 w-5" /> Stop
                </button>
              </div>
            </div>

            {/* Input Controls */}
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Inputs</h2>
              <div className="mt-3 space-y-2">
                <button
                  onClick={() => setCameraEnabled(!cameraEnabled)}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    cameraEnabled
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-slate-700 hover:bg-slate-50 dark:bg-slate-700 dark:text-slate-300'
                  }`}
                >
                  <VideoCameraIcon className="h-5 w-5" /> Camera
                </button>
                <button
                  onClick={() => setMicEnabled(!micEnabled)}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    micEnabled
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-slate-700 hover:bg-slate-50 dark:bg-slate-700 dark:text-slate-300'
                  }`}
                >
                  <MicrophoneIcon className="h-5 w-5" /> Microphone
                </button>
              </div>
            </div>

            {/* Files */}
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Files</h2>
              <nav className="mt-3 space-y-2">
                {[
                  { id: 'index.html' as const, label: 'index.html' },
                  { id: 'styles.css' as const, label: 'styles.css' },
                  { id: 'notes' as const, label: 'notes.md' },
                ].map((file) => (
                  <button
                    key={file.id}
                    onClick={() => setActiveFile(file.id)}
                    className={`flex w-full items-center rounded-xl px-4 py-2 text-sm font-medium transition ${
                      activeFile === file.id
                        ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                        : 'hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {file.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Markers */}
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Markers</h2>
                <button
                  onClick={addMarker}
                  className="rounded-lg bg-primary-600 p-1 text-white transition hover:bg-primary-700"
                >
                  <BookmarkIcon className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-3 space-y-2">
                {markers.map((marker) => (
                  <div
                    key={marker.id}
                    className="rounded-lg bg-white px-3 py-2 text-xs dark:bg-slate-700"
                  >
                    <p className="font-semibold text-slate-900 dark:text-white">{marker.label}</p>
                    <p className="text-slate-600 dark:text-slate-400">{marker.timecode}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex flex-1 flex-col">
          {/* Controls Bar */}
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-100 px-6 py-3 dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center gap-2">
              <button className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 bg-slate-200 text-slate-700 transition hover:bg-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600">
                <ArrowUturnLeftIcon className="h-4 w-4" />
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 bg-slate-200 text-slate-700 transition hover:bg-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600">
                <ArrowUturnRightIcon className="h-4 w-4" />
              </button>
              <span className="ml-2 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">{activeFile}</span>
            </div>
            <div className="flex items-center gap-2">
              {recordingState === 'recording' && (
                <span className="flex items-center gap-2 text-xs font-semibold text-red-600">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-red-600" />
                  Recording
                </span>
              )}
            </div>
          </div>

          {/* Split View */}
          <div className="flex flex-1 overflow-hidden">
            {/* Editor */}
            <div className="flex flex-1 flex-col border-r border-slate-200 dark:border-slate-700">
              <div className="flex-1 bg-white dark:bg-slate-900">
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
                    fontSize: 14,
                    minimap: { enabled: false },
                    automaticLayout: true,
                    wordWrap: 'on',
                    smoothScrolling: true,
                    scrollBeyondLastLine: false,
                    padding: { top: 16 },
                  }}
                  loading={<div className="flex h-full items-center justify-center text-sm text-slate-600 dark:text-slate-400">Loading editor...</div>}
                  height="100%"
                />
              </div>
            </div>

            {/* Preview */}
            <div className="flex w-1/2 flex-col bg-white dark:bg-slate-900">
              <div className="border-b border-slate-200 bg-slate-100 px-4 py-2 dark:border-slate-700 dark:bg-slate-800">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Live Preview</p>
              </div>
              <div className="flex-1 overflow-auto p-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg dark:border-slate-700 dark:bg-slate-800">
                  <div dangerouslySetInnerHTML={{ __html: code }} />
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="border-t border-slate-200 bg-slate-100 p-4 dark:border-slate-700 dark:bg-slate-800">
            <div className="relative h-12 rounded-lg bg-slate-200 dark:bg-slate-700">
              {markers.map((marker) => (
                <div
                  key={marker.id}
                  className="absolute top-0 h-full w-1 bg-primary-500"
                  style={{ left: `${marker.position}%` }}
                  title={marker.label}
                />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
