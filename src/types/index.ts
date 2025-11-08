import type { SelectProps } from "antd";

export interface PaginationType {
    current: number;
    pageSize: number;
    total: number;
}

export type FieldTypeType = "text" | "number" | "select" | "date";

export interface FieldOptionType {
    key: string;
    label: string;
}

export interface FieldType {
    key: string;
    label: string;
    type: FieldTypeType;
    placeholder?: string;
    options?: FieldOptionType[];
    mode?: SelectProps["mode"];
}