import api from './apiClient';

export interface LearningEventPayload {
  event_type: string;
  occurred_at?: string;
  course_id?: string;
  lesson_id?: string;
  assessment_slug?: string;
  metadata?: Record<string, unknown>;
}

export const trackLearningEvent = async (payload: LearningEventPayload): Promise<void> => {
  try {
    await api.post('analytics/events/', payload);
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('Failed to record analytics event', error);
    }
  }
};
