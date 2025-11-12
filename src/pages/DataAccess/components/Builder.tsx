import React, { useEffect, useState } from "react";
import { Button, Select, Table, Row, Col, Divider, Space, Flex } from "antd";
import { ColumnModal } from "./ColumnModal";
import type { ModuleDataType, ModuleType } from "@/types/module";
import { ViewModal } from "./ViewModal";
import type { PaginationType } from "@/types";
import { axiosClient } from "@/services/axiosClient";
import { useAuth } from "@/providers/AuthContext";
import { successMessageHandler } from "@/utils/notificationHandler";
import { DynamicField } from "@/components/DynamicField";
import { formatDate, toUtcString } from "@/utils/date";
import dayjs from "dayjs";
import type { ColumnsType } from "antd/es/table";
import { capitalize } from "@/utils";

const { Option } = Select;

interface BuilderProps {
  relatedType?: "role" | "user",
  relatedId?: string | number;
}
type AccessConfigType = Record<string, ModuleDataType>;

export const Builder: React.FC<BuilderProps> = ({ relatedType, relatedId }) => {
  const { modules } = useAuth();
  const [currentModule, setCurrentModule] = useState<ModuleType>();
  const [pagination, setPagination] = useState<PaginationType>({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [selectedModule, setSelectedModule] = useState<string>();
  const [selectedFilters, setSelectedFilters] = useState<Record<string, any>>({});
  const [moduleIds, setModuleIds] = useState<React.Key[]>([]);
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [accessConfig, setAccessConfig] = useState<AccessConfigType>({});
  const [loading, setLoading] = useState(false);
  const [viewLoading, setViewLoading] = useState(true);

  const defaultModuleData: ModuleDataType = {
    hidden_columns: [],
    conditions: {},
    module_ids: []
  }

  const getModuleData = (moduleKey: string) => accessConfig[moduleKey] || defaultModuleData;

  const transformCondition = (conditions: ModuleDataType["conditions"], inBound: boolean) => {
    if (!conditions) return {};

    const updatedConditions = JSON.parse(JSON.stringify(conditions));
    for (const [field, values] of Object.entries(conditions)) {
      updatedConditions[field] = values.map((value) => {
        if (typeof value === "string" && dayjs(value).isValid()) {
          return inBound ? formatDate(value) : toUtcString(value);
        }
        return value;
      });
    }

    return updatedConditions;
  }

  const onAddAccess = () => {
    if (!selectedModule) return;

    const moduleData = getModuleData(selectedModule);
    const currentConditions = Object.keys(selectedFilters).length > 0 ? { ...selectedFilters } : null;

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
    if (!selectedModule || moduleIds.length === 0) return;

    const moduleData = getModuleData(selectedModule);
    const updatedIds = Array.from(new Set([...moduleData.module_ids, ...moduleIds]));

    setAccessConfig((prev) => ({
      ...prev,
      [selectedModule]: {
        ...moduleData,
        module_ids: updatedIds
      },
    }));

    setModuleIds([]);
  };

  const onAddColumns = (hiddenColumns: string[]) => {
    if (!selectedModule) return;

    const moduleData = getModuleData(selectedModule);

    setAccessConfig((prev) => ({
      ...prev,
      [selectedModule]: {
        ...moduleData,
        hidden_columns: hiddenColumns
      },
    }));
  };

  const onSave = () => {
    setLoading(true);

    const accessConfigPayload: AccessConfigType = JSON.parse(JSON.stringify(accessConfig));
    for (const moduleData of Object.values(accessConfigPayload)) {
      moduleData.conditions = transformCondition(moduleData.conditions, false);
    }

    axiosClient
      .post(`portal/data-access/sync`, {
        related_type: relatedType,
        related_id: relatedId,
        access_config: accessConfigPayload,
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
                hidden_columns: item.hidden_columns ?? [],
                conditions: transformCondition(item.conditions, true),
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

  const formatTableData = (rows: ModuleType["rows"]["data"]) => {
    rows.forEach((row: Record<string, any>) => {
      for (const [key, value] of Object.entries(row)) {
        if (typeof value === 'string' && dayjs(value).isValid()) {
          row[key] = formatDate(value);
        }
        if (key === 'children' && value.length === 0) {
          delete row[key]
        }
      }
    })

    return rows;
  }

  const columns: ColumnsType<Record<string, any>> =
    currentModule?.columns.map((column) => ({
      title: capitalize(column, /_/),
      dataIndex: column,
      key: column
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
                setSelectedFilters({});
                setModuleIds([]);
              }}
              value={selectedModule}
            >
              {modules.map((module) => (
                <Option key={module.key} value={module.key}>
                  {module.label}
                </Option>
              ))}
            </Select>
          </Col>
          <Col>
            <Space>
              <Button onClick={() => setIsViewModalOpen(true)} disabled={viewLoading}>
                View
              </Button>
              <Button type="primary" onClick={onSave} disabled={loading}>
                Save
              </Button>
            </Space>
          </Col>
        </Row>
        <Space wrap>
          {currentModule?.filters.map((filter) => (
            <DynamicField
              key={filter.key}
              field={filter}
              value={selectedFilters[filter.key]}
              loading={loading}
              onChange={(value) => {
                setSelectedFilters((prev) => ({
                  ...prev,
                  [filter.key]: value,
                }))
              }}
              classname="!mb-0"
            />
          ))}
        </Space>
        {selectedModule && (
          <Flex justify="end" gap={8} wrap>
            <Button onClick={() => setIsColumnModalOpen(true)} disabled={!currentModule || loading}>
              Select Columns
            </Button>
            {moduleIds.length > 0 && (
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
          dataSource={formatTableData(currentModule?.rows?.data || [])}
          columns={columns}
          loading={loading}
          rowSelection={{
            selectedRowKeys: moduleIds,
            onChange: (keys: React.Key[]) => setModuleIds(keys)
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

      {currentModule && (
        <ColumnModal
          isOpen={isColumnModalOpen}
          onClose={() => setIsColumnModalOpen(false)}
          onSave={(columns) => onAddColumns(columns)}
          currentModule={currentModule}
          accessConfig={accessConfig}
        />
      )}

      <ViewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        accessConfig={accessConfig}
        setAccessConfig={setAccessConfig}
      />
    </>
  );
}