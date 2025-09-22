import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/apiClient';

type Lesson = {
  lesson_id: string;
  title: string;
  description?: string;
  order: number;
};

const Lessons: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [search, setSearch] = useState<string>('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('courses/get-all-lessons/', {
        params: { page, search },
      });
      const data = response.data?.data;
      setLessons(data?.lessons || []);
      setTotalPages(data?.pagination?.total_pages || 1);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
      <div className="max-w-5xl mx-auto px-4">
        <h4 className="text-xl font-semibold text-black dark:text-white mb-4 mt-9">Lessons</h4>
        <div className="flex items-center mb-4 gap-2">
          <input
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            placeholder="Search lessons"
            className="p-2 border rounded w-full max-w-md"
          />
        </div>
        {loading && <p>Loading...</p>}
        {!loading && (
          <div className="space-y-3">
            {lessons.map((l) => (
              <Link key={l.lesson_id} to={`/lesson?lesson_id=${l.lesson_id}`}>
                <div className="rounded-2xl bg-white shadow-lg dark:bg-boxdark dark:border-strokedark p-3 flex items-center mb-2">
                  <div className="w-10 h-10 bg-primary rounded-xl flex justify-center items-center text-white font-bold">
                    {l.order}
                  </div>
                  <div className="flex flex-col ml-6 space-y-1">
                    <p className="text-lg font-semibold text-gray-800 dark:text-white">{l.title}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{l.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        <div className="flex items-center gap-2 mt-6">
          <button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
          <span>Page {page} of {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
        </div>
      </div>
    </>
  );
};

export default Lessons;
