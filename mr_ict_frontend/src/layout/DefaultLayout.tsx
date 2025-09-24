import React, { ReactNode, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header/index';
import Sidebar from '../components/Sidebar';
import { getStudentProfile } from '../services/studentExperience';

interface DefaultLayoutProps {
  children: ReactNode;
  hiddenOnRoutes: string[];
}

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children, hiddenOnRoutes }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileChecked, setProfileChecked] = useState(false);

  // Determine if the current route should hide the sidebar and header
  const hideSidebarAndHeader = hiddenOnRoutes.some(route => {
    if (route.includes(':')) {
      // For dynamic routes like /verify-user/:user_email, check if the pathname starts with the route
      return pathname.startsWith(route.split('/:')[0]);
    }
    return pathname === route; // Exact match for non-dynamic routes
  });

  useEffect(() => {
    let isMounted = true;

    const ensureOnboarding = async () => {
      if (hideSidebarAndHeader) {
        setProfileChecked(true);
        return;
      }
      try {
        const profile = await getStudentProfile();
        if (!isMounted) return;
        if (!profile.has_completed_onboarding) {
          navigate('/onboarding', { replace: true });
        }
      } catch (err: any) {
        if (!isMounted) return;
        const statusCode = err?.response?.status;
        if (statusCode === 401 || statusCode === 403) {
          navigate('/sign-in', { replace: true });
        }
      } finally {
        if (isMounted) {
          setProfileChecked(true);
        }
      }
    };

    ensureOnboarding();

    return () => {
      isMounted = false;
    };
  }, [hideSidebarAndHeader, navigate]);

  if (!profileChecked && !hideSidebarAndHeader) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900 text-white">
        <div className="rounded-xl bg-slate-800 px-4 py-3 shadow">Preparing your dashboard…</div>
      </div>
    );
  }

  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark">
      <div className="flex h-screen overflow-hidden">
        {/* Conditionally render Sidebar */}
        {!hideSidebarAndHeader && (
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        )}

        <div className="relative flex flex-1 flex-col overflow-y px-7 overflow-x-hidden">
          {/* Conditionally render Header */}
          {!hideSidebarAndHeader && (
            <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          )}

          <main>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DefaultLayout;
