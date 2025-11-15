import { useEffect, useState } from "react";
import { Button, Table, Popconfirm, Modal, Typography, Flex, Form, Switch } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { axiosClient } from "@/services/axiosClient";
import type { ColumnsType, ColumnType } from "antd/es/table";
import type { PersonalAccessTokenType } from "@/types/personalAccessToken";
import type { PaginationType } from "@/types";
import { successMessageHandler } from "@/utils/notificationHandler";
import { CreatePersonalAccessToken } from "./create";
import { ViewPersonalAccessToken } from "./view";
import { formatDate } from "@/utils/date";
import { usePermission } from "@/hooks/usePermission";

const { Title } = Typography;

export const PersonalAccessTokens = () => {
    const { hasModulePermission } = usePermission();

    const canViewAll = hasModulePermission("personal_access_token", "INDEX");
    const canCreate = hasModulePermission("personal_access_token", "STORE");
    const canDelete = hasModulePermission("personal_access_token", "DESTROY");
    const canToggleActive = hasModulePermission("personal_access_token", "ACTIVE");

    const [personalAccessToken, setPersonalAccessTokens] = useState<PersonalAccessTokenType[]>([]);
    const [pagination, setPagination] = useState<PaginationType>({
        current: 1,
        pageSize: 10,
        total: 0,
    });
    const [loading, setLoading] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
    const [generatedPersonalAccessToken, setGeneratedPersonalAccessToken] = useState<string>();
    const [form] = Form.useForm();

    const onToggleActive = (togglePersonalAccessTokenId: number, isActive: boolean) => {
        setLoading(true);
        axiosClient
            .patch(`portal/personal_access_tokens/${togglePersonalAccessTokenId}/toggle-active`, {
                is_active: isActive
            })
            .then(({ data: responseData }) => {
                if (responseData?.data) {
                    const payload = responseData.data;
                    const updatedPersonalAccessToken = payload.data;

                    setPersonalAccessTokens((prev) =>
                        prev.map((personalAccessToken) => personalAccessToken.id === updatedPersonalAccessToken.id ? {
                            ...personalAccessToken,
                            is_active: updatedPersonalAccessToken.is_active,
                        } : personalAccessToken)
                    );
                    successMessageHandler(responseData);
                }
            })
            .finally(() => setLoading(false))
    }

    const onDelete = (deletedPersonalAccessTokenId: number) => {
        setLoading(true);
        axiosClient
            .delete(`portal/personal_access_tokens/${deletedPersonalAccessTokenId}`)
            .then(({ data: responseData }) => {
                if (responseData?.data) {
                    setPersonalAccessTokens((prev) => prev.filter((personalAccessToken) => personalAccessToken.id !== deletedPersonalAccessTokenId));
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
            .get("portal/personal_access_tokens", {
                params: {
                    page: pagination.current,
                    per_page: pagination.pageSize,
                },
                signal: controller.signal
            })
            .then(({ data: responseData }) => {
                if (responseData?.data) {
                    const payload = responseData.data;

                    setPersonalAccessTokens(payload.data);
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

    const actionChildren: ColumnType<PersonalAccessTokenType>[] = [];
    if (canToggleActive) {
        actionChildren.push({
            title: "Active",
            key: "active",
            align: "center",
            width: "10%",
            render: (_: unknown, record: PersonalAccessTokenType) => (
                <Switch
                    checked={record.is_active}
                    size="small"
                    onChange={(checked) => onToggleActive(record.id, checked)}
                />
            ),
        });
    }
    if (canDelete) {
        actionChildren.push({
            title: "General",
            key: "general",
            align: "center",
            width: "10%",
            render: (_: unknown, record: PersonalAccessTokenType) => (
                <Popconfirm
                    title="Are you sure to delete this token?"
                    okText="Yes"
                    cancelText="No"
                    onConfirm={() => onDelete(record.id)}
                >
                    <DeleteOutlined className="cursor-pointer text-red-600" />
                </Popconfirm>
            ),
        });
    }
    const columns: ColumnsType<PersonalAccessTokenType> = [
        {
            title: "User",
            dataIndex: "user",
            key: "user",
            render: (user) => user.name
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name"
        },
        {
            title: "Abilities",
            dataIndex: "abilities",
            key: "abilities",
            render: (abilities) => abilities.join(", ")
        },
        {
            title: "Last Used At",
            dataIndex: "last_used_at",
            key: "last_used_at",
            render: (last_used_at) => (last_used_at ? formatDate(last_used_at) : undefined) || "Never"
        },
        {
            title: "Expires At",
            dataIndex: "expires_at",
            key: "expires_at",
            render: (expires_at) => (expires_at ? formatDate(expires_at) : undefined) || "Never"
        },
        {
            title: "Created At",
            dataIndex: "created_at",
            key: "created_at",
            render: (created_at) => formatDate(created_at)
        },
        ...(actionChildren.length > 0 ? [{
            title: "Action",
            key: "action",
            children: actionChildren,
        }] : []),
    ];

    return (
        <Flex vertical gap="middle">
            <Flex justify="space-between" align="center">
                <Title level={4}>
                    Personal Access Tokens
                </Title>
                {canCreate && (
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsCreateModalOpen(true)}>
                        Create Token
                    </Button>
                )}
            </Flex>

            {canViewAll && (
                <Table
                    rowKey="id"
                    dataSource={personalAccessToken}
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
            )}

            {canCreate && (
                <Modal
                    title="Create Token"
                    open={isCreateModalOpen}
                    onCancel={() => setIsCreateModalOpen(false)}
                    afterClose={() => form.resetFields()}
                    footer={null}
                >
                    <CreatePersonalAccessToken
                        form={form}
                        onTokenCreated={(payload) => {
                            const { data: newToken, plain_text_token: plainToken } = payload;
                            setPersonalAccessTokens((prev) => [newToken, ...prev]);
                            setGeneratedPersonalAccessToken(plainToken);
                            setIsCreateModalOpen(false);
                            setIsTokenModalOpen(true);
                        }}
                    />
                </Modal>
            )}

            <Modal
                title="View Token"
                open={isTokenModalOpen}
                onCancel={() => setIsTokenModalOpen(false)}
                footer={[
                    <Button key="ok" type="primary" onClick={() => setIsTokenModalOpen(false)}>
                        Done
                    </Button>
                ]}
                closable={false}
                maskClosable={false}
            >
                {generatedPersonalAccessToken && <ViewPersonalAccessToken generatedPersonalAccessToken={generatedPersonalAccessToken} />}
            </Modal>
        </Flex>
    );
}