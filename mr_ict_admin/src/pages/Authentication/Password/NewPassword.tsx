import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { resolveApiPath } from '../../../services/apiClient';
import backCover from '../../../images/cover/ges.jpg';
import Logo from '../../../images/logo/mrict_logo.jpg';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import ButtonLoader from '../../../common/button_loader';

const NewPassword = () => {
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');

  const [inputError, setInputError] = useState('');
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const email = location.state?.email;

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear any previous error
    setInputError('');

    if (password === '') {
      setInputError('Passwords required.');
      return;
    }

    if (password2 === '') {
      setInputError('Password2 required.');
      return;
    }

    if (password !== password2) {
      setInputError('Passwords do not match');
      return;
    }

    if (!validatePassword(password)) {
      setInputError(
        'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character',
      );
      return;
    }

    // Create FormData object
    const formData = new FormData();
    formData.append('email', email);
    formData.append('new_password', password);
    formData.append('new_password2', password2);

    // Make a POST request to the server
    const url = resolveApiPath('accounts/new-password-reset/');

    try {
      setLoading(true);
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        // Display the first error message from the errors object
        if (data.errors) {
          const errorMessages = Object.values(data.errors).flat();
          setInputError(errorMessages.join('\n'));
        } else {
          setInputError(data.message || 'Failed to reset password');
        }
        return; // Prevent further code execution
      }

      // Registration successful
      console.log('Password reset successfully');

      navigate('/sign-in', {
        state: {
          successMessage: 'Password reset successfully! You can now log in.',
        },
      });
    } catch (error) {
      console.error('Error registering user:', error.message);
      setInputError('Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[-!@#\$%^&*_()-+=/.,<>?"~`£{}|:;])[A-Za-z\d-!@#\$%^&*_()-+=/.,<>?"~`£{}|:;]{8,}$/;
    return passwordRegex.test(password);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{ backgroundImage: `url(${backCover})` }}
        ></div>
        <div>
          <div className="relative z-10 flex justify-center items-center max-w-lg mx-auto px-6 py-8 bg-white dark:bg-gray-800 rounded-3xl shadow-xl">
            <div className="w-full max-w-md space-y-8">
       

              <h1 className="text-4xl text-center font-extrabold text-gray-900 dark:text-white">
                New Password
              </h1>
              <p className="text-center text-lg text-gray-600 dark:text-gray-300 mb-6">
                Please enter your new password here.
              </p>

              {inputError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-3">
                  <strong className="font-bold">Error!</strong>
                  <span className="block sm:inline"> {inputError}</span>
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Password Input */}
                <div className="relative w-full">
                  <label
                    htmlFor="password"
                    className="block text-lg font-medium text-gray-700 dark:text-gray-200 mb-2"
                  >
                    Type New Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="6+ Characters, 1 Capital letter"
                    className="w-full p-4 text-lg rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-6 top-1/2 transform -translate-y-1/2 text-black"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="w-6 h-6" />
                    ) : (
                      <EyeIcon className="w-6 h-6" />
                    )}
                  </button>
                </div>
                <div className="relative w-full">
                  <label
                    htmlFor="password2"
                    className="block text-lg font-medium text-gray-700 dark:text-gray-200 mb-2"
                  >
                    Repeat Password
                  </label>
                  <input
                    id="password2"
                    name="password2"
                    type={showPassword ? 'text' : 'password'}
                    value={password2}
                    onChange={(e) => setPassword2(e.target.value)}
                    placeholder="6+ Characters, 1 Capital letter"
                    className="w-full p-4 text-lg rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-6 top-1/2 transform -translate-y-1/2 text-black"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="w-6 h-6" />
                    ) : (
                      <EyeIcon className="w-6 h-6" />
                    )}
                  </button>
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
                      Reset Password
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

export default NewPassword;
