import { createContext, useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { frontendErrorHandler } from "@/utils/notificationHandler";
import type { User } from "@/utils/api";
import { FullPageLoader } from "@/components/FullPageLoader";

interface AuthContextType {
    user?: User;
    token?: string;
    isAuthenticated: boolean;
    login: (user: User, token: string, expiresAt: string) => void;
    logout: (showMessage?: boolean) => void;
}

interface AuthProviderType {
    children: React.ReactNode
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: AuthProviderType) => {
    const [user, setUser] = useState<User>();
    const [token, setToken] = useState<string>();
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();

    const isAuthenticated = !!user;
    const guestRoutes = ["/login"];
    const isGuestRoute = guestRoutes.includes(location.pathname);

    const login = (user: User, token: string, expiresAt: string) => {
        setUser(user);
        setToken(token);

        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);
        localStorage.setItem("expires_at", expiresAt);

        navigate("/");
    };

    const logout = (showMessage: boolean = false) => {
        setUser(undefined);
        setToken(undefined);

        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("expires_at");

        if (showMessage) {
            frontendErrorHandler({
                message: "Session expired",
                description: "Your session has expired Please login again",
            });
        }

        navigate("/login");
    };

    useEffect(() => {
        if (isGuestRoute) {
            setLoading(false);
            return;
        }

        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");
        const storedExpiresAt = localStorage.getItem("expires_at");

        if (!storedUser || !storedToken || !storedExpiresAt) {
            logout();
            return;
        }

        const storedExpiryTime = parseInt(storedExpiresAt);
        const now = Date.now();

        if (storedExpiryTime <= now) {
            logout(true);
            setLoading(false);
            return;
        }

        const timeoutId = setTimeout(() => {
            logout(true);
        }, storedExpiryTime - now - 5000);

        setUser(JSON.parse(storedUser));
        setToken(storedToken);

        setLoading(false);

        return () => clearTimeout(timeoutId);
    }, [location.pathname]);

    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout }}>
            {loading ? <FullPageLoader /> : children}
        </AuthContext.Provider>
    );
};

const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};

export {
    AuthProvider,
    useAuth
}