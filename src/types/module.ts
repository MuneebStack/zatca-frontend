import type { FieldType } from ".";

export interface ModuleType {
    key: string;
    label: string;
    filters: FieldType[];
    columns: string[];
    rows: {
        data: Record<string, any>[];
        links: Record<string, any>;
        meta: Record<string, any>;
    };
}

export interface ModuleDataType {
    hidden_columns: string[];
    conditions: Record<string, (string | number)[]>;
    module_ids: React.Key[];
}
