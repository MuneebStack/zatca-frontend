import React, { useEffect, useState } from "react";
import { Button, Select, Table, Form, Input, Row, Col, Divider, Space, Flex } from "antd";
import type { ColumnsType } from "antd/es/table";
import { ColumnModal } from "./ColumnModal";
import type { DefaultModuleDataType, ModuleType } from "@/types/module";
import { ViewModal } from "./ViewModal";
import type { PaginationType } from "@/types";
import { axiosClient } from "@/services/axiosClient";
import { useAuth } from "@/providers/AuthContext";
import { formatDate } from "@/utils/dateFormatter";
import { successMessageHandler } from "@/utils/notificationHandler";

const { Option } = Select;

interface BuilderProps {
  relatedType?: "role" | "user",
  relatedId?: string;
}
type AccessConfigType = Record<string, DefaultModuleDataType>;

const Builder: React.FC<BuilderProps> = ({ relatedType, relatedId }) => {
  const { modules } = useAuth();
  const [currentModule, setCurrentModule] = useState<ModuleType>();
  const [pagination, setPagination] = useState<PaginationType>({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [selectedModule, setSelectedModule] = useState<string>();
  const [selectedConditions, setSelectedConditions] = useState<Record<string, any>>({});
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [accessConfig, setAccessConfig] = useState<AccessConfigType>({});
  const [loading, setLoading] = useState(false);
  const [viewLoading, setViewLoading] = useState(true);

  const defaultModuleData: DefaultModuleDataType = {
    columns: [],
    conditions: {},
    module_ids: []
  }

  const onAddAccess = () => {
    if (!selectedModule) return;

    const moduleData = accessConfig[selectedModule] || defaultModuleData;
    const currentConditions = Object.keys(selectedConditions).length > 0 ? { ...selectedConditions } : null;

    const existingConditions = moduleData.conditions || {};
    const mergedConditions: Record<string, any> = { ...existingConditions };

    if (currentConditions) {
      for (const [key, value] of Object.entries(currentConditions)) {
        const prevValue = mergedConditions[key];

        if (Array.isArray(prevValue)) {
          mergedConditions[key] = Array.from(
            new Set([...prevValue, ...(Array.isArray(value) ? value : [value])])
          );
        } else if (value) {
          mergedConditions[key] = Array.isArray(value) ? value : [value];
        }
      }
    }

    setAccessConfig((prev) => ({
      ...prev,
      [selectedModule]: {
        ...moduleData,
        conditions: mergedConditions
      }
    }));
  };

  const onAddRows = () => {
    if (!selectedModule || selectedRowKeys.length === 0) return;

    const moduleData = accessConfig[selectedModule] || defaultModuleData;
    const updatedIds = Array.from(new Set([...moduleData.module_ids, ...selectedRowKeys]));

    setAccessConfig((prev) => ({
      ...prev,
      [selectedModule]: {
        ...moduleData,
        module_ids: updatedIds
      },
    }));

    setSelectedRowKeys([]);
  };

  const onSaveColumns = (columns: string[]) => {
    if (!selectedModule) return;

    const moduleData = accessConfig[selectedModule] || defaultModuleData;

    setAccessConfig((prev) => ({
      ...prev,
      [selectedModule]: {
        ...moduleData,
        columns: columns
      },
    }));
  };

  const onSave = () => {
    setLoading(true);
    axiosClient
      .post(`portal/data-access/sync`, {
        related_type: relatedType,
        related_id: relatedId,
        access_config: accessConfig,
      })
      .then(({ data: responseData }) => {
        successMessageHandler(responseData);
      })
      .catch(error => (error))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const controller = new AbortController();

    axiosClient
      .get(`portal/data-access/${relatedType}s/${relatedId}`, {
        signal: controller.signal,
      })
      .then(({ data: responseData }) => {
        if (responseData?.data) {
          const payload = responseData.data;

          const transformed: AccessConfigType = payload.data.reduce(function (
            acc: AccessConfigType, item: Record<string, any>
          ) {
            const moduleKey = item.module;
            if (moduleKey) {
              acc[moduleKey] = {
                columns: item.columns ?? [],
                conditions: item.conditions ?? {},
                module_ids: item.module_ids ?? []
              };

              return acc;
            }
          }, {})
          setAccessConfig(transformed);
        }
      })
      .catch(() => { })
      .finally(() => setViewLoading(false));

    return () => controller.abort();
  }, [relatedType, relatedId]);

  useEffect(() => {
    if (!selectedModule) return;

    const controller = new AbortController();

    setLoading(true);
    axiosClient
      .get("portal/data-access/module", {
        params: {
          page: pagination.current,
          per_page: pagination.pageSize,
          module: selectedModule
        },
        signal: controller.signal
      })
      .then(({ data: responseData }) => {
        if (responseData?.data) {
          const payload = responseData.data;
          setCurrentModule(payload);
        }
      })
      .catch((error) => (error))
      .finally(() => setLoading(false))

    return () => controller.abort();
  }, [selectedModule, pagination.current, pagination.pageSize]);

  useEffect(() => {
    if (currentModule) {
      setPagination((prev) => ({
        ...prev,
        total: currentModule.rows.meta.total,
        current: currentModule.rows.meta.current_page,
        pageSize: currentModule.rows.meta.per_page,
      }));
    }
  }, [currentModule])

  const preprocessTableData = (rows: ModuleType['rows']['data']) => {
    return rows.map((row) => {
      const newRow: Record<string, any> = {};

      Object.entries(row).forEach(([key, value]) => {
        if (
          typeof value === "string" &&
          /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)
        ) {
          newRow[key] = formatDate(value);
        } else {
          newRow[key] = value;
        }
      });

      return newRow;
    });
  };

  const columns: ColumnsType<any> =
    currentModule?.columns.map((col) => ({
      title: col,
      dataIndex: col,
      key: col
    })) || [];

  return (
    <>
      <Space direction="vertical" size={[18, 18]} className="w-full">
        <Row justify="space-between">
          <Col span={8}>
            <Select
              placeholder="Select Module"
              className="w-full"
              onChange={(value) => {
                setSelectedModule(value);
                setSelectedConditions({});
                setSelectedRowKeys([]);
              }}
              value={selectedModule}
            >
              {modules.map((module) => (
                <Option key={module.key} value={module.key}>
                  {module.name}
                </Option>
              ))}
            </Select>
          </Col>
          <Col>
            <Space>
              <Button onClick={() => setIsViewModalOpen(true)} disabled={viewLoading}>
                View
              </Button>
              <Button type="primary" onClick={onSave} disabled={!currentModule || loading}>
                Save
              </Button>
            </Space>
          </Col>
        </Row>
        <Space wrap>
          {currentModule?.conditions.map((condition, index) => (
            <Form.Item className="!mb-0" key={index}>
              {condition.type === "select" ? (
                <Select
                  mode="multiple"
                  placeholder={`Select ${condition.label}`}
                  className="w-full min-w-40"
                  value={selectedConditions[condition.key] || []}
                  onChange={(value) =>
                    setSelectedConditions((prev) => ({
                      ...prev,
                      [condition.key]: value,
                    }))
                  }
                  disabled={loading}
                  allowClear
                >
                  {condition.options?.map((option) => (
                    <Select.Option key={option} value={option}>
                      {option}
                    </Select.Option>
                  ))}
                </Select>
              ) : condition.type === "number" ? (
                <Input
                  type="number"
                  value={selectedConditions[condition.key] || ""}
                  className="w-full"
                  onChange={(e) =>
                    setSelectedConditions((prev) => ({
                      ...prev,
                      [condition.key]: e.target.value,
                    }))
                  }
                  placeholder={condition.placeholder || `Enter ${condition.label}`}
                  disabled={loading}
                />
              ) : (
                <Input
                  type="text"
                  value={selectedConditions[condition.key] || ""}
                  className="w-full"
                  onChange={(e) =>
                    setSelectedConditions((prev) => ({
                      ...prev,
                      [condition.key]: e.target.value
                    }))
                  }
                  placeholder={condition.placeholder || `Enter ${condition.label}`}
                  disabled={loading}
                />
              )}
            </Form.Item>
          ))}
        </Space>
        {selectedModule && (
          <Flex justify="end" gap={8} wrap>
            <Button onClick={() => setIsColumnModalOpen(true)} disabled={!currentModule || loading}>
              Select Columns
            </Button>
            {selectedRowKeys.length > 0 && (
              <Button onClick={onAddRows}>Add Rows</Button>
            )}
            <Button onClick={onAddAccess} disabled={!currentModule || loading}>
              Add To Acccess
            </Button>
          </Flex>
        )}
      </Space>

      <Divider />

      {selectedModule && (
        <Table
          rowKey="id"
          dataSource={preprocessTableData(currentModule?.rows?.data || [])}
          columns={columns}
          loading={loading}
          rowSelection={{
            selectedRowKeys,
            onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
          }}
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
      )}

      {
        currentModule &&
        <ColumnModal
          isOpen={isColumnModalOpen}
          onClose={() => setIsColumnModalOpen(false)}
          onSave={(columns) => onSaveColumns(columns)}
          currentModule={currentModule}
          accessConfig={accessConfig}
        />
      }

      <ViewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        accessConfig={accessConfig}
        setAccessConfig={setAccessConfig}
      />
    </>
  );
};

export {
  Builder
}