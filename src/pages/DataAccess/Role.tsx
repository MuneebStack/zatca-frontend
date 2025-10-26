import { useParams, useNavigate } from "react-router-dom";
import { Button, Card, Flex, Typography } from "antd";
import { Builder } from "./components/Builder";
import { ArrowLeftOutlined } from "@ant-design/icons";

const { Text } = Typography;

const Role: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    return (
        <Card
            title={
                <Flex justify="space-between" align="center">
                    <Text>Manage Role - Data Access</Text>
                    <Button
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate(-1)}
                    >
                        Back
                    </Button>
                </Flex>
            }
        >
            <Builder relatedType="role" relatedId={id!} />
        </Card>
    );
}; 

export {
    Role
}