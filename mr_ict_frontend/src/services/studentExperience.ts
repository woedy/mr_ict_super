import api from './apiClient';

export interface StudentProfile {
  student_id: string;
  email: string;
  first_name: string;
  last_name: string;
  photo: string | null;
  school_name: string | null;
  preferred_language: string | null;
  accessibility_preferences: string[];
  interest_tags: string[];
  allow_offline_downloads: boolean;
  has_completed_onboarding: boolean;
  onboarding_completed_at: string | null;
}

export interface DashboardData {
  user: {
    user_id: string;
    first_name: string;
    last_name: string;
    photo: string | null;
    preferred_language: string | null;
    streak_days: number;
    requires_onboarding: boolean;
  };
  notifications: {
    unread: number;
    messages: number;
  };
  overview: {
    in_progress: number;
    completed: number;
    challenges_completed: number;
    xp: number;
  };
  resume_learning: Array<ResumeLearningItem>;
  recommended_courses: CourseSummary[];
  badges: Array<{
    id: number;
    name: string | null;
    criteria: string | null;
    image: string | null;
    challenge_title: string | null;
    earned_at: string | null;
  }>;
  practice: {
    sections: Array<{
      title: string;
      items: Array<{
        id: number;
        title: string | null;
        difficulty: string | null;
        course_title: string | null;
      }>;
    }>;
  };
}

export interface ResumeLearningItem {
  student_lesson_id: number;
  lesson_id: string;
  lesson_title: string;
  course_id: string;
  course_title: string;
  lessons_completed: number;
  total_lessons: number;
  progress_percent: number;
  thumbnail: string | null;
  updated_at: string;
}

export interface CourseSummary {
  course_id: string;
  slug: string;
  title: string;
  summary: string | null;
  description: string | null;
  level: string | null;
  estimated_duration_minutes: number;
  tags: string[];
  image: string | null;
  modules_count: number;
  lessons_count: number;
  is_enrolled: boolean;
  progress_percent: number;
  resume_lesson_id: string | null;
}

export interface CourseDetail extends Omit<CourseSummary, 'modules_count' | 'lessons_count'> {
  modules: Array<{
    id: number;
    title: string;
    description: string | null;
    order: number;
    lessons: Array<{
      lesson_id: string;
      title: string;
      description: string | null;
      order: number;
      duration_seconds: number;
      thumbnail: string | null;
    }>;
  }>;
}

export interface LessonPlaybackData {
  lesson: {
    lesson_id: string;
    title: string;
    description: string | null;
    duration_seconds: number;
    course: {
      course_id: string | null;
      title: string | null;
      slug: string | null;
    };
    module: {
      id: number | null;
      title: string | null;
    };
  };
  primary_video: LessonVideoAsset | null;
  insert_videos: LessonVideoAsset[];
  insert_outputs: Array<{
    id: number;
    timestamp: number;
    content: string | null;
    window_position: Record<string, unknown>;
    window_dimension: Record<string, unknown>;
    subtitles_url: string | null;
  }>;
  code_snippets: Array<{
    id: number;
    timestamp: number;
    code_content: string;
    cursor_position: Record<string, unknown>;
    scroll_position: Record<string, unknown>;
    is_highlight: boolean;
    output: string | null;
  }>;
  assignments: Array<{
    id: number;
    title: string;
    instructions: string;
    expected_output: string | null;
    code_template: string | null;
    difficulty: string | null;
  }>;
  download_manifest: Array<{
    type: string;
    label: string;
    url: string | null;
  }>;
  playback_state: {
    completed: boolean;
    last_position_seconds: number;
    resume_snippet_id: number | null;
    last_viewed_at: string | null;
  };
  transcript: string | null;
}

export interface AssessmentQuestion {
  id: number;
  question_text: string;
  question_type: string;
  options: string[] | null;
  order: number;
  points: number;
}

export interface AssessmentSummary {
  id: number;
  slug: string;
  title: string;
  description: string;
  tags: string[];
  lesson_title: string | null;
  course_title: string | null;
  passing_score: number;
  time_limit_seconds: number | null;
  max_attempts: number;
  is_practice: boolean;
  reward_xp: number;
  issues_certificate: boolean;
  available_from: string | null;
  available_until: string | null;
  attempts_used: number;
  attempts_remaining: number;
  is_available: boolean;
}

export interface AssessmentDetail extends AssessmentSummary {
  questions: AssessmentQuestion[];
}

export interface AssessmentAttemptResult {
  score: number;
  percentage: number;
  status: string;
  awarded_xp: number;
  attempts_remaining: number;
  certificate: {
    id: number;
    title: string;
    issued_at: string;
    issued_by: string;
    download_url: string;
  } | null;
  badge: {
    id: number;
    name: string | null;
    criteria: string | null;
    image: string | null;
  } | null;
  results: Array<{
    question_id: number;
    correct: boolean;
    earned_points: number;
    possible_points: number;
    feedback: string;
  }>;
}

