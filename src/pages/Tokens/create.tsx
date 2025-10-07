import { Form, Input, Button, Select, type FormInstance } from "antd";
import { axiosClient } from "@/services/axiosClient";
import React, { useEffect, useState } from "react";
import { successMessageHandler } from "@/utils/notificationHandler";
import type { UserType } from "@/types/user";
import type { TokenType } from "@/types/token";

interface CreateTokenProps {
    form: FormInstance;
    setGeneratedToken?: React.Dispatch<React.SetStateAction<string | undefined>>
    setIsTokenModalOpen?: React.Dispatch<React.SetStateAction<boolean>>
    setIsCreateModelOpen?: React.Dispatch<React.SetStateAction<boolean>>
    onTokenCreated?: (newToken: TokenType) => void;
}

const CreateToken = ({ form, setGeneratedToken, setIsTokenModalOpen, setIsCreateModelOpen, onTokenCreated }: CreateTokenProps) => {
    const [loading, setLoading] = useState(false);
    const [userLoading, setUserLoading] = useState(false);
    const [users, setUsers] = useState<UserType[]>([]);

    const onFinish = (values: any) => {
        setLoading(true);
        axiosClient
            .post('portal/tokens', values)
            .then(({ data: responseData }) => {
                if (responseData?.data) {
                    const payload = responseData.data;
                    onTokenCreated?.(payload.data);
                    setGeneratedToken?.(payload.plain_text_token);
                    setIsCreateModelOpen?.(false);
                    setIsTokenModalOpen?.(true);
                    successMessageHandler(responseData);
                }
            })
            .catch(error => (error))
            .finally(() => setLoading(false))
    };

    useEffect(() => {
        const controller = new AbortController();

        setUserLoading(true);
        axiosClient
            .get('portal/users', {
                params: {
                    bypass_pagination: true
                },
                signal: controller.signal
            })
            .then(({ data: responseData }) => {
                if (responseData?.data) {
                    setUsers(responseData.data.data);
                }
            })
            .catch(error => (error))
            .finally(() => setUserLoading(false))

        return () => controller.abort();
    }, [])

    return (
        <>
            <Form layout="vertical" form={form} onFinish={onFinish}>
                <Form.Item
                    name="name"
                    label="Token Name"
                    rules={[
                        {
                            required: true,
                            message: "Please enter a token name"
                        }
                    ]}
                >
                    <Input placeholder="e.g. Client Access Token" autoComplete="off" />
                </Form.Item>

                <Form.Item
                    name="user_id"
                    label="User"
                    rules={[{ required: true, message: "Please select a user" }]}
                >
                    <Select
                        placeholder="Select User"
                        options={
                            users.map((user) => {
                                return {
                                    label: user.name,
                                    value: user.id
                                }
                            })
                        }
                        loading={userLoading}
                    />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} disabled={loading} block>
                        Generate Token
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
}

export {
    CreateToken
};