import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  CourseDetail,
  enrollInCourse,
  fetchCourseDetail,
} from '../../services/studentExperience';

const Lessons: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const courseId = query.get('course_id');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [enrolling, setEnrolling] = useState(false);

  const loadCourse = useCallback(async () => {
    if (!courseId) {
      setCourse(null);
      setError('Select a course from your dashboard or catalog to see its lessons.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const detail = await fetchCourseDetail(courseId);
      setCourse(detail);
    } catch (err: any) {
      const message = err?.response?.data?.detail || 'We could not load this course.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    loadCourse();
  }, [loadCourse]);

  const handleEnroll = async () => {
    if (!courseId) return;
    setEnrolling(true);
    setError(null);
    try {
      const detail = await enrollInCourse(courseId);
      setCourse(detail);
    } catch (err: any) {
      const message = err?.response?.data?.detail || 'Unable to enroll in this course.';
      setError(message);
    } finally {
      setEnrolling(false);
    }
  };

  return (
    <div className="mx-auto mt-9 max-w-5xl px-4">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h4 className="text-xl font-semibold text-black dark:text-white">Lessons</h4>
          {course && (
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              {course.title} · {course.modules.reduce((count, module) => count + module.lessons.length, 0)} lessons
            </p>
          )}
        </div>
        <button
          onClick={() => navigate('/all-courses')}
          className="rounded-full border border-primary px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/10"
        >
          Browse catalog
        </button>
      </div>

      {!courseId && (
        <div className="rounded-2xl border border-dashed border-gray-300 p-6 text-center text-sm text-gray-600 dark:border-gray-700 dark:text-gray-300">
          Select a course to view its lessons.
        </div>
      )}

      {loading && (
        <div className="rounded-2xl bg-white p-6 text-center shadow dark:bg-boxdark dark:text-white">Loading lessons…</div>
      )}

      {!loading && error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-500/40 dark:bg-red-500/10">
          <p className="font-semibold">{error}</p>
          {courseId && (
            <button
              type="button"
              onClick={loadCourse}
              className="mt-4 inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
            >
              Try again
            </button>
          )}
        </div>
      )}

      {!loading && !error && course && (
        <div className="space-y-8">
          <section className="rounded-2xl bg-white p-6 shadow dark:bg-boxdark dark:text-white">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-semibold">{course.title}</h2>
                {course.summary && <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{course.summary}</p>}
                <p className="mt-3 text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  {course.level || 'Self paced'} · {course.modules.length} modules · {course.estimated_duration_minutes} mins
                </p>
              </div>
              <div className="flex flex-col items-stretch gap-2 md:w-48">
                {!course.is_enrolled ? (
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {enrolling ? 'Enrolling…' : 'Enroll now'}
                  </button>
                ) : (
                  <Link
                    to={course.resume_lesson_id ? `/lesson?lesson_id=${course.resume_lesson_id}` : '#'}
                    className="rounded-full border border-primary px-4 py-2 text-center text-sm font-semibold text-primary hover:bg-primary/10"
                  >
                    {course.resume_lesson_id ? 'Resume where you left off' : 'Start first lesson'}
                  </Link>
                )}
              </div>
            </div>
          </section>

          {course.modules.length > 0 ? (
            course.modules.map((module) => (
              <section key={module.id} className="rounded-2xl bg-white p-6 shadow dark:bg-boxdark dark:text-white">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Module {module.order}: {module.title}</h3>
                {module.description && (
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{module.description}</p>
                )}
                <ul className="mt-4 space-y-3">
                  {module.lessons.map((lesson) => (
                    <li key={lesson.lesson_id} className="rounded-2xl border border-gray-200 p-4 transition hover:border-primary hover:shadow dark:border-gray-700">
                      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className="text-sm font-medium uppercase text-gray-500 dark:text-gray-400">Lesson {lesson.order}</p>
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{lesson.title}</h4>
                          {lesson.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-300">{lesson.description}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {(lesson.duration_seconds / 60).toFixed(0)} mins
                          </span>
                          <Link
                            to={`/lesson?lesson_id=${lesson.lesson_id}`}
                            className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
                          >
                            Open lesson
                          </Link>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-300 p-6 text-center text-sm text-gray-600 dark:border-gray-700 dark:text-gray-300">
              Lessons are on their way. Check back soon.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Lessons;
