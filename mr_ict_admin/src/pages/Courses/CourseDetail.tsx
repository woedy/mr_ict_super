import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FiAlertCircle,
  FiArrowLeft,
  FiEdit3,
  FiExternalLink,
  FiLoader,
  FiPlus,
  FiRefreshCw,
  FiUploadCloud,
} from 'react-icons/fi';
import { Link, useNavigate, useParams } from 'react-router-dom';

import {
  createLesson,
  createModule,
  fetchCourse,
  fetchCourseAuditLog,
  publishCourse,
  publishLesson,
  publishModule,
  revertCourse,
  revertLesson,
  revertModule,
  submitCourseForReview,
  submitLessonForReview,
  submitModuleForReview,
  updateCourse,
  uploadLessonVideo,
} from '../../services/content';
import { AuditLogEntry, Course, Module, PublishStatus } from '../../types/content';

const STATUS_BADGE: Record<PublishStatus, string> = {
  draft: 'bg-gray-100 text-gray-700',
  in_review: 'bg-yellow-100 text-yellow-800',
  published: 'bg-green-100 text-green-700',
  archived: 'bg-slate-200 text-slate-600',
};

const STATUS_LABEL: Record<PublishStatus, string> = {
  draft: 'Draft',
  in_review: 'In review',
  published: 'Published',
  archived: 'Archived',
};

interface ModuleFormState {
  title: string;
  description: string;
  order: number;
}

interface LessonFormState {
  moduleId: string;
  title: string;
  description: string;
  content: string;
  order: number;
}

const initialModuleForm: ModuleFormState = {
  title: '',
  description: '',
  order: 1,
};

const initialLessonForm: LessonFormState = {
  moduleId: '',
  title: '',
  description: '',
  content: '',
  order: 1,
};

const CourseDetail: React.FC = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [moduleForm, setModuleForm] = useState<ModuleFormState>(initialModuleForm);
  const [lessonForm, setLessonForm] = useState<LessonFormState>(initialLessonForm);
  const [uploadLessonId, setUploadLessonId] = useState<string>('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const numericCourseId = useMemo(() => Number(courseId), [courseId]);

  const loadCourse = useCallback(async (showSpinner = true) => {
    if (!courseId || Number.isNaN(numericCourseId)) {
      setError('Invalid course identifier.');
      setLoading(false);
      return;
    }
    if (showSpinner) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }
    try {
      const [courseData, auditData] = await Promise.all([
        fetchCourse(numericCourseId),
        fetchCourseAuditLog(numericCourseId),
      ]);
      setCourse(courseData);
      setAuditLog(auditData);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Unable to load course details.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [courseId, numericCourseId]);

  useEffect(() => {
    loadCourse();
  }, [loadCourse]);

  const handleCourseUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!course) return;
    try {
      const form = new FormData(event.currentTarget);
      const payload = {
        summary: String(form.get('summary') || ''),
        description: String(form.get('description') || ''),
        level: String(form.get('level') || ''),
        estimated_duration_minutes: Number(form.get('duration') || 0),
      };
      const updated = await updateCourse(course.id, payload);
      setCourse(updated);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to update course details.');
    }
  };

  const handleCourseTransition = async (action: 'submit' | 'publish' | 'revert') => {
    if (!course) return;
    try {
      let updated: Course;
      if (action === 'submit') {
        updated = await submitCourseForReview(course.id);
      } else if (action === 'publish') {
        updated = await publishCourse(course.id);
      } else {
        updated = await revertCourse(course.id);
      }
      setCourse(updated);
      setError(null);
      await loadCourse(false);
    } catch (err) {
      console.error(err);
      setError('Course status change failed. Check validation requirements.');
    }
  };

  const handleModuleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!course) return;
    if (!moduleForm.title.trim()) {
      setError('Module title cannot be empty.');
      return;
    }
    try {
      await createModule({
        course: course.id,
        title: moduleForm.title.trim(),
        description: moduleForm.description.trim(),
        order: moduleForm.order,
      });
      setModuleForm(initialModuleForm);
      setError(null);
      await loadCourse(false);
    } catch (err) {
      console.error(err);
      setError('Creating module failed.');
    }
  };

  const handleLessonCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!course) return;
    if (!lessonForm.moduleId) {
      setError('Choose a module for the lesson.');
      return;
    }
    if (!lessonForm.title.trim()) {
      setError('Lesson title cannot be empty.');
      return;
    }
    try {
      await createLesson({
        module: Number(lessonForm.moduleId),
        title: lessonForm.title.trim(),
        description: lessonForm.description.trim(),
        content: lessonForm.content,
        order: lessonForm.order,
      });
      setLessonForm(initialLessonForm);
      setError(null);
      await loadCourse(false);
    } catch (err) {
      console.error(err);
      setError('Could not create lesson.');
    }
  };

  const handleModuleAction = async (module: Module, action: 'submit' | 'publish' | 'revert') => {
    try {
      if (action === 'submit') {
        await submitModuleForReview(module.id);
      } else if (action === 'publish') {
        await publishModule(module.id);
      } else {
        await revertModule(module.id);
      }
      setError(null);
      await loadCourse(false);
    } catch (err) {
      console.error(err);
      setError('Module status update failed.');
    }
  };

  const handleLessonAction = async (lessonId: number, action: 'submit' | 'publish' | 'revert') => {
    try {
      if (action === 'submit') {
        await submitLessonForReview(lessonId);
      } else if (action === 'publish') {
        await publishLesson(lessonId);
      } else {
        await revertLesson(lessonId);
      }
      setError(null);
      await loadCourse(false);
    } catch (err) {
      console.error(err);
      setError('Lesson status update failed.');
    }
  };

  const handleUpload = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!uploadLessonId || !uploadFile) {
      setError('Select a lesson and choose a video file to upload.');
      return;
    }
    try {
      await uploadLessonVideo(Number(uploadLessonId), uploadFile);
      setUploadLessonId('');
      setUploadFile(null);
      setError(null);
      await loadCourse(false);
    } catch (err) {
      console.error(err);
      setError('Video upload failed. Ensure the file size is reasonable.');
    }
  };

  if (loading && !course) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white p-12 text-gray-500">
        <FiLoader className="mr-3 animate-spin text-xl" /> Loading course…
      </div>
    );
  }

  if (!course) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700">
        Unable to locate the requested course.{' '}
        <button className="underline" onClick={() => navigate(-1)} type="button">
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3 text-sm text-purple-700">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-md border border-purple-200 px-3 py-2 font-medium hover:bg-purple-50"
          >
            <FiArrowLeft /> Back to courses
          </button>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 rounded-md border border-gray-200 px-3 py-2 font-medium text-gray-600 hover:bg-gray-50"
          >
            <FiExternalLink /> Dashboard
          </Link>
        </div>
        <button
          type="button"
          onClick={() => loadCourse(false)}
          className="inline-flex items-center gap-2 rounded-md border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <FiRefreshCw className={refreshing ? 'animate-spin' : ''} /> Refresh
        </button>
      </header>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">{course.title}</h1>
            {course.summary && <p className="text-gray-600">{course.summary}</p>}
          </div>
          <span className={`rounded-full px-3 py-1 text-sm font-semibold ${STATUS_BADGE[course.status]}`}>
            {STATUS_LABEL[course.status]}
          </span>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          {course.status === 'draft' && (
            <button
              type="button"
              onClick={() => handleCourseTransition('submit')}
              className="inline-flex items-center gap-2 rounded-md border border-yellow-200 px-3 py-2 text-sm font-medium text-yellow-700 hover:bg-yellow-50"
            >
              <FiEdit3 /> Submit for review
            </button>
          )}
          {course.status === 'in_review' && (
            <button
              type="button"
              onClick={() => handleCourseTransition('publish')}
              className="inline-flex items-center gap-2 rounded-md border border-green-200 px-3 py-2 text-sm font-medium text-green-700 hover:bg-green-50"
            >
              <FiPlus /> Publish course
            </button>
          )}
          {course.status !== 'draft' && course.status !== 'archived' && (
            <button
              type="button"
              onClick={() => handleCourseTransition('revert')}
              className="inline-flex items-center gap-2 rounded-md border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              <FiRefreshCw /> Revert to draft
            </button>
          )}
        </div>

        <form onSubmit={handleCourseUpdate} className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="course-description">
              Description
            </label>
            <textarea
              id="course-description"
              name="description"
              defaultValue={course.description}
              rows={5}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="course-summary">
              Summary
            </label>
            <input
              id="course-summary"
              name="summary"
              defaultValue={course.summary}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="course-level">
              Level
            </label>
            <input
              id="course-level"
              name="level"
              defaultValue={course.level}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="course-duration">
              Estimated duration (minutes)
            </label>
            <input
              id="course-duration"
              name="duration"
              type="number"
              min={0}
              defaultValue={course.estimated_duration_minutes}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-md bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-700"
            >
              <FiEdit3 /> Save details
            </button>
          </div>
        </form>
      </section>

      {error && (
        <div className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 p-4 text-red-700">
          <FiAlertCircle className="text-lg" />
          <span>{error}</span>
        </div>
      )}

      <section className="grid gap-6 md:grid-cols-2">
        <form onSubmit={handleModuleCreate} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Add module</h2>
          <p className="text-sm text-gray-600">Create a new module to group lessons for this course.</p>
          <div className="mt-4 space-y-3">
            <input
              value={moduleForm.title}
              onChange={(event) => setModuleForm((prev) => ({ ...prev, title: event.target.value }))}
              placeholder="Module title"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
            />
            <textarea
              value={moduleForm.description}
              onChange={(event) => setModuleForm((prev) => ({ ...prev, description: event.target.value }))}
              placeholder="Module description"
              rows={3}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
            />
            <input
              type="number"
              min={1}
              value={moduleForm.order}
              onChange={(event) => setModuleForm((prev) => ({ ...prev, order: Number(event.target.value) }))}
              placeholder="Display order"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-md bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-700"
            >
              <FiPlus /> Add module
            </button>
          </div>
        </form>

        <form onSubmit={handleLessonCreate} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Add lesson</h2>
          <p className="text-sm text-gray-600">Lessons require content and/or video before publishing.</p>
          <div className="mt-4 space-y-3">
            <select
              value={lessonForm.moduleId}
              onChange={(event) => setLessonForm((prev) => ({ ...prev, moduleId: event.target.value }))}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
            >
              <option value="">Choose module…</option>
              {course.modules.map((module) => (
                <option key={module.id} value={module.id}>
                  {module.title}
                </option>
              ))}
            </select>
            <input
              value={lessonForm.title}
              onChange={(event) => setLessonForm((prev) => ({ ...prev, title: event.target.value }))}
              placeholder="Lesson title"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
            />
            <textarea
              value={lessonForm.description}
              onChange={(event) => setLessonForm((prev) => ({ ...prev, description: event.target.value }))}
              placeholder="Short description"
              rows={2}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
            />
            <textarea
              value={lessonForm.content}
              onChange={(event) => setLessonForm((prev) => ({ ...prev, content: event.target.value }))}
              placeholder="Lesson outline or starter code"
              rows={4}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
            />
            <input
              type="number"
              min={1}
              value={lessonForm.order}
              onChange={(event) => setLessonForm((prev) => ({ ...prev, order: Number(event.target.value) }))}
              placeholder="Display order"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-md bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-700"
            >
              <FiPlus /> Add lesson
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900">Modules & lessons</h2>
        <p className="text-sm text-gray-600">Manage module and lesson status, and upload lesson recordings.</p>

        <form onSubmit={handleUpload} className="mt-4 flex flex-col gap-3 rounded-lg border border-dashed border-purple-200 bg-purple-50 p-4 md:flex-row md:items-center">
          <select
            value={uploadLessonId}
            onChange={(event) => setUploadLessonId(event.target.value)}
            className="w-full rounded-md border border-purple-200 px-3 py-2 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 md:w-auto"
          >
            <option value="">Select lesson for upload…</option>
            {course.modules.flatMap((module) =>
              module.lessons.map((lesson) => (
                <option key={lesson.id} value={lesson.id}>
                  {module.title} – {lesson.title}
                </option>
              )),
            )}
          </select>
          <input
            type="file"
            accept="video/*"
            onChange={(event) => setUploadFile(event.target.files ? event.target.files[0] : null)}
            className="w-full rounded-md border border-purple-200 px-3 py-2 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 md:w-auto"
          />
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-md bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-700"
          >
            <FiUploadCloud /> Upload video
          </button>
        </form>

        <div className="mt-6 space-y-6">
          {course.modules.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-gray-500">
              No modules yet. Create one to get started.
            </div>
          ) : (
            course.modules.map((module) => (
              <article key={module.id} className="rounded-lg border border-gray-200 p-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{module.title}</h3>
                    {module.description && <p className="text-sm text-gray-600">{module.description}</p>}
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_BADGE[module.status]}`}>
                    {STATUS_LABEL[module.status]}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {module.status === 'draft' && (
                    <button
                      type="button"
                      onClick={() => handleModuleAction(module, 'submit')}
                      className="inline-flex items-center gap-2 rounded-md border border-yellow-200 px-3 py-1 text-xs font-medium text-yellow-700 hover:bg-yellow-50"
                    >
                      <FiEdit3 /> Submit for review
                    </button>
                  )}
                  {module.status === 'in_review' && (
                    <button
                      type="button"
                      onClick={() => handleModuleAction(module, 'publish')}
                      className="inline-flex items-center gap-2 rounded-md border border-green-200 px-3 py-1 text-xs font-medium text-green-700 hover:bg-green-50"
                    >
                      <FiPlus /> Publish module
                    </button>
                  )}
                  {module.status !== 'draft' && module.status !== 'archived' && (
                    <button
                      type="button"
                      onClick={() => handleModuleAction(module, 'revert')}
                      className="inline-flex items-center gap-2 rounded-md border border-gray-200 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50"
                    >
                      <FiRefreshCw /> Revert to draft
                    </button>
                  )}
                </div>

                <ul className="mt-4 space-y-4">
                  {module.lessons.length === 0 ? (
                    <li className="rounded-md border border-dashed border-gray-200 p-4 text-sm text-gray-500">
                      No lessons yet in this module.
                    </li>
                  ) : (
                    module.lessons.map((lesson) => (
                      <li key={lesson.id} className="rounded-md border border-gray-200 p-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <h4 className="text-base font-semibold text-gray-900">{lesson.title}</h4>
                            {lesson.description && <p className="text-sm text-gray-600">{lesson.description}</p>}
                          </div>
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_BADGE[lesson.status]}`}>
                            {STATUS_LABEL[lesson.status]}
                          </span>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-500">
                          <span>Order #{lesson.order}</span>
                          <span>•</span>
                          <span>{lesson.videos.length} video upload(s)</span>
                          {lesson.content && <span>• Has content</span>}
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {lesson.status === 'draft' && (
                            <button
                              type="button"
                              onClick={() => handleLessonAction(lesson.id, 'submit')}
                              className="inline-flex items-center gap-2 rounded-md border border-yellow-200 px-3 py-1 text-xs font-medium text-yellow-700 hover:bg-yellow-50"
                            >
                              <FiEdit3 /> Submit for review
                            </button>
                          )}
                          {lesson.status === 'in_review' && (
                            <button
                              type="button"
                              onClick={() => handleLessonAction(lesson.id, 'publish')}
                              className="inline-flex items-center gap-2 rounded-md border border-green-200 px-3 py-1 text-xs font-medium text-green-700 hover:bg-green-50"
                            >
                              <FiPlus /> Publish lesson
                            </button>
                          )}
                          {lesson.status !== 'draft' && lesson.status !== 'archived' && (
                            <button
                              type="button"
                              onClick={() => handleLessonAction(lesson.id, 'revert')}
                              className="inline-flex items-center gap-2 rounded-md border border-gray-200 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50"
                            >
                              <FiRefreshCw /> Revert to draft
                            </button>
                          )}
                        </div>
                      </li>
                    ))
                  )}
                </ul>
              </article>
            ))
          )}
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900">Audit log</h2>
        <p className="text-sm text-gray-600">
          Track the publishing history of this course, including status changes and reviewers.
        </p>
        <div className="mt-4 space-y-3">
          {auditLog.length === 0 ? (
            <div className="rounded-md border border-dashed border-gray-200 p-4 text-sm text-gray-500">
              No status changes recorded yet.
            </div>
          ) : (
            auditLog.map((entry) => (
              <div key={entry.id} className="flex flex-col gap-1 rounded-md border border-gray-200 p-4 text-sm text-gray-600">
                <div className="flex flex-wrap items-center justify-between gap-2 text-gray-700">
                  <span className="font-medium">
                    {STATUS_LABEL[entry.from_status]} → {STATUS_LABEL[entry.to_status]}
                  </span>
                  <span>{new Date(entry.created_at).toLocaleString()}</span>
                </div>
                {entry.notes && <p className="italic text-purple-800">“{entry.notes}”</p>}
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default CourseDetail;
