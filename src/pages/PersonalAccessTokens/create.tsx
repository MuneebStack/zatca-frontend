import { Form, Input, Button, type FormInstance } from "antd";
import { axiosClient } from "@/services/axiosClient";
import { useState } from "react";
import { successMessageHandler } from "@/utils/notificationHandler";
import type { PersonalAccessTokenType } from "@/types/personalAccessToken";
import { UserSelector } from "@/components/UserSelector";

type PayloadType = {
    data: PersonalAccessTokenType,
    plain_text_token: string
}
interface CreatePersonalAccessTokenProps {
    form: FormInstance;
    onTokenCreated?: (payload: PayloadType) => void;
}

export const CreatePersonalAccessToken = ({ form, onTokenCreated }: CreatePersonalAccessTokenProps) => {
    const [loading, setLoading] = useState(false);

    const onFinish = (values: any) => {
        setLoading(true);
        axiosClient
            .post('portal/personal_access_tokens', values)
            .then(({ data: responseData }) => {
                if (responseData?.data) {
                    const payload = responseData.data;
                    onTokenCreated?.(payload);
                    successMessageHandler(responseData);
                }
            })
            .catch(error => (error))
            .finally(() => setLoading(false))
    };

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
                    <UserSelector className="w-64 mt-2!" />
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