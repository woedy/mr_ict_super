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


const steps = [
  {
    title: 'Personal info',
    description: 'Introduce yourself',
  },
  {
    title: 'School',
    description: 'Find your institution',
  },
  {
    title: 'Security',
    description: 'Create a strong password',
  },
];

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
  const [currentStep, setCurrentStep] = useState(0);

  const navigate = useNavigate();

  const validateStep = (stepIndex: number) => {
    switch (stepIndex) {
      case 0: {
        if (!firstName || !lastName) {
          setInputError('First and last name required.');
          return false;
        }
        if (!email) {
          setInputError('Email is required.');
          return false;
        }
        if (!validateEmail(email)) {
          setInputError('Invalid email address');
          return false;
        }
        return true;
      }
      case 1: {
        if (!useManualSchool) {
          if (!schoolId) {
            setInputError('School selection required.');
            return false;
          }
        } else {
          if (!manualSchoolId) {
            setInputError('Enter your School ID.');
            return false;
          }
          if (manualValid !== true) {
            setInputError('Please validate your School ID.');
            return false;
          }
        }
        return true;
      }
      case 2: {
        if (!password || !password2) {
          setInputError('Enter and confirm your password.');
          return false;
        }
        if (password !== password2) {
          setInputError('Passwords do not match');
          return false;
        }
        if (!validatePassword(password)) {
          setInputError(
            'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character',
          );
          return false;
        }
        return true;
      }
      default:
        return true;
    }
  };

  const handleNext = () => {
    setInputError('');
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handleBack = () => {
    setInputError('');
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setInputError('');
    for (let i = 0; i < steps.length; i += 1) {
      if (!validateStep(i)) {
        setCurrentStep(i);
        return;
      }
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
    <div className="min-h-screen bg-slate-950/70 relative flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-50"
        style={{ backgroundImage: `url(${backCover})` }}
      />
      <div className="relative z-10 w-full max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] overflow-hidden rounded-3xl bg-white/95 shadow-2xl backdrop-blur dark:bg-gray-900/95">
          <div className="hidden flex-col justify-between bg-gradient-to-br from-indigo-600 via-blue-600 to-sky-500 p-10 text-white lg:flex">
            <div className="flex items-center gap-3">
              <img className="h-16 w-16 rounded-xl bg-white/20 p-2" src={Logo} alt="Mr ICT" />
              <div>
                <p className="text-sm uppercase tracking-wide text-sky-100">Ghana Education Service</p>
                <h2 className="text-3xl font-black">{'<Mr ICT />'}</h2>
              </div>
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold leading-tight">Your digital skills journey starts here</h1>
              <p className="text-lg text-indigo-100">
                Create an account in three quick steps and access curated ICT lessons, projects, and resources built for Ghanaian students.
              </p>
              <ul className="space-y-2 text-sm font-medium text-sky-100">
                <li className="flex items-center gap-2">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-xs font-bold">1</span>
                  Personalise your profile
                </li>
                <li className="flex items-center gap-2">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-xs font-bold">2</span>
                  Connect to your school community
                </li>
                <li className="flex items-center gap-2">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-xs font-bold">3</span>
                  Secure your learning space
                </li>
              </ul>
            </div>
            <p className="text-xs text-indigo-200/70">
              Need help? Reach out to your ICT coordinator or email <span className="font-semibold text-white">support@mrictonline.com</span>
            </p>
          </div>

          <div className="flex flex-col gap-8 p-6 sm:p-10">
            <div className="flex items-center gap-3 lg:hidden">
              <img className="h-14 w-14 rounded-xl bg-indigo-100 p-2" src={Logo} alt="Mr ICT" />
              <div>
                <p className="text-xs uppercase tracking-wide text-indigo-500">Ghana Education Service</p>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{'<Mr ICT />'}</h2>
              </div>
            </div>

            <div className="space-y-2 text-center lg:text-left">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-500">Sign up</p>
              <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                Create your Mr ICT account
              </h1>
              <p className="text-base text-gray-600 dark:text-gray-300">
                We guide you through a short, focused flow so you never have to scroll through endless form fields.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
                {steps.map((step, index) => {
                  const isActive = index === currentStep;
                  const isCompleted = index < currentStep;
                  return (
                    <div key={step.title} className="flex-1">
                      <div className="flex items-start gap-3">
                        <span
                          className={`mt-1 inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition ${
                            isActive
                              ? 'border-indigo-600 bg-indigo-600 text-white shadow'
                              : isCompleted
                                ? 'border-emerald-500 bg-emerald-500 text-white'
                                : 'border-gray-300 bg-white text-gray-500'
                          }`}
                        >
                          {index + 1}
                        </span>
                        <div>
                          <p className={`text-sm font-semibold ${isActive ? 'text-indigo-600' : 'text-gray-500'}`}>
                            {step.title}
                          </p>
                          <p className="text-xs text-gray-400">{step.description}</p>
                        </div>
                      </div>
                      {index < steps.length - 1 && (
                        <div className="ml-4 mt-3 hidden h-1 rounded-full bg-gray-200 sm:block">
                          <div
                            className={`h-full rounded-full transition-all ${
                              index < currentStep ? 'w-full bg-emerald-500' : index === currentStep ? 'w-1/2 bg-indigo-400' : 'w-2 bg-gray-200'
                            }`}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {inputError && (
                <div className="rounded-2xl border border-red-200 bg-red-50/80 px-4 py-3 text-sm text-red-700" role="alert">
                  <strong className="font-semibold">Please double-check:</strong> {inputError}
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
              {currentStep === 0 && (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
                      First name
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Ama"
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-base shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
                      Last name
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Mensah"
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-base shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
                      Email address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ama.mensah@example.com"
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-base shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
                      Search for your school
                    </label>
                    <input
                      type="text"
                      value={schoolSearch}
                      onChange={(e) => {
                        setSchoolPage(1);
                        setSchoolSearch(e.target.value);
                      }}
                      placeholder="Start typing the school name"
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-base shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
                      Select your school
                    </label>
                    <select
                      value={schoolId}
                      onChange={(e) => setSchoolId(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-base shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    >
                      <option value="">
                        {schoolsLoading ? 'Loading schools…' : 'Choose your school'}
                      </option>
                      {schools.map((s) => (
                        <option key={s.school_id} value={s.school_id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                      <button
                        type="button"
                        disabled={schoolPage <= 1 || schoolsLoading}
                        onClick={() => setSchoolPage((p) => Math.max(1, p - 1))}
                        className="rounded-full border border-gray-200 px-3 py-1 font-medium transition hover:border-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Previous
                      </button>
                      <span className="font-semibold text-gray-600">
                        Page {schoolPage} of {schoolTotalPages}
                      </span>
                      <button
                        type="button"
                        disabled={schoolPage >= schoolTotalPages || schoolsLoading}
                        onClick={() => setSchoolPage((p) => Math.min(schoolTotalPages, p + 1))}
                        className="rounded-full border border-gray-200 px-3 py-1 font-medium transition hover:border-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/50 p-4">
                    <label className="flex items-start gap-3 text-sm font-medium text-gray-700 dark:text-gray-200">
                      <input
                        type="checkbox"
                        className="mt-1 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        checked={useManualSchool}
                        onChange={(e) => {
                          setUseManualSchool(e.target.checked);
                          setManualMessage('');
                          setManualValid(null);
                        }}
                      />
                      <span>My school isn’t listed — I have the unique school ID.</span>
                    </label>
                    {useManualSchool && (
                      <div className="mt-4 space-y-3 rounded-2xl border border-indigo-100 bg-white p-4 shadow-sm">
                        <input
                          type="text"
                          value={manualSchoolId}
                          onChange={(e) => setManualSchoolId(e.target.value)}
                          placeholder="e.g. GES-12345"
                          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-base shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        />
                        <div className="flex flex-wrap items-center gap-3 text-sm">
                          <button
                            type="button"
                            onClick={validateManualSchool}
                            disabled={validatingManual}
                            className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 font-semibold text-white shadow transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {validatingManual ? 'Validating…' : 'Validate ID'}
                          </button>
                          {manualValid === true && (
                            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                              <span className="h-2 w-2 rounded-full bg-emerald-500" />
                              {manualMessage || 'Valid school ID'}
                            </span>
                          )}
                          {manualValid === false && (
                            <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
                              <span className="h-2 w-2 rounded-full bg-red-500" />
                              {manualMessage || 'Invalid school ID'}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="grid grid-cols-1 gap-5">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="8+ characters with letters, numbers & symbols"
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-base shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
                      Confirm password
                    </label>
                    <input
                      type="password"
                      value={password2}
                      onChange={(e) => setPassword2(e.target.value)}
                      placeholder="Repeat your password"
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-base shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                  <p className="rounded-xl border border-indigo-100 bg-indigo-50/70 px-4 py-3 text-xs leading-relaxed text-indigo-600">
                    Use at least eight characters, including upper and lower case letters, a number, and a special character. Strong passwords keep your progress safe.
                  </p>
                </div>
              )}

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex gap-3">
                  {currentStep > 0 && (
                    <button
                      type="button"
                      onClick={handleBack}
                      className="inline-flex items-center justify-center rounded-full border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-600 transition hover:border-indigo-400 hover:text-indigo-500"
                    >
                      Back
                    </button>
                  )}
                </div>
                {currentStep < steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-8 py-3 text-sm font-semibold text-white shadow transition hover:bg-indigo-500"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-8 py-3 text-sm font-semibold text-white shadow transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={loading}
                  >
                    {loading ? 'Creating account…' : 'Create account'}
                  </button>
                )}
              </div>
            </form>

            <div className="text-center text-sm text-gray-600 dark:text-gray-300">
              Already registered?{' '}
              <Link to="/" className="font-semibold text-indigo-600 hover:underline">
                Sign in instead
              </Link>
              <span className="mx-2 text-gray-300">•</span>
              <Link to="/forgot-password" className="font-semibold text-indigo-600 hover:underline">
                Forgot password?
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
