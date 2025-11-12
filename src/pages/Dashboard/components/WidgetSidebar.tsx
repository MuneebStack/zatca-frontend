import type { WidgetType } from "@/types/widget";
import { Drawer, List, Checkbox } from "antd";

interface Props {
    openDrawer: boolean;
    onClose: () => void;
    widgets: WidgetType[];
    selected: WidgetType["name"][];
    onToggle: (name: string, checked: boolean) => void;
}

export const WidgetSidebar: React.FC<Props> = ({
    openDrawer,
    onClose,
    widgets,
    selected,
    onToggle
}) => {
    return (
        <Drawer
            title="Manage Widgets"
            placement="right"
            onClose={onClose}
            open={openDrawer}
        >
            <List
                className="h-full"
                dataSource={widgets}
                renderItem={(item) => (
                    <List.Item>
                        <Checkbox
                            checked={selected.includes(item.name)}
                            onChange={(e) => onToggle(item.name, e.target.checked)}
                        >
                            {item.title}
                        </Checkbox>
                    </List.Item>
                )}
                bordered
            />
        </Drawer>
    );
};