import type { FieldType } from ".";

export interface WidgetType {
    id: number;
    name: string;
    title: string;
    icon?: string;
    type: 'stat';
    order: number;
    filters?: FieldType[];
}
