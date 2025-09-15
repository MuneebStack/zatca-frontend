import { List, notification, Typography } from 'antd';
import axios from 'axios';
import type { AxiosError } from 'node_modules/axios/index.d.cts';
import React from 'react';

const { Text, Paragraph } = Typography;

type FrontendErrorType = {
    message: string;
    description: string;
}

type ApiErrorType = {
    message?: string;
    description?: string;
    errors?: [];
};

type ApiSuccessType = {
    message: string;
    description: string;
}

const formatFieldName = (field: string) => {
    return field
        .replace(/[_-]/g, ' ')
        .replace(/\b\w/g, char => char.toUpperCase());
};

const frontendErrorHandler = (error: FrontendErrorType) => {
    const message = <Text strong>{error.message}</Text>
    const description = (
        <Paragraph type="danger">
            {error.description}
        </Paragraph>
    );

    notification.error({
        message,
        description,
        placement: 'topRight',
        duration: 4.5
    });
}

const apiErrorHandler = (error: AxiosError | any) => {
    if (axios.isCancel(error) || error.code == "ERR_CANCELED") {
        return Promise.reject(error);
    }
    
    let message: React.ReactNode = 'Error';
    let description: React.ReactNode = 'Something went wrong';

    if (error?.response) {
        const data = error.response.data as ApiErrorType;

        if (data?.errors && typeof data.errors === 'object' && data?.errors.length !== 0) {
            message = <Text strong>{data?.message || message}</Text>
            description = (
                <List
                    size="small"
                    dataSource={Object.entries(data.errors)}
                    renderItem={([field, messages]) => (
                        <List.Item>
                            <Text strong>{formatFieldName(field)}:</Text>&nbsp;
                            <Text type="danger">{(messages as string[]).join(', ')}</Text>
                        </List.Item>
                    )}
                />
            );
        } else if (data?.message) {
            message = <Text strong>{data.message}</Text>
            description = (
                <Paragraph type="danger">
                    {data?.description || description}
                </Paragraph>
            );
        }
    } else if (error?.request) {
        description = (
            <Paragraph type="danger">
                No response from server. Please check your connection
            </Paragraph>
        );
    }

    notification.error({
        message,
        description,
        placement: 'topRight',
        duration: 5
    });

    return Promise.reject(error);
};

const successMessageHandler = (data: ApiSuccessType) => {
    const message = <Text strong>{data.message}</Text>
    const description = (
        <Paragraph type="success">
            {data.description}
        </Paragraph>
    );

    notification.success({
        message,
        description,
        placement: 'topRight',
        duration: 4.5
    });
}

export {
    frontendErrorHandler,
    apiErrorHandler,
    successMessageHandler
};