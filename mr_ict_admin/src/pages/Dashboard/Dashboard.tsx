import React, { useEffect, useMemo, useState } from 'react';
import {
  FiActivity,
  FiArrowRight,
  FiAward,
  FiBookOpen,
  FiClipboard,
  FiDownload,
  FiPlayCircle,
  FiTrendingUp,
  FiUsers,
  FiZap,
} from 'react-icons/fi';

import {
  AdminAnalyticsSummary,
  AdminAnnouncementItem,
  AdminRecentActivityItem,
  AdminTimeseriesPoint,
  fetchAdminAnalyticsSummary,
  buildAnalyticsCsvUrl,
} from '../../services/analytics';

const formatNumber = (value?: number) =>
  typeof value === 'number' ? value.toLocaleString() : '—';

const formatDateTime = (iso?: string | null) => {
  if (!iso) return '—';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
};

const formatDate = (iso: string) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium' }).format(date);
};

const Dashboard: React.FC = () => {
  const [summary, setSummary] = useState<AdminAnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchAdminAnalyticsSummary();
        setSummary(data);
      } catch (err) {
        console.error('Failed to load analytics summary', err);
        setError('We could not load the latest analytics snapshot. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const statCards = useMemo(() => {
    const stats = summary?.stats || {};
    return [
      { key: 'totalStudents', label: 'Total Students', icon: FiUsers, tone: 'text-blue-500' },
      { key: 'activeCourses', label: 'Active Courses', icon: FiBookOpen, tone: 'text-purple-500' },
      { key: 'totalLessons', label: 'Published Lessons', icon: FiPlayCircle, tone: 'text-green-500' },
      { key: 'totalChallenges', label: 'Coding Challenges', icon: FiZap, tone: 'text-orange-500' },
    ].map((item) => ({ ...item, value: stats[item.key] }));
  }, [summary]);

  const highlightCards = useMemo(() => {
    const stats = summary?.stats || {};
    return [
      {
        label: 'New Students Today',
        value: stats.newStudentsToday,
        icon: FiUsers,
        tone: 'bg-blue-50 text-blue-700',
      },
      {
        label: 'Courses Completed Today',
        value: stats.coursesCompletedToday,
        icon: FiAward,
        tone: 'bg-green-50 text-green-700',
      },
      {
        label: 'Assessments Completed Today',
        value: stats.assessmentsCompletedToday,
        icon: FiClipboard,
        tone: 'bg-purple-50 text-purple-700',
      },
    ];
  }, [summary]);

  const timeseries = summary?.timeseries ?? [];
  const recentActivity = summary?.recentActivity ?? [];
  const topCourses = summary?.topCourses ?? [];
  const announcements = summary?.announcements ?? [];

  const handleExport = () => {
    window.open(buildAnalyticsCsvUrl(), '_blank', 'noopener');
  };

  return (
    <div className="min-h-screen">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Platform analytics</h1>
          <p className="text-sm text-gray-500">
            Track learner engagement, completions, and announcements in real time.
          </p>
        </div>
        <button
          type="button"
          onClick={handleExport}
          className="inline-flex items-center justify-center rounded-lg bg-green px-4 py-2 text-white shadow transition hover:bg-green-700"
        >
          <FiDownload className="mr-2" /> Export CSV
        </button>
      </div>

      {loading && (
        <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
          Loading analytics…
        </div>
      )}

      {error && !loading && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-sm text-red-700">{error}</div>
      )}

      {!loading && !error && summary && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {statCards.map((card) => (
              <div
                key={card.key}
                className="flex items-center justify-between rounded-xl bg-white p-6 shadow hover:shadow-lg transition"
              >
                <div>
                  <p className="text-sm text-gray-500">{card.label}</p>
                  <p className="text-3xl font-semibold text-gray-900">{formatNumber(card.value)}</p>
                </div>
                <card.icon className={`text-4xl opacity-30 ${card.tone}`} />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 rounded-xl bg-white p-6 shadow">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="flex items-center text-xl font-semibold text-gray-900">
                  <FiActivity className="mr-2 text-indigo-500" /> Recent activity
                </h2>
                <span className="text-xs uppercase tracking-wide text-gray-400">
                  {recentActivity.length} events this week
                </span>
              </div>
              {recentActivity.length === 0 ? (
                <p className="text-sm text-gray-500">No activity recorded yet today.</p>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {recentActivity.slice(0, 8).map((item: AdminRecentActivityItem) => (
                    <li key={item.id} className="flex items-center justify-between py-3">
                      <div className="flex flex-1 flex-col">
                        <span className="text-sm font-medium text-gray-900">
                          {item.actor || 'Someone'} {item.description}
                        </span>
                        <span className="text-xs text-gray-500">
                          {item.context ? `${item.context} • ` : ''}
                          {formatDateTime(item.occurred_at)}
                        </span>
                      </div>
                      <FiArrowRight className="text-gray-300" />
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="rounded-xl bg-white p-6 shadow">
              <h2 className="mb-4 flex items-center text-xl font-semibold text-gray-900">
                <FiTrendingUp className="mr-2 text-green-500" /> Today’s highlights
              </h2>
              <div className="space-y-3">
                {highlightCards.map((item) => (
                  <div key={item.label} className={`flex items-center justify-between rounded-lg p-3 ${item.tone}`}
                  >
                    <span className="flex items-center text-sm font-medium">
                      <item.icon className="mr-2" /> {item.label}
                    </span>
                    <span className="text-xl font-semibold">{formatNumber(item.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-xl bg-white p-6 shadow">
              <h2 className="mb-4 flex items-center text-xl font-semibold text-gray-900">
                <FiTrendingUp className="mr-2 text-blue-500" /> Engagement trend (7 days)
              </h2>
              {timeseries.length === 0 ? (
                <p className="text-sm text-gray-500">We’ll chart trends as soon as activity begins.</p>
              ) : (
                <div className="space-y-2 text-sm text-gray-700">
                  {timeseries.map((point: AdminTimeseriesPoint) => (
                    <div
                      key={point.date}
                      className="flex items-center justify-between rounded border border-gray-100 px-3 py-2"
                    >
                      <span>{formatDate(point.date)}</span>
                      <span className="flex items-center gap-4 text-xs">
                        <span className="flex items-center gap-1 text-blue-600">
                          <FiUsers /> {formatNumber(point.activeStudents)} active
                        </span>
                        <span className="flex items-center gap-1 text-green-600">
                          <FiPlayCircle /> {formatNumber(point.lessonsCompleted)} lessons
                        </span>
                        <span className="flex items-center gap-1 text-purple-600">
                          <FiAward /> {formatNumber(point.assessmentsCompleted)} assessments
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-xl bg-white p-6 shadow">
              <h2 className="mb-4 flex items-center text-xl font-semibold text-gray-900">
                <FiBookOpen className="mr-2 text-orange-500" /> Top courses
              </h2>
              {topCourses.length === 0 ? (
                <p className="text-sm text-gray-500">No enrollments yet. Encourage students to join their first course!</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead>
                      <tr className="text-xs uppercase tracking-wide text-gray-400">
                        <th className="pb-2">Course</th>
                        <th className="pb-2">Enrollments</th>
                        <th className="pb-2">Completions</th>
                        <th className="pb-2">Completion rate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {topCourses.map((course) => (
                        <tr key={`${course.courseId}-${course.title}`} className="text-sm">
                          <td className="py-2 font-medium text-gray-900">{course.title || 'Untitled course'}</td>
                          <td className="py-2 text-gray-600">{formatNumber(course.enrollments)}</td>
                          <td className="py-2 text-gray-600">{formatNumber(course.completions)}</td>
                          <td className="py-2 text-gray-600">{course.completionRate.toFixed(1)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <h2 className="mb-4 flex items-center text-xl font-semibold text-gray-900">
              <FiClipboard className="mr-2 text-indigo-500" /> Latest announcements
            </h2>
            {announcements.length === 0 ? (
              <p className="text-sm text-gray-500">No announcements are currently live.</p>
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {announcements.map((item: AdminAnnouncementItem) => (
                  <div key={item.id} className="rounded-lg border border-gray-100 p-4">
                    <h3 className="text-sm font-semibold text-gray-900">{item.title}</h3>
                    <p className="mt-1 text-xs text-gray-500">
                      Audience: {item.audience.replace('_', ' ')}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Published {formatDateTime(item.published_at)}
                    </p>
                    {item.expires_at && (
                      <p className="text-xs text-gray-500">Expires {formatDateTime(item.expires_at)}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
