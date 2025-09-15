import { Layout, Menu, Row, Typography } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined, SettingOutlined, DashboardOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/providers/AuthContext";

const { Sider } = Layout;
const { Title, Text } = Typography;

const Sidebar = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [hovered, setHovered] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const { configs } = useAuth();

    useEffect(() => {
        const checkScreen = () => setIsMobile(window.innerWidth < 768);
        checkScreen();
        window.addEventListener("resize", checkScreen);
        return () => window.removeEventListener("resize", checkScreen);
    }, []);

    const items = [
        {
            key: "/",
            icon: <DashboardOutlined />,
            label: <Link to="/">Dashboard</Link>,
        },
        {
            key: "/users",
            icon: <UserOutlined />,
            label: <Link to="/users">Users</Link>,
        },
        {
            key: "/settings",
            icon: <SettingOutlined />,
            label: <Link to="/settings">Settings</Link>,
        },
    ];

    return (
        <Sider
            theme="light"
            collapsible={!isMobile}
            collapsed={isMobile ? true : collapsed}
            trigger={null}
            width={250}
            collapsedWidth={100}
        >
            <Row
                className={`flex items-center h-12 px-4 ${collapsed ? "justify-center" : "justify-between"}`}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                {((isMobile ? true : collapsed && !hovered) || !collapsed) && (
                    <Title level={4} style={{ margin: 0 }}>
                        {configs.app_name}
                    </Title>
                )}

                {(!isMobile) && (!collapsed || hovered) && (
                    <Text className="cursor-pointer !text-lg">
                        {collapsed ? (
                            <MenuUnfoldOutlined onClick={() => setCollapsed(false)} />
                        ) : (
                            <MenuFoldOutlined onClick={() => setCollapsed(true)} />
                        )}
                    </Text>
                )}
            </Row>
            <Menu
                className="!border-r-0"
                mode="inline"
                defaultSelectedKeys={["/"]}
                items={items}
            />
        </Sider>
    );
};

export { 
    Sidebar
}