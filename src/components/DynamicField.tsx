import React from "react";
import { Input, Select, DatePicker, Form } from "antd";
import type { FieldType } from "@/types";
import { formatDate } from "@/utils/date";
import dayjs from "dayjs";

const { Option } = Select;

interface DynamicFieldProps {
    field: FieldType;
    value: any;
    loading?: boolean;
    onChange: (value: any) => void;
    classname?: string;
}

const DynamicField: React.FC<DynamicFieldProps> = ({
    field,
    value,
    loading = false,
    onChange,
    classname
}) => {
    const renderField = () => {
        switch (field.type) {
            case "select":
                return (
                    <Select
                        mode="multiple"
                        placeholder={`Select ${field.name}`}
                        className="w-full min-w-40"
                        value={value || []}
                        onChange={onChange}
                        disabled={loading}
                        allowClear
                    >
                        {field.options?.map((option) => (
                            <Option key={option} value={option}>
                                {option}
                            </Option>
                        ))}
                    </Select>
                );

            case "number":
                return (
                    <Input
                        type="number"
                        value={value || ""}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={field.placeholder || `Enter ${field.name}`}
                        disabled={loading}
                        className="w-full"
                    />
                );

            case "date":
                return (
                    <DatePicker
                        className="w-full"
                        value={value ? dayjs(value) : undefined}
                        onChange={(date) => {
                            const formattedDate = formatDate(date);
                            formattedDate && onChange(formattedDate);
                        }}
                        disabled={loading}
                        placeholder={field.placeholder || `Select ${field.name}`}
                    />
                );

            default:
                return (
                    <Input
                        type="text"
                        value={value || ""}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={field.placeholder || `Enter ${field.name}`}
                        disabled={loading}
                        className="w-full"
                    />
                );
        }
    };

    return (
        <Form.Item className={classname} key={field.key}>
            {renderField()}
        </Form.Item>
    );
};

export {
    DynamicField
}