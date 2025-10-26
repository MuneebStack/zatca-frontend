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
import { Roles as RolesPermissions } from '@/pages/Permissions/Roles';
import { Users as UsersPermissions } from '@/pages/Permissions/Users';
import { Role as RolePermissions } from '@/pages/Permissions/Role';
import { User as UserPermissions } from '@/pages/Permissions/User';
import { Navigations } from '@/pages/Navigations';
import { Roles as RolesDataAccess } from '@/pages/DataAccess/Roles';
import { Users as UsersDataAccess } from '@/pages/DataAccess/Users';
import { Role as RoleDataAccess } from '@/pages/DataAccess/Role';
import { User as UserDataAccess } from '@/pages/DataAccess/User';

export function AppRoutes() {
  return (
    <Suspense fallback={<FullPageLoader />}>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <GuestLayout>
                <Login />
              </GuestLayout>
            </PublicRoute>
          }
        />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <AuthLayout>
                <Dashboard />
              </AuthLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/users"
          element={
            <PrivateRoute>
              <AuthLayout>
                <Users />
              </AuthLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/users/create"
          element={
            <PrivateRoute>
              <AuthLayout>
                <CreateUser />
              </AuthLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/users/edit/:id"
          element={
            <PrivateRoute>
              <AuthLayout>
                <EditUser />
              </AuthLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/users/view/:id"
          element={
            <PrivateRoute>
              <AuthLayout>
                <ViewUser />
              </AuthLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/tokens"
          element={
            <PrivateRoute>
              <AuthLayout>
                <Tokens />
              </AuthLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/permissions/roles"
          element={
            <PrivateRoute>
              <AuthLayout>
                <RolesPermissions />
              </AuthLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/permissions/users"
          element={
            <PrivateRoute>
              <AuthLayout>
                <UsersPermissions />
              </AuthLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/permissions/roles/:id"
          element={
            <PrivateRoute>
              <AuthLayout>
                <RolePermissions />
              </AuthLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/permissions/users/:id"
          element={
            <PrivateRoute>
              <AuthLayout>
                <UserPermissions />
              </AuthLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/data-access/roles"
          element={
            <PrivateRoute>
              <AuthLayout>
                <RolesDataAccess />
              </AuthLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/data-access/users"
          element={
            <PrivateRoute>
              <AuthLayout>
                <UsersDataAccess />
              </AuthLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/data-access/roles/:id"
          element={
            <PrivateRoute>
              <AuthLayout>
                <RoleDataAccess />
              </AuthLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/data-access/users/:id"
          element={
            <PrivateRoute>
              <AuthLayout>
                <UserDataAccess />
              </AuthLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/navigations"
          element={
            <PrivateRoute>
              <AuthLayout>
                <Navigations />
              </AuthLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <AuthLayout>
                <Settings />
              </AuthLayout>
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}