import { Card, Form, Input, Button } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { axiosClient } from "@/services/axiosClient";
import { useState } from "react";
import { successMessageHandler } from "@/utils/notificationHandler";
import { useNavigate } from "react-router-dom";

export const CreateUser = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = (values: any) => {
        setLoading(true);
        axiosClient
            .post('portal/users', values)
            .then(({ data: responseData }) => {
                if (responseData?.data) {
                    successMessageHandler(responseData);
                    navigate('/users');
                }
            })
            .catch(error => (error))
            .finally(() => setLoading(false))
    };

    return (
        <Card title="Create User">
            <Form
                name="create-user"
                onFinish={onFinish}
                layout="vertical"
            >
                <Form.Item
                    name="name"
                    label="Name"
                    rules={[
                        {
                            required: true,
                            message: "Please enter the name"
                        }
                    ]}
                >
                    <Input
                        prefix={<UserOutlined />}
                        placeholder="Name"
                    />
                </Form.Item>

                <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                        {
                            required: true,
                            message: "Please enter the email"
                        },
                        {
                            type: 'email',
                            message: 'Please enter a correct email!',
                        },
                    ]}
                >
                    <Input
                        prefix={<UserOutlined />}
                        placeholder="Email"
                    />
                </Form.Item>

                <Form.Item
                    name="password"
                    label="Password"
                    rules={[
                        {
                            required: true,
                            message: "Please enter the password"
                        },
                        {
                            min: 8,
                            message: "Please enter atleast 8 characters"
                        }
                    ]}
                >
                    <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="Password"
                    />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" disabled={loading} loading={loading} block>
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
}