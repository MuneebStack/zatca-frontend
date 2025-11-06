import { Card, Form, Input, Button } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { axiosClient } from "@/services/axiosClient";
import { useEffect, useState } from "react";
import { successMessageHandler } from "@/utils/notificationHandler";
import { useNavigate, useParams } from "react-router-dom";

interface FormDataType {
    name: string,
    email: string,
    password?: string
}

export const EditUser = () => {
    const [loading, setLoading] = useState(false);
    const [dataLoading, setDataLoading] = useState(true);
    const [initialValues, setInitialValues] = useState<FormDataType>();
    const navigate = useNavigate();
    const params = useParams();

    const onFinish = (values: any) => {
        if (params?.id) {
            setLoading(true);

            !values.password && delete values.password;

            axiosClient
                .put(`portal/users/${params.id}`, values)
                .then(({ data: responseData }) => {
                    if (responseData?.data) {
                        successMessageHandler(responseData);
                        navigate('/users');
                    }
                })
                .catch(error => (error))
                .finally(() => setLoading(false))
        }
    };

    useEffect(() => {
        if (params.id) {
            const controller = new AbortController();

            axiosClient
                .get(`portal/users/${params.id}`)
                .then(({ data: responseData }) => {
                    const payload = responseData?.data;

                    if (payload) {
                        setInitialValues(payload.data);
                    }
                })
                .catch(error => (error))
                .finally(() => setDataLoading(false))

            return () => controller.abort();
        }
    }, [params.id])

    return (
        <Card title="Edit User" loading={dataLoading}>
            <Form
                name="edit-user"
                initialValues={initialValues}
                onFinish={onFinish}
                layout="vertical"
                key={initialValues ? Object.keys(initialValues).join(' ') : null}
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
                        Update
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
}