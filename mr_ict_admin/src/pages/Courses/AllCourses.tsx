import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FiAlertCircle, FiEdit2, FiExternalLink, FiFilter, FiLoader, FiPlus, FiRefreshCw } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import {
  createCourse,
  listCourses,
  publishCourse,
  revertCourse,
  submitCourseForReview,
} from '../../services/content';
import { Course, PublishStatus } from '../../types/content';

const STATUS_LABELS: Record<PublishStatus, string> = {
  draft: 'Draft',
  in_review: 'In review',
  published: 'Published',
  archived: 'Archived',
};

const STATUS_INTENT: Record<PublishStatus, string> = {
  draft: 'bg-gray-100 text-gray-700',
  in_review: 'bg-yellow-100 text-yellow-800',
  published: 'bg-green-100 text-green-700',
  archived: 'bg-slate-200 text-slate-600',
};

type StatusFilter = PublishStatus | 'all';

interface CreateCourseForm {
  title: string;
  summary: string;
  description: string;
  tags: string;
}

const initialCreateForm: CreateCourseForm = {
  title: '',
  summary: '',
  description: '',
  tags: '',
};

const AllCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [createForm, setCreateForm] = useState<CreateCourseForm>(initialCreateForm);

  useEffect(() => {
    const handle = window.setTimeout(() => setDebouncedSearch(searchTerm), 400);
    return () => window.clearTimeout(handle);
  }, [searchTerm]);

  const loadCourses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params: Record<string, string> = {};
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }
      if (debouncedSearch.trim()) {
        params.search = debouncedSearch.trim();
      }
      const data = await listCourses(params);
      setCourses(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load courses. Please retry.');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, debouncedSearch]);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  const handleCreateCourse = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!createForm.title.trim()) {
      setError('Course title is required.');
      return;
    }
    try {
      setIsCreating(true);
      const payload = {
        title: createForm.title.trim(),
        summary: createForm.summary.trim(),
        description: createForm.description.trim(),
        tags: createForm.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean),
      };
      const created = await createCourse(payload);
      setCourses((prev) => [created, ...prev]);
      setCreateForm(initialCreateForm);
      setError(null);
      return;
    } catch (err) {
      console.error(err);
      setError('Could not create course. Check the details and try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleCourseTransition = async (
    courseId: number,
    action: 'submit' | 'publish' | 'revert',
  ) => {
    try {
      let updated: Course;
      if (action === 'submit') {
        updated = (await submitCourseForReview(courseId)) as Course;
      } else if (action === 'publish') {
        updated = (await publishCourse(courseId)) as Course;
      } else {
        updated = (await revertCourse(courseId)) as Course;
      }
      setCourses((prev) => prev.map((course) => (course.id === updated.id ? updated : course)));
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Unable to update course status. Resolve validation issues and retry.');
    }
  };

  const visibleCourses = useMemo(() => courses, [courses]);

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Admin Course Production</h1>
          <p className="text-gray-600">
            Create courses, manage their publishing lifecycle, and drill into modules and lessons.
          </p>
        </div>
        <button
          type="button"
          onClick={loadCourses}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
        >
          <FiRefreshCw className="text-lg" /> Refresh
        </button>
      </header>

      <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <form className="grid gap-4 md:grid-cols-4 md:items-end">
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="course-search">
              Search
            </label>
            <input
              id="course-search"
              type="text"
              placeholder="Search by title or description"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="status-filter">
              Status
            </label>
            <div className="relative">
              <select
                id="status-filter"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
                className="w-full appearance-none rounded-md border border-gray-300 px-3 py-2 pr-10 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
              >
                <option value="all">All statuses</option>
                {Object.entries(STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <FiFilter className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsCreating((prev) => !prev)}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700"
          >
            <FiPlus className="text-lg" /> New course
          </button>
        </form>

        {isCreating && (
          <form onSubmit={handleCreateCourse} className="mt-6 grid gap-4 rounded-lg bg-purple-50 p-4">
            <div className="grid gap-2 md:grid-cols-2">
              <label className="text-sm font-semibold text-purple-900" htmlFor="new-course-title">
                Title
              </label>
              <input
                id="new-course-title"
                value={createForm.title}
                onChange={(event) => setCreateForm((prev) => ({ ...prev, title: event.target.value }))}
                required
                className="md:col-span-1 rounded-md border border-purple-200 px-3 py-2 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
              />
              <label className="text-sm font-semibold text-purple-900" htmlFor="new-course-summary">
                Summary
              </label>
              <input
                id="new-course-summary"
                value={createForm.summary}
                onChange={(event) => setCreateForm((prev) => ({ ...prev, summary: event.target.value }))}
                className="md:col-span-1 rounded-md border border-purple-200 px-3 py-2 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-purple-900" htmlFor="new-course-description">
                Description
              </label>
              <textarea
                id="new-course-description"
                value={createForm.description}
                onChange={(event) => setCreateForm((prev) => ({ ...prev, description: event.target.value }))}
                rows={4}
                className="w-full rounded-md border border-purple-200 px-3 py-2 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-purple-900" htmlFor="new-course-tags">
                Tags (comma separated)
              </label>
              <input
                id="new-course-tags"
                value={createForm.tags}
                onChange={(event) => setCreateForm((prev) => ({ ...prev, tags: event.target.value }))}
                className="w-full rounded-md border border-purple-200 px-3 py-2 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={isCreating}
                className="inline-flex items-center gap-2 rounded-md bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-purple-400"
              >
                {isCreating ? <FiLoader className="animate-spin" /> : <FiPlus />} Create course
              </button>
              <button
                type="button"
                onClick={() => {
                  setCreateForm(initialCreateForm);
                  setIsCreating(false);
                }}
                className="text-sm font-medium text-purple-900 hover:underline"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </section>

      {error && (
        <div className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 p-4 text-red-700">
          <FiAlertCircle className="text-lg" />
          <span>{error}</span>
        </div>
      )}

      <section>
        {loading ? (
          <div className="flex items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white p-12 text-gray-500">
            <FiLoader className="mr-2 animate-spin text-xl" /> Loading courses…
          </div>
        ) : visibleCourses.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 bg-white p-12 text-center text-gray-500">
            <FiExternalLink className="text-2xl" />
            <p>No courses match your filters yet.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {visibleCourses.map((course) => {
              const moduleCount = course.modules.length;
              const lessonCount = course.modules.reduce((total, module) => total + module.lessons.length, 0);
              return (
                <article key={course.id} className="flex h-full flex-col justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold text-gray-900">{course.title}</h2>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_INTENT[course.status]}`}>
                        {STATUS_LABELS[course.status]}
                      </span>
                    </div>
                    {course.summary && <p className="text-sm text-gray-600">{course.summary}</p>}
                    <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                      <span>{moduleCount} modules</span>
                      <span>•</span>
                      <span>{lessonCount} lessons</span>
                      {course.tags.length > 0 && (
                        <>
                          <span>•</span>
                          <span>{course.tags.join(', ')}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <Link
                      to={`/courses/${course.id}`}
                      className="inline-flex items-center gap-2 rounded-md border border-purple-200 px-3 py-2 text-sm font-medium text-purple-700 hover:bg-purple-50"
                    >
                      <FiExternalLink /> Manage
                    </Link>
                    {course.status === 'draft' && (
                      <button
                        type="button"
                        onClick={() => handleCourseTransition(course.id, 'submit')}
                        className="inline-flex items-center gap-2 rounded-md border border-yellow-200 px-3 py-2 text-sm font-medium text-yellow-700 hover:bg-yellow-50"
                      >
                        <FiEdit2 /> Submit for review
                      </button>
                    )}
                    {course.status === 'in_review' && (
                      <button
                        type="button"
                        onClick={() => handleCourseTransition(course.id, 'publish')}
                        className="inline-flex items-center gap-2 rounded-md border border-green-200 px-3 py-2 text-sm font-medium text-green-700 hover:bg-green-50"
                      >
                        <FiPlus /> Publish
                      </button>
                    )}
                    {course.status !== 'draft' && course.status !== 'archived' && (
                      <button
                        type="button"
                        onClick={() => handleCourseTransition(course.id, 'revert')}
                        className="inline-flex items-center gap-2 rounded-md border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
                      >
                        <FiRefreshCw /> Revert to draft
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default AllCourses;
