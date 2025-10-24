import { Flex, Typography } from "antd";
import { PermissionRoleListTable } from "./components/PermissionRoleListTable";

const { Title } = Typography;

const RolesPermissions: React.FC = () => {
    return (
        <Flex vertical gap="middle">
            <Flex justify="space-between" align="center">
                <Title level={4}>
                    Roles - Permissions
                </Title>
            </Flex>

            <PermissionRoleListTable />
        </Flex>
    );
};

export {
    RolesPermissions
} 