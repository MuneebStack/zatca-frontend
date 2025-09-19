import { Card, Form, Input, Button } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { axiosClient } from "@/services/axiosClient";
import { useState } from "react";
import { useAuth } from "@/providers/AuthContext";

const Login = () => {
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const onFinish = (values: any) => {
        setLoading(true);
        axiosClient
            .post('auth/login', values)
            .then((response) => {
                if (response?.data?.data) {
                    const { auth_token, expires_at } = response.data.data;
                    login(auth_token, new Date(expires_at).getTime().toString())
                }
            })
            .catch(error => (error))
            .finally(() => setLoading(false))
    };

    return (
        <div className="flex items-center justify-center w-full">
            <Card title="Login" className="w-96">
                <Form
                    name="login"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    layout="vertical"
                >
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { 
                                required: true,
                                message: "Please enter your email" 
                            },
                            {
                                type: 'email',
                                message: 'Please enter a correct email!',
                            },
                        ]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="Email" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[
                            { 
                                required: true,
                                message: "Please enter your password"
                            }
                        ]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Password" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" disabled={loading} loading={loading} block>
                            Login
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
}

export {
    Login
};