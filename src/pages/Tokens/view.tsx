import { Button, Card, Typography } from "antd";
import { CheckOutlined, CopyOutlined } from "@ant-design/icons";
import { useState } from "react";
import { frontendErrorHandler } from "@/utils/notificationHandler";

const { Text } = Typography;

interface ViewTokenProps {
    generatedToken: string
}

export const ViewToken = ({ generatedToken }: ViewTokenProps) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(generatedToken);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
            frontendErrorHandler({
                title: 'Error',
                message: 'Failed to copy token'
            });
        }
    };

    return (
        <>
            <Text type="secondary" className="block mt-4 mb-2">
                This token is shown only once — please copy and store it securely.
            </Text>
            <Card
                size="small"
            >
                <code className="mr-2">
                    {generatedToken}
                </code>
                <Button
                    type="text"
                    icon={copied ? <CheckOutlined /> : <CopyOutlined />}
                    onClick={handleCopy}
                    aria-label="Copy token"
                />
            </Card>
        </>
    );
}