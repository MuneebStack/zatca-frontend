export interface NavigationType {
    id: number;
    name: string;
    icon?: string;
    route?: string;
    parent_id?: number;
    order: number;
    created_at?: string;
    updated_at?: string;
    children?: NavigationType[];
}
