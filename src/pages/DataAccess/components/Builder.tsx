import React, { useEffect, useState } from "react";
import { Button, Select, Table, Form, Input, Row, Col, Divider, Space, message, Flex } from "antd";
import type { ColumnsType } from "antd/es/table";
import { ColumnModal } from "./ColumnModal";
import type { DefaultModuleDataType, ModuleType } from "@/types/module";
import { ViewModal } from "./ViewModal";
import type { PaginationType } from "@/types";

const { Option } = Select;

interface BuilderProps {
  relatedType?: "role" | "user",
  relatedId?: string;
}

const Builder: React.FC<BuilderProps> = ({ relatedType, relatedId }) => {
  const [modules, setModules] = useState<ModuleType[]>([])
  const [pagination, setPagination] = useState<PaginationType>({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [selectedModule, setSelectedModule] = useState<string>();
  const [selectedFilters, setSelectedFilters] = useState<Record<string, any>>({});
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [accessConfig, setAccessConfig] = useState<Record<string, DefaultModuleDataType>>({});

  const defaultModuleData: DefaultModuleDataType = {
    columns: [],
    filters: {},
    ids: []
  }
  const currentModule = modules.find((module) => module.name === selectedModule);

  const handleAddAccess = () => {
    if (!selectedModule) return;

    const moduleData = accessConfig[selectedModule] || defaultModuleData;
    const currentFilters = Object.keys(selectedFilters).length > 0 ? { ...selectedFilters } : null;

    const existingFilters = moduleData.filters || {};
    const mergedFilters: Record<string, any> = { ...existingFilters };

    if (currentFilters) {
      for (const [key, value] of Object.entries(currentFilters)) {
        const prevValue = mergedFilters[key];

        if (Array.isArray(prevValue)) {
          mergedFilters[key] = Array.from(
            new Set([...prevValue, ...(Array.isArray(value) ? value : [value])])
          );
        } else if (value) {
          mergedFilters[key] = Array.isArray(value) ? value : [value];
        }
      }
    }

    setAccessConfig((prev) => ({
      ...prev,
      [selectedModule]: {
        ...moduleData,
        filters: mergedFilters
      }
    }));
  };

  const handleAddRows = () => {
    if (!selectedModule || selectedRowKeys.length === 0) return;

    const moduleData = accessConfig[selectedModule] || defaultModuleData;
    const updatedIds = Array.from(new Set([...moduleData.ids, ...selectedRowKeys]));

    setAccessConfig((prev) => ({
      ...prev,
      [selectedModule]: {
        ...moduleData,
        ids: updatedIds
      },
    }));

    setSelectedRowKeys([]);
  };

  const handleSaveColumns = (columns: string[]) => {
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

  const handleSave = () => {
    message.success("Structure saved!");
  }

  useEffect(() => {
    console.log(relatedType, relatedId);
    const mockModules = [
      {
        name: "Users",
        conditions: [
          {
            label: "Role",
            type: "select",
            options: ["Admin", "Manager", "User"],
          },
          {
            label: "Status",
            type: "select",
            options: ["Active", "Inactive"],
          },
          {
            label: "Department",
            type: "text",
            placeholder: "Enter department name",
          }
        ],
        columns: ["id", "name", "email", "role", "status", "department"],
        rows: [
          { id: 1, name: "Muneeb", role: "Admin", status: "Active", department: "IT" },
          { id: 2, name: "Ali", role: "User", status: "Inactive", department: "HR" },
          { id: 3, name: "Sara", role: "Manager", status: "Active", department: "Finance" },
        ],
      },
      {
        name: "Invoices",
        conditions: [
          {
            label: "Status",
            type: "select",
            options: ["Paid", "Pending", "Overdue"],
          },
          {
            label: "Min Amount",
            type: "number",
            placeholder: "Enter minimum amount",
          },
          {
            label: "Max Amount",
            type: "number",
            placeholder: "Enter maximum amount",
          },
        ],
        columns: ["id", "customer", "status", "amount"],
        rows: [
          { id: 10, customer: "Company A", status: "Paid", amount: 1200 },
          { id: 11, customer: "Company B", status: "Pending", amount: 800 },
        ],
      },
    ];
    setModules(mockModules);

    // const mockaccessConfig = {
    //   users: {
    //     columns: [],
    //     filters: {},
    //     ids: []
    //   },
    //   invoices: {
    //     columns: [],
    //     filters: {},
    //     ids: []
    //   }
    // };
    // setAccessConfig(mockaccessConfig);
  }, []);

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
                setSelectedFilters({});
                setSelectedRowKeys([]);
              }}
              value={selectedModule}
            >
              {modules.map((module, index) => (
                <Option key={index} value={module.name}>
                  {module.name}
                </Option>
              ))}
            </Select>
          </Col>
          <Col>
            <Space>
              <Button onClick={() => setIsViewModalOpen(true)}>
                View
              </Button>
              <Button type="primary" onClick={handleSave}>
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
                  value={selectedFilters[condition.label] || []}
                  onChange={(value) =>
                    setSelectedFilters((prev) => ({
                      ...prev,
                      [condition.label]: value,
                    }))
                  }
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
                  value={selectedFilters[condition.label] || ""}
                  className="w-full"
                  onChange={(e) =>
                    setSelectedFilters((prev) => ({
                      ...prev,
                      [condition.label]: e.target.value,
                    }))
                  }
                  placeholder={condition.placeholder || `Enter ${condition.label}`}
                />
              ) : (
                <Input
                  type="text"
                  value={selectedFilters[condition.label] || ""}
                  className="w-full"
                  onChange={(e) =>
                    setSelectedFilters((prev) => ({
                      ...prev,
                      [condition.label]: e.target.value,
                    }))
                  }
                  placeholder={condition.placeholder || `Enter ${condition.label}`}
                />
              )}
            </Form.Item>
          ))}
        </Space>
        {selectedModule && (
          <Flex justify="end" gap={8} wrap>
            <Button onClick={() => setIsColumnModalOpen(true)}>
              Select Columns
            </Button>
            {selectedRowKeys.length > 0 && (
              <Button onClick={handleAddRows}>Add Rows</Button>
            )}
            <Button onClick={handleAddAccess}>
              Add To Acccess
            </Button>
          </Flex>
        )}
      </Space>

      <Divider />

      {selectedModule && (
        <Table
          rowKey="id"
          dataSource={currentModule?.rows || []}
          columns={columns}
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
          onSave={(columns) => handleSaveColumns(columns)}
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