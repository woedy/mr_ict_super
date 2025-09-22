// src/pages/CourseChallengesPage.jsx (or similar)

import React, { useState } from 'react';
import {
  FiArrowLeft, FiPlusCircle, FiEdit, FiTrash2, FiSearch, FiCode,
  FiZap, FiHelpCircle, FiCheckSquare, FiStar, FiEyeOff, FiEye,
  FiList
} from 'react-icons/fi'; // Feather icons

// Dummy data for challenges
const challengesData = [
  {
    id: 'html_challenge_01',
    courseId: 'course_html',
    title: 'Challenge 1: Basic HTML Structure',
    description: 'Create a simple HTML document with a head, body, title, and a single heading.',
    type: 'Code Editor', // 'Code Editor', 'Multiple Choice', 'Fill-in-the-Blanks'
    difficulty: 'Easy', // 'Easy', 'Medium', 'Hard'
    status: 'Published',
    order: 1,
  },
  {
    id: 'html_challenge_02',
    courseId: 'course_html',
    title: 'Challenge 2: Image & Link Integration',
    description: 'Add an image and a hyperlink to an existing HTML page. Ensure accessibility attributes.',
    type: 'Code Editor',
    difficulty: 'Medium',
    status: 'Published',
    order: 2,
  },
  {
    id: 'html_challenge_03',
    courseId: 'course_html',
    title: 'Challenge 3: Semantic Tag Identification',
    description: 'Identify the correct semantic HTML5 tag for given content descriptions.',
    type: 'Multiple Choice',
    difficulty: 'Easy',
    status: 'Published',
    order: 3,
  },
  {
    id: 'html_challenge_04',
    courseId: 'course_html',
    title: 'Challenge 4: Table Construction',
    description: 'Build an HTML table to display sample student data with headers and rows.',
    type: 'Code Editor',
    difficulty: 'Medium',
    status: 'Draft',
    order: 4,
  },
  {
    id: 'html_challenge_05',
    courseId: 'course_html',
    title: 'Challenge 5: Form Validation Basics',
    description: 'Create a simple contact form with required fields and basic input types.',
    type: 'Code Editor',
    difficulty: 'Hard',
    status: 'Published',
    order: 5,
  },
];

// Dummy course data (to get course title)
const dummyCourse = {
  id: 'course_html',
  title: 'Mastering HTML: Building Web Foundations',
  imageUrl: 'https://images.unsplash.com/photo-1549692520-cb2f08a47346?q=80&w=2000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
};

const ChallengeStatusBadge = ({ status }) => {
  let bgColor = 'bg-gray-100';
  let textColor = 'text-gray-700';
  let icon = <FiEyeOff />;

  if (status === 'Published') {
    bgColor = 'bg-green-100';
    textColor = 'text-green-800';
    icon = <FiEye />;
  } else if (status === 'Draft') {
    bgColor = 'bg-yellow-100';
    textColor = 'text-yellow-800';
    icon = <FiEyeOff />;
  } else if (status === 'Archived') {
    bgColor = 'bg-red-100';
    textColor = 'text-red-800';
    icon = <FiTrash2 />;
  }

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${bgColor} ${textColor}`}>
      {icon} <span className="ml-1">{status}</span>
    </span>
  );
};

const ChallengeTypeBadge = ({ type }) => {
  let bgColor = 'bg-blue-100';
  let textColor = 'text-blue-800';
  let icon = <FiHelpCircle />; // Default icon

  if (type === 'Code Editor') {
    icon = <FiCode />;
  } else if (type === 'Multiple Choice') {
    icon = <FiCheckSquare />;
  } else if (type === 'Fill-in-the-Blanks') {
    icon = <FiZap />;
  }

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${bgColor} ${textColor}`}>
      {icon} <span className="ml-1">{type}</span>
    </span>
  );
};

const DifficultyStars = ({ difficulty }) => {
  const stars = [];
  let numStars = 0;
  let color = 'text-gray-400';

  if (difficulty === 'Easy') {
    numStars = 1;
    color = 'text-green-500';
  } else if (difficulty === 'Medium') {
    numStars = 2;
    color = 'text-yellow-500';
  } else if (difficulty === 'Hard') {
    numStars = 3;
    color = 'text-red-500';
  }

  for (let i = 0; i < 3; i++) {
    stars.push(
      <FiStar
        key={i}
        className={`${i < numStars ? color : 'text-gray-300'}`}
      />
    );
  }
  return <div className="flex items-center space-x-0.5">{stars}</div>;
};


const CourseChallengesPage = ({ courseId = 'course_html' }) => { // Assume courseId is passed as prop
  const [challenges, setChallenges] = useState(challengesData.filter(challenge => challenge.courseId === courseId).sort((a, b) => a.order - b.order));
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedType, setSelectedType] = useState('All');

  const currentCourse = dummyCourse; // In a real app, fetch this based on courseId

  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];
  const types = ['All', 'Code Editor', 'Multiple Choice', 'Fill-in-the-Blanks'];

  const filteredChallenges = challenges.filter(challenge => {
    const matchesSearch = challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          challenge.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = selectedDifficulty === 'All' || challenge.difficulty === selectedDifficulty;
    const matchesType = selectedType === 'All' || challenge.type === selectedType;
    return matchesSearch && matchesDifficulty && matchesType;
  });

  // Drag and Drop handlers (conceptual, would use a library)
  const handleDragStart = (e, challengeId) => {
    e.dataTransfer.setData('challengeId', challengeId);
    e.currentTarget.classList.add('opacity-50', 'border-dashed', 'border-purple-400');
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Necessary to allow drop
    e.currentTarget.classList.add('bg-purple-50', 'shadow-inner');
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('bg-purple-50', 'shadow-inner');
  };

  const handleDrop = (e, targetChallengeId) => {
    e.currentTarget.classList.remove('bg-purple-50', 'shadow-inner');
    const draggedChallengeId = e.dataTransfer.getData('challengeId');
    const draggedChallenge = challenges.find(challenge => challenge.id === draggedChallengeId);
    const targetChallenge = challenges.find(challenge => challenge.id === targetChallengeId);

    if (draggedChallenge && targetChallenge && draggedChallenge.id !== targetChallenge.id) {
      const newChallenges = [...challenges];
      const draggedIndex = newChallenges.findIndex(item => item.id === draggedChallengeId);
      const targetIndex = newChallenges.findIndex(item => item.id === targetChallengeId);

      const [removed] = newChallenges.splice(draggedIndex, 1);
      newChallenges.splice(targetIndex, 0, removed);

      const reorderedChallenges = newChallenges.map((challenge, index) => ({
        ...challenge,
        order: index + 1
      }));

      setChallenges(reorderedChallenges);
      console.log('New challenge order:', reorderedChallenges.map(l => l.title));
    }
    e.currentTarget.classList.remove('opacity-50', 'border-dashed', 'border-purple-400');
  };

  const handleDragEnd = (e) => {
    e.currentTarget.classList.remove('opacity-50', 'border-dashed', 'border-purple-400');
  };


  if (!currentCourse) {
    return <div className="text-center py-20 text-gray-600">Course not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-6 md:p-10 font-sans">
      {/* Breadcrumbs & Header */}
      <div className="mb-8">
        <nav className="text-sm font-medium text-gray-500 mb-4">
          <a href="/admin/dashboard" className="hover:text-purple-600">Dashboard</a>
          <span className="mx-2">/</span>
          <a href="/admin/courses" className="hover:text-purple-600">Courses</a>
          <span className="mx-2">/</span>
          <span className="text-purple-600">{currentCourse.title}</span>
          <span className="mx-2">/</span>
          <span>Challenges</span>
        </nav>

        <div className="flex items-center mb-6">
          <button
            onClick={() => window.history.back()}
            className="p-2 mr-4 rounded-full bg-white hover:bg-gray-100 shadow-md transition duration-200 text-gray-600"
            title="Go back to Course Details"
          >
            <FiArrowLeft className="text-xl" />
          </button>
          <img
            src={currentCourse.imageUrl}
            alt={currentCourse.title}
            className="w-16 h-16 rounded-lg object-cover shadow-sm mr-4"
          />
          <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">
            <span className="text-purple-600">{currentCourse.title}:</span> Challenges
          </h1>
        </div>

        <p className="text-lg text-gray-600 max-w-3xl">
          Create and manage interactive coding challenges to test and reinforce student understanding.
        </p>
      </div>

      {/* Search & Filters & Add Challenge */}
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl mb-8 border border-gray-100 grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
        {/* Search Input */}
        <div className="relative md:col-span-2">
          <label htmlFor="challenge-search" className="sr-only">Search Challenges</label>
          <input
            type="text"
            id="challenge-search"
            placeholder="Search by challenge title or description..."
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-purple-500 focus:border-purple-500 transition duration-200 text-gray-800"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
        </div>

        {/* Difficulty Filter */}
        <div>
          <label htmlFor="difficulty-filter" className="block text-gray-700 text-sm font-medium mb-2">Filter by Difficulty</label>
          <div className="relative">
            <select
              id="difficulty-filter"
              className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-xl appearance-none focus:ring-purple-500 focus:border-purple-500 transition duration-200 text-gray-800"
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
            >
              {difficulties.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
            <FiZap className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl pointer-events-none" />
          </div>
        </div>

        {/* Type Filter */}
        <div>
          <label htmlFor="type-filter" className="block text-gray-700 text-sm font-medium mb-2">Filter by Type</label>
          <div className="relative">
            <select
              id="type-filter"
              className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-xl appearance-none focus:ring-purple-500 focus:border-purple-500 transition duration-200 text-gray-800"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              {types.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <FiCode className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl pointer-events-none" />
          </div>
        </div>

        {/* Add Challenge Button (positioned at the bottom right visually) */}
        <div className="md:col-span-full flex justify-end mt-4 md:mt-0">
            <button
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-md flex items-center transition duration-300 ease-in-out transform hover:scale-105 w-full sm:w-auto justify-center"
            onClick={() => alert(`Add New Challenge for "${currentCourse.title}"!`)}
            >
            <FiPlusCircle className="mr-2 text-xl" />
            Add New Challenge
            </button>
        </div>
      </div>

      {/* Challenges List */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-4 md:p-6">
        {filteredChallenges.length > 0 ? (
          <ul className="space-y-4">
            {filteredChallenges.map((challenge, index) => (
              <li
                key={challenge.id}
                draggable
                onDragStart={(e) => handleDragStart(e, challenge.id)}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, challenge.id)}
                onDragEnd={handleDragEnd}
                className="group relative flex flex-col sm:flex-row items-start sm:items-center bg-gray-50 p-4 rounded-xl border border-gray-100 hover:bg-gray-100 transition-all duration-200 ease-in-out cursor-grab active:cursor-grabbing"
              >
                {/* Drag Handle (Visual Cue) */}
                <div className="absolute top-4 left-4 text-gray-400 group-hover:text-purple-500 transition duration-200 hidden sm:block">
                    <FiList className="text-xl" />
                </div>
                {/* Challenge Number */}
                <div className="flex-shrink-0 text-3xl font-extrabold text-purple-500 mr-4 sm:mr-6 w-12 text-center">
                  {challenge.order}.
                </div>

                {/* Challenge Details */}
                <div className="flex-grow">
                  <h3 className="text-lg font-bold text-gray-900 mb-1 leading-tight">{challenge.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">{challenge.description}</p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm">
                    <ChallengeTypeBadge type={challenge.type} />
                    <DifficultyStars difficulty={challenge.difficulty} />
                    <ChallengeStatusBadge status={challenge.status} />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex-shrink-0 flex space-x-3 mt-4 sm:mt-0 sm:ml-4">
                  <button
                    className="p-2 rounded-lg text-blue-600 hover:bg-blue-100 transition duration-200"
                    onClick={(e) => { e.stopPropagation(); alert(`Editing challenge: ${challenge.title}`); }}
                    title="Edit Challenge"
                  >
                    <FiEdit className="text-lg" />
                  </button>
                  <button
                    className="p-2 rounded-lg text-red-600 hover:bg-red-100 transition duration-200"
                    onClick={(e) => { e.stopPropagation(); confirm(`Are you sure you want to delete challenge: ${challenge.title}?`); }}
                    title="Delete Challenge"
                  >
                    <FiTrash2 className="text-lg" />
                  </button>
                   {challenge.status === 'Published' ? (
                     <button
                        className="p-2 rounded-lg text-orange-600 hover:bg-orange-100 transition duration-200"
                        onClick={(e) => { e.stopPropagation(); alert(`Unpublishing challenge: ${challenge.title}`); }}
                        title="Unpublish Challenge"
                      >
                        <FiEyeOff className="text-lg" />
                      </button>
                  ) : (
                    <button
                        className="p-2 rounded-lg text-green-600 hover:bg-green-100 transition duration-200"
                        onClick={(e) => { e.stopPropagation(); alert(`Publishing challenge: ${challenge.title}`); }}
                        title="Publish Challenge"
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
              <FiZap className="inline-block text-4xl mb-2" />
            </p>
            <p>No challenges found for this course, or none match your search.</p>
            <button
              className="mt-6 bg-purple-500 hover:bg-purple-600 text-white font-bold py-2.5 px-6 rounded-lg transition duration-300"
              onClick={() => alert(`Add New Challenge for "${currentCourse.title}"!`)}
            >
              Create the First Challenge
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseChallengesPage;