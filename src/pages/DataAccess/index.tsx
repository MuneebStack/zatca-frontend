import { useState } from "react";
import { Button, Card, Flex, Space, Tabs, Typography } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import type { TabsProps } from "antd";
import { UserSelector } from "@/components/UserSelector";
import { RoleSelector } from "@/components/RoleSelector";
import { Builder } from "./components/Builder";
import { usePermission } from "@/hooks/usePermission";

const { Text } = Typography;

export const DataAccess: React.FC = () => {
    const { hasModulePermission } = usePermission();

    const canForUser = hasModulePermission("data_access", "FOR_USER");
    const canForRole = hasModulePermission("data_access", "FOR_ROLE");

    const defaultTab: "role" | "user" = canForRole ? "role" : canForUser ? "user" : "role";

    const [activeTab, setActiveTab] = useState<"role" | "user">(defaultTab);
    const [selectedRoleId, setSelectedRoleId] = useState<string | number>();
    const [selectedUserId, setSelectedUserId] = useState<string | number>();

    const relatedId = activeTab === "role" ? selectedRoleId : selectedUserId;

    const handleTabChange = (key: string) => {
        setActiveTab(key as "role" | "user");
        setSelectedRoleId(undefined);
        setSelectedUserId(undefined);
    };

    const tabItems: TabsProps["items"] = [];
    if (canForRole) {
        tabItems.push({
            key: "role",
            label: "Role",
            children: (
                <RoleSelector
                    value={selectedRoleId}
                    onChange={setSelectedRoleId}
                    className="w-64 mt-2!"
                />
            ),
        })
    }
    if (canForUser) {
        tabItems.push({
            key: "user",
            label: "User",
            children: (
                <UserSelector
                    value={selectedUserId}
                    onChange={setSelectedUserId}
                    className="w-64 mt-2!"
                />
            ),
        })
    }

    return (
        <Card
            title={
                <Flex justify="space-between" align="center">
                    <Text>Manage Data Access</Text>
                    <Button
                        icon={<ArrowLeftOutlined />}
                        onClick={() => history.back()}
                    >
                        Back
                    </Button>
                </Flex>
            }
        >
            {
                tabItems && (
                    <Space direction="vertical" size={[36, 36]} className="w-full">
                        <Tabs
                            activeKey={activeTab}
                            onChange={handleTabChange}
                            items={tabItems}
                        />

                        {relatedId && (
                            <Card>
                                <Builder 
                                    relatedType={activeTab}
                                    relatedId={relatedId}
                                />
                            </Card>
                        )}
                    </Space>
                )
            }
        </Card>
    );
}