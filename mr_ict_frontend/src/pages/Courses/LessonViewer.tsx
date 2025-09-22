import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../../services/apiClient';

type Lesson = {
  lesson_id: string;
  title: string;
  description?: string;
  content?: string;
  video_url?: string;
};

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const LessonViewer: React.FC = () => {
  const query = useQuery();
  const lessonId = query.get('lesson_id') || '';

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!lessonId) return;
    setLoading(true);
    setError('');
    api
      .get(`courses/get-lesson-details/`, { params: { lesson_id: lessonId } })
      .then((res) => setLesson(res.data.data))
      .catch((err) => {
        const data = err?.response?.data;
        if (data?.errors) {
          const msgs = Object.values(data.errors).flat() as string[];
          setError(msgs.join('\n'));
        } else {
          setError('Failed to load lesson');
        }
      })
      .finally(() => setLoading(false));
  }, [lessonId]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Lesson Viewer</h1>
      {!lessonId && <p className="text-gray-600">Provide a lesson_id in the URL query.</p>}
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {lesson && (
        <div className="space-y-3">
          <h2 className="text-xl font-semibold">{lesson.title}</h2>
          {lesson.video_url && (
            <video src={lesson.video_url} controls className="w-full max-w-3xl rounded" />
          )}
          {lesson.description && <p className="text-gray-700">{lesson.description}</p>}
          {lesson.content && (
            <div className="p-4 bg-white rounded shadow">
              <pre className="whitespace-pre-wrap">{lesson.content}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LessonViewer;

