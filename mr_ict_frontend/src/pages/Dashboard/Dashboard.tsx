import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AcademicCapIcon,
  BellIcon,
  BoltIcon,
  CheckCircleIcon,
  EnvelopeIcon,
  TrophyIcon,
} from '@heroicons/react/24/outline';

import CardDataStats from '../../components/CardDataStats';
import {
  CourseSummary,
  DashboardData,
  ResumeLearningItem,
  fetchDashboard,
} from '../../services/studentExperience';

const DASHBOARD_CACHE_KEY = 'mrict_dashboard_cache';

const initialOverview: DashboardData['overview'] = {
  in_progress: 0,
  completed: 0,
  challenges_completed: 0,
  xp: 0,
};

const getInitials = (first?: string, last?: string) => {
  const firstInitial = first?.trim()?.charAt(0) ?? '';
  const lastInitial = last?.trim()?.charAt(0) ?? '';
  const initials = `${firstInitial}${lastInitial}`;
  return initials ? initials.toUpperCase() : 'ST';
};

const formatProgressPercent = (value?: number | null) => {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return null;
  }
  return Math.round(value);
};

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [usingCache, setUsingCache] = useState<boolean>(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    setUsingCache(false);

    try {
      const payload = await fetchDashboard();
      setData(payload);
      localStorage.setItem(DASHBOARD_CACHE_KEY, JSON.stringify(payload));
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      const cached = localStorage.getItem(DASHBOARD_CACHE_KEY);
      if (cached) {
        try {
          const parsed = JSON.parse(cached) as DashboardData;
          setData(parsed);
          setUsingCache(true);
        } catch (parseError) {
          localStorage.removeItem(DASHBOARD_CACHE_KEY);
          setError('We could not load your dashboard right now. Please try again.');
        }
      } else {
        setError('We could not load your dashboard right now. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const courseOverview = data?.overview ?? initialOverview;
  const user = data?.user ?? { first_name: '', last_name: '', photo: null };
  const notifications = data?.notifications ?? { unread: 0, messages: 0 };
  const resumeLearning = data?.resume_learning ?? [];
  const recommendedCourses = data?.recommended_courses ?? [];
  const badges = data?.badges ?? [];
  const practiceSections = data?.practice?.sections ?? [];
  const offline = typeof navigator !== 'undefined' && !navigator.onLine;

  return (
    <div className="space-y-8">
      {loading && (
        <div className="rounded-2xl bg-white p-6 text-center shadow-lg dark:bg-boxdark dark:text-white">
          Loading your dashboard...
        </div>
      )}

      {!loading && error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-500/40 dark:bg-red-500/10">
          <p className="font-semibold">{error}</p>
          <button
            type="button"
            onClick={fetchData}
            className="mt-4 inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary/90"
          >
            Try again
          </button>
        </div>
      )}

      {!loading && !error && data && (
        <>
          <section className="rounded-2xl bg-white p-6 shadow-lg dark:bg-boxdark dark:text-white">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              {user.photo ? (
                <img
                  src={user.photo}
                  alt={`${user.first_name ?? ''} ${user.last_name ?? ''}`.trim() || 'Student avatar'}
                  className="h-20 w-20 rounded-2xl object-cover"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-xl font-semibold text-primary">
                  {getInitials(user.first_name, user.last_name)}
                </div>
              )}
              <div className="flex-1">
                <p className="text-sm text-gray-500 dark:text-gray-300">Welcome back</p>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {`${user.first_name ?? ''} ${user.last_name ?? ''}`.trim() || 'Student'}
                </h2>
              </div>
              <div className="flex flex-col gap-2 text-sm text-gray-600 dark:text-gray-300 md:flex-row md:items-center">
                <span className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 dark:bg-white/10">
                  <BellIcon className="h-5 w-5" />
                  {notifications.unread === 0 ? 'No new notifications' : `${notifications.unread} notifications`}
                </span>
                <span className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 dark:bg-white/10">
                  <EnvelopeIcon className="h-5 w-5" />
                  {notifications.messages} new message{notifications.messages === 1 ? '' : 's'}
                </span>
              </div>
            </div>
            {(usingCache || offline) && (
              <div className="mt-4 rounded-xl border border-amber-300/60 bg-amber-500/10 p-4 text-sm text-amber-700 dark:border-amber-400/40 dark:text-amber-200">
                {offline
                  ? 'You are offline. Showing the latest data saved on this device.'
                  : 'Showing cached dashboard data from your last session.'}
              </div>
            )}
          </section>

          <section>
            <h3 className="mb-4 text-xl font-semibold text-black dark:text-white">Course overview</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <CardDataStats title="In progress" total={courseOverview.in_progress} rate="courses">
                <AcademicCapIcon className="h-6 w-6 text-primary" />
              </CardDataStats>
              <CardDataStats title="Completed" total={courseOverview.completed} rate="courses">
                <CheckCircleIcon className="h-6 w-6 text-primary" />
              </CardDataStats>
              <CardDataStats title="Challenges" total={courseOverview.challenges_completed} rate="completed">
                <BoltIcon className="h-6 w-6 text-primary" />
              </CardDataStats>
              <CardDataStats title="XP earned" total={courseOverview.xp} rate="points">
                <TrophyIcon className="h-6 w-6 text-primary" />
              </CardDataStats>
            </div>
          </section>

          <section>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-black dark:text-white">Resume learning</h3>
              <Link to="/all-my-courses" className="text-sm font-semibold text-primary hover:text-primary/80">
                View all courses
              </Link>
            </div>
            {resumeLearning.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {resumeLearning.map((lesson: ResumeLearningItem) => {
                  const percent = formatProgressPercent(lesson.progress_percent);
                  const lessonsCompleted = lesson.lessons_completed ?? 0;
                  const totalLessons = lesson.total_lessons ?? 0;
                  const fallbackLetter = lesson.course_title?.charAt(0) ?? lesson.lesson_title?.charAt(0) ?? 'L';

                  return (
                    <Link
                      key={lesson.student_lesson_id}
                      to={`/lesson?lesson_id=${lesson.lesson_id}`}
                      className="flex items-center gap-5 rounded-2xl bg-white p-5 shadow-lg transition hover:-translate-y-1 hover:shadow-xl dark:bg-boxdark"
                    >
                      <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-primary/10 text-xl font-semibold text-primary">
                        {lesson.thumbnail ? (
                          <img src={lesson.thumbnail} alt={lesson.lesson_title ?? 'Lesson'} className="h-full w-full object-cover" />
                        ) : (
                          fallbackLetter.toUpperCase()
                        )}
                      </div>
                      <div className="flex-1 space-y-2">
                        <p className="text-sm font-medium uppercase text-gray-500 dark:text-gray-400">{lesson.course_title}</p>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{lesson.lesson_title}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {lessonsCompleted}/{totalLessons} lessons completed
                          {percent !== null && <span className="ml-2 text-primary">({percent}% complete)</span>}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-6 text-center text-sm text-primary">
                You&apos;re all caught up! Start a new lesson from the catalog below.
              </div>
            )}
          </section>

          <section>
            <h3 className="mb-4 text-xl font-semibold text-black dark:text-white">Recommended courses</h3>
            {recommendedCourses.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {recommendedCourses.map((course: CourseSummary) => {
                  const fallbackLetter = course.title?.charAt(0) ?? 'C';
                  return (
                    <Link
                      to={`/lessons?course_id=${course.course_id}`}
                      key={`${course.course_id ?? course.slug ?? course.title}`}
                      className="flex items-start gap-4 rounded-2xl bg-white p-5 shadow-lg transition hover:-translate-y-1 hover:shadow-xl dark:bg-boxdark"
                    >
                      <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-primary/10 text-lg font-semibold text-primary">
                        {course.image ? (
                          <img src={course.image} alt={course.title ?? 'Course'} className="h-full w-full object-cover" />
                        ) : (
                          fallbackLetter.toUpperCase()
                        )}
                      </div>
                      <div className="flex-1 space-y-2">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{course.title}</h4>
                        {course.summary && (
                          <p className="text-sm text-gray-600 dark:text-gray-300">{course.summary}</p>
                        )}
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {course.level || 'Self paced'} · {course.lessons_count} lessons
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
                Courses will appear here once your school assigns them to you.
              </div>
            )}
          </section>

          {badges.length > 0 && (
            <section>
              <h3 className="mb-4 text-xl font-semibold text-black dark:text-white">Recently earned badges</h3>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {badges.map((badge) => (
                  <div
                    key={badge.id}
                    className="min-w-[200px] rounded-2xl bg-white p-4 shadow-lg dark:bg-boxdark"
                  >
                    <div className="mb-3 flex items-center gap-3">
                      {badge.image ? (
                        <img src={badge.image} alt={badge.name ?? 'Badge'} className="h-12 w-12 rounded-xl object-cover" />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <TrophyIcon className="h-6 w-6" />
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{badge.name}</p>
                        {badge.challenge_title && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">{badge.challenge_title}</p>
                        )}
                      </div>
                    </div>
                    {badge.criteria && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">{badge.criteria}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          <section>
            <h3 className="mb-4 text-xl font-semibold text-black dark:text-white">Practice challenges</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              {practiceSections.map((section) => (
                <div key={section.title} className="rounded-2xl bg-white p-4 shadow-lg dark:bg-boxdark">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{section.title}</h4>
                  <ul className="mt-3 space-y-3 text-sm text-gray-600 dark:text-gray-300">
                    {section.items.length > 0 ? (
                      section.items.map((challenge) => (
                        <li key={challenge.id} className="rounded-lg bg-gray-100 p-3 dark:bg-white/5">
                          <p className="font-medium text-gray-800 dark:text-white">{challenge.title}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Difficulty: {challenge.difficulty ?? 'N/A'}
                          </p>
                        </li>
                      ))
                    ) : (
                      <li className="rounded-lg border border-dashed border-gray-300 p-3 text-center text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400">
                        No challenges yet.
                      </li>
                    )}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {!loading && !error && !data && (
        <div className="rounded-2xl border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
          We couldn&apos;t find any dashboard data. Please try refreshing the page.
        </div>
      )}
    </div>
  );
};

export default Dashboard;
