// src/pages/CourseLessonsPage.jsx (or similar)

import React, { useState } from 'react';
import {
  FiArrowLeft, FiPlusCircle, FiEdit, FiTrash2, FiPlayCircle, FiClock,
  FiPaperclip, FiSearch, FiList, FiCheckCircle, FiCircle, FiEyeOff, FiEye,
  FiBookOpen
} from 'react-icons/fi'; // Feather icons

// Dummy data for lessons
const lessonsData = [
  {
    id: 'html_lesson_01',
    courseId: 'course_html',
    title: 'Lesson 1: Introduction to HTML & Web Structure',
    description: 'Understand what HTML is, its role in web development, and the basic document structure.',
    duration: '15 min',
    status: 'Published', // 'Published', 'Draft', 'Archived'
    order: 1,
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' // Example video URL
  },
  {
    id: 'html_lesson_02',
    courseId: 'course_html',
    title: 'Lesson 2: Essential HTML Tags & Attributes',
    description: 'Learn about headings, paragraphs, links, images, and common attributes.',
    duration: '20 min',
    status: 'Published',
    order: 2,
    videoUrl: 'https://www.youtube.com/watch?v=some_other_video'
  },
  {
    id: 'html_lesson_03',
    courseId: 'course_html',
    title: 'Lesson 3: Creating Lists (Ordered & Unordered)',
    description: 'How to structure content using ordered and unordered lists in HTML.',
    duration: '10 min',
    status: 'Published',
    order: 3,
    videoUrl: 'https://www.youtube.com/watch?v=list_video'
  },
  {
    id: 'html_lesson_04',
    courseId: 'course_html',
    title: 'Lesson 4: Tables for Tabular Data',
    description: 'Learn to create and style tables for displaying structured data.',
    duration: '25 min',
    status: 'Draft',
    order: 4,
    videoUrl: '' // No video yet for draft
  },
  {
    id: 'html_lesson_05',
    courseId: 'course_html',
    title: 'Lesson 5: Forms & User Input',
    description: 'Design interactive forms to collect user information.',
    duration: '30 min',
    status: 'Published',
    order: 5,
    videoUrl: 'https://www.youtube.com/watch?v=forms_video'
  },
];

// Dummy course data (to get course title)
const dummyCourse = {
  id: 'course_html',
  title: 'Mastering HTML: Building Web Foundations',
  imageUrl: 'https://images.unsplash.com/photo-1549692520-cb2f08a47346?q=80&w=2000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
};

