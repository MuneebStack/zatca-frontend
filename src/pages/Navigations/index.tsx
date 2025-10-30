import { useEffect, useRef, useState } from "react";
import { Button, Table, Popconfirm, Modal, Typography, Flex, Form, Space } from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { axiosClient } from "@/services/axiosClient";
import type { ColumnsType } from "antd/es/table";
import type { PaginationType } from "@/types";
import { successMessageHandler } from "@/utils/notificationHandler";
import type { NavigationType } from "@/types/navigation";
import { antdIconRender } from "@/utils/antdIconRender";
import { removeEmptyChildren } from "@/utils";
import { NavigationForm } from "./components/navigationForm";
import { useAuth } from "@/providers/AuthContext";

const { Title } = Typography;

const Navigations = () => {
    const [navigations, setNavigations] = useState<NavigationType[]>([]);
    const [pagination, setPagination] = useState<PaginationType>({
        current: 1,
        pageSize: 10,
        total: 0,
    });
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const { setNavigations: setGlobalNavigations } = useAuth();
    const firstRender = useRef(true);

    const insertNavigation = (
        navigations: NavigationType[],
        newNavigation: NavigationType
    ): NavigationType[] => {
        if (!newNavigation.parent_id) {
            return [newNavigation, ...navigations].sort((a, b) => a.order - b.order);
        }

        return navigations.map((navigation) => {
            if (navigation.id === newNavigation.parent_id) {
                const updatedChildren = [...(navigation.children ?? []), newNavigation].sort((a, b) => a.order - b.order);
                return { ...navigation, children: updatedChildren };
            }

            if (navigation.children && navigation.children.length > 0) {
                return { ...navigation, children: insertNavigation(navigation.children, newNavigation) };
            }

            return navigation;
        });
    }

    const updateNavigation = (
        navigations: NavigationType[],
        updatedNavigation: NavigationType
    ): NavigationType[] => {
        const flatNavigations = navigations
            .map((navigation) => {
                const updatedChildren = navigation.children ? updateNavigation(navigation.children, updatedNavigation) : undefined;
                return {
                    ...navigation,
                    ...(updatedChildren && updatedChildren.length > 0 ? { children: updatedChildren } : {})
                };
            })
            .filter((navigation) => navigation.id !== updatedNavigation.id);

        if (!updatedNavigation.parent_id) {
            return [updatedNavigation, ...flatNavigations].sort((a, b) => a.order - b.order);
        }

        return flatNavigations.map((navigation) => {
            if (navigation.id === updatedNavigation.parent_id) {
                const updatedChildren = [
                    ...(navigation.children ?? []),
                    updatedNavigation,
                ].sort((a, b) => a.order - b.order);
                return { ...navigation, children: updatedChildren };
            }
            return navigation;
        });
    };

    const deleteNavigation = (
        navigations: NavigationType[],
        navigationId: number
    ): NavigationType[] => {
        return navigations
            .filter((navigation) => navigation.id !== navigationId)
            .map((navigation) => {
                if (navigation.children && navigation.children.length > 0) {
                    const updatedChildren = deleteNavigation(navigation.children, navigationId);

                    if (updatedChildren.length > 0) {
                        return { ...navigation, children: updatedChildren };
                    } else {
                        const { children, ...rest } = navigation;
                        return rest;
                    }
                }

                return navigation;
            });
    };

    const onDelete = (navigationId: number) => {
        setLoading(true);
        axiosClient
            .delete(`portal/navigations/${navigationId}`)
            .then(({ data: responseData }) => {
                if (responseData?.data) {
                    setNavigations((prev) => deleteNavigation(prev, navigationId));
                    successMessageHandler(responseData);
                }
            })
            .finally(() => setLoading(false))
    };

    useEffect(() => {
        const controller = new AbortController();

        setLoading(true);
        axiosClient
            .get("portal/navigations/tree", {
                params: {
                    page: pagination.current,
                    per_page: pagination.pageSize,
                },
                signal: controller.signal
            })
            .then(({ data: responseData }) => {
                if (responseData?.data) {
                    const payload = responseData.data;

                    setNavigations(removeEmptyChildren(payload.data));
                    setPagination((prev) => ({
                        ...prev,
                        total: payload.meta.total,
                        current: payload.meta.current_page,
                        pageSize: payload.meta.per_page,
                    }));
                }
            })
            .catch((error) => (error))
            .finally(() => setLoading(false))

        return () => controller.abort();
    }, [pagination.current, pagination.pageSize]);

    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }

        setGlobalNavigations(navigations);
    }, [navigations])

    const columns: ColumnsType<NavigationType> = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name"
        },
        {
            title: "Route",
            dataIndex: "route",
            key: "route"
        },
        {
            title: "Icon",
            dataIndex: "icon",
            key: "icon",
            render: (icon: string) => antdIconRender(icon)
        },
        {
            title: "Order",
            dataIndex: "order",
            key: "order"
        },
        {
            title: "Action",
            key: "action",
            render: (_: unknown, record: NavigationType) => (
                <Space size="middle">
                    <EditOutlined
                        className="cursor-pointer !text-green-500"
                        onClick={() => {
                            form.setFieldsValue(record);
                            setIsEditModalOpen(true);
                        }}
                    />
                    <Popconfirm
                        title="Are you sure to delete this navigation?"
                        okText="Yes"
                        cancelText="No"
                        onConfirm={() => onDelete(record.id)}
                    >
                        <DeleteOutlined
                            className="cursor-pointer !text-red-600"
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <Flex vertical gap="middle">
            <Flex justify="space-between" align="center">
                <Title level={4}>
                    Navigations
                </Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsCreateModalOpen(true)}>
                    Create Navigations
                </Button>
            </Flex>

            <Table
                rowKey="id"
                dataSource={navigations}
                columns={columns}
                loading={loading}
                pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    total: pagination.total,
                    showSizeChanger: true,
                    pageSizeOptions: ["10", "25", "50", "100"],
                    onChange: (page, pageSize) => {
                        setPagination((prev) => ({ ...prev, current: page, pageSize }));
                    },
                }}
                bordered
                expandable={{
                    rowExpandable: (record) => !record.route
                }}
            />

            <Modal
                title="Create Navigation"
                open={isCreateModalOpen}
                onCancel={() => setIsCreateModalOpen(false)}
                afterClose={() => form.resetFields()}
                footer={null}
            >
                <NavigationForm
                    form={form}
                    mode="create"
                    navigations={navigations}
                    onSuccess={(newNavigation) => {
                        setNavigations((prev) => insertNavigation(prev, newNavigation));
                        setIsCreateModalOpen(false);
                    }}
                />
            </Modal>

            <Modal
                title="Edit Navigation"
                open={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                afterClose={() => form.resetFields()}
                footer={null}
            >
                <NavigationForm
                    form={form}
                    mode="edit"
                    navigations={navigations}
                    onSuccess={(updatedNavigation) => {
                        setNavigations((prev) => updateNavigation(prev, updatedNavigation));
                        setIsEditModalOpen(false);
                    }}
                />
            </Modal>
        </Flex>
    );
};

export { Navigations };