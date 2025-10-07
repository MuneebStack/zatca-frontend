const capitalize = (text: string, separator: string | RegExp) => {
    return text.replace(separator, ' ').replace(/\b\w/g, (character) => character.toUpperCase());
};

const cleanPayload = <T extends Record<string, any>>(payload: T): T => {
    const result = { ...payload };
    Object.keys(result).forEach((key) => {
        if (typeof result[key] === "string" && result[key].trim() === "") {
            delete result[key];
        }
    });
    return result;
}

export { 
    capitalize,
    cleanPayload
};
