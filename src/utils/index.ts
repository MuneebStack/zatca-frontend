import { formatDate } from './dateFormatter';

const capitalize = (text: string, separator: string | RegExp) => {
    return text.replace(separator, ' ').replace(/\b\w/g, (character) => character.toUpperCase());
};

const cleanPayload = <T extends Record<string, any>>(payload: T): T => {
    const result = { ...payload };
    Object.keys(result).forEach((key) => {
        if (typeof result[key] === 'string' && result[key].trim() === '') {
            delete result[key];
        }
    });
    return result;
};

const removeEmptyChildren = <T extends { children?: T[] }>(input: T | T[]): T | T[] => {
    const cleanItem = (item: T): T => {
        const newItem = { ...item };
        if (newItem.children && newItem.children.length > 0) {
            newItem.children = newItem.children.map(cleanItem);
        } else {
            delete newItem.children;
        }
        return newItem;
    };

    return Array.isArray(input) ? input.map(cleanItem) : cleanItem(input);
};

export const dataTransformer = (value: any): any => {
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
        value = formatDate(value);
    }

    return value;
};

export function preprocessData<T extends Record<string, any>>(input: T): T;
export function preprocessData<T extends Record<string, any>>(input: T[]): T[];
export function preprocessData<T extends Record<string, any>>(input: T | T[]): T | T[] {
    const process = (item: T): T => {
        const newItem: Record<string, any> = { ...item };
        for (const [key, value] of Object.entries(item)) {
            newItem[key] = dataTransformer(value);
        }
        return newItem as T;
    };

    return Array.isArray(input) ? input.map(process) : process(input);
};

export { capitalize, cleanPayload, removeEmptyChildren };