const LessonStatusBadge = ({ status }) => {
  let bgColor = 'bg-gray-100';
  let textColor = 'text-gray-700';
  let icon = <FiCircle />;

  if (status === 'Published') {
    bgColor = 'bg-green-100';
    textColor = 'text-green-800';
    icon = <FiCheckCircle />;
  } else if (status === 'Draft') {
    bgColor = 'bg-yellow-100';
    textColor = 'text-yellow-800';
    icon = <FiEyeOff />;
  } else if (status === 'Archived') {
    bgColor = 'bg-red-100';
    textColor = 'text-red-800';
    icon = <FiEyeOff />; // Could use a different icon for archived
  }

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${bgColor} ${textColor}`}>
      {icon} <span className="ml-1">{status}</span>
    </span>
  );
};


const CourseLessonsPage = ({ courseId = 'course_html' }) => { // Assume courseId is passed as prop
  const [lessons, setLessons] = useState(lessonsData.filter(lesson => lesson.courseId === courseId).sort((a, b) => a.order - b.order));
  const [searchTerm, setSearchTerm] = useState('');

  const currentCourse = dummyCourse; // In a real app, fetch this based on courseId

  const filteredLessons = lessons.filter(lesson =>
    lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lesson.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Drag and Drop handlers (conceptual, would use a library)
  const handleDragStart = (e, lessonId) => {
    e.dataTransfer.setData('lessonId', lessonId);
    e.currentTarget.classList.add('opacity-50', 'border-dashed', 'border-blue-400');
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Necessary to allow drop
    e.currentTarget.classList.add('bg-blue-50', 'shadow-inner');
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('bg-blue-50', 'shadow-inner');
  };

  const handleDrop = (e, targetLessonId) => {
    e.currentTarget.classList.remove('bg-blue-50', 'shadow-inner');
    const draggedLessonId = e.dataTransfer.getData('lessonId');
    const draggedLesson = lessons.find(lesson => lesson.id === draggedLessonId);
    const targetLesson = lessons.find(lesson => lesson.id === targetLessonId);

    if (draggedLesson && targetLesson && draggedLesson.id !== targetLesson.id) {
      const newLessons = [...lessons];
      const draggedIndex = newLessons.findIndex(item => item.id === draggedLessonId);
      const targetIndex = newLessons.findIndex(item => item.id === targetLessonId);

      // Simple reordering logic
      const [removed] = newLessons.splice(draggedIndex, 1);
      newLessons.splice(targetIndex, 0, removed);

      // Update order property to reflect new sequence
      const reorderedLessons = newLessons.map((lesson, index) => ({
        ...lesson,
        order: index + 1
      }));

      setLessons(reorderedLessons);
      // In a real app, you'd send this new order to your backend API
      console.log('New lesson order:', reorderedLessons.map(l => l.title));
    }
    e.currentTarget.classList.remove('opacity-50', 'border-dashed', 'border-blue-400');
  };

  const handleDragEnd = (e) => {
    e.currentTarget.classList.remove('opacity-50', 'border-dashed', 'border-blue-400');
  };


  if (!currentCourse) {
    return <div className="text-center py-20 text-gray-600">Course not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 p-6 md:p-10 font-sans">
      {/* Breadcrumbs & Header */}
      <div className="mb-8">
        <nav className="text-sm font-medium text-gray-500 mb-4">
          <a href="/admin/dashboard" className="hover:text-blue-600">Dashboard</a>
          <span className="mx-2">/</span>
          <a href="/admin/courses" className="hover:text-blue-600">Courses</a>
          <span className="mx-2">/</span>
          <span className="text-blue-600">{currentCourse.title}</span>
          <span className="mx-2">/</span>
          <span>Lessons</span>
        </nav>

        <div className="flex items-center mb-6">
          <button
            onClick={() => window.history.back()} // Simple back button for demo
            className="p-2 mr-4 rounded-full bg-white hover:bg-gray-100 shadow-md transition duration-200 text-gray-600"
            title="Go back to Courses"
          >
            <FiArrowLeft className="text-xl" />
          </button>
          <img
            src={currentCourse.imageUrl}
            alt={currentCourse.title}
            className="w-16 h-16 rounded-lg object-cover shadow-sm mr-4"
          />
          <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">
            <span className="text-blue-600">{currentCourse.title}:</span> Lessons
          </h1>
        </div>

        <p className="text-lg text-gray-600 max-w-3xl">
          Organize and manage the learning modules for this course. Drag and drop to reorder lessons easily.
        </p>
      </div>

      {/* Search & Add Lesson */}
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl mb-8 border border-gray-100 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4">
        <div className="relative flex-grow w-full md:w-auto">
          <input
            type="text"
            placeholder="Search lessons by title or description..."
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-gray-800"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
        </div>
        <button
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-md flex items-center transition duration-300 ease-in-out transform hover:scale-105 w-full md:w-auto justify-center"
          onClick={() => alert(`Add New Lesson for "${currentCourse.title}"!`)}
        >
          <FiPlusCircle className="mr-2 text-xl" />
          Add New Lesson
        </button>
      </div>

      {/* Lessons List */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-4 md:p-6">
        {filteredLessons.length > 0 ? (
          <ul className="space-y-4">
            {filteredLessons.map((lesson, index) => (
              <li
                key={lesson.id}
                draggable // Make item draggable
                onDragStart={(e) => handleDragStart(e, lesson.id)}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, lesson.id)}
                onDragEnd={handleDragEnd}
                className="group relative flex flex-col sm:flex-row items-start sm:items-center bg-gray-50 p-4 rounded-xl border border-gray-100 hover:bg-gray-100 transition-all duration-200 ease-in-out cursor-grab active:cursor-grabbing"
              >
                {/* Drag Handle (Visual Cue) */}
                <div className="absolute top-4 left-4 text-gray-400 group-hover:text-blue-500 transition duration-200 hidden sm:block">
                    <FiList className="text-xl" />
                </div>
                {/* Lesson Number */}
                <div className="flex-shrink-0 text-3xl font-extrabold text-blue-500 mr-4 sm:mr-6 w-12 text-center">
                  {lesson.order}.
                </div>

                {/* Lesson Details */}
                <div className="flex-grow">
                  <h3 className="text-lg font-bold text-gray-900 mb-1 leading-tight">{lesson.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">{lesson.description}</p>
                  <div className="flex items-center text-gray-500 text-xs sm:text-sm">
                    <FiClock className="mr-1.5 text-indigo-500" />
                    <span>{lesson.duration}</span>
                    <span className="mx-2">|</span>
                    <LessonStatusBadge status={lesson.status} />
                    {lesson.videoUrl && (
                      <>
                        <span className="mx-2 hidden sm:block">|</span>
                        <a
                          href={lesson.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-600 hover:text-purple-800 flex items-center ml-auto sm:ml-0"
                          onClick={(e) => e.stopPropagation()} // Prevent parent li click
                        >
                          <FiPlayCircle className="mr-1.5" /> Watch Preview
                        </a>
                      </>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex-shrink-0 flex space-x-3 mt-4 sm:mt-0 sm:ml-4">
                  <button
                    className="p-2 rounded-lg text-blue-600 hover:bg-blue-100 transition duration-200"
                    onClick={(e) => { e.stopPropagation(); alert(`Editing lesson: ${lesson.title}`); }}
                    title="Edit Lesson"
                  >
                    <FiEdit className="text-lg" />
                  </button>
                  <button
                    className="p-2 rounded-lg text-red-600 hover:bg-red-100 transition duration-200"
                    onClick={(e) => { e.stopPropagation(); confirm(`Are you sure you want to delete lesson: ${lesson.title}?`); }}
                    title="Delete Lesson"
                  >
                    <FiTrash2 className="text-lg" />
                  </button>
                  {lesson.status === 'Published' ? (
                     <button
                        className="p-2 rounded-lg text-orange-600 hover:bg-orange-100 transition duration-200"
                        onClick={(e) => { e.stopPropagation(); alert(`Unpublishing lesson: ${lesson.title}`); }}
                        title="Unpublish Lesson"
                      >
                        <FiEyeOff className="text-lg" />
                      </button>
                  ) : (
                    <button
                        className="p-2 rounded-lg text-green-600 hover:bg-green-100 transition duration-200"
                        onClick={(e) => { e.stopPropagation(); alert(`Publishing lesson: ${lesson.title}`); }}
                        title="Publish Lesson"
                      >
                        <FiEye className="text-lg" />
                      </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-10 text-gray-500 text-lg">
            <p className="mb-4">
              <FiBookOpen className="inline-block text-4xl mb-2" />
            </p>
            <p>No lessons found for this course, or none match your search.</p>
            <button
              className="mt-6 bg-purple-500 hover:bg-purple-600 text-white font-bold py-2.5 px-6 rounded-lg transition duration-300"
              onClick={() => alert(`Add New Lesson for "${currentCourse.title}"!`)}
            >
              Add the First Lesson
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseLessonsPage;