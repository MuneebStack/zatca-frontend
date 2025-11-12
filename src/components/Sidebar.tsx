import { Layout, Menu, Row, Typography } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/providers/AuthContext";
import { antdIconRender } from "@/utils/antdIconRender";
import type { NavigationType } from "@/types/navigation";
import type { ItemType, MenuItemType } from "antd/es/menu/interface";

const { Sider } = Layout;
const { Title, Text } = Typography;
const AntdSMBreakpoint = 768;

const Sidebar = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [hovered, setHovered] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const { configs, navigations } = useAuth();

    useEffect(() => {
        const checkScreen = () => setIsMobile(window.innerWidth < AntdSMBreakpoint);
        checkScreen();
        window.addEventListener("resize", checkScreen);
        return () => window.removeEventListener("resize", checkScreen);
    }, []);

    const buildMenuItems = (navs: NavigationType[] = []): ItemType<MenuItemType>[] =>
        navs
            .map((nav): ItemType<MenuItemType> => {
                const hasChildren = nav.children && nav.children.length > 0;
                console.log(nav.route, hasChildren);
                return {
                    key: nav.route,
                    icon: antdIconRender(nav.icon),
                    label: nav.route && !hasChildren ? (
                        <Link to={nav.route}>{nav.name}</Link>
                    ) : (
                        nav.name
                    ),
                    children: hasChildren ? buildMenuItems(nav.children) : undefined,
                };
            });

    const menuItems = useMemo(() => buildMenuItems(navigations), [navigations]);

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
                className={`flex items-center h-12 px-4 py-4 ${collapsed ? "justify-center" : "justify-between"}`}
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
                className="!border-r-0 !mt-3"
                mode="inline"
                selectedKeys={[location.pathname]}
                items={menuItems}
            />
        </Sider>
    );
};

export {
    Sidebar
}