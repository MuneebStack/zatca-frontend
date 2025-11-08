import type { FieldType } from "@/types";
import type { WidgetType } from "@/types/widget";
import { Empty, Form, Select, Space } from "antd";

const { Option } = Select;

interface Props {
    filters?: WidgetType["filters"];
    onChange?: (values: Record<string, any>) => void;
}

export const WidgetFilters: React.FC<Props> = ({ filters = [], onChange }) => {
    const handleSelectChange = (key: string, value?: string | number) => {
        onChange?.({ [key]: value });
    };

    const renderFilterContent = (filter: FieldType) => {
        switch (filter.type) {
            case "select":
                return (
                    <Select
                        placeholder={`Select ${filter.label}`}
                        onChange={(value) => handleSelectChange(filter.key, value)}
                        mode={filter?.mode}
                        allowClear
                    >
                        {filter.options?.map((option) => (
                            <Option key={option.key} value={option.key}>
                                {option.label}
                            </Option>
                        ))}
                    </Select>
                );
            default:
                return <Empty description="Unsupported filter type" />;
                break;
        }
    }

    return (
        <Form layout="vertical">
            <Space direction="vertical" className="w-full">
                {filters.map((filter) => (
                    <Form.Item
                        key={filter.key}
                        label={filter.label}
                    >
                        {renderFilterContent(filter)}
                    </Form.Item>
                ))}
            </Space>
        </Form>
    );
};