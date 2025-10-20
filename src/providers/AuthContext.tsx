import { createContext, useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { frontendErrorHandler } from "@/utils/notificationHandler";
import { FullPageLoader } from "@/components/FullPageLoader";
import { axiosClient } from "@/services/axiosClient";
import type { UserType } from "@/types/user";

type configType = Record<string, any>;

interface AuthContextType {
    user?: UserType;
    configs: configType;
    isAuthenticated: boolean;
    login: (token: string, expiresAt: string) => void;
    logout: (showMessage?: boolean) => void;
}

interface AuthProviderType {
    children: React.ReactNode
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: AuthProviderType) => {
    const [user, setUser] = useState<UserType>();
    const [configs, setConfigs] = useState<configType>({});
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();

    const isAuthenticated = !!user;

    const guestRoutes = ["/login"];
    const isGuestRoute = guestRoutes.includes(location.pathname);

    const login = (token: string, expiresAt: string) => {
        localStorage.setItem("token", token);
        localStorage.setItem("expires_at", expiresAt);

        window.location.href = '/';
    };

    const logout = (showMessage: boolean = false) => {
        setUser(undefined);
        setConfigs([]);

        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("expires_at");

        if (showMessage) {
            frontendErrorHandler({
                title: "Session expired",
                message: "Your session has expired Please login again",
            });
        }

        navigate('/login');
    };

    const handleToken = (): NodeJS.Timeout | undefined => {
        let timeoutId: NodeJS.Timeout | undefined;
        const now = Date.now();
        const storedToken = localStorage.getItem("token");
        const storedExpiresAt = parseInt(localStorage.getItem("expires_at") || "0");

        if (storedToken && storedExpiresAt && storedExpiresAt > now) {
            timeoutId = setTimeout(() => {
                logout(true);
            }, storedExpiresAt - now - 5000);
        } else {
            logout();
        }

        return timeoutId;
    }

    const handleSession = (): AbortController | undefined => {
        const controller = new AbortController();
        axiosClient
            .get("auth/session", { signal: controller.signal })
            .then((response) => {
                if (response?.data?.data) {
                    const { user, configs } = response.data.data;
                    setUser(user);
                    setConfigs(configs);
                }
            })
            .catch((error) => (error))
            .finally(() => !controller.signal.aborted && setLoading(false))

        return controller;
    }

    useEffect(() => {
        if (!isGuestRoute) {
            let timeoutId = handleToken();
            return () => timeoutId && clearTimeout(timeoutId);
        }
    }, [location.pathname]);

    useEffect(() => {
        let controller = handleSession();
        return () => controller && controller.abort();
    }, [isGuestRoute])

    return (
        <AuthContext.Provider value={{ user, configs, isAuthenticated, login, logout }}>
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