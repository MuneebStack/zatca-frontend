import { useEffect, useRef, useState } from "react";
import { Button, Table, Popconfirm, Modal, Typography, Flex, Form, Space } from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { axiosClient } from "@/services/axiosClient";
import type { ColumnsType } from "antd/es/table";
import type { PaginationType } from "@/types";
import { successMessageHandler } from "@/utils/notificationHandler";
import type { NavigationType } from "@/types/navigation";
import { antdIconRender } from "@/utils/antdIconRender";
import { buildTree, filterTableColumns, flattenTree, removeEmptyChildren } from "@/utils";
import { NavigationForm } from "./components/NavigationForm";
import { useAuth } from "@/providers/AuthContext";
import { formatDate } from "@/utils/date";

const { Title } = Typography;

export const Navigations = () => {
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
        const flatNavigations = flattenTree(navigations);
        flatNavigations.push(newNavigation);
        return buildTree(flatNavigations, 'order');
    }

    const updateNavigation = (
        navigations: NavigationType[],
        updatedNavigation: NavigationType
    ): NavigationType[] => {
        const flatNavigations = flattenTree(navigations).sort((a, b) => a.order - b.order);
        const updatedNavigations = flatNavigations.map((navigation) => navigation.id == updatedNavigation.id ? updatedNavigation : navigation);
        return buildTree(updatedNavigations, 'order');
    };

    const deleteNavigation = (
        navigations: NavigationType[],
        navigationId: number
    ): NavigationType[] => {
        const flatNavigations = flattenTree(navigations);
        const filtered = flatNavigations.filter(nav => nav.id !== navigationId);
        return buildTree(filtered, 'order');
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
            title: "Id",
            dataIndex: "id",
            key: "id",
            render: (_: number, __: NavigationType, rowIndex) => (pagination.current - 1) * pagination.pageSize + rowIndex + 1
        },
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
            title: "Created At",
            dataIndex: "created_at",
            key: "created_at",
            render: (created_at) => formatDate(created_at)
        },
        {
            title: "Updated At",
            dataIndex: "updated_at",
            key: "updated_at",
            render: (updated_at) => formatDate(updated_at)
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
    const hiddenColumns: (keyof NavigationType)[] = ["parent_id", "created_at", "updated_at"];
    const filteredColumns = filterTableColumns<NavigationType>(
        columns,
        navigations,
        hiddenColumns
    );

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
                columns={navigations.length ? filteredColumns : []}
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