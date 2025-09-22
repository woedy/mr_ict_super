import React, { useCallback, useEffect, useState } from 'react';
import CardDataStats from '../../components/CardDataStats';
import userImage from '../../images/user/user-01.png';
import html from '../../images/html.png';
import css from '../../images/css.png';
import javascript from '../../images/javascript.png';
import python from '../../images/python.png';
import chale from '../../images/chale.png';

import { Link } from 'react-router-dom';
import { baseUrl, baseUrlMedia, projectID, truncateText, userID } from '../../constants';
import api from '../../services/apiClient';

const Dashboard: React.FC = () => {
  const [generatedCount, setGeneratedCount] = useState(0);
  const [recentGenerated, setRecentGenerated] = useState([]);

  const [loading, setLoading] = useState(false);

  // State for alerts
  const [alert, setAlert] = useState({ message: '', type: '' });

  // Init State

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('homepage/student-dashboard/', {
        params: { user_id: userID },
      });
      setGeneratedCount(response.data.data.generated_count);

      console.log('#######################################');
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [baseUrl, userToken]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
      <div className="grid grid-cols-3 gap-7">
        <div className="col-span-2">
          <h4 className="text-xl font-semibold text-black dark:text-white mb-4">
            Course Overview
          </h4>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3 2xl:gap-7.5">
            <CardDataStats title="In Progress" total={'2'}>
              <svg
                className="fill-primary dark:fill-white"
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21.1063 18.0469L19.3875 3.23126C19.2157 1.71876 17.9438 0.584381 16.3969 0.584381H5.56878C4.05628 0.584381 2.78441 1.71876 2.57816 3.23126L0.859406 18.0469C0.756281 18.9063 1.03128 19.7313 1.61566 20.3844C2.20003 21.0375 2.99066 21.3813 3.85003 21.3813H18.1157C18.975 21.3813 19.8 21.0031 20.35 20.3844C20.9 19.7656 21.2094 18.9063 21.1063 18.0469ZM19.2157 19.3531C18.9407 19.6625 18.5625 19.8344 18.15 19.8344H3.85003C3.43753 19.8344 3.05941 19.6625 2.78441 19.3531C2.50941 19.0438 2.37191 18.6313 2.44066 18.2188L4.12503 3.43751C4.19378 2.71563 4.81253 2.16563 5.56878 2.16563H16.4313C17.1532 2.16563 17.7719 2.71563 17.875 3.43751L19.5938 18.2531C19.6282 18.6656 19.4907 19.0438 19.2157 19.3531Z"
                  fill=""
                />
                <path
                  d="M14.3345 5.29375C13.922 5.39688 13.647 5.80938 13.7501 6.22188C13.7845 6.42813 13.8189 6.63438 13.8189 6.80625C13.8189 8.35313 12.547 9.625 11.0001 9.625C9.45327 9.625 8.1814 8.35313 8.1814 6.80625C8.1814 6.6 8.21577 6.42813 8.25015 6.22188C8.35327 5.80938 8.07827 5.39688 7.66577 5.29375C7.25327 5.19063 6.84077 5.46563 6.73765 5.87813C6.6689 6.1875 6.63452 6.49688 6.63452 6.80625C6.63452 9.2125 8.5939 11.1719 11.0001 11.1719C13.4064 11.1719 15.3658 9.2125 15.3658 6.80625C15.3658 6.49688 15.3314 6.1875 15.2626 5.87813C15.1595 5.46563 14.747 5.225 14.3345 5.29375Z"
                  fill=""
                />
              </svg>
            </CardDataStats>
            <CardDataStats title="Completed" total={'2/5'}>
              <svg
                className="fill-primary dark:fill-white"
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21.1063 18.0469L19.3875 3.23126C19.2157 1.71876 17.9438 0.584381 16.3969 0.584381H5.56878C4.05628 0.584381 2.78441 1.71876 2.57816 3.23126L0.859406 18.0469C0.756281 18.9063 1.03128 19.7313 1.61566 20.3844C2.20003 21.0375 2.99066 21.3813 3.85003 21.3813H18.1157C18.975 21.3813 19.8 21.0031 20.35 20.3844C20.9 19.7656 21.2094 18.9063 21.1063 18.0469ZM19.2157 19.3531C18.9407 19.6625 18.5625 19.8344 18.15 19.8344H3.85003C3.43753 19.8344 3.05941 19.6625 2.78441 19.3531C2.50941 19.0438 2.37191 18.6313 2.44066 18.2188L4.12503 3.43751C4.19378 2.71563 4.81253 2.16563 5.56878 2.16563H16.4313C17.1532 2.16563 17.7719 2.71563 17.875 3.43751L19.5938 18.2531C19.6282 18.6656 19.4907 19.0438 19.2157 19.3531Z"
                  fill=""
                />
                <path
                  d="M14.3345 5.29375C13.922 5.39688 13.647 5.80938 13.7501 6.22188C13.7845 6.42813 13.8189 6.63438 13.8189 6.80625C13.8189 8.35313 12.547 9.625 11.0001 9.625C9.45327 9.625 8.1814 8.35313 8.1814 6.80625C8.1814 6.6 8.21577 6.42813 8.25015 6.22188C8.35327 5.80938 8.07827 5.39688 7.66577 5.29375C7.25327 5.19063 6.84077 5.46563 6.73765 5.87813C6.6689 6.1875 6.63452 6.49688 6.63452 6.80625C6.63452 9.2125 8.5939 11.1719 11.0001 11.1719C13.4064 11.1719 15.3658 9.2125 15.3658 6.80625C15.3658 6.49688 15.3314 6.1875 15.2626 5.87813C15.1595 5.46563 14.747 5.225 14.3345 5.29375Z"
                  fill=""
                />
              </svg>
            </CardDataStats>
            <CardDataStats title="Challenges" total={'5/70'}>
              <svg
                className="fill-primary dark:fill-white"
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21.1063 18.0469L19.3875 3.23126C19.2157 1.71876 17.9438 0.584381 16.3969 0.584381H5.56878C4.05628 0.584381 2.78441 1.71876 2.57816 3.23126L0.859406 18.0469C0.756281 18.9063 1.03128 19.7313 1.61566 20.3844C2.20003 21.0375 2.99066 21.3813 3.85003 21.3813H18.1157C18.975 21.3813 19.8 21.0031 20.35 20.3844C20.9 19.7656 21.2094 18.9063 21.1063 18.0469ZM19.2157 19.3531C18.9407 19.6625 18.5625 19.8344 18.15 19.8344H3.85003C3.43753 19.8344 3.05941 19.6625 2.78441 19.3531C2.50941 19.0438 2.37191 18.6313 2.44066 18.2188L4.12503 3.43751C4.19378 2.71563 4.81253 2.16563 5.56878 2.16563H16.4313C17.1532 2.16563 17.7719 2.71563 17.875 3.43751L19.5938 18.2531C19.6282 18.6656 19.4907 19.0438 19.2157 19.3531Z"
                  fill=""
                />
                <path
                  d="M14.3345 5.29375C13.922 5.39688 13.647 5.80938 13.7501 6.22188C13.7845 6.42813 13.8189 6.63438 13.8189 6.80625C13.8189 8.35313 12.547 9.625 11.0001 9.625C9.45327 9.625 8.1814 8.35313 8.1814 6.80625C8.1814 6.6 8.21577 6.42813 8.25015 6.22188C8.35327 5.80938 8.07827 5.39688 7.66577 5.29375C7.25327 5.19063 6.84077 5.46563 6.73765 5.87813C6.6689 6.1875 6.63452 6.49688 6.63452 6.80625C6.63452 9.2125 8.5939 11.1719 11.0001 11.1719C13.4064 11.1719 15.3658 9.2125 15.3658 6.80625C15.3658 6.49688 15.3314 6.1875 15.2626 5.87813C15.1595 5.46563 14.747 5.225 14.3345 5.29375Z"
                  fill=""
                />
              </svg>
            </CardDataStats>
          </div>

          <div>
            <h4 className="text-xl font-semibold text-black dark:text-white mb-4 mt-9">
              Resume Learning
            </h4>

            <div className="rounded-2xl bg-white shadow-lg dark:bg-boxdark dark:border-strokedark p-5 flex items-center">
              {/* Left Side: Square background with Round Image */}
              <div className="w-20 h-20 bg-primary rounded-xl flex justify-center items-center shadow-lg overflow-hidden">
                <img
                  src={html}
                  alt="User Photo"
                  className="w-16 h-16 object-contain"
                />
              </div>

              {/* Content Section */}
              <div className="flex flex-col ml-6 space-y-2">
                <p className="text-lg font-semibold text-gray-800 dark:text-white">
                  HTML
                </p>
                <p className="text-base font-medium text-gray-600 dark:text-gray-300">
                  Lesson 01{' '}
                  <span className="text-primary">Basics of inline CSS</span>
                </p>
              </div>

              {/* Progress Section */}
              <div className="ml-auto text-center space-y-1">
                <p className="text-xl font-semibold text-primary">30%</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  14/50 Lessons
                </p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-xl font-semibold text-black dark:text-white mb-4 mt-9">
              Available Courses
            </h4>

            <div className="grid grid-cols-2 gap-5">
              <Link to="/lessons">
                <div className="rounded-2xl bg-white shadow-lg dark:bg-boxdark dark:border-strokedark p-5 flex items-center">
                  {/* Left Side: Square background with Round Image */}
                  <div className="w-20 h-20 bg-primary rounded-xl flex justify-center items-center shadow-lg overflow-hidden">
                    <img
                      src={html}
                      alt="htmll"
                      className="w-16 h-16 object-contain"
                    />
                  </div>

                  {/* Content Section */}
                  <div className="flex flex-col ml-6 space-y-2">
                    <p className="text-lg font-semibold text-gray-800 dark:text-white">
                      HTML
                    </p>
                    <p className="">The language for building web pages</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      50 Lessons
                    </p>
                  </div>
                </div>
              </Link>

              <div className="rounded-2xl bg-white shadow-lg dark:bg-boxdark dark:border-strokedark p-5 flex items-center">
                {/* Left Side: Square background with Round Image */}
                <div className="w-20 h-20 bg-primary rounded-xl flex justify-center items-center shadow-lg overflow-hidden">
                  <img
                    src={css}
                    alt="csss"
                    className="w-16 h-16 object-contain"
                  />
                </div>

                {/* Content Section */}
                <div className="flex flex-col ml-6 space-y-2">
                  <p className="text-lg font-semibold text-gray-800 dark:text-white">
                    CSS
                  </p>
                  <p className="">The language for building web pages</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    50 Lessons
                  </p>
                </div>
              </div>

              <div className="rounded-2xl bg-white shadow-lg dark:bg-boxdark dark:border-strokedark p-5 flex items-center">
                {/* Left Side: Square background with Round Image */}
                <div className="w-20 h-20 bg-primary rounded-xl flex justify-center items-center shadow-lg overflow-hidden">
                  <img
                    src={javascript}
                    alt="javascript"
                    className="w-16 h-16 object-contain"
                  />
                </div>

                {/* Content Section */}
                <div className="flex flex-col ml-6 space-y-2">
                  <p className="text-lg font-semibold text-gray-800 dark:text-white">
                    Javascript
                  </p>
                  <p className="">The language for building web pages</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    50 Lessons
                  </p>
                </div>
              </div>

              <div className="rounded-2xl bg-white shadow-lg dark:bg-boxdark dark:border-strokedark p-5 flex items-center">
                {/* Left Side: Square background with Round Image */}
                <div className="w-20 h-20 bg-primary rounded-xl flex justify-center items-center shadow-lg overflow-hidden">
                  <img
                    src={python}
                    alt="pythom"
                    className="w-16 h-16 object-contain"
                  />
                </div>

                {/* Content Section */}
                <div className="flex flex-col ml-6 space-y-2">
                  <p className="text-lg font-semibold text-gray-800 dark:text-white">
                    PYTHON
                  </p>
                  <p className="">The language for building web pages</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    50 Lessons
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-1">
          <h4 className="text-xl font-semibold text-black dark:text-white mb-4">
            Challenges
          </h4>
          <div className="mt-4 grid grid-cols-1 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5 mb-4">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="py-5 px-4 md:px-6 xl:px-7.5">
                <div className="flex justify-between">
                  <h4 className="text-base font-semibold text-black dark:text-white">
                    HTML Challenges
                  </h4>
                  <h4 className="text-xs font-semibold  dark:text-white">
                    View All
                  </h4>
                </div>

                <div className="rounded-2xl bg-white shadow-lg dark:bg-boxdark dark:border-strokedark p-3 flex items-center mb-3">
                  {/* Left Side: Square background with Round Image */}
                  <div className="w-20 h-20 bg-primary rounded-xl flex justify-center items-center shadow-lg overflow-hidden">
                    <img
                      src={html}
                      alt="User Photo"
                      className="w-10 h-10 object-contain "
                    />
                  </div>

                  {/* Content Section */}
                  <div className="flex flex-col ml-3 space-y-1">
                    <p className="">
                      {
                        'How to control the line breaks and spaces with the <pre> tag'
                      }
                    </p>
                  </div>

                  <img
                    src={chale}
                    alt="User Photo"
                    className="w-5 h-5 object-contain ml-2"
                  />
                </div>

                <div className="rounded-2xl bg-white shadow-lg dark:bg-boxdark dark:border-strokedark p-3 flex items-center mb-3">
                  {/* Left Side: Square background with Round Image */}
                  <div className="w-20 h-20 bg-primary rounded-xl flex justify-center items-center shadow-lg overflow-hidden">
                    <img
                      src={html}
                      alt="User Photo"
                      className="w-10 h-10 object-contain"
                    />
                  </div>

                  {/* Content Section */}
                  <div className="flex flex-col ml-3 space-y-1">
                    <p className="">
                      {
                        'How to control the line breaks and spaces with the <pre> tag'
                      }
                    </p>
                  </div>

                  <img
                    src={chale}
                    alt="User Photo"
                    className="w-5 h-5 object-contain ml-2"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5 mb-4">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="py-5 px-4 md:px-6 xl:px-7.5">
                <div className="flex justify-between">
                  <h4 className="text-base font-semibold text-black dark:text-white">
                    HTML Challenges
                  </h4>
                  <h4 className="text-xs font-semibold  dark:text-white">
                    View All
                  </h4>
                </div>

                <div className="rounded-2xl bg-white shadow-lg dark:bg-boxdark dark:border-strokedark p-3 flex items-center mb-3">
                  {/* Left Side: Square background with Round Image */}
                  <div className="w-20 h-20 bg-primary rounded-xl flex justify-center items-center shadow-lg overflow-hidden">
                    <img
                      src={css}
                      alt="User Photo"
                      className="w-10 h-10 object-contain"
                    />
                  </div>

                  {/* Content Section */}
                  <div className="flex flex-col ml-3 space-y-1">
                    <p className="">
                      {
                        'How to control the line breaks and spaces with the <pre> tag'
                      }
                    </p>
                  </div>

                  <img
                    src={chale}
                    alt="User Photo"
                    className="w-5 h-5 object-contain ml-2"
                  />
                </div>
                <div className="rounded-2xl bg-white shadow-lg dark:bg-boxdark dark:border-strokedark p-3 flex items-center mb-3">
                  {/* Left Side: Square background with Round Image */}
                  <div className="w-20 h-20 bg-primary rounded-xl flex justify-center items-center shadow-lg overflow-hidden">
                    <img
                      src={css}
                      alt="User Photo"
                      className="w-10 h-10 object-contain"
                    />
                  </div>

                  {/* Content Section */}
                  <div className="flex flex-col ml-3 space-y-1">
                    <p className="">
                      {
                        'How to control the line breaks and spaces with the <pre> tag'
                      }
                    </p>
                  </div>

                  <img
                    src={chale}
                    alt="User Photo"
                    className="w-5 h-5 object-contain ml-2"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5 mb-4">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="py-5 px-4 md:px-6 xl:px-7.5">
                <div className="flex justify-between">
                  <h4 className="text-base font-semibold text-black dark:text-white">
                    Javascript Challenges
                  </h4>
                  <h4 className="text-xs font-semibold  dark:text-white">
                    View All
                  </h4>
                </div>

                <div className="rounded-2xl bg-white shadow-lg dark:bg-boxdark dark:border-strokedark p-3 flex items-center mb-3">
                  {/* Left Side: Square background with Round Image */}
                  <div className="w-20 h-20 bg-primary rounded-xl flex justify-center items-center shadow-lg overflow-hidden">
                    <img
                      src={javascript}
                      alt="User Photo"
                      className="w-10 h-10 object-contain"
                    />
                  </div>

                  {/* Content Section */}
                  <div className="flex flex-col ml-3 space-y-1">
                    <p className="">
                      {
                        'How to control the line breaks and spaces with the <pre> tag'
                      }
                    </p>
                  </div>

                  <img
                    src={chale}
                    alt="User Photo"
                    className="w-5 h-5 object-contain ml-2"
                  />
                </div>
                <div className="rounded-2xl bg-white shadow-lg dark:bg-boxdark dark:border-strokedark p-3 flex items-center mb-3">
                  {/* Left Side: Square background with Round Image */}
                  <div className="w-20 h-20 bg-primary rounded-xl flex justify-center items-center shadow-lg overflow-hidden">
                    <img
                      src={javascript}
                      alt="User Photo"
                      className="w-10 h-10 object-contain"
                    />
                  </div>

                  {/* Content Section */}
                  <div className="flex flex-col ml-3 space-y-1">
                    <p className="">
                      {
                        'How to control the line breaks and spaces with the <pre> tag'
                      }
                    </p>
                  </div>

                  <img
                    src={chale}
                    alt="User Photo"
                    className="w-5 h-5 object-contain ml-2"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
