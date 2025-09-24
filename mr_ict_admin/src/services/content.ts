import api from './apiClient';
import { AuditLogEntry, Course, Lesson, Module } from '../types/content';

export const listCourses = async (params?: Record<string, unknown>): Promise<Course[]> => {
  const response = await api.get<Course[]>('admin/content/courses/', { params });
  return response.data;
};

export const fetchCourse = async (courseId: number | string): Promise<Course> => {
  const response = await api.get<Course>(`admin/content/courses/${courseId}/`);
  return response.data;
};

export const createCourse = async (payload: Partial<Course>): Promise<Course> => {
  const response = await api.post<Course>('admin/content/courses/', payload);
  return response.data;
};

export const updateCourse = async (courseId: number | string, payload: Partial<Course>): Promise<Course> => {
  const response = await api.patch<Course>(`admin/content/courses/${courseId}/`, payload);
  return response.data;
};

const postWithNotes = async (url: string, notes?: string): Promise<Course | Module | Lesson> => {
  const response = await api.post(url, notes ? { notes } : {});
  return response.data;
};

export const submitCourseForReview = (courseId: number | string, notes?: string) =>
  postWithNotes(`admin/content/courses/${courseId}/submit-for-review/`, notes) as Promise<Course>;

export const publishCourse = (courseId: number | string, notes?: string) =>
  postWithNotes(`admin/content/courses/${courseId}/publish/`, notes) as Promise<Course>;

export const revertCourse = (courseId: number | string, notes?: string) =>
  postWithNotes(`admin/content/courses/${courseId}/revert/`, notes) as Promise<Course>;

export const createModule = async (payload: Partial<Module>): Promise<Module> => {
  const response = await api.post<Module>('admin/content/modules/', payload);
  return response.data;
};

export const updateModule = async (moduleId: number | string, payload: Partial<Module>): Promise<Module> => {
  const response = await api.patch<Module>(`admin/content/modules/${moduleId}/`, payload);
  return response.data;
};

export const submitModuleForReview = (moduleId: number | string, notes?: string) =>
  postWithNotes(`admin/content/modules/${moduleId}/submit-for-review/`, notes) as Promise<Module>;

export const publishModule = (moduleId: number | string, notes?: string) =>
  postWithNotes(`admin/content/modules/${moduleId}/publish/`, notes) as Promise<Module>;

export const revertModule = (moduleId: number | string, notes?: string) =>
  postWithNotes(`admin/content/modules/${moduleId}/revert/`, notes) as Promise<Module>;

export const createLesson = async (payload: Partial<Lesson>): Promise<Lesson> => {
  const response = await api.post<Lesson>('admin/content/lessons/', payload);
  return response.data;
};

export const updateLesson = async (lessonId: number | string, payload: Partial<Lesson>): Promise<Lesson> => {
  const response = await api.patch<Lesson>(`admin/content/lessons/${lessonId}/`, payload);
  return response.data;
};

export const submitLessonForReview = (lessonId: number | string, notes?: string) =>
  postWithNotes(`admin/content/lessons/${lessonId}/submit-for-review/`, notes) as Promise<Lesson>;

export const publishLesson = (lessonId: number | string, notes?: string) =>
  postWithNotes(`admin/content/lessons/${lessonId}/publish/`, notes) as Promise<Lesson>;

export const revertLesson = (lessonId: number | string, notes?: string) =>
  postWithNotes(`admin/content/lessons/${lessonId}/revert/`, notes) as Promise<Lesson>;

export const uploadLessonVideo = async (lessonId: number | string, file: File, language = 'English') => {
  const formData = new FormData();
  formData.append('lesson', String(lessonId));
  formData.append('video_file', file);
  formData.append('language', language);

  const response = await api.post('admin/content/lesson-media/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const fetchCourseAuditLog = async (courseId: number | string): Promise<AuditLogEntry[]> => {
  const response = await api.get<AuditLogEntry[]>(`admin/content/courses/${courseId}/audit-log/`);
  return response.data;
};
