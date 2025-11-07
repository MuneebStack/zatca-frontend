import type { SelectProps } from "antd";

export interface FilterOptionType {
    label: string;
    value: string;
}

export interface FilterType {
    label: string;
    type: 'select';
    key: string;
    options?: FilterOptionType[];
    mode?: SelectProps["mode"];
}

export interface WidgetType {
    id: number;
    name: string;
    title: string;
    icon?: string;
    type: 'stat';
    order: number;
    filters?: FilterType[];
}
