export type PublishStatus = 'draft' | 'in_review' | 'published' | 'archived';

export interface LessonVideo {
  id: number;
  lesson: number;
  video_url: string | null;
  subtitles_url: string | null;
  duration: number | null;
  video_file: string | null;
  language: string;
  created_at: string;
  updated_at: string;
}

export interface Lesson {
  id: number;
  lesson_id: string;
  course: number | null;
  module: number | null;
  module_title: string | null;
  title: string;
  description: string | null;
  content: string | null;
  video_url: string | null;
  order: number;
  duration_seconds: number;
  thumbnail: string | null;
  status: PublishStatus;
  status_display: string;
  review_notes: string;
  submitted_for_review_at: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  videos: LessonVideo[];
}

export interface Module {
  id: number;
  course: number;
  title: string;
  description: string;
  order: number;
  status: PublishStatus;
  status_display: string;
  review_notes: string;
  submitted_for_review_at: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  lessons: Lesson[];
}

export interface Course {
  id: number;
  course_id: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  image: string | null;
  tags: string[];
  level: string;
  estimated_duration_minutes: number;
  status: PublishStatus;
  status_display: string;
  review_notes: string;
  submitted_for_review_at: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  modules: Module[];
}

export interface AuditLogEntry {
  id: number;
  content_type: number;
  object_id: number;
  from_status: PublishStatus;
  to_status: PublishStatus;
  notes: string;
  performed_by: number | null;
  created_at: string;
  content_object_repr: string;
}
