import { useEffect, useState } from "react";
import { Button, Table, Popconfirm, Modal, Typography, Flex, Form, Space } from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { axiosClient } from "@/services/axiosClient";
import type { ColumnsType } from "antd/es/table";
import type { PaginationType } from "@/types";
import { successMessageHandler } from "@/utils/notificationHandler";
import { RoleForm } from "./components/RoleForm";
import type { RoleType } from "@/types/role";
import { filterTableColumns } from "@/utils";
import { usePermission } from "@/hooks/usePermission";

const { Title } = Typography;

export const Roles = () => {
    const { hasModulePermission } = usePermission();

    const canViewAll = hasModulePermission("role", "INDEX");
    const canCreate = hasModulePermission("role", "STORE");
    const canUpdate = hasModulePermission("role", "UPDATE");
    const canDelete = hasModulePermission("role", "DESTROY");

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
        if (!canViewAll) return;
        
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
        ...(((canUpdate || canDelete) ? [{
            title: "Action",
            key: "action",
            render: (_: unknown, record: RoleType) => (
                <Space size="middle">
                    {canUpdate &&
                        <EditOutlined
                            className="cursor-pointer !text-green-500"
                            onClick={() => {
                                form.setFieldsValue(record);
                                setIsEditModalOpen(true);
                            }}
                        />
                    }
                    {canDelete &&
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
                    }
                </Space>
            ),
        }] : [])),
    ];
    const hiddenColumns: (keyof RoleType)[] = ["created_at", "updated_at"];
    const filteredColumns = filterTableColumns<RoleType>(
        columns,
        roles,
        hiddenColumns
    );

    return (
        <Flex vertical gap="middle">
            <Flex justify="space-between" align="center">
                <Title level={4}>
                    Roles
                </Title>
                {canCreate && (
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsCreateModalOpen(true)}>
                        Create Role
                    </Button>
                )}
            </Flex>

            {canViewAll && (
                <Table
                    rowKey="id"
                    dataSource={roles}
                    columns={filteredColumns}
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
            )}

            {canCreate && (
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
            )}

            {canUpdate && (
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
            )}
        </Flex>
    );
}