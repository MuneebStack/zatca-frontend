import { Form, Input, Button } from "antd";
import { axiosClient } from "@/services/axiosClient";
import { successMessageHandler } from "@/utils/notificationHandler";
import { useState } from "react";
import type { FormInstance } from "antd";
import type { RoleType } from "@/types/role";

interface RoleFormProps {
    form: FormInstance;
    mode: "create" | "edit";
    onSuccess: (role: RoleType) => void;
}

export const RoleForm = ({
    form,
    mode,
    onSuccess
}: RoleFormProps) => {
    const [loading, setLoading] = useState(false);

    const editRecordId: number | undefined = form.getFieldValue("id");

    const onFinish = (values: any) => {
        setLoading(true);

        const request =
            mode === "create"
                ? axiosClient.post("portal/roles", values)
                : axiosClient.put(`portal/roles/${editRecordId}`, values);

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
            onFinish={onFinish}
        >
            <Form.Item
                name="name"
                label="Name"
                rules={[
                    {
                        required: true,
                        message: "Please enter a name"
                    }
                ]}
            >
                <Input placeholder="e.g. Admin" autoComplete="off" />
            </Form.Item>

            <Form.Item>
                <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    disabled={loading}
                    block
                >
                    {mode === "create" ? "Create Role" : "Update Role"}
                </Button>
            </Form.Item>
        </Form>
    );
};