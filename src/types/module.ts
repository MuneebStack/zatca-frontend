export interface ModuleType {
    name: string;
    conditions: {
        label: string;
        type: string;
        options?: string[];
        placeholder?: string;
    }[];
    columns: string[];
    rows: Record<string, any>[];
}

export interface DefaultModuleDataType {
    columns: string[],
    filters: Record<string, (string | number)[]>,
    ids: React.Key[]
}