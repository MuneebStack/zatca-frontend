import React from "react";
import { Modal, Collapse, Row, Col, Empty, Space, Tag, Popconfirm, Divider, Typography, Button } from "antd";
import { MinusCircleOutlined } from "@ant-design/icons";
import { capitalize } from "@/utils";
import type { ModuleDataType } from "@/types/module";

const { Text } = Typography;

interface ViewModalProps {
    isOpen: boolean;
    onClose: () => void;
    accessConfig: Record<string, ModuleDataType>;
    setAccessConfig: React.Dispatch<React.SetStateAction<Record<string, ModuleDataType>>>;
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

    const handleRemoveConditionValue = (moduleKey: string, field: string, removedValue: string | number) => {
        setAccessConfig((prev) => {
            const updatedConditions = { ...prev[moduleKey].conditions };
            const remaining = updatedConditions[field].filter((value) => value !== removedValue);
            if (remaining.length > 0) {
                updatedConditions[field] = remaining;
            } else {
                delete updatedConditions[field];
            }

            return {
                ...prev,
                [moduleKey]: {
                    ...prev[moduleKey],
                    conditions: updatedConditions,
                },
            };
        });
    };

    const handleRemoveId = (moduleKey: string, removeId: React.Key) => {
        setAccessConfig((prev) => ({
            ...prev,
            [moduleKey]: {
                ...prev[moduleKey],
                module_ids: prev[moduleKey].module_ids.filter((moduleId) => moduleId !== removeId)
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
                                {Object.keys(moduleData.conditions || {}).length > 0 ? (
                                    Object.entries(moduleData.conditions).map(([field, values]) => (
                                        <Space wrap size={[4, 4]} key={field}>
                                            <Text>{field}:</Text>
                                            {values.map((value: any, index: number) => (
                                                <Tag
                                                    key={`${field}-${value}-${index}`}
                                                    closable
                                                    onClose={() => handleRemoveConditionValue(moduleKey, field, value)}
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
                                {moduleData.module_ids?.length ? (
                                    moduleData.module_ids.map((moduleId) => (
                                        <Tag key={moduleId} closable onClose={() => handleRemoveId(moduleKey, moduleId)}>
                                            {moduleId}
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