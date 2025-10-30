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

          <Route path="/permissions">
            <Route path="roles" element={<RolesPermissions />} />
            <Route path="roles/:id" element={<RolePermissions />} />
            <Route path="users" element={<UsersPermissions />} />
            <Route path="users/:id" element={<UserPermissions />} />
          </Route>

          <Route path="/data-access">
            <Route path="roles" element={<RolesDataAccess />} />
            <Route path="roles/:id" element={<RoleDataAccess />} />
            <Route path="users" element={<UsersDataAccess />} />
            <Route path="users/:id" element={<UserDataAccess />} />
          </Route>

          <Route path="/tokens" element={<Tokens />} />
          <Route path="/navigations" element={<Navigations />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense >
  );
}