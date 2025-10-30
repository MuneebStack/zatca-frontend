const capitalize = (text: string, separator: string | RegExp) => {
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
    parentPath = ""
): T[] => {
    const result: T[] = [];

    for (const item of items) {
        const fullName = updateName ? (parentPath ? `${parentPath} > ${item.name}` : item.name) : item.name;

        const newItem = { ...item, name: fullName };
        result.push(newItem);

        if (item.children && item.children.length > 0) {
            result.push(...flattenTree(item.children, updateName, fullName));
        }
    }

    return result;
};

export { capitalize, removeEmptyChildren, flattenTree };
