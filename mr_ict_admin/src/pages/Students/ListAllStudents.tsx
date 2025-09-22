// src/pages/AdminStudentsPage.jsx (or similar)

import React, { useCallback, useEffect, useState } from 'react';
import {
  FiSearch,
  FiFilter,
  FiList,
  FiGrid,
  FiUserPlus,
  FiEdit,
  FiTrash2,
  FiMail,
  FiPhone,
  FiMapPin,
  FiAward,
  FiBookOpen,
  FiPlayCircle,
  FiZap,
  FiArchive,
} from 'react-icons/fi'; // Feather icons
import { baseUrl, baseUrlMedia, userToken } from '../../constants';
import { Link, useNavigate } from 'react-router-dom';
import ArchiveConfirmationModal from '../../components/ArchiveConfirmationModal';
import Alert2 from '../UiElements/Alert2';
import Pagination from '../../components/Pagination';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal';

// Dummy data for students
const studentsData = [
  {
    id: 'std001',
    name: 'Akua Mansah',
    email: 'akua.mansah@example.com',
    phone: '+233 24 555 1111',
    school: 'Accra Academy Senior High School',
    region: 'Greater Accra',
    enrollmentDate: '2024-01-20',
    progress: 75, // Percentage
    completedCourses: 3,
    activeCourses: ['HTML Basics'],
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
  },
  {
    id: 'std002',
    name: 'Kofi Boahen',
    email: 'kofi.boahen@example.com',
    phone: '+233 20 444 2222',
    school: 'Prempeh College',
    region: 'Ashanti',
    enrollmentDate: '2024-02-10',
    progress: 40,
    completedCourses: 1,
    activeCourses: ['CSS Styling'],
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
  },
  {
    id: 'std003',
    name: 'Ama Serwaa',
    email: 'ama.serwaa@example.com',
    phone: '+233 55 333 4444',
    school: 'Achimota School',
    region: 'Greater Accra',
    enrollmentDate: '2024-03-01',
    progress: 90,
    completedCourses: 5,
    activeCourses: [],
    avatar: 'https://randomuser.me/api/portraits/women/72.jpg',
  },
  {
    id: 'std004',
    name: 'Kwasi Owusu',
    email: 'kwasi.owusu@example.com',
    phone: '+233 24 111 5555',
    school: 'Mfantsipim School',
    region: 'Central',
    enrollmentDate: '2024-01-05',
    progress: 60,
    completedCourses: 2,
    activeCourses: ['JavaScript Fundamentals', 'HTML Basics'],
    avatar: 'https://randomuser.me/api/portraits/men/88.jpg',
  },
  {
    id: 'std005',
    name: 'Esi Blankson',
    email: 'esi.blankson@example.com',
    phone: '+233 27 777 8888',
    school: "Wesley Girls' High School",
    region: 'Central',
    enrollmentDate: '2024-02-25',
    progress: 20,
    completedCourses: 0,
    activeCourses: ['HTML Basics'],
    avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
  },
  {
    id: 'std006',
    name: 'Yaw Boateng',
    email: 'yaw.boateng@example.com',
    phone: '+233 50 666 7777',
    school: 'Adisadel College',
    region: 'Central',
    enrollmentDate: '2024-04-12',
    progress: 0,
    completedCourses: 0,
    activeCourses: [],
    avatar: 'https://randomuser.me/api/portraits/men/33.jpg',
  },
];

const regions = [
  'All',
  'Greater Accra',
  'Ashanti',
  'Central',
  'Northern',
  'Volta',
  'Western',
  'Eastern',
  'Upper East',
  'Upper West',
  'Brong Ahafo',
];
const schools = [
  'All',
  'Accra Academy Senior High School',
  'Prempeh College',
  'Achimota School',
  'Mfantsipim School',
  "Wesley Girls' High School",
  'Adisadel College',
];

const AllStudents = () => {
  //const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedSchool, setSelectedSchool] = useState('All');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [students, setStudents] = useState([]);
  const [totalPages, setTotalPages] = useState(1); // Default to 1 to avoid issues
  const [loading, setLoading] = useState(false);

  const [itemToDelete, setItemToDelete] = useState(null);
  const [itemToArchive, setItemToArchive] = useState(null);

  // State for delete confirmation modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  //const [alert, setAlert] = useState({ message: '', type: '' });

  const navigate = useNavigate();

  const getProgressBarColor = (progress) => {
    if (progress >= 75) return 'bg-green';
    if (progress >= 40) return 'bg-yellow';
    return 'bg-red-500';
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${baseUrl}api/students/get-all-students/?search=${encodeURIComponent(
          search,
        )}&page=${page}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${userToken}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setStudents(data.data.students);
      setTotalPages(data.data.pagination.total_pages);
      console.log('Total Pages:', data.data.pagination.total_pages);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [baseUrl, search, page, userToken]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleArchive = async (itemId) => {
    const data = { student_id: itemId };

    try {
      const response = await fetch(`${baseUrl}api/students/archive-student/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${userToken}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to delete the item');
      }

      // Refresh the data after deletion
      await fetchData();
      //setAlert({ message: 'Item archived successfully', type: 'success' });
    } catch (error) {
      console.error('Error archiving item:', error);
      //setAlert({
      //  message: 'An error occurred while archiving the item',
      //  type: 'error',
      //});
    } finally {
      setIsArchiveModalOpen(false);
      setItemToArchive(null);
    }
  };

  const openArchiveModal = (itemId) => {
    setItemToArchive(itemId);
    setIsArchiveModalOpen(true);
  };

  const closeArchiveModal = () => {
    setIsArchiveModalOpen(false);
    setItemToArchive(null);
  };

  const closeAlert = () => {
    //setAlert({ message: '', type: '' });
  };



  const handleDelete = async (itemId) => {
    const data = { student_id: itemId };

    try {
      const response = await fetch(`${baseUrl}api/students/delete-student/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${userToken}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to delete the item');
      }

      // Refresh the data after deletion
      await fetchData();
      //setAlert({ message: 'Item deleted successfully', type: 'success' });
    } catch (error) {
      console.error('Error deleting item:', error);
      //setAlert({
      //  message: 'An error occurred while deleting the item',
      //  type: 'error',
      //});
    } finally {
      setIsModalOpen(false);
      setItemToDelete(null);
    }
  };

  const openDeleteModal = (itemId) => {
    setItemToDelete(itemId);
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsModalOpen(false);
    setItemToDelete(null);
  };




  return (
    <div className="min-h-screen font-sans">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 md:mb-0">
          <span className="text-blue-600">Student</span> Directory
        </h1>
        <div className="flex items-center space-x-4">
          <button
            className="bg-graydark hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-md flex items-center transition duration-300 ease-in-out transform hover:scale-105"
            onClick={() => alert('Add New Student functionality!')}
          >
            <FiUserPlus className="mr-2 text-xl" />
            Add New Student
          </button>
          <Link to={'/archived-students'}>
            <button className="bg-graydark hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-md flex items-center transition duration-300 ease-in-out transform hover:scale-105">
              Archives
            </button>
          </Link>
          <div className="flex bg-white dark:bg-graydark rounded-lg p-1 shadow-inner">
            <button
              className={`p-2 rounded-lg transition duration-200 ${
                viewMode === 'grid'
                  ? 'bg-blue-500 text-white shadow'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              <FiGrid className="text-xl" />
            </button>
            <button
              className={`p-2 rounded-lg transition duration-200 ${
                viewMode === 'list'
                  ? 'bg-blue-500 text-white shadow'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => setViewMode('list')}
              title="List View"
            >
              <FiList className="text-xl" />
            </button>
          </div>
        </div>
      </div>

      {/* Search & Filters Section */}
      <div className="bg-white dark:bg-boxdark p-6 md:p-8 rounded-2xl shadow-xl mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Search Input */}
          <div className="relative">
            <label htmlFor="student-search" className="sr-only">
              Search Students
            </label>
            <input
              type="text"
              id="student-search"
              placeholder="Search by name, email, school..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:bg-boxdark rounded-xl focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-gray-800"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
          </div>

          {/* Region Filter */}
          <div>
            <label htmlFor="region-filter" className="sr-only">
              Filter by Region
            </label>
            <div className="relative">
              <select
                id="region-filter"
                className="w-full pl-4 pr-10 py-3 border border-gray-300 dark:bg-boxdark rounded-xl appearance-none focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-gray-800"
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
              >
                {regions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
              <FiMapPin className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl pointer-events-none" />
            </div>
          </div>

          {/* School Filter */}
          <div>
            <label htmlFor="school-filter" className="sr-only">
              Filter by School
            </label>
            <div className="relative">
              <select
                id="school-filter"
                className="w-full pl-4 pr-10 py-3 border border-gray-300 dark:bg-boxdark rounded-xl appearance-none focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-gray-800"
                value={selectedSchool}
                onChange={(e) => setSelectedSchool(e.target.value)}
              >
                {schools.map((school) => (
                  <option key={school} value={school}>
                    {school}
                  </option>
                ))}
              </select>
              <FiBookOpen className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Student List/Grid */}
      {students !== null ? (
        <>
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-3">
              {students.map((student) => (
                  <div
                    key={student.student_id}
                    className="bg-white dark:bg-boxdark rounded-2xl shadow-md p-6 flex flex-col items-center text-center transition-all duration-300 hover:shadow-lg hover:border-blue-200 border border-transparent cursor-pointer"
                    onClick={() => {
                      var student_id = student.student_id;
                      navigate('/student-details', { state: { student_id } });
                    }}
                  >
                    <img
                      src={`${baseUrlMedia}${student.photo}`}
                      alt={student.full_name}
                      className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-blue-100 shadow-md"
                    />
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {student.full_name}
                    </h3>
                    <p className="text-blue-600 font-medium text-sm mb-2">
                      {student.school_name}
                    </p>

                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                      <div
                        className={`h-2.5 rounded-full ${getProgressBarColor(
                          student.progress,
                        )}`}
                        style={{ width: `${student.progress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-600 mb-4">
                      {student.progress}% Course Progress
                    </p>

                    <div className="text-gray-500 text-sm space-y-1 mb-4 w-full">
                      <p className="flex items-center justify-center">
                        <FiAward className="mr-2 text-purple-500" />{' '}
                        {student.completed_courses} Courses Completed
                      </p>

                      <p className="flex items-center justify-center">
                        <FiPlayCircle className="mr-2 text-green-500" /> Active:{' '}
                        {student.active_lesson}
                      </p>
                    </div>

                    <div className="border-t border-gray-100 pt-4 flex justify-around w-full">
                      <button
                        className="text-blue-600 hover:text-blue-800 transition duration-200 flex items-center text-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          alert(`Editing ${student.full_name}`);
                        }}
                        title="Edit Student"
                      >
                        <FiEdit className="mr-1" /> Edit
                      </button>
                      <button
                        className="text-blue-600 hover:text-blue-800 transition duration-200 flex items-center text-sm"
                        onClick={(e) =>{ 
                              e.stopPropagation();

                          openArchiveModal(student.student_id)}}
                        title="Archive Student"
                      >
                        <FiArchive className="mr-1" />
                        Archive
                      </button>

                      <button
                        className="z-10 text-red-600 hover:text-red-800 transition duration-200 flex items-center text-sm"
                        onClick={(e) => {
                              e.stopPropagation();
                          
                          openDeleteModal(student.student_id)}} // Pass the ID of the item to be deleted

                      >
                        <FiTrash2 className="mr-1" /> Delete
                      </button>
                    </div>
                  </div>
              ))}
            </div>
          )}

          {viewMode === 'list' && (
            <div className="bg-white dark:bg-boxdark rounded-2xl shadow-md overflow-hidden mb-3">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Student Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      School
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell"
                    >
                      Progress
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell"
                    >
                      Completed Courses
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell"
                    >
                      Active Courses
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-boxdark divide-y divide-gray-200">
                  {students.map((student) => (
                    <tr
                      key={student.student_id}
                      className="hover:bg-gray-50 transition duration-150 ease-in-out cursor-pointer"
                      onClick={() => {
                        var student_id = student.student_id;
                        navigate('/student-details', { state: { student_id } });
                      }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img
                              className="h-10 w-10 rounded-full"
                              src={`${baseUrlMedia}${student.photo}`}
                              alt={student.full_name}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {student.full_name}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <FiMail className="mr-1" /> {student.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {student.school_name}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <FiMapPin className="mr-1" /> {student.school_region}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                        <div className="w-32 bg-gray-200 rounded-full h-2.5">
                          <div
                            className={`h-2.5 rounded-full ${getProgressBarColor(
                              student.progress,
                            )}`}
                            style={{ width: `${student.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600 mt-1 block">
                          {student.progress}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          <FiAward className="mr-1" />{' '}
                          {student.completed_courses}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden xl:table-cell">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <FiPlayCircle className="mr-1" />{' '}
                          {student.active_lesson}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          className="text-blue-600 hover:text-blue-800 transition duration-200 mr-3"
                          onClick={(e) => {
                            e.stopPropagation();
                            alert(`Editing ${student.full_name}`);
                          }}
                          title="Edit Student"
                        >
                          <FiEdit className="inline-block text-lg" />
                        </button>
                        <button
                          className="text-blue-600 hover:text-blue-800 transition duration-200 mr-3"
                          onClick={(e) => {
                                e.stopPropagation();

                            openArchiveModal(student.student_id)}
                          }
                        >
                          <FiArchive className="inline-block text-lg" />
                        </button>

                        <button
                          className="text-red-600 dark:text-red-900 hover:text-red-800 transition duration-200"
                          onClick={(e) => {
                            e.stopPropagation();

                            openDeleteModal(student.student_id)}} // Pass the ID of the item to be deleted

                        >
                          <FiTrash2 className="inline-block text-lg" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      ) : (
        <div className="col-span-full text-center py-12 text-gray-500 text-xl bg-white dark:bg-boxdark rounded-xl shadow-md">
          <p className="mb-4">
            <FiSearch className="inline-block text-4xl mb-2" />
          </p>
          <p>
            No students found matching your criteria. Try adjusting your search
            or filters.
          </p>
        </div>
      )}

      {/* Optional: Pagination (if many students) */}
      {/* ... (same as before) */}

      <Pagination
        pagination={{
          page_number: page,
          total_pages: totalPages,
          next: page < totalPages ? page + 1 : null,
          previous: page > 1 ? page - 1 : null,
        }}
        setPage={setPage}
      />

      <ArchiveConfirmationModal
        isOpen={isArchiveModalOpen}
        itemId={itemToArchive}
        onConfirm={handleArchive}
        onCancel={closeArchiveModal}
      />


      <DeleteConfirmationModal
            isOpen={isModalOpen}
            itemId={itemToDelete}
            onConfirm={handleDelete}
            onCancel={closeDeleteModal}
          />

      {/* Render the alert */}
      <Alert2 message={alert.message} type={alert.type} onClose={closeAlert} />
    </div>
  );
};

export default AllStudents;
