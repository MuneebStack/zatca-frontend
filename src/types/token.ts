
export interface TokenType {
    id: number;
    name: string;
    abilities: string[];
    last_used_at: string;
    expires_at: string;
    created_at: string;
    user?: string;
}