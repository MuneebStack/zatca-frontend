import { useEffect, useState } from "react";
import { Button, Table, Popconfirm, Modal, Typography, Flex, Form } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { axiosClient } from "@/services/axiosClient";
import type { ColumnsType } from "antd/es/table";
import type { TokenType } from "@/types/token";
import type { PaginationType } from "@/types";
import { successMessageHandler } from "@/utils/notificationHandler";
import { CreateToken } from "./create";
import { ViewToken } from "./view";
import { formatDate } from "@/utils/dateFormatter";

const { Title } = Typography;

const Tokens = () => {
    const [tokens, setTokens] = useState<TokenType[]>([]);
    const [pagination, setPagination] = useState<PaginationType>({
        current: 1,
        pageSize: 10,
        total: 0,
    });
    const [loading, setLoading] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
    const [generatedToken, setGeneratedToken] = useState<string>();
    const [form] = Form.useForm();

    const onDelete = (tokenId: number) => {
        setLoading(true);
        axiosClient
            .delete(`portal/tokens/${tokenId}`)
            .then(({ data: responseData }) => {
                if (responseData?.data) {
                    setTokens((prevTokens) => prevTokens.filter((token) => token.id !== tokenId));
                    successMessageHandler(responseData);
                }
            })
            .finally(() => setLoading(false))
    };

    useEffect(() => {
        const controller = new AbortController();

        setLoading(true);
        axiosClient
            .get("portal/tokens", {
                params: {
                    page: pagination.current,
                    per_page: pagination.pageSize,
                },
                signal: controller.signal
            })
            .then(({ data: responseData }) => {
                if (responseData?.data) {
                    const payload = responseData.data;

                    setTokens(payload.data);
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

    const columns: ColumnsType<TokenType> = [
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
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Popconfirm
                    title="Are you sure to delete this token?"
                    okText="Yes"
                    cancelText="No"
                    onConfirm={() => onDelete(record.id)}
                >
                    <DeleteOutlined
                        className="cursor-pointer !text-red-600"
                    />
                </Popconfirm>
            ),
        },
    ];

    return (
        <Flex vertical gap="middle">
            <Flex justify="space-between" align="center">
                <Title level={4}>
                    Tokens
                </Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsCreateModalOpen(true)}>
                    Create Token
                </Button>
            </Flex>

            <Table
                rowKey="id"
                dataSource={tokens}
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
                title="Create Token"
                open={isCreateModalOpen}
                onCancel={() => setIsCreateModalOpen(false)}
                afterClose={() => form.resetFields()}
                footer={null}
            >
                <CreateToken
                    form={form}
                    setGeneratedToken={setGeneratedToken}
                    setIsTokenModalOpen={setIsTokenModalOpen}
                    setIsCreateModelOpen={setIsCreateModalOpen}
                    onTokenCreated={(newToken) => {
                        setTokens((prev) => [newToken, ...prev]);
                    }}
                />
            </Modal>

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
                {generatedToken && <ViewToken generatedToken={generatedToken} />}
            </Modal>
        </Flex>
    );
};

export { Tokens };