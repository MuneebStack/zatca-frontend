import React from "react";
import { Modal, Collapse, Row, Col, Empty, Space, Tag, Popconfirm, Divider, Typography, Button } from "antd";
import { MinusCircleOutlined } from "@ant-design/icons";
import { capitalize } from "@/utils";
import type { DefaultModuleDataType } from "@/types/module";

const { Text } = Typography;

interface ViewModalProps {
    isOpen: boolean;
    onClose: () => void;
    accessConfig: Record<string, DefaultModuleDataType>;
    setAccessConfig: React.Dispatch<React.SetStateAction<Record<string, DefaultModuleDataType>>>;
}

const ViewModal: React.FC<ViewModalProps> = ({
    isOpen,
    onClose,
    accessConfig,
    setAccessConfig
}) => {
    const handleRemoveModule = (moduleKey: string) => {
        setAccessConfig((prev) => {
            const updated = { ...prev };
            delete updated[moduleKey];
            return updated;
        });
    };

    const handleRemoveColumn = (moduleKey: string, removedColumn: string) => {
        setAccessConfig((prev) => ({
            ...prev,
            [moduleKey]: {
                ...prev[moduleKey],
                columns: prev[moduleKey].columns.filter((column: string) => column !== removedColumn),
            },
        }));
    };

    const handleRemoveFilterValue = (moduleKey: string, field: string, removedValue: any) => {
        setAccessConfig((prev) => {
            const updatedFilters = { ...prev[moduleKey].filters };
            const remaining = updatedFilters[field].filter((v: any) => v !== removedValue);
            if (remaining.length > 0) {
                updatedFilters[field] = remaining;
            } else {
                delete updatedFilters[field];
            }

            return {
                ...prev,
                [moduleKey]: {
                    ...prev[moduleKey],
                    filters: updatedFilters,
                },
            };
        });
    };

    const handleRemoveId = (moduleKey: string, removeId: React.Key) => {
        setAccessConfig((prev) => ({
            ...prev,
            [moduleKey]: {
                ...prev[moduleKey],
                ids: prev[moduleKey].ids.filter((id) => id !== removeId)
            },
        }));
    };

    const items = Object.entries(accessConfig).map(([moduleKey, moduleData]) => ({
        key: moduleKey,
        label: (capitalize(moduleKey, /_-/)),
        children: (
            <>
                <Row justify="end" style={{ marginBottom: 8 }}>
                    <Popconfirm
                        title="Are you sure you want to remove the access?"
                        okText="Yes"
                        cancelText="No"
                        onConfirm={() => handleRemoveModule(moduleKey)}
                    >
                        <Button danger icon={<MinusCircleOutlined />} />
                    </Popconfirm>
                </Row>

                <Divider size="middle" />

                <Row gutter={[18, 18]}>
                    <Col span={24}>
                        <Space direction="vertical" wrap>
                            <Text strong>Columns</Text>
                            <Space wrap size={[2, 2]} className="ms-3">
                                {moduleData.columns?.length ? (
                                    moduleData.columns.map((column: string) => (
                                        <Tag key={column} closable onClose={() => handleRemoveColumn(moduleKey, column)}>
                                            {column}
                                        </Tag>
                                    ))
                                ) : (
                                    <Tag color="default">All Columns</Tag>
                                )}
                            </Space>
                        </Space>
                    </Col>

                    <Col span={24}>
                        <Space direction="vertical" wrap>
                            <Text strong>Conditions</Text>
                            <Space direction="vertical" size={[8, 8]} className="ms-3">
                                {Object.keys(moduleData.filters || {}).length > 0 ? (
                                    Object.entries(moduleData.filters).map(([field, values]) => (
                                        <Space wrap size={[4, 4]} key={field}>
                                            <Text>{field}:</Text>
                                            {values.map((value: any, index: number) => (
                                                <Tag
                                                    key={`${field}-${value}-${index}`}
                                                    closable
                                                    onClose={() => handleRemoveFilterValue(moduleKey, field, value)}
                                                >
                                                    {String(value)}
                                                </Tag>
                                            ))}
                                        </Space>
                                    ))
                                ) : (
                                    <Tag color="default">None</Tag>
                                )}
                            </Space>
                        </Space>
                    </Col>

                    <Col span={24}>
                        <Space direction="vertical" wrap>
                            <Text strong>Custom IDs</Text>
                            <Space wrap size={[4, 4]} className="ms-3">
                                {moduleData.ids?.length ? (
                                    moduleData.ids.map((id: any) => (
                                        <Tag key={id} closable onClose={() => handleRemoveId(moduleKey, id)}>
                                            {id}
                                        </Tag>
                                    ))
                                ) : (
                                    <Tag color="default">None</Tag>
                                )}
                            </Space>
                        </Space>
                    </Col>
                </Row>
            </>
        )
    }))

    return (
        <Modal
            title="Data Access"
            open={isOpen}
            onCancel={onClose}
            footer={null}
            width={700}
        >
            {Object.keys(accessConfig).length === 0 ? (
                <Empty description="No access rules added yet." />
            ) : (
                <Collapse
                    accordion
                    items={items}
                    className="!mt-5"
                />
            )}
        </Modal>
    );
};

export {
    ViewModal
}