/**
 * Adapters to transform backend API data to frontend format
 */

import type { Course } from '../data/mockData'

/**
 * Transform backend course data to frontend Course type
 */
export function adaptCourse(backendCourse: any): Course {
  return {
    id: backendCourse.course_id || backendCourse.id,
    title: backendCourse.title,
    subtitle: backendCourse.summary || '',
    summary: backendCourse.description || backendCourse.summary || '',
    heroImage: backendCourse.image || '/placeholder-course.jpg',
    track: 'Web' as const, // Default - would need track field from backend
    level: (backendCourse.level || 'Beginner') as 'Beginner' | 'Intermediate' | 'Advanced',
    tags: backendCourse.tags || [],
    xp: 1000, // Default - would need xp field from backend
    hours: Math.round((backendCourse.estimated_duration_minutes || 60) / 60),
    color: 'primary', // Default color
    spotlight: backendCourse.description || '',
    instructors: [], // Would need instructors from backend
    modules: (backendCourse.modules || []).map((module: any) => ({
      id: module.module_id || module.id,
      title: module.title,
      lessons: (module.lessons || []).map((lesson: any) => ({
        id: lesson.lesson_id || lesson.id,
        title: lesson.title,
        summary: lesson.summary || '',
        type: (lesson.lesson_type || 'video') as 'video' | 'project' | 'quiz' | 'reflection',
        duration: `${Math.round((lesson.estimated_duration_minutes || 10))} min`,
      })),
    })),
  }
}

/**
 * Transform array of backend courses
 */
export function adaptCourses(backendCourses: any[]): Course[] {
  return backendCourses.map(adaptCourse)
}
