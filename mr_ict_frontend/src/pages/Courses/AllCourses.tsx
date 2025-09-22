import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/apiClient';

type Course = {
  course_id: string;
  title: string;
  description?: string;
  image?: string;
};

const AllCourses: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [search, setSearch] = useState<string>('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('courses/get-all-courses/', {
        params: { page, search },
      });
      const data = response.data?.data;
      setCourses(data?.courses || []);
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
      <div className="max-w-7xl mx-auto px-4">
        <h4 className="text-xl font-semibold text-black dark:text-white mb-4 mt-9">Available Courses</h4>
        <div className="flex items-center mb-4 gap-2">
          <input
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            placeholder="Search courses"
            className="p-2 border rounded w-full max-w-md"
          />
        </div>
        {loading && <p>Loading...</p>}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {courses.map((c) => (
              <div key={c.course_id} className="rounded-2xl bg-white shadow-lg dark:bg-boxdark dark:border-strokedark p-5">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-primary rounded-xl flex justify-center items-center text-white font-bold">
                    {c.title?.[0] || 'C'}
                  </div>
                  <div className="flex-1">
                    <p className="text-lg font-semibold text-gray-800 dark:text-white">{c.title}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">{c.description}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <Link to={`/lessons`}><span className="text-blue-600 underline">View Lessons</span></Link>
                </div>
              </div>
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

export default AllCourses;
