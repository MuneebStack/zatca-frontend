import { Form, Input, Button } from "antd";
import { axiosClient } from "@/services/axiosClient";
import { successMessageHandler } from "@/utils/notificationHandler";
import { useState } from "react";
import type { FormInstance } from "antd";
import type { UserType } from "@/types/user";

interface UserFormProps {
    form: FormInstance;
    mode: "create" | "edit";
    onSuccess: (user: UserType) => void;
}

export const UserForm = ({
    form,
    mode,
    onSuccess
}: UserFormProps) => {
    const [loading, setLoading] = useState(false);

    const editRecordId: number | undefined = form.getFieldValue("id");

    const onFinish = (values: any) => {
        setLoading(true);

        mode === "edit" && !values.password && delete values.password;

        const request =
            mode === "create"
                ? axiosClient.post("portal/users", values)
                : axiosClient.put(`portal/users/${editRecordId}`, values);

        request
            .then(({ data: responseData }) => {
                if (responseData?.data) {
                    const payload = responseData.data;
                    onSuccess(payload.data);
                    successMessageHandler(responseData);
                }
            })
            .catch((error) => error)
            .finally(() => setLoading(false));
    };

    return (
        <Form
            layout="vertical"
            form={form}
            name={mode === "create" ? "create_user_form" : "edit_user_form"}
            onFinish={onFinish}
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
                <Input placeholder="e.g. John" />
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
                <Input placeholder="e.g. user@example.com" />
            </Form.Item>

            <Form.Item
                name="password"
                label="Password"
                rules={[
                    ...(mode === "create" ?
                        [
                            {
                                required: true,
                                message: "Please enter the password"
                            },
                        ] : []
                    ),
                    {
                        validator: (_, value) => {
                            if (value && value.length < 8) {
                                return Promise.reject("Please enter at least 8 characters");
                            }
                            return Promise.resolve();
                        },
                    },
                ]}
            >
                <Input.Password placeholder="Password" />
            </Form.Item>

            <Form.Item>
                <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    disabled={loading}
                    block
                >
                    {mode === "create" ? "Create User" : "Update User"}
                </Button>
            </Form.Item>
        </Form >
    );
};