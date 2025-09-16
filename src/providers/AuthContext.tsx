import { createContext, useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { frontendErrorHandler } from "@/utils/notificationHandler";
import type { User } from "@/utils/api";
import { FullPageLoader } from "@/components/FullPageLoader";
import { axiosClient } from "@/services/axiosClient";

type configType = Record<string, any>;

interface AuthContextType {
    user?: User;
    configs: configType;
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
    const [configs, setConfigs] = useState<configType>({});
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

    const handleToken = (): NodeJS.Timeout | undefined => {
        let timeoutId : NodeJS.Timeout | undefined;
        const now = Date.now();
        const storedToken = localStorage.getItem("token");
        const storedExpiresAt = parseInt(localStorage.getItem("expires_at") || "0");

        if (storedToken && storedExpiresAt && storedExpiresAt > now) {
            setToken(storedToken);
            timeoutId = setTimeout(() => {
                logout(true);
            }, storedExpiresAt - now - 5000);
        } else {
            logout(true);
        }

        return timeoutId;
    }

    const handleSession = (): AbortController | undefined => {
        const controller = new AbortController();
        axiosClient
            .get("/portal/session", { signal: controller.signal })
            .then((response) => {
                if (response?.data?.data) {
                    const { user, configs } = response.data.data;
                    setUser(user);
                    setConfigs(configs);
                }
            })
            .catch((error) => (error))

        return controller;
    }

    useEffect(() => {
        let timeoutId: NodeJS.Timeout | undefined;
        let controller: AbortController | undefined;

        if (!isGuestRoute) {
            timeoutId = handleToken();
            if (Object.keys(configs).length === 0) controller = handleSession();
        }

        return () => {
            timeoutId && clearTimeout(timeoutId);
            controller && controller.abort();
        };
    }, [location.pathname]);

    useEffect(() => {
        if (isGuestRoute) setLoading(false);
        if (isAuthenticated) setLoading(false);
    }, [user]);

    return (
        <AuthContext.Provider value={{ user, configs, token, isAuthenticated, login, logout }}>
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