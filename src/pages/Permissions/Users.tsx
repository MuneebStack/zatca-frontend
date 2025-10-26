import { Flex, Typography } from "antd";
import { UserListTable } from "./components/UserListTable";

const { Title } = Typography;

const Users: React.FC = () => {
    return (
        <Flex vertical gap="middle">
            <Flex justify="space-between" align="center">
                <Title level={4}>
                    Users - Permissions
                </Title>
            </Flex>

            <UserListTable />
        </Flex>
    );
};

export {
    Users
} 