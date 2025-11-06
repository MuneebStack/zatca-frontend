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
import { CreateUser } from '@/pages/Users/create';
import { ViewUser } from '@/pages/Users/show';
import { EditUser } from '@/pages/Users/edit';
import { Tokens } from '@/pages/Tokens';
import { Permissions } from '@/pages/Permissions';
import { Navigations } from '@/pages/Navigations';
import { DataAccess } from '@/pages/DataAccess';

export function AppRoutes() {
  return (
    <Suspense fallback={<FullPageLoader />}>
      <Routes>
        <Route element={<PublicRoute><GuestLayout /></PublicRoute>}>
          <Route path="/login" element={<Login />} />
        </Route>

        <Route element={<PrivateRoute><AuthLayout /></PrivateRoute>}>
          <Route path="/" element={<Dashboard />} />

          <Route path="/users" element={<Users />}>
            <Route path="create" element={<CreateUser />} />
            <Route path="edit/:id" element={<EditUser />} />
            <Route path="view/:id" element={<ViewUser />} />
          </Route>

          <Route path="/permissions" element={<Permissions />} />

          <Route path="/data-access" element={<DataAccess />} />

          <Route path="/tokens" element={<Tokens />} />
          <Route path="/navigations" element={<Navigations />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense >
  );
}