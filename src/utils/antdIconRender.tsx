import * as Icons from "@ant-design/icons";

const antdIconRender = (iconName?: string) => {
    if (!iconName) return null;
    const IconComponent = (Icons as any)[iconName];
    return IconComponent ? <IconComponent /> : null;
};

export {
    antdIconRender
}