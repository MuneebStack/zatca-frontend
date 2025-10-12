import { Flex, Typography } from "antd";
import { RoleListTable } from "./components/RoleListTable";

const { Title } = Typography;

const RolesPermissions: React.FC = () => {
    return (
        <Flex vertical gap="middle">
            <Flex justify="space-between" align="center">
                <Title level={4}>
                    Roles Permissions
                </Title>
            </Flex>

            <RoleListTable />
        </Flex>
    );
};

export {
    RolesPermissions
} 