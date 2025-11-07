import { useEffect, useState } from "react";
import { Button, Table, Popconfirm, Modal, Typography, Flex, Form, Space } from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { axiosClient } from "@/services/axiosClient";
import type { ColumnsType } from "antd/es/table";
import type { PaginationType } from "@/types";
import { successMessageHandler } from "@/utils/notificationHandler";
import { RoleForm } from "./components/RoleForm";
import type { RoleType } from "@/types/role";

const { Title } = Typography;

export const Roles = () => {
    const [roles, setRoles] = useState<RoleType[]>([]);
    const [pagination, setPagination] = useState<PaginationType>({
        current: 1,
        pageSize: 10,
        total: 0
    });
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const onDelete = (roleId: number) => {
        setLoading(true);
        axiosClient
            .delete(`portal/roles/${roleId}`)
            .then(({ data: responseData }) => {
                if (responseData?.data) {
                    setRoles((prev) => prev.filter(role => role.id !== roleId));
                    successMessageHandler(responseData);
                }
            })
            .finally(() => setLoading(false))
    };

    useEffect(() => {
        const controller = new AbortController();

        setLoading(true);
        axiosClient
            .get("portal/roles", {
                params: {
                    page: pagination.current,
                    per_page: pagination.pageSize,
                },
                signal: controller.signal
            })
            .then(({ data: responseData }) => {
                if (responseData?.data) {
                    const payload = responseData.data;

                    setRoles(payload.data);
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

    const columns: ColumnsType<RoleType> = [
        {
            title: "#",
            key: "index",
            width: "5%",
            render: (_: unknown, __: RoleType, index: number) => (pagination.current - 1) * pagination.pageSize + index + 1,
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name"
        },
        {
            title: "Action",
            key: "action",
            render: (_: unknown, record: RoleType) => (
                <Space size="middle">
                    <EditOutlined
                        className="cursor-pointer !text-green-500"
                        onClick={() => {
                            form.setFieldsValue(record);
                            setIsEditModalOpen(true);
                        }}
                    />
                    <Popconfirm
                        title="Are you sure to delete this role?"
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
                    Roles
                </Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsCreateModalOpen(true)}>
                    Create Role
                </Button>
            </Flex>

            <Table
                rowKey="id"
                dataSource={roles}
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
            />

            <Modal
                title="Create Role"
                open={isCreateModalOpen}
                onCancel={() => setIsCreateModalOpen(false)}
                afterClose={() => form.resetFields()}
                footer={null}
            >
                <RoleForm
                    form={form}
                    mode="create"
                    onSuccess={(newRole) => {
                        setRoles((prev) => [newRole, ...prev]);
                        setIsCreateModalOpen(false);
                    }}
                />
            </Modal>

            <Modal
                title="Edit Role"
                open={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                afterClose={() => form.resetFields()}
                footer={null}
            >
                <RoleForm
                    form={form}
                    mode="edit"
                    onSuccess={(updatedRole) => {
                        setRoles((prev) => prev.map(role => role.id === updatedRole.id ? updatedRole : role));
                        setIsEditModalOpen(false);
                    }}
                />
            </Modal>
        </Flex>
    );
}