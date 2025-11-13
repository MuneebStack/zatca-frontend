import type { RoleType } from "./role";

export interface UserType {
    id: number;
    name: string;
    email: string;
    created_at?: string;
    updated_at?: string;
    is_active?: boolean;
    roles?: RoleType[]
}
