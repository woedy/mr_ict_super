import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { baseUrl } from '../../constants';
import api from '../../services/apiClient';
import backCover from '../../images/cover/ges.jpg';
import Logo from '../../images/logo/mrict_logo.jpg';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import ButtonLoader from '../../common/button_loader';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fcm_token, setFcmtoken] = useState('sddfdsfdsfsdf');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
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

    if (!password.trim()) {
      setPasswordError('Password is required');
      isValid = false;
    } else {
      setPasswordError('');
    }

    if (!isValid) return;

    const url = baseUrl + 'accounts/login-student/';
    const data = {
      email,
      password,
      fcm_token,
    };

    setLoading(true);

    try {
      const response = await api.post(url.replace(baseUrl, ''), data);
      const responseData = response.data;

      if (response.status === 200) {
        localStorage.setItem('first_name', responseData.data.first_name);
        localStorage.setItem('last_name', responseData.data.last_name);
        localStorage.setItem('user_id', responseData.data.user_id);
        if (responseData.data.admin_id) {
          localStorage.setItem('admin_id', responseData.data.admin_id);
        }
        localStorage.setItem('email', responseData.data.email);
        localStorage.setItem('photo', responseData.data.photo);
        localStorage.setItem('token', responseData.data.token);
        localStorage.setItem('epz', responseData.data.epz);

        navigate('/dashboard');
        window.location.reload();
      }
    } catch (error: any) {
      const responseData = error?.response?.data;
      setEmailError(responseData?.errors?.email?.[0] || '');
      setPasswordError(responseData?.errors?.password?.[0] || '');
      if (
        responseData?.errors?.email?.[0] ===
        'Please check your email to confirm your account or resend confirmation email.'
      ) {
        navigate('/verify-email', { state: { email } });
      }
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
                Welcome Back!
              </h1>
              <p className="text-center text-lg text-gray-600 dark:text-gray-300 mb-6">
                Please sign in to your account to continue.
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

                {/* Password Input */}
                <div className="relative w-full">
                  <label
                    htmlFor="password"
                    className="block text-lg font-medium text-gray-700 dark:text-gray-200 mb-2"
                  >
                    Type Password
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

                <p className=" text-black mt-6 text-center">
                  Forgot your password?{' '}
                  <Link
                    to="/forgot-password"
                    className="underline text-blue-400 hover:text-blue-200"
                  >
                    Reset
                  </Link>
                </p>

                {/* Submit Button */}
                <div className="flex items-center justify-center">
                  {loading ? (
                    <ButtonLoader />
                  ) : (
                    <button
                      type="submit"
                      className="w-full p-4 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-500 focus:outline-none transition"
                    >
                      Sign In
                    </button>
                  )}
                </div>
              </form>

              {/* Sign Up Link */}
              <div className="text-center mt-4">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Don’t have an account?{' '}
                  <Link
                    to="/sign-up"
                    className="text-indigo-600 font-semibold hover:underline"
                  >
                    Sign Up
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;
