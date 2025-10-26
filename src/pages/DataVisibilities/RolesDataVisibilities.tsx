import { Flex, Typography } from "antd";
import { DataVisibilityRoleListTable } from "./components/DataVisibilityRoleListTable";

const { Title } = Typography;

const RolesDataVisibilities: React.FC = () => {
    return (
        <Flex vertical gap="middle">
            <Flex justify="space-between" align="center">
                <Title level={4}>
                    Roles - Data Visibilities
                </Title>
            </Flex>

            <DataVisibilityRoleListTable />
        </Flex>
    );
};

export {
    RolesDataVisibilities
} 