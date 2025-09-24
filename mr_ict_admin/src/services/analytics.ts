import api, { resolveApiPath } from './apiClient';

export interface AdminRecentActivityItem {
  id: number;
  event_type: string;
  description: string;
  actor: string | null;
  context: string | null;
  occurred_at: string;
  metadata: Record<string, unknown>;
}

export interface AdminTimeseriesPoint {
  date: string;
  activeStudents: number;
  lessonsCompleted: number;
  assessmentsCompleted: number;
  xpAwarded: number;
}

export interface AdminTopCourseItem {
  courseId: string | null;
  title: string | null;
  enrollments: number;
  completions: number;
  completionRate: number;
}

export interface AdminAnnouncementItem {
  id: number;
  title: string;
  audience: string;
  published_at: string | null;
  expires_at: string | null;
  course: string | null;
}

export interface AdminAnalyticsSummary {
  stats: Record<string, number>;
  recentActivity: AdminRecentActivityItem[];
  timeseries: AdminTimeseriesPoint[];
  topCourses: AdminTopCourseItem[];
  announcements: AdminAnnouncementItem[];
}

interface SummaryResponse {
  message: string;
  data: AdminAnalyticsSummary;
}

export const fetchAdminAnalyticsSummary = async (): Promise<AdminAnalyticsSummary> => {
  const response = await api.get<SummaryResponse>('analytics/admin/summary/');
  return response.data.data;
};

export const buildAnalyticsCsvUrl = (): string =>
  resolveApiPath('analytics/admin/summary/export/');
