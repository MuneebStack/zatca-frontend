import type { ColumnsType, ColumnType } from "antd/es/table";

const capitalize = (text: string, separator: string | RegExp = /[_-]/g) => {
    return text.replace(separator, ' ').replace(/\b\w/g, (character) => character.toUpperCase());
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

const flattenTree = <T extends { id: number | string; name: string; children?: T[] }>(
    items: T[],
    updateName = false,
    parentPath = '',
    sortBy?: keyof T,
    direction: 'asc' | 'desc' = 'asc',
): Omit<T, 'children'>[] => {
    const result: Omit<T, 'children'>[] = [];

    const sortedItems = sortBy
        ? [...items].sort((a, b) => {
              const aVal = a[sortBy];
              const bVal = b[sortBy];
              if (aVal === bVal) return 0;
              if (aVal! < bVal!) return direction === 'asc' ? -1 : 1;
              return direction === 'asc' ? 1 : -1;
          })
        : items;

    for (const item of sortedItems) {
        const fullName = updateName
            ? parentPath
                ? `${parentPath} > ${item.name}`
                : item.name
            : item.name;

        const { children, ...rest } = item;

        const flatItem = { ...rest, name: fullName };
        result.push(flatItem);

        if (item.children && item.children.length > 0) {
            result.push(...flattenTree(item.children, updateName, fullName, sortBy, direction));
        }
    }

    return result;
};

const buildTree = <
    T extends {
        id: number | string;
        name: string;
        children?: T[];
        parent_id?: number | string | null;
    },
>(
    items: T[],
    sortBy?: keyof T,
    direction: 'asc' | 'desc' = 'asc',
): T[] => {
    const itemMap = new Map<number | string, T>();
    const roots: T[] = [];

    for (const item of items) {
        const cloned = { ...item };
        delete cloned.children;
        itemMap.set(item.id, { ...cloned });
    }

    for (const item of itemMap.values()) {
        if (item.parent_id != null && itemMap.has(item.parent_id)) {
            const parent = itemMap.get(item.parent_id)!;
            if (!parent.children) parent.children = [];
            parent.children.push(item);
        } else {
            roots.push(item);
        }
    }

    const sortRecursively = (nodes: T[]) => {
        if (!sortBy) return nodes;
        nodes.sort((a, b) => {
            const aVal = a[sortBy];
            const bVal = b[sortBy];
            if (aVal === bVal) return 0;
            if (aVal! < bVal!) return direction === 'asc' ? -1 : 1;
            return direction === 'asc' ? 1 : -1;
        });
        for (const node of nodes) {
            if (node.children && node.children.length > 0) {
                sortRecursively(node.children);
            }
        }
        return nodes;
    };

    return sortRecursively(roots);
};

function filterTableColumns<T extends object>(
    columns: ColumnsType<T>,
    data: T[],
    hiddenColumns: (keyof T)[] = []
): ColumnsType<T> {
    if (!data?.length) return columns;

    const firstRow = data?.[0];
    return columns.filter((col): col is ColumnType<T> => {
        if (!("dataIndex" in col) || col.dataIndex === undefined) return true;

        const dataIndex = col.dataIndex;

        return (
            (typeof dataIndex === "string" || typeof dataIndex === "number") &&
            dataIndex in firstRow &&
            !hiddenColumns.includes(dataIndex as keyof T)
        );
    });
}

export { capitalize, removeEmptyChildren, flattenTree, buildTree, filterTableColumns };
