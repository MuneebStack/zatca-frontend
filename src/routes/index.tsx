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
import { RolePermissions } from '@/pages/Permissions/RolePermissions';
import { UserPermissions } from '@/pages/Permissions/UserPermissions';
import { RolesPermissions } from '@/pages/Permissions/RolesPermissions';
import { UsersPermissions } from '@/pages/Permissions/UsersPermissions';
import { Navigations } from '@/pages/Navigations';
import { RolesDataVisibilities } from '@/pages/DataVisibilities/RolesDataVisibilities';
import { UsersDataVisibilities } from '@/pages/DataVisibilities/UsersDataVisibilities';
import { RoleDataVisibilities } from '@/pages/DataVisibilities/RoleDataVisibilities';
import { UserDataVisibilities } from '@/pages/DataVisibilities/UserDataVisibilities';

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
          path="/data-visibilities/roles"
          element={
            <PrivateRoute>
              <AuthLayout>
                <RolesDataVisibilities />
              </AuthLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/data-visibilities/users"
          element={
            <PrivateRoute>
              <AuthLayout>
                <UsersDataVisibilities />
              </AuthLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/data-visibilities/roles/:id"
          element={
            <PrivateRoute>
              <AuthLayout>
                <RoleDataVisibilities />
              </AuthLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/data-visibilities/users/:id"
          element={
            <PrivateRoute>
              <AuthLayout>
                <UserDataVisibilities />
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