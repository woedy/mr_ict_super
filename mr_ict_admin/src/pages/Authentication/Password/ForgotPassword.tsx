import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { resolveApiPath } from '../../../services/apiClient';
import backCover from '../../../images/cover/ges.jpg';
import Logo from '../../../images/logo/mrict_logo.jpg';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import ButtonLoader from '../../../common/button_loader';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const navigate = useNavigate();
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const [successMessage, setSuccessMessage] = useState(
    location.state?.successMessage || '',
  );

  useEffect(() => {
    // Clear the message after 5 seconds (optional)
    const timer = setTimeout(() => setSuccessMessage(''), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    let isValid = true;

    if (!email.trim()) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Email is invalid');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!isValid) return;

    const url = resolveApiPath('accounts/forgot-user-password/');
    const data = {
      email,
    };

    setLoading(true);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (response.status === 200) {
        
        navigate('/confirm-password-otp', { state: { email } });

      } else if (response.status === 400) {
        setEmailError(responseData.errors?.email?.[0] || '');
      } else {
        console.error('Reset failed:', responseData.message);
      }
    } catch (error) {
      console.error('Error:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{ backgroundImage: `url(${backCover})` }}
        ></div>
        <div>
          {successMessage && (
            <div
              className="mb-4 rounded-lg border border-green bg-green px-4 py-3 text-white relative"
              role="alert"
            >
              <strong className="font-bold">Success!</strong>
              <span className="block sm:inline ml-2">{successMessage}</span>
              <button
                onClick={() => setSuccessMessage('')}
                className="absolute top-0 bottom-0 right-0 px-4 py-3 text-green-700"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
          )}
          <div className="relative z-10 flex justify-center items-center max-w-lg mx-auto px-6 py-8 bg-white dark:bg-gray-800 rounded-3xl shadow-xl">
            <div className="w-full max-w-md space-y-8">
              <div className="flex items-center gap-2">
                <img className="h-20" src={Logo} alt="Logo" />

                <div>
                  <h4 className="mb-1 text-xl font-semibold text-black dark:text-white">
                    {'<Mr ICT />'}
                  </h4>

                  <p className="text-sm font-medium">
                    Ghana Education Service (GES)
                  </p>
                </div>
              </div>

              <h1 className="text-4xl text-center font-extrabold text-gray-900 dark:text-white">
               Forgot Password
              </h1>
              <p className="text-center text-lg text-gray-600 dark:text-gray-300 mb-6">
              Enter your email to reset your password. An OTP Code will be sent to
              your email.
              </p>

              {emailError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-3">
                  <strong className="font-bold">Error!</strong>
                  <span className="block sm:inline"> {emailError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Input */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-lg font-medium text-gray-700 dark:text-gray-200 mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full p-4 text-lg rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  />
                </div>

     
                {/* Submit Button */}
                <div className="flex items-center justify-center">
                  {loading ? (
                    <ButtonLoader />
                  ) : (
                    <button
                      type="submit"
                      className="w-full p-4 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-500 focus:outline-none transition"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </form>

         
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
