import { Form, Input, Button, Select, Tooltip } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { axiosClient } from "@/services/axiosClient";
import { successMessageHandler } from "@/utils/notificationHandler";
import { antdIconRender } from "@/utils/antdIconRender";
import { useEffect, useState } from "react";
import type { FormInstance } from "antd";
import type { NavigationType } from "@/types/navigation";
import { removeEmptyChildren } from "@/utils";

interface NavigationFormProps {
    form: FormInstance;
    mode?: "create" | "edit" | "";
    onSuccess: (navigation: NavigationType) => void;
}

const NavigationForm = ({
    form,
    mode,
    onSuccess
}: NavigationFormProps) => {
    const [loading, setLoading] = useState(false);
    const [navigationLoading, setNavigationLoading] = useState(false);
    const [allNavigations, setAllNavigations] = useState<NavigationType[]>([]);
    const [navigations, setNavigations] = useState<NavigationType[]>([]);
    const [iconName, setIconName] = useState<string>("");
    const editRecordId : number | undefined = form.getFieldValue("id");

    const onFinish = (values: any) => {
        setLoading(true);

        const request =
            mode === "create"
                ? axiosClient.post("portal/navigations", values)
                : axiosClient.put(`portal/navigations/${editRecordId}`, values);

        request
            .then(({ data: responseData }) => {
                if (responseData?.data) {
                    onSuccess(removeEmptyChildren(responseData.data.data));
                    successMessageHandler(responseData);
                }
            })
            .catch((error) => error)
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        const controller = new AbortController();

        setNavigationLoading(true);
        axiosClient
            .get("portal/navigations", {
                params: { bypass_pagination: true },
                signal: controller.signal
            })
            .then(({ data: responseData }) => {
                if (responseData?.data) {
                    setAllNavigations(removeEmptyChildren(responseData.data.data));
                }
            })
            .catch(() => { })
            .finally(() => setNavigationLoading(false));

        return () => controller.abort();
    }, []);

    useEffect(() => {
        if (allNavigations.length === 0) return;

        if (mode === "edit" && editRecordId) {
            setNavigations(allNavigations.filter((navigation) => navigation.id !== editRecordId));
        } else {
            setNavigations(allNavigations);
        }
    }, [mode, editRecordId, allNavigations]);

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
                <Input placeholder="e.g. Dashboard" autoComplete="off" />
            </Form.Item>

            <Form.Item
                name="route"
                label="Route"
            >
                <Input placeholder="e.g. /dashboard" autoComplete="off" />
            </Form.Item>

            <Form.Item
                name="icon"
                label="Icon"
                rules={[
                    {
                        validator: async (_, value) => {
                            if (!value || antdIconRender(value)) return Promise.resolve();
                            return Promise.reject(new Error("Invalid Ant Design icon name"));
                        },
                    },
                ]}
                validateTrigger="onBlur"
            >
                <Input
                    placeholder="e.g. DashboardOutlined"
                    autoComplete="off"
                    prefix={
                        <Tooltip title="View Ant Design Icons">
                            <a
                                href="https://ant.design/components/icon/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <InfoCircleOutlined />
                            </a>
                        </Tooltip>
                    }
                    suffix={antdIconRender(iconName)}
                    onBlur={() => setIconName(form.getFieldValue("icon") || "")}
                />
            </Form.Item>

            <Form.Item
                name="order"
                label="Order"
                rules={[
                    {
                        required: true,
                        message: "Please enter a order"
                    }
                ]}>
                <Input type="number" placeholder="e.g. 1" />
            </Form.Item>

            <Form.Item name="parent_id" label="Parent Menu">
                <Select
                    placeholder="Select a parent menu"
                    allowClear
                    options={navigations.map((navigation) => ({
                        label: navigation.name,
                        value: navigation.id,
                    }))}
                    loading={navigationLoading}
                    disabled={navigationLoading}
                />
            </Form.Item>

            <Form.Item>
                <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    disabled={loading}
                    block
                >
                    {mode === "create" ? "Create Navigation" : "Update Navigation"}
                </Button>
            </Form.Item>
        </Form>
    );
};

export {
    NavigationForm
};