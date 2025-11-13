import { axiosClient } from "@/services/axiosClient";
import type { UserType } from "@/types/user";
import { Button, Flex, Popconfirm, Space, Table, Typography, Modal, Form, Switch } from "antd"
import type { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { successMessageHandler } from "@/utils/notificationHandler";
import type { PaginationType } from "@/types";
import { UserForm } from "./components/UserForm";
import { filterTableColumns } from "@/utils";
import { usePermission } from "@/hooks/usePermission";

const { Title } = Typography;

export const Users = () => {
    const [users, setUsers] = useState<UserType[]>([]);
    const [pagination, setPagination] = useState<PaginationType>({
        current: 1,
        pageSize: 10,
        total: 0
    });
    const [loading, setLoading] = useState(false);
    const [createForm] = Form.useForm();
    const [editForm] = Form.useForm();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const { hasModulePermission } = usePermission();

    const canViewAll = hasModulePermission("user", "INDEX");
    const canCreate = hasModulePermission("user", "STORE");
    const canUpdate = hasModulePermission("user", "UPDATE");
    const canDelete = hasModulePermission("user", "DELETE");
    const canToggleActive = hasModulePermission("user", "TOGGLE_ACTIVE");

    const onDelete = (userId: number) => {
        setLoading(true);
        axiosClient
            .delete(`portal/users/${userId}`)
            .then(({ data: responseData }) => {
                if (responseData?.data) {
                    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
                    successMessageHandler(responseData);
                }
            })
            .catch((error) => (error))
            .finally(() => setLoading(false))
    }

    const onToggleActive = (userId: number, isActive: boolean) => {
        setLoading(true);
        axiosClient
            .patch(`portal/users/${userId}/toggle-active`, {
                is_active: isActive
            })
            .then(({ data: responseData }) => {
                if (responseData?.data) {
                    setUsers((prev) =>
                        prev.map((user) =>
                            user.id === userId ? { ...user, is_active: isActive } : user
                        )
                    );
                    successMessageHandler(responseData);
                }
            })
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        const controller = new AbortController();

        setLoading(true);
        axiosClient
            .get("portal/users", {
                params: {
                    page: pagination.current,
                    per_page: pagination.pageSize,
                },
                signal: controller.signal
            })
            .then(({ data: responseData }) => {
                if (responseData?.data) {
                    const payload = responseData.data;

                    setUsers(payload.data);
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

    const actionChildren = [];

    if (canToggleActive) {
        actionChildren.push({
            title: "Active",
            key: "active",
            align: "center",
            width: "10%",
            render: (_: unknown, record: UserType) => (
                <Switch
                    checked={record.is_active}
                    size="small"
                    onChange={(checked) => onToggleActive(record.id, checked)}
                />
            ),
        });
    }

    if (canUpdate || canDelete) {
        actionChildren.push({
            title: "General",
            key: "general",
            align: "center",
            width: "10%",
            render: (_: unknown, record: UserType) => (
                <Space size="middle">
                    {canUpdate && (
                        <EditOutlined
                            className="cursor-pointer !text-green-500"
                            onClick={() => {
                                editForm.setFieldsValue(record);
                                setIsEditModalOpen(true);
                            }}
                        />
                    )}
                    {canDelete && (
                        <Popconfirm
                            title="Are you sure to delete this user?"
                            okText="Yes"
                            cancelText="No"
                            onConfirm={() => onDelete(record.id)}
                        >
                            <DeleteOutlined
                                className="cursor-pointer !text-red-600"
                            />
                        </Popconfirm>
                    )}
                </Space>
            ),
        });
    }
    const actionColumn = actionChildren.length > 0
        ? {
            title: "Action",
            key: "action",
            children: actionChildren,
        }
        : null;


    const columns: ColumnsType<UserType> = [
        {
            title: "#",
            key: "index",
            width: "5%",
            render: (_: unknown, __: UserType, index: number) => (pagination.current - 1) * pagination.pageSize + index + 1,
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        ...(actionColumn ? [actionColumn] : [])
    ];
    const hiddenColumns: (keyof UserType)[] = ["created_at", "updated_at"];
    const filteredColumns = filterTableColumns<UserType>(
        columns,
        users,
        hiddenColumns
    );

    return (
        <Flex vertical gap="middle">
            <Flex justify="space-between" align="center">
                <Title level={4}>
                    Users
                </Title>
                {canCreate && (
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsCreateModalOpen(true)}>
                        Create User
                    </Button>
                )}
            </Flex>

            {canViewAll && (
                <Table
                    rowKey="id"
                    dataSource={users}
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
                    title="Create User"
                    open={isCreateModalOpen}
                    onCancel={() => setIsCreateModalOpen(false)}
                    afterClose={() => createForm.resetFields()}
                    footer={null}
                >
                    <UserForm
                        form={createForm}
                        mode="create"
                        onSuccess={(newUser) => {
                            setUsers((prev) => [newUser, ...prev]);
                            setIsCreateModalOpen(false);
                        }}
                    />
                </Modal>
            )}

            {canUpdate && (
                <Modal
                    title="Edit User"
                    open={isEditModalOpen}
                    onCancel={() => setIsEditModalOpen(false)}
                    afterClose={() => editForm.resetFields()}
                    footer={null}
                >
                    <UserForm
                        form={editForm}
                        mode="edit"
                        onSuccess={(updatedUser) => {
                            setUsers((prev) => prev.map(user => user.id === updatedUser.id ? updatedUser : user));
                            setIsEditModalOpen(false);
                        }}
                    />
                </Modal>
            )}
        </Flex >
    )
}