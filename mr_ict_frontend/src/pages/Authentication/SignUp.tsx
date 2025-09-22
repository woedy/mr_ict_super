import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { baseUrl } from '../../constants';
import api from '../../services/apiClient';

type School = {
  school_id: string;
  name: string;
};
import backCover from '../../images/cover/ges.jpg';
import Logo from '../../images/logo/coat.png';


const SignUp: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [schoolId, setSchoolId] = useState('');
  const [schools, setSchools] = useState<School[]>([]);
  const [schoolSearch, setSchoolSearch] = useState('');
  const [schoolPage, setSchoolPage] = useState(1);
  const [schoolTotalPages, setSchoolTotalPages] = useState(1);
  const [schoolsLoading, setSchoolsLoading] = useState(false);

  // Manual school fallback
  const [useManualSchool, setUseManualSchool] = useState(false);
  const [manualSchoolId, setManualSchoolId] = useState('');
  const [manualValid, setManualValid] = useState<boolean | null>(null);
  const [manualMessage, setManualMessage] = useState('');
  const [validatingManual, setValidatingManual] = useState(false);
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');

  const [inputError, setInputError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate email
    if (!validateEmail(email)) {
      setInputError('Invalid email address');
      return;
    }

    // Clear any previous error
    setInputError('');

    if (!firstName || !lastName) {
      setInputError('First and last name required.');
      return;
    }

    if (!useManualSchool) {
      if (!schoolId) {
        setInputError('School selection required.');
        return;
      }
    } else {
      if (!manualSchoolId) {
        setInputError('Enter your School ID.');
        return;
      }
      if (manualValid === false || manualValid === null) {
        setInputError('Please validate your School ID.');
        return;
      }
    }

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

    const payload = {
      email,
      first_name: firstName,
      last_name: lastName,
      school_id: useManualSchool ? manualSchoolId : schoolId,
      password,
      password2,
    };

    const url = baseUrl + 'accounts/register-student/';

    try {
      setLoading(true);
      const response = await api.post(url.replace(baseUrl, ''), payload);
      if (response.status !== 200) {
        throw new Error('Registration failed');
      }
      navigate('/verify-email', { state: { email } });
    } catch (error: any) {
      const data = error?.response?.data;
      if (data?.errors) {
        const first = Object.values(data.errors).flat() as string[];
        setInputError(first.join('\n'));
      } else {
        setInputError('Failed to register');
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch schools (public GET)
  const fetchSchools = async () => {
    setSchoolsLoading(true);
    try {
      const res = await api.get('schools/get-all-schools/', {
        params: { page: schoolPage, search: schoolSearch },
      });
      const data = res.data?.data;
      setSchools(data?.schools || []);
      setSchoolTotalPages(data?.pagination?.total_pages || 1);
    } catch (e) {
      // Keep silent on signup; allow manual entry if backend locked down
    } finally {
      setSchoolsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchSchools();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schoolSearch, schoolPage]);

  const validateManualSchool = async () => {
    setManualMessage('');
    setManualValid(null);
    if (!manualSchoolId) {
      setManualMessage('Enter a school ID to validate.');
      setManualValid(false);
      return;
    }
    setValidatingManual(true);
    try {
      const res = await api.get('schools/get-school-details/', {
        params: { school_id: manualSchoolId },
      });
      if (res.status === 200) {
        setManualValid(true);
        setManualMessage(`Found: ${res.data?.data?.name || 'School'}`);
      } else {
        setManualValid(false);
        setManualMessage('School not found.');
      }
    } catch (e: any) {
      const data = e?.response?.data;
      const first = data?.errors ? (Object.values(data.errors).flat() as string[]).join('\n') : 'School not found.';
      setManualValid(false);
      setManualMessage(first);
    } finally {
      setValidatingManual(false);
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
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
              Create Your Account
            </h1>
            <p className="text-center text-lg text-gray-600 dark:text-gray-300 mb-6">
              Please sign in to your account to continue.
            </p>

            {inputError && (
              <div
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6"
                role="alert"
              >
                <strong className="font-bold">Error!</strong>
                <span>{inputError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* First Name */}
              <div>
                <label className="block text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                  className="w-full p-4 text-lg rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last name"
                  className="w-full p-4 text-lg rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>

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

              {/* School Selector */}
              <div>
                <label className="block text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Select School
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={schoolSearch}
                    onChange={(e) => {
                      setSchoolPage(1);
                      setSchoolSearch(e.target.value);
                    }}
                    placeholder="Search schools by name"
                    className="w-full p-3 text-base rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  />
                </div>
                <select
                  value={schoolId}
                  onChange={(e) => setSchoolId(e.target.value)}
                  className="w-full p-3 text-base rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  >
                  <option value="" disabled>
                    {schoolsLoading ? 'Loading schools...' : 'Choose your school'}
                  </option>
                  {schools.map((s) => (
                    <option key={s.school_id} value={s.school_id}>
                      {s.name}
                    </option>
                  ))}
                </select>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    type="button"
                    disabled={schoolPage <= 1 || schoolsLoading}
                    onClick={() => setSchoolPage((p) => Math.max(1, p - 1))}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                  >
                    Prev
                  </button>
                  <span>
                    Page {schoolPage} of {schoolTotalPages}
                  </span>
                  <button
                    type="button"
                    disabled={schoolPage >= schoolTotalPages || schoolsLoading}
                    onClick={() => setSchoolPage((p) => Math.min(schoolTotalPages, p + 1))}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
                <div className="mt-4 p-3 border rounded">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={useManualSchool}
                      onChange={(e) => {
                        setUseManualSchool(e.target.checked);
                        setManualMessage('');
                        setManualValid(null);
                      }}
                    />
                    <span>My school isn’t listed. Enter ID manually.</span>
                  </label>
                  {useManualSchool && (
                    <div className="mt-3 space-y-2">
                      <input
                        type="text"
                        value={manualSchoolId}
                        onChange={(e) => setManualSchoolId(e.target.value)}
                        placeholder="Enter your School ID"
                        className="w-full p-3 text-base rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                      />
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={validateManualSchool}
                          disabled={validatingManual}
                          className="px-3 py-2 bg-indigo-600 text-white rounded disabled:opacity-50"
                        >
                          {validatingManual ? 'Validating...' : 'Validate'}
                        </button>
                        {manualValid === true && (
                          <span className="text-green-600 text-sm">{manualMessage || 'Valid school ID'}</span>
                        )}
                        {manualValid === false && (
                          <span className="text-red-600 text-sm">{manualMessage || 'Invalid school ID'}</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-lg font-medium text-gray-700 dark:text-gray-200 mb-2"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="8+ chars, uppercase, lowercase, digit, symbol"
                  className="w-full p-4 text-lg rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={password2}
                  onChange={(e) => setPassword2(e.target.value)}
                  placeholder="Re-type password"
                  className="w-full p-4 text-lg rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-center">
                {loading ? (
                  <div className="flex items-center space-x-3">
                    <svg
                      className="animate-spin w-6 h-6 text-indigo-500"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        className="text-gray-200"
                      />
                      <path
                        d="M4 12a8 8 0 018-8"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="text-indigo-500">Loading...</span>
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="w-full p-4 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-500 focus:outline-none transition"
                  >
                    Sign Up
                  </button>
                )}
              </div>
            </form>

            {/* Sign Up Link */}
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Already have an account?{' '}
                <Link
                  to="/"
                  className="text-indigo-600 font-semibold hover:underline"
                >
                  Sign In
                </Link>
                <br />
                <Link to="/forgot-password" className="text-indigo-600 font-semibold hover:underline">
                  Forgot your password?
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
