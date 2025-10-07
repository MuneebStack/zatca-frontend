import { axiosClient } from "@/services/axiosClient";
import type { UserType } from "@/types/user";
import { Button, Flex, Popconfirm, Space, Table, Typography } from "antd"
import type { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { EyeOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { successMessageHandler } from "@/utils/notificationHandler";
import type { PaginationType } from "@/types";

const { Title } = Typography;

const Users = () => {
    const [users, setUsers] = useState<UserType[]>([]);
    const [pagination, setPagination] = useState<PaginationType>({
        current: 1,
        pageSize: 10,
        total: 0,
    });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const onView = (userId: number) => navigate(`/users/view/${userId}`);

    const onEdit = (userId: number) => navigate(`/users/edit/${userId}`);

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

    useEffect(() => {
        const controller = new AbortController();

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
        {
            title: "Action",
            key: "action",
            render: (_: unknown, record: UserType) => (
                <Space size="middle">
                    <EyeOutlined
                        className="cursor-pointer !text-blue-600"
                        onClick={() => onView(record.id)}
                    />
                    <EditOutlined
                        className="cursor-pointer !text-green-500"
                        onClick={() => onEdit(record.id)}
                    />
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
                </Space>
            ),
        },
    ];

    return (
        <Flex vertical gap="middle">
            <Flex justify="space-between" align="center">
                <Title level={4}>
                    Users
                </Title>
                <NavLink to="/users/create">
                    <Button type="primary" icon={<PlusOutlined />}>
                        Create User
                    </Button>
                </NavLink>
            </Flex>

            <Table
                rowKey="id"
                dataSource={users}
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
        </Flex>
    )
}

export {
    Users
}