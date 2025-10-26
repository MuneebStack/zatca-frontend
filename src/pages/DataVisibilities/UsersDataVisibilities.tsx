import { Flex, Typography } from "antd";
import { DataVisibilityUserListTable } from "./components/DataVisibilityUserListTable";

const { Title } = Typography;

const UsersDataVisibilities: React.FC = () => {
    return (
        <Flex vertical gap="middle">
            <Flex justify="space-between" align="center">
                <Title level={4}>
                    Users - Data Visibilities
                </Title>
            </Flex>

            <DataVisibilityUserListTable />
        </Flex>
    );
};

export {
    UsersDataVisibilities
} 