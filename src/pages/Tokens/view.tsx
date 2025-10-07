import { Button, Card, Typography } from "antd";
import { CheckOutlined, CopyOutlined } from "@ant-design/icons";
import { useState } from "react";
import { frontendErrorHandler, successMessageHandler } from "@/utils/notificationHandler";

const { Text } = Typography;

interface ViewTokenProps {
    generatedToken: string
}

const ViewToken = ({ generatedToken }: ViewTokenProps) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(generatedToken);
            setCopied(true);
            successMessageHandler({
                'message': 'Copied',
                'description': 'The token has been copied successfully'
            });
            setTimeout(() => setCopied(false), 1500);
        } catch {
            frontendErrorHandler({
                'message': 'Error',
                'description': 'Failed to copy token'
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

export {
    ViewToken
}