import { useEffect, useState } from "react";
import { Row, Col, Button, Empty, Card, Flex, Typography } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import { WidgetCard } from "./components/WidgetCard";
import { WidgetSidebar } from "./components/WidgetSidebar";
import { axiosClient } from "@/services/axiosClient";
import type { WidgetType } from "@/types/widget";

const { Title } = Typography;

export function Dashboard() {
    const [widgets, setWidgets] = useState<WidgetType[]>([]);
    const [selectedWidgetNames, setSelectedWidgetNames] = useState<WidgetType["name"][]>([]);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [loading, setLoading] = useState(false);

    const selectedWidgets = widgets.filter((widget) => selectedWidgetNames.includes(widget.name));

    const handleToggle = (toggleWidgetName: string, checked: boolean) => {
        const updated = checked ? [...selectedWidgetNames, toggleWidgetName] : selectedWidgetNames.filter((widgetName) => widgetName !== toggleWidgetName);
        setSelectedWidgetNames(updated);
        localStorage.setItem("selectedWidgets", JSON.stringify(updated));
    }

    useEffect(() => {
        const controller = new AbortController();

        setLoading(true);
        axiosClient
            .get("portal/widgets/active", {
                signal: controller.signal
            })
            .then(({ data: responseData }) => {
                if (responseData?.data) {
                    const payload = responseData.data;
                    setWidgets(payload.data);
                }
            })
            .catch((error) => (error))
            .finally(() => setLoading(false))

        return () => controller.abort();
    }, []);

    useEffect(() => {
        if (widgets.length) {
            const saved = localStorage.getItem("selectedWidgets");
            if (saved) setSelectedWidgetNames(JSON.parse(saved));
        }
    }, [widgets])

    return (
        <Card loading={loading}>

            <Flex vertical gap="middle">
                <Flex justify="space-between" align="center">
                    <Title level={4}>
                        Dashboard
                    </Title>
                    <Button
                        type="primary"
                        icon={<SettingOutlined />}
                        onClick={() => setOpenDrawer(true)}
                    >
                        Manage Widgets
                    </Button>
                </Flex>

                {selectedWidgets.length ? (
                    <Row gutter={[16, 16]}>
                        {selectedWidgets.map((widget) => (
                            <Col key={widget.id} xs={24} sm={12} lg={8}>
                                <WidgetCard widget={widget} />
                            </Col>
                        ))}
                    </Row>
                ) : (
                    <Empty description="No widgets selected" />
                )}
            </Flex>

            <WidgetSidebar
                openDrawer={openDrawer}
                onClose={() => setOpenDrawer(false)}
                widgets={widgets}
                selected={selectedWidgetNames}
                onToggle={handleToggle}
            />

        </Card>
    );
}