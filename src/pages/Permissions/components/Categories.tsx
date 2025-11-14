import { Table, Switch } from "antd";
import { useState, useEffect } from "react";
import type { ColumnsType } from "antd/es/table";
import { axiosClient } from "@/services/axiosClient";
import type { PaginationType } from "@/types";
import { successMessageHandler } from "@/utils/notificationHandler";
import { capitalize, filterTableColumns } from "@/utils";
import type { PermissionType } from "@/types/permission";
import { formatDate } from "@/utils/date";
import { usePermission } from "@/hooks/usePermission";

interface CategoriesProps {
    relatedType?: "role" | "user",
    relatedId?: string | number;
}

export const Categories: React.FC<CategoriesProps> = ({ relatedType, relatedId }) => {
    const { hasModulePermission } = usePermission();

    const canSync = hasModulePermission("permission", "SYNC");

    const [permissions, setPermissions] = useState<PermissionType[]>([]);
    const [updatingIds, setUpdatingIds] = useState<Set<number>>(new Set());
    const [pagination, setPagination] = useState<PaginationType>({
        current: 1,
        pageSize: 10,
        total: 0,
    });
    const [loading, setLoading] = useState(false);

    const handleToggle = (permissionId: number, checked: boolean) => {
        setUpdatingIds(prev => new Set(prev).add(permissionId));

        axiosClient
            .post(`portal/permissions/${permissionId}/sync`, {
                related_type: relatedType,
                related_id: relatedId,
                assigned: checked,
            })
            .then(({ data: responseData }) => {
                if (responseData?.data) {
                    setPermissions((prev) =>
                        prev.map((permission) =>
                            permission.id === permissionId ? { ...permission, assigned: checked } : permission
                        )
                    );
                    successMessageHandler(responseData);
                }
            })
            .catch(error => (error))
            .finally(() =>
                setUpdatingIds(prev => {
                    const copy = new Set(prev);
                    copy.delete(permissionId);
                    return copy;
                })
            );
    };

    useEffect(() => {
        const controller = new AbortController();
        setLoading(true);

        axiosClient
            .get(`portal/permissions/${relatedType}s/${relatedId}`, {
                params: {
                    page: pagination.current,
                    per_page: pagination.pageSize
                },
                signal: controller.signal,
            })
            .then(({ data: responseData }) => {
                if (responseData?.data) {
                    const payload = responseData.data;

                    setPermissions(payload.data);
                    setPagination((prev) => ({
                        ...prev,
                        total: payload.meta.total,
                        current: payload.meta.current_page,
                        pageSize: payload.meta.per_page,
                    }));
                }
            })
            .catch(() => { })
            .finally(() => setLoading(false));

        return () => controller.abort();
    }, [relatedId, relatedType, pagination.current, pagination.pageSize]);

    const columns: ColumnsType<PermissionType> = [
        {
            title: "#",
            dataIndex: "id",
            key: "id",
            width: "5%",
            render: (_: number, __: PermissionType, rowIndex) => (pagination.current - 1) * pagination.pageSize + rowIndex + 1
        },
        {
            title: "Permission",
            dataIndex: "name",
            key: "name",
            render: (name) => capitalize(name),
        },
        {
            title: "Category",
            dataIndex: "category",
            key: "category",
            render: (category) => capitalize(category),
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
        ...(canSync ? [{
            title: "Assigned",
            key: "assigned",
            align: "center" as const,
            render: (_: unknown, record: PermissionType) => (
                <Switch
                    checked={!!record.assigned}
                    loading={updatingIds.has(record.id)}
                    onChange={(checked) => handleToggle(record.id, checked)}
                />
            ),
        }] : []),
    ];
    const hiddenColumns: (keyof PermissionType)[] = ["created_at", "updated_at"];
    const filteredColumns = filterTableColumns<PermissionType>(
        columns,
        permissions,
        hiddenColumns
    );

    return (
        <Table
            rowKey="id"
            columns={permissions.length ? filteredColumns : []}
            dataSource={permissions}
            loading={loading}
            pagination={{
                current: pagination.current,
                pageSize: pagination.pageSize,
                total: pagination.total,
                onChange: (page, pageSize) =>
                    setPagination({ ...pagination, current: page, pageSize }),
            }}
        />
    );
}