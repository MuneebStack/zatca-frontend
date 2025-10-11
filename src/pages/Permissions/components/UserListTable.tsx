import { Table, Button, Tag } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ColumnsType } from "antd/es/table";
import type { Role } from "@/types/role";
import type { PaginationType } from "@/types";
import { axiosClient } from "@/services/axiosClient";
import { capitalize } from "@/utils";

const UserListTable: React.FC = () => {
    const [users, setUsers] = useState<Role[]>([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState<PaginationType>({
        current: 1,
        pageSize: 10,
        total: 0,
    });
    const navigate = useNavigate();

    useEffect(() => {
        const controller = new AbortController();

        setLoading(true);
        axiosClient
            .get("portal/users/permissions", {
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

    const columns: ColumnsType<Role> = [
        {
            title: "Role",
            dataIndex: "name",
            render: (name) => capitalize(name, '-')
        },
        { 
            title: "Email",
            dataIndex: "email",
        },
        {
            title: "Total Permissions",
            dataIndex: "permissions_count",
            render: (_, record) => (
                <Tag>
                    {record?.permissions_count || 0}
                </Tag>
            ),
        },
        {
            title: "Action",
            align: "center",
            render: (_, record) => (
                <Button
                    type="primary"
                    onClick={() => navigate(`/permissions/users/${record.id}`)}
                >
                    Manage
                </Button>
            ),
        },
    ];

    return (
        <Table
            rowKey="id"
            columns={columns}
            dataSource={users}
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
        />
    );
};

export {
    UserListTable
}