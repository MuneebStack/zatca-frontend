import { useParams, useNavigate } from "react-router-dom";
import { Button, Card, Flex, Typography } from "antd";
import { Categories } from "./components/Categories";
import { ArrowLeftOutlined } from "@ant-design/icons";

const { Text } = Typography;

const User: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    return (
        <Card
            title={
                <Flex justify="space-between" align="center">
                    <Text>Manage User - Permissions</Text>
                    <Button
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate(-1)}
                    >
                        Back
                    </Button>
                </Flex>
            }
        >
            <Categories relatedType="user" relatedId={id!} />
        </Card>
    );
};

export {
    User
} 