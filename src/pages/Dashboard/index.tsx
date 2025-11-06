import { useEffect, useState } from "react";
import { Card, Row, Col, Typography, Flex, Empty } from "antd";
import type { DashboardCounts } from "@/types/dashboard";
import { UserOutlined } from "@ant-design/icons";
import { axiosClient } from "@/services/axiosClient";
import { BlockLoader } from "@/components/BlockLoader";

const { Text } = Typography;

const iconMap: Record<string, React.ReactNode> = {
    users: <UserOutlined />,
};

export const Dashboard = () => {
    const [counts, setCounts] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();

        axiosClient
            .get("portal/dashboard/counts", { signal: controller.signal })
            .then((response) => {
                if (response?.data?.data) {
                    setCounts(response.data.data);
                }
            })
            .catch((error) => (error))
            .finally(() => !controller.signal.aborted && setLoading(false))

        return () => controller.abort();
    }, []);

    const entries = counts
        ? (Object.entries(counts) as [keyof DashboardCounts, number][])
        : [];

    return (
        <>
            {loading && <BlockLoader />}

            {counts && entries.length > 0 ? (
                <Row gutter={[16, 16]}>
                    {entries.map(([key, value]) => (
                        <Col xs={24} sm={12} md={8} lg={6} key={key}>
                            <Card>
                                <Flex align="center" gap={8}>
                                    {iconMap[key] ?? null}
                                    <Text className="capitalize" type="secondary">
                                        {key}
                                    </Text>
                                </Flex>
                                <Text strong className="!text-2xl">
                                    {value}
                                </Text>
                            </Card>
                        </Col>
                    ))}
                </Row>
            ) : (
                !loading && <Empty />
            )}
        </>
    );
};