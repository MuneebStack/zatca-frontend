import { Card, Empty, Flex, Space, Typography } from "antd";
import { useEffect, useState } from "react";
import { WidgetFilters } from "./WidgetFilters";
import type { WidgetType } from "@/types/widget";
import { axiosClient } from "@/services/axiosClient";
import { antdIconRender } from "@/utils/antdIconRender";

interface WidgetCardProps {
    widget: WidgetType;
}

const { Text } = Typography;

export const WidgetCard: React.FC<WidgetCardProps> = ({ widget }) => {
    const [data, setData] = useState<any>();
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState<Record<string, any>>({});

    useEffect(() => {
        const controller = new AbortController();

        setLoading(true);
        axiosClient
            .get(`portal/widgets/${widget.id}/data`, {
                params: {
                    ...filters
                },
                signal: controller.signal
            })
            .then(({ data: responseData }) => {
                if (responseData?.data) {
                    const payload = responseData.data;
                    setData(payload.data);
                }
            })
            .catch((error) => (error))
            .finally(() => setLoading(false))

        return () => controller.abort();
    }, [filters]);

    const renderWidgetContent = () => {
        switch (widget.type) {
            case "stat":
                return (
                    <Flex
                        vertical
                        align="center"
                        justify="center"
                        className="!text-2xl"
                        gap={8}
                    >
                        {antdIconRender(widget.icon)}
                        <Text strong className="!text-2xl">{data ?? 0}</Text>
                    </Flex>
                );
            default:
                return <Empty description="Unsupported widget type" />;
        }
    };

    return (
        <Card
            title={widget.title}
        >
            <Space direction="vertical" className="w-full">
                {
                    widget.filters?.length && (
                        <WidgetFilters filters={widget.filters} onChange={(filter) => setFilters((prev) => ({ ...prev, ...filter }))} />
                    )
                }

                <Card loading={loading}>
                    {data !== undefined ? renderWidgetContent() : <Empty description="No data found" />}
                </Card>

            </Space>
        </Card>
    );
};