export interface PaginationType {
    current: number;
    pageSize: number;
    total: number;
}

export type FieldTypeType = "text" | "number" | "select" | "date";

export interface FieldType {
    key: string;
    name: string;
    type: FieldTypeType;
    placeholder?: string;
    options?: string[];
}