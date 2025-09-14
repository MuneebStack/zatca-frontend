import { Layout, Space, Typography, Avatar, Dropdown, Button } from "antd";
import { UserOutlined, LogoutOutlined, SunOutlined, MoonOutlined } from "@ant-design/icons";
import { useTheme } from "@/providers/ThemeContext";
import { axiosClient } from "@/services/axiosClient";
import { useAuth } from "@/providers/AuthContext";
import { useEffect, useState } from "react";
import { successMessageHandler } from "@/utils/notificationHandler";
import { useLoader } from "@/providers/LoaderContext";

const { Header } = Layout;
const { Title } = Typography;

const TopBar = () => {
    const [loading, setLoading] = useState(false);
    const { isDark, switchTheme } = useTheme();
    const { user, logout } = useAuth();
    const isAuthenticated = !!user;
    const { showLoader, hideLoader } = useLoader();

    const avatarText = user?.name?.charAt(0)?.toUpperCase() || "?";
    const avatarUrl = user?.name
        ? `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&color=fff`
        : "";

    const handleLogout = () => {
        setLoading(true);
        axiosClient
            .post('/portal/logout')
            .then((response) => {
                if (response?.data) {
                    successMessageHandler(response.data);
                    logout();
                }
            })
            .finally(() => setLoading(false))
    };

    useEffect(() => {
        loading ? showLoader() : hideLoader();
    }, [loading]);

    const menuItems = [
        {
            key: "username",
            label: (
                <span className="inline-block p-2 text-gray-500">{user?.name}</span>
            ),
            style: { padding: 0 }
        },
        {
            key: "logout",
            label: (
                <Button
                    className="!p-0 w-full"
                    type="text"
                    icon={<LogoutOutlined />}
                    onClick={handleLogout}
                    disabled={loading}
                    loading={loading}
                >
                    Logout
                </Button>
            ),
            style: { padding: 0 }
        },
    ];

    return (
        <Header className="flex justify-end items-center px-4">
            {!isAuthenticated && (
                <Title level={4} className="!mb-0 mr-auto">
                    MyApp
                </Title>
            )}

            <Space size={16} align="end">
                {isAuthenticated && (
                    <Dropdown menu={{ items: menuItems, className: 'w-32 text-center !py-2' }} placement="bottom" trigger={["click"]}>
                        <Avatar
                            className="cursor-pointer"
                            size="default"
                            icon={!avatarUrl && <UserOutlined />}
                        >
                            {avatarText}
                        </Avatar>
                    </Dropdown>
                )}

                <Button
                    className="align-middle leading-none"
                    type="text"
                    icon={isDark ? <MoonOutlined className="!text-2xl" /> : <SunOutlined className="!text-2xl" />}
                    onClick={() => switchTheme(!isDark)}
                />
            </Space>
        </Header>
    );
};

export {
    TopBar
}