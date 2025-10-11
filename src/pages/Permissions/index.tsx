import { Tabs, Flex, Typography } from "antd";
import { RoleListTable } from "./components/RoleListTable";
import { UserListTable } from "./components/UserListTable";

const { Title } = Typography;

const Permissions: React.FC = () => {
    return (
        <Flex vertical gap="middle">
            <Flex justify="space-between" align="center">
                <Title level={4}>
                    Permissions
                </Title>
            </Flex>

            <Tabs
                defaultActiveKey="roles"
                items={[
                    {
                        key: "roles",
                        label: "Roles",
                        children: <RoleListTable />,
                    },
                    {
                        key: "users",
                        label: "Users",
                        children: <UserListTable />,
                    },
                ]}
            />
        </Flex>
    );
};

export {
    Permissions
} 