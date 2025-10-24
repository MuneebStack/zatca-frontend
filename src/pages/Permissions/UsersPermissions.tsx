import { Flex, Typography } from "antd";
import { PermissionUserListTable } from "./components/PermissionUserListTable";

const { Title } = Typography;

const UsersPermissions: React.FC = () => {
    return (
        <Flex vertical gap="middle">
            <Flex justify="space-between" align="center">
                <Title level={4}>
                    Users - Permissions
                </Title>
            </Flex>

            <PermissionUserListTable />
        </Flex>
    );
};

export {
    UsersPermissions
} 