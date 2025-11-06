import { useState } from "react";
import { Button, Card, Flex, Space, Tabs, Typography } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Categories } from "./components/Categories";
import type { TabsProps } from "antd";
import { UserSelector } from "@/components/UserSelector";
import { RoleSelector } from "@/components/RoleSelector";

const { Text } = Typography;

const Permissions: React.FC = () => {
    const [activeTab, setActiveTab] = useState<"role" | "user">("role");
    const [selectedRoleId, setSelectedRoleId] = useState<string | number>();
    const [selectedUserId, setSelectedUserId] = useState<string | number>();

    const relatedId = activeTab === "role" ? selectedRoleId : selectedUserId;

    const handleTabChange = (key: string) => {
        setActiveTab(key as "role" | "user");
        setSelectedRoleId(undefined);
        setSelectedUserId(undefined);
    };

    const tabItems: TabsProps["items"] = [
        {
            key: "role",
            label: "Role",
            children: (
                <RoleSelector
                    value={selectedRoleId}
                    onSelect={setSelectedRoleId}
                    className="w-64 mt-2!"
                />
            ),
        },
        {
            key: "user",
            label: "User",
            children: (
                <UserSelector
                    value={selectedUserId}
                    onSelect={setSelectedUserId}
                    className="w-64  mt-2!"
                />
            ),
        },
    ];

    return (
        <Card
            title={
                <Flex justify="space-between" align="center">
                    <Text>Manage Permissions</Text>
                    <Button
                        icon={<ArrowLeftOutlined />}
                        onClick={() => history.back()}
                    >
                        Back
                    </Button>
                </Flex>
            }
        >
            <Space direction="vertical" size={[36, 36]} className="w-full">
                <Tabs
                    activeKey={activeTab}
                    onChange={handleTabChange}
                    items={tabItems}
                />

                {relatedId && (
                    <Card>
                        <Categories
                            relatedType={activeTab}
                            relatedId={relatedId}
                        />
                    </Card>
                )}
            </Space>
        </Card>
    );
};

export { Permissions };