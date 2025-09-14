import { useAuth } from '@/providers/AuthContext';
import type { JSX } from 'react';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }: { children: JSX.Element }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <Navigate to="/" replace /> : children;
}

export {
    PublicRoute
}