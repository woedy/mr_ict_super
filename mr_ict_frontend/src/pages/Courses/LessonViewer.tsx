import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LessonPlaybackData,
  fetchLessonPlayback,
  updateLessonProgress,
} from '../../services/studentExperience';
import { trackLearningEvent } from '../../services/analytics';

const LESSON_CACHE_PREFIX = 'mrict_lesson_cache_';

const LessonViewer: React.FC = () => {
  const location = useLocation();
  const query = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const lessonId = query.get('lesson_id');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [data, setData] = useState<LessonPlaybackData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usingCache, setUsingCache] = useState(false);
  const [saving, setSaving] = useState(false);
  const [lastPosition, setLastPosition] = useState(0);
  const offline = typeof navigator !== 'undefined' && !navigator.onLine;

  const cacheKey = lessonId ? `${LESSON_CACHE_PREFIX}${lessonId}` : null;

  const loadLesson = useCallback(async () => {
    if (!lessonId) return;
    setLoading(true);
    setError(null);
    setUsingCache(false);
    try {
      const payload = await fetchLessonPlayback(lessonId);
      setData(payload);
      setLastPosition(payload.playback_state.last_position_seconds || 0);
      if (cacheKey) {
        localStorage.setItem(cacheKey, JSON.stringify(payload));
      }
    } catch (err: any) {
      const cached = cacheKey ? localStorage.getItem(cacheKey) : null;
      if (cached) {
        try {
          const parsed = JSON.parse(cached) as LessonPlaybackData;
          setData(parsed);
          setLastPosition(parsed.playback_state.last_position_seconds || 0);
          setUsingCache(true);
        } catch (parseError) {
          if (cacheKey) localStorage.removeItem(cacheKey);
          const message = err?.response?.data?.detail || 'Unable to load this lesson.';
          setError(message);
        }
      } else {
        const message = err?.response?.data?.detail || 'Unable to load this lesson.';
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  }, [cacheKey, lessonId]);

  useEffect(() => {
    loadLesson();
  }, [loadLesson]);

  useEffect(() => {
    if (data?.lesson.lesson_id) {
      trackLearningEvent({
        event_type: 'lesson_viewed',
        lesson_id: data.lesson.lesson_id,
        course_id: data.lesson.course?.course_id || undefined,
        metadata: { cached: usingCache },
      });
    }
  }, [data?.lesson.lesson_id, usingCache]);

  useEffect(() => {
    if (videoRef.current && data) {
      try {
        videoRef.current.currentTime = data.playback_state.last_position_seconds || 0;
      } catch (err) {
        // ignore seek failures
      }
    }
  }, [data]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setLastPosition(videoRef.current.currentTime);
    }
  };

  const persistProgress = async (completed = false) => {
    if (!lessonId) return;
    setSaving(true);
    try {
      const payload = await updateLessonProgress(lessonId, {
        last_position_seconds: Math.round(lastPosition),
        completed,
      });
      setData((prev) => {
        if (!prev) {
          return prev;
        }
        const updated = {
          ...prev,
          playback_state: {
            ...prev.playback_state,
            completed: payload.completed,
            last_position_seconds: payload.last_position_seconds,
            resume_snippet_id: payload.resume_snippet_id,
          },
        };
        if (cacheKey && offline) {
          localStorage.setItem(cacheKey, JSON.stringify(updated));
        }
        return updated;
      });
      if (cacheKey && !offline) {
        const fresh = await fetchLessonPlayback(lessonId);
        setData(fresh);
        localStorage.setItem(cacheKey, JSON.stringify(fresh));
      }
    } catch (err: any) {
      const message = err?.response?.data?.detail || 'Unable to update your progress right now.';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  if (!lessonId) {
    return (
      <div className="mx-auto mt-10 max-w-4xl rounded-2xl border border-dashed border-gray-300 p-6 text-center text-gray-600 dark:border-gray-700 dark:text-gray-300">
        Provide a lesson_id in the URL query to view a lesson.
      </div>
    );
  }

  return (
    <div className="mx-auto mt-8 max-w-6xl px-4 pb-16">
      {loading && (
        <div className="rounded-2xl bg-white p-6 text-center shadow dark:bg-boxdark dark:text-white">Loading lesson…</div>
      )}

      {!loading && error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-500/40 dark:bg-red-500/10">
          <p className="font-semibold">{error}</p>
          <button
            type="button"
            onClick={loadLesson}
            className="mt-4 inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
          >
            Try again
          </button>
        </div>
      )}

      {!loading && !error && data && (
        <div className="space-y-8">
          <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow dark:bg-boxdark dark:text-white md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400">
                {data.lesson.course?.title}
              </p>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{data.lesson.title}</h1>
              {data.lesson.description && (
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{data.lesson.description}</p>
              )}
              <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                Module {data.lesson.module?.title || '-'} · {(data.lesson.duration_seconds / 60).toFixed(0)} mins
              </p>
            </div>
            <div className="flex flex-col items-stretch gap-2 md:w-48">
              <button
                type="button"
                onClick={() => persistProgress(false)}
                disabled={saving}
                className="rounded-full border border-primary px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? 'Saving…' : 'Save progress'}
              </button>
              <button
                type="button"
                onClick={() => persistProgress(true)}
                disabled={saving || data.playback_state.completed}
                className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {data.playback_state.completed ? 'Completed' : 'Mark as complete'}
              </button>
              <Link
                to="/lessons"
                className="text-center text-xs font-semibold text-gray-500 hover:text-primary dark:text-gray-400"
              >
                Back to lessons
              </Link>
            </div>
          </div>

          {(usingCache || offline) && (
            <div className="rounded-2xl border border-amber-300/60 bg-amber-500/10 p-4 text-sm text-amber-700 dark:border-amber-400/40 dark:text-amber-200">
              {offline
                ? 'You are offline. Showing the latest cached version of this lesson.'
                : 'Showing cached lesson data from your last session.'}
            </div>
          )}

          {data.primary_video ? (
            <div className="rounded-2xl bg-white p-4 shadow dark:bg-boxdark">
              <video
                key={data.primary_video.url || data.primary_video.id}
                ref={videoRef}
                controls
                onTimeUpdate={handleTimeUpdate}
                className="h-auto w-full rounded"
                poster={data.lesson.course?.title || undefined}
              >
                {data.primary_video.url && <source src={data.primary_video.url} />}
                Your browser does not support HTML5 video.
              </video>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-300">
              Video coming soon for this lesson.
            </div>
          )}

          {data.transcript && (
            <section className="rounded-2xl bg-white p-6 shadow dark:bg-boxdark dark:text-white">
              <h2 className="text-lg font-semibold">Transcript & notes</h2>
              <div className="prose prose-sm mt-3 max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: data.transcript }} />
            </section>
          )}

          {data.download_manifest.length > 0 && (
            <section className="rounded-2xl bg-white p-6 shadow dark:bg-boxdark dark:text-white">
              <h2 className="text-lg font-semibold">Offline resources</h2>
              <ul className="mt-3 space-y-2 text-sm text-primary">
                {data.download_manifest.map((item, index) => (
                  <li key={`${item.url}-${index}`}>
                    <a href={item.url || '#'} download className="underline hover:text-primary/80">
                      {item.label || item.type}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {data.insert_outputs.length > 0 && (
            <section className="rounded-2xl bg-white p-6 shadow dark:bg-boxdark dark:text-white">
              <h2 className="text-lg font-semibold">Lesson inserts</h2>
              <div className="mt-3 space-y-4">
                {data.insert_outputs.map((output) => (
                  <div key={output.id} className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
                    <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Timestamp {output.timestamp}s</p>
                    {output.content && (
                      <div className="prose prose-sm mt-2 max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: output.content }} />
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.code_snippets.length > 0 && (
            <section className="rounded-2xl bg-white p-6 shadow dark:bg-boxdark dark:text-white">
              <h2 className="text-lg font-semibold">Code snapshots</h2>
              <div className="mt-3 space-y-4">
                {data.code_snippets.map((snippet) => (
                  <div key={snippet.id} className="rounded-xl bg-gray-900 p-4 font-mono text-sm text-white">
                    <p className="mb-2 text-xs uppercase tracking-wide text-gray-400">Timestamp {snippet.timestamp}s</p>
                    <pre className="whitespace-pre-wrap">{snippet.code_content}</pre>
                    {snippet.output && (
                      <div className="mt-3 rounded border border-gray-700 bg-gray-800 p-3 text-xs text-gray-200">
                        <p className="mb-1 font-semibold uppercase tracking-wide text-gray-400">Output</p>
                        <pre className="whitespace-pre-wrap">{snippet.output}</pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.assignments.length > 0 && (
            <section className="rounded-2xl bg-white p-6 shadow dark:bg-boxdark dark:text-white">
              <h2 className="text-lg font-semibold">Assignments</h2>
              <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
                {data.assignments.map((assignment) => (
                  <div key={assignment.id} className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
                    <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">{assignment.difficulty || 'Practice'}</p>
                    <h3 className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">{assignment.title}</h3>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{assignment.instructions}</p>
                    {assignment.expected_output && (
                      <div className="mt-3 rounded border border-gray-200 bg-gray-50 p-3 text-xs text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">
                        <p className="font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Expected output</p>
                        <pre className="whitespace-pre-wrap">{assignment.expected_output}</pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};

export default LessonViewer;

