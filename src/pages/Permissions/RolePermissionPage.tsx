import { useParams, useNavigate } from "react-router-dom";
import { Button, Card, Flex, Typography } from "antd";
import { PermissionCategories } from "./components/PermissionCategories";
import { ArrowLeftOutlined } from "@ant-design/icons";

const { Text } = Typography;

const RolePermissionsPage: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    return (
        <Card
            title={
                <Flex justify="space-between" align="center">
                    <Text>Manage Role Permissions</Text>
                    <Button
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate(-1)}
                    >
                        Back
                    </Button>
                </Flex>
            }
        >
            <PermissionCategories relatedType="role" relatedId={id!} />
        </Card>
    );
}; 

export {
    RolePermissionsPage
}