import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CourseSummary, fetchCourseCatalog } from '../../services/studentExperience';

const AllCourses: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [courses, setCourses] = useState<CourseSummary[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [search, setSearch] = useState<string>('');
  const [level, setLevel] = useState<string>('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchCourseCatalog({ page, search: search || undefined, level: level || undefined });
      setCourses(response.results || []);
      const pageCount = Math.max(1, Math.ceil((response.count || 0) / 12));
      setTotalPages(pageCount);
    } catch (err: any) {
      const message = err?.response?.data?.detail || 'Unable to load courses right now.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [level, page, search]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="mx-auto mt-9 max-w-7xl px-4">
      <h4 className="text-xl font-semibold text-black dark:text-white">Course catalog</h4>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
        Explore courses curated for Ghanaian students. Filter to find the next lesson you want to take.
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          placeholder="Search courses"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-primary dark:border-gray-700 dark:bg-boxdark dark:text-white"
        />
        <select
          value={level}
          onChange={(e) => {
            setPage(1);
            setLevel(e.target.value);
          }}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-primary dark:border-gray-700 dark:bg-boxdark dark:text-white sm:w-48"
        >
          <option value="">All levels</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      </div>

      {loading && (
        <div className="mt-6 rounded-2xl bg-white p-6 text-center shadow dark:bg-boxdark dark:text-white">Loading courses…</div>
      )}

      {!loading && error && (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-500/40 dark:bg-red-500/10">
          <p className="font-semibold">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => {
            const fallbackLetter = course.title?.charAt(0) ?? 'C';
            return (
              <div key={course.course_id} className="flex flex-col justify-between rounded-2xl bg-white p-5 shadow-lg transition hover:-translate-y-1 hover:shadow-xl dark:bg-boxdark">
                <div className="flex items-start gap-4">
                  <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-primary/10 text-lg font-semibold text-primary">
                    {course.image ? (
                      <img src={course.image} alt={course.title ?? 'Course'} className="h-full w-full object-cover" />
                    ) : (
                      fallbackLetter.toUpperCase()
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{course.title}</p>
                    {course.summary && (
                      <p className="text-sm text-gray-600 dark:text-gray-300">{course.summary}</p>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {course.level || 'Self paced'} · {course.lessons_count} lessons
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between text-sm text-gray-500 dark:text-gray-300">
                  <span>
                    {course.is_enrolled ? `Enrolled · ${Math.round(course.progress_percent)}% complete` : 'Not enrolled yet'}
                  </span>
                  <Link to={`/lessons?course_id=${course.course_id}`} className="rounded-full bg-primary px-4 py-2 font-semibold text-white hover:bg-primary/90">
                    View lessons
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-300">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="rounded-full border border-gray-300 px-3 py-1 hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700"
        >
          Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          className="rounded-full border border-gray-300 px-3 py-1 hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AllCourses;
