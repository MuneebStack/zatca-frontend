import { Table, Button } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ColumnsType } from "antd/es/table";
import type { RoleType } from "@/types/role";
import type { PaginationType } from "@/types";
import { axiosClient } from "@/services/axiosClient";
import { capitalize } from "@/utils";

const DataVisibilityRoleListTable: React.FC = () => {
    const [roles, setRoles] = useState<RoleType[]>([]);
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
            .get("portal/roles/data-visibilities", {
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
            title: "Role",
            dataIndex: "name",
            render: (name) => capitalize(name, '-')
        },
        {
            title: "Action",
            align: "center",
            render: (_, record) => (
                <Button
                    type="primary"
                    onClick={() => navigate(`/data-visibilities/roles/${record.id}`)}
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
            dataSource={roles}
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
    DataVisibilityRoleListTable
}