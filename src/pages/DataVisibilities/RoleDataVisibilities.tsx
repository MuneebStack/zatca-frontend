import { useParams, useNavigate } from "react-router-dom";
import { Button, Card, Flex, Typography } from "antd";
import { DataVisibilityBuilder } from "./components/DataVisibilityBuilder";
import { ArrowLeftOutlined } from "@ant-design/icons";

const { Text } = Typography;

const RoleDataVisibilities: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    return (
        <Card
            title={
                <Flex justify="space-between" align="center">
                    <Text>Manage Role - Data Visibilities</Text>
                    <Button
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate(-1)}
                    >
                        Back
                    </Button>
                </Flex>
            }
        >
            <DataVisibilityBuilder relatedType="role" relatedId={id!} />
        </Card>
    );
}; 

export {
    RoleDataVisibilities
}