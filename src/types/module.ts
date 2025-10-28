export interface ModuleType {
    key: string;
    name: string;
    conditions: {
        key: string;
        label: string;
        type: string;
        options?: string[];
        placeholder?: string;
    }[];
    columns: string[];
    rows: {
        data: Record<string, any>[];
        links: Record<string, any>;
        meta: Record<string, any>;
    };
}

export interface DefaultModuleDataType {
    columns: string[];
    conditions: Record<string, (string | number)[]>;
    module_ids: React.Key[];
}
