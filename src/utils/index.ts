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

export { capitalize, removeEmptyChildren };