export interface ProgressSummary {
  xp: {
    total: number;
    events: Array<{
      id: number;
      amount: number;
      source: string;
      description: string;
      reference: string;
      balance_after: number;
      created_at: string;
    }>;
  };
  badges: Array<{
    id: number;
    name: string | null;
    criteria: string | null;
    image: string | null;
    challenge_title: string | null;
    earned_at: string;
  }>;
  certificates: Array<{
    id: number;
    title: string;
    issued_at: string;
    issued_by: string;
    description: string;
    download_url: string;
  }>;
  recent_assessments: Array<{
    id: number;
    assessment: {
      title: string;
      slug: string;
      lesson_title: string | null;
    };
    score: number;
    percentage: number;
    status: string;
    awarded_xp: number;
    completed_at: string;
  }>;
}

export interface Announcement {
  id: number;
  title: string;
  body: string;
  audience: string;
  course: number | null;
  course_title: string | null;
  published_by: number | null;
  published_by_name: string | null;
  published_at: string;
  expires_at: string | null;
  is_pinned: boolean;
}

export interface LessonComment {
  id: number;
  student: {
    id: number;
    name: string;
  };
  body: string;
  created_at: string;
  is_pinned?: boolean;
  like_count: number;
  liked: boolean;
  replies: Array<{
    id: number;
    student: {
      id: number;
      name: string;
    };
    body: string;
    created_at: string;
    like_count: number;
    liked: boolean;
  }>;
}

export interface LessonVideoAsset {
  id: number;
  type: string;
  url: string | null;
  duration?: number | null;
  language?: string | null;
  timestamp?: number | null;
  subtitles_url?: string | null;
}

export interface PaginatedCourses {
  count: number;
  next: string | null;
  previous: string | null;
  results: CourseSummary[];
}

export const getStudentProfile = async (): Promise<StudentProfile> => {
  const response = await api.get('students/experience/me/');
  return response.data.data as StudentProfile;
};

export const updateStudentProfile = async (
  payload: Partial<StudentProfile> & { complete_onboarding?: boolean },
): Promise<StudentProfile> => {
  const response = await api.patch('students/experience/me/', payload);
  return response.data.data as StudentProfile;
};

export const fetchDashboard = async (): Promise<DashboardData> => {
  const response = await api.get('students/experience/dashboard/');
  return response.data.data as DashboardData;
};

export const fetchCourseCatalog = async (
  params: Record<string, string | number | undefined>,
): Promise<PaginatedCourses> => {
  const response = await api.get('students/experience/catalog/', { params });
  return response.data as PaginatedCourses;
};

export const fetchCourseDetail = async (courseId: string): Promise<CourseDetail> => {
  const response = await api.get(`students/experience/catalog/${courseId}/`);
  return response.data.data as CourseDetail;
};

export const enrollInCourse = async (courseId: string): Promise<CourseDetail> => {
  const response = await api.post(`students/experience/catalog/${courseId}/enroll/`);
  return response.data.data as CourseDetail;
};

export const unenrollFromCourse = async (courseId: string): Promise<void> => {
  await api.delete(`students/experience/catalog/${courseId}/enroll/`);
};

export const fetchLessonPlayback = async (lessonId: string): Promise<LessonPlaybackData> => {
  const response = await api.get(`students/experience/lessons/${lessonId}/`);
  return response.data.data as LessonPlaybackData;
};

export const updateLessonProgress = async (
  lessonId: string,
  payload: { last_position_seconds?: number; completed?: boolean; resume_snippet_id?: number | null },
): Promise<{ completed: boolean; last_position_seconds: number; resume_snippet_id: number | null; progress_percent: number }> => {
  const response = await api.post(`students/experience/lessons/${lessonId}/progress/`, payload);
  return response.data.data;
};

export const fetchAssessments = async (): Promise<AssessmentSummary[]> => {
  const response = await api.get('assessments/student/');
  return response.data.data as AssessmentSummary[];
};

export const fetchAssessmentDetail = async (slug: string): Promise<AssessmentDetail> => {
  const response = await api.get(`assessments/student/${slug}/`);
  return response.data.data as AssessmentDetail;
};

export const submitAssessmentAttempt = async (
  slug: string,
  payload: { answers: Record<string, unknown>; started_at?: string },
): Promise<AssessmentAttemptResult> => {
  const response = await api.post(`assessments/student/${slug}/attempt/`, payload);
  return response.data.data as AssessmentAttemptResult;
};

export const fetchProgressSummary = async (): Promise<ProgressSummary> => {
  const response = await api.get('students/experience/progression/summary/');
  return response.data.data as ProgressSummary;
};

export const fetchAnnouncements = async (
  params?: { course?: string },
): Promise<Announcement[]> => {
  const response = await api.get('notifications/student/announcements/', { params });
  return response.data.data as Announcement[];
};

export const fetchLessonComments = async (lessonId: string): Promise<LessonComment[]> => {
  const response = await api.get(`students/experience/lessons/${lessonId}/comments/`);
  return response.data.data as LessonComment[];
};

export const postLessonComment = async (
  lessonId: string,
  body: string,
  parentId?: number,
): Promise<LessonComment> => {
  const response = await api.post(`students/experience/lessons/${lessonId}/comments/`, {
    body,
    parent_id: parentId,
  });
  return response.data.data as LessonComment;
};

export const toggleCommentLike = async (
  commentId: number,
): Promise<{ liked: boolean; like_count: number }> => {
  const response = await api.post(`students/experience/comments/${commentId}/like/`);
  return response.data.data as { liked: boolean; like_count: number };
};
