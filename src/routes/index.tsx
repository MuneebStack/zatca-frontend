import { Routes, Route, Navigate } from 'react-router-dom';
import { Login } from '@/pages/Auth/Login';
import { Dashboard } from '@/pages/Dashboard';
import { Users } from '@/pages/Users';
import { Settings } from '@/pages/Settings';
import { GuestLayout } from '@/layouts/GuestLayout';
import { AuthLayout } from '@/layouts/AuthLayout';
import { PrivateRoute } from '@/middlewares/PrivateRoute';
import { PublicRoute } from '@/middlewares/PublicRoute';
import { Suspense } from 'react';
import { FullPageLoader } from '@/components/FullPageLoader';
import { Tokens } from '@/pages/Tokens';
import { Permissions } from '@/pages/Permissions';
import { Navigations } from '@/pages/Navigations';
import { DataAccess } from '@/pages/DataAccess';
import { Roles } from '@/pages/Roles';
import { useAuth } from '@/providers/AuthContext';
import type { NavigationType } from '@/types/navigation';

const routeConfig = [
  { path: '/', element: <Dashboard />, name: 'Dashboard' },
  { path: '/users', element: <Users />, name: 'Users' },
  { path: '/roles', element: <Roles />, name: 'Roles' },
  { path: '/permissions', element: <Permissions />, name: 'Permissions' },
  { path: '/data-access', element: <DataAccess />, name: 'Data Access' },
  { path: '/navigations', element: <Navigations />, name: 'Navigations' },
  { path: '/tokens', element: <Tokens />, name: 'Tokens' },
  { path: '/settings', element: <Settings />, name: 'Settings' },
];

const extractRoutes = (navigations: NavigationType[]): string[] => {
  const routes: string[] = [];

  const traverse = (navItems: NavigationType[]) => {
    for (const nav of navItems) {
      if (nav.route) routes.push(nav.route);
      if (nav.children?.length) traverse(nav.children);
    }
  };

  traverse(navigations);
  return routes;
}

const AppRoutes = () => {
  const { navigations } = useAuth();

  const allowedRoutes = extractRoutes(navigations || []);
  const filteredRoutes = routeConfig.filter((r) =>
    allowedRoutes.includes(r.path)
  );

  return (
    <Suspense fallback={<FullPageLoader />}>
      <Routes>
        <Route element={<PublicRoute><GuestLayout /></PublicRoute>}>
          <Route path="/login" element={<Login />} />
        </Route>

        <Route element={<PrivateRoute><AuthLayout /></PrivateRoute>}>
          {filteredRoutes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense >
  );
}

export {
  AppRoutes
}