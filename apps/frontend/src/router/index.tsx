import { Navigate, type RouteObject } from 'react-router-dom';
import { UserRole } from '@app-types/user.types';
import RequireAuth from './guards/RequireAuth';
import RequireRole from './guards/RequireRole';

// 布局组件
import CandidateLayout from '@/layouts/CandidateLayout';
import EmployerLayout from '@/layouts/EmployerLayout';
import AuthLayout from '@/layouts/AuthLayout';

// 求职者端页面
import Home from '@/pages/home';
import JobList from '@/pages/jobs';
import JobDetail from '@/pages/jobs/[id]';
import ResumeList from '@/pages/resumes';
import ResumeDetail from '@/pages/resumes/[id]';
import Applications from '@/pages/applications';
import Profile from '@/pages/profile';

// 企业端页面
import EmployerJobs from '@/pages/employer/jobs';
import EmployerJobCreate from '@/pages/employer/jobs/create';
import EmployerJobDetail from '@/pages/employer/jobs/[id]';
import EmployerCandidates from '@/pages/employer/candidates';
import EmployerSettings from '@/pages/employer/settings';

// 认证页面
import Login from '@/pages/login';
import Register from '@/pages/register';

// 404 页面
import NotFound from '@/pages/404';

/**
 * 路由配置
 * 使用 react-router-dom v6 的 useRoutes 配置方式
 */
const routes: RouteObject[] = [
  // 认证页面（无需登录）
  {
    path: '/login',
    element: (
      <AuthLayout>
        <Login />
      </AuthLayout>
    ),
  },
  {
    path: '/register',
    element: (
      <AuthLayout>
        <Register />
      </AuthLayout>
    ),
  },

  // 求职者端主布局（需要登录）
  {
    path: '/',
    element: (
      <RequireAuth>
        <CandidateLayout />
      </RequireAuth>
    ),
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'jobs',
        element: <JobList />,
      },
      {
        path: 'jobs/:id',
        element: <JobDetail />,
      },
      {
        path: 'resumes',
        element: <ResumeList />,
      },
      {
        path: 'resumes/:id',
        element: <ResumeDetail />,
      },
      {
        path: 'applications',
        element: <Applications />,
      },
      {
        path: 'profile',
        element: <Profile />,
      },
    ],
  },

  // 企业端布局（需要登录 + 企业角色）
  {
    path: '/employer',
    element: (
      <RequireAuth>
        <RequireRole roles={[UserRole.EMPLOYER, UserRole.ADMIN]}>
          <EmployerLayout />
        </RequireRole>
      </RequireAuth>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/employer/jobs" replace />,
      },
      {
        path: 'jobs',
        element: <EmployerJobs />,
      },
      {
        path: 'jobs/create',
        element: <EmployerJobCreate />,
      },
      {
        path: 'jobs/:id',
        element: <EmployerJobDetail />,
      },
      {
        path: 'candidates',
        element: <EmployerCandidates />,
      },
      {
        path: 'settings',
        element: <EmployerSettings />,
      },
    ],
  },

  // 404 页面
  {
    path: '*',
    element: <NotFound />,
  },
];

export default routes;
