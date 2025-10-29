import type { FieldType } from ".";

export interface ModuleType {
    key: string;
    name: string;
    conditions: FieldType[];
    columns: string[];
    rows: {
        data: Record<string, any>[];
        links: Record<string, any>;
        meta: Record<string, any>;
    };
}

export interface ModuleDataType {
    columns: string[];
    conditions: Record<string, (string | number)[]>;
    module_ids: React.Key[];
}
