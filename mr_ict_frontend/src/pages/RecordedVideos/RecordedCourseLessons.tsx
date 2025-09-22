import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/apiClient';
import html from '../../images/html.png';

type Recording = {
  id: number;
  title: string;
  video_file: string;
  duration: number;
};

const RecordedCourseLessons: React.FC = () => {
  const [items, setItems] = useState<Recording[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('recordings/');
      setItems(res.data?.data || []);
    } catch (e) {
      setError('Failed to load recordings');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h4 className="text-2xl font-semibold text-black dark:text-black mb-8">Lessons</h4>

      {loading && <p>Loading…</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((rec) => (
          <Link to={`/record-player?id=${rec.id}`} key={rec.id}>
            <div className="rounded-2xl bg-white shadow-lg dark:bg-boxdark dark:border-strokedark p-4 flex items-center space-x-4 hover:shadow-2xl transition duration-300">
              <div className="w-10 h-10 bg-primary rounded-xl flex justify-center items-center shadow-lg overflow-hidden">
                <img src={html} alt="Lesson" className="w-10 h-10 object-contain" />
              </div>
              <div className="flex flex-col flex-grow space-y-2">
                <p className="text-lg font-semibold text-gray-800 dark:text-white">{rec.title}</p>
                <p className="text-base font-medium text-gray-600 dark:text-gray-300">{Math.round(rec.duration)}s</p>
              </div>
            </div>
          </Link>
        ))}
        {!loading && !error && items.length === 0 && (
          <p className="text-gray-500">No lessons available yet.</p>
        )}
      </div>
    </div>
  );
};

export default RecordedCourseLessons;
