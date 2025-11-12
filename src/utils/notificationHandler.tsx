import { getNotification } from '@/services/antdAppInstances';
import { List, Typography } from 'antd';
import axios from 'axios';
import type { AxiosError } from 'node_modules/axios/index.d.cts';
import React from 'react';
import { capitalize } from '.';

const { Text, Paragraph } = Typography;

type FrontendErrorType = {
    title: string;
    message: string;
}

type ApiErrorType = {
    title?: string;
    message?: string;
    errors?: [];
};

type ApiSuccessType = {
    title: string;
    message: string;
}

const frontendErrorHandler = (error: FrontendErrorType) => {
    const notification = getNotification();
    const title = <Text strong>{error.title}</Text>
    const message = (
        <Paragraph type="danger">
            {error.message}
        </Paragraph>
    );

    notification.error({
        message: title,
        description: message,
        placement: 'topRight',
        duration: 4.5
    });
}

const apiErrorHandler = (error: AxiosError | any) => {
    const notification = getNotification();
    if (axios.isCancel(error) || error.code == "ERR_CANCELED") {
        return Promise.reject(error);
    }

    let title: React.ReactNode = 'Error';
    let message: React.ReactNode = 'Something went wrong';

    if (error?.response) {
        const data = error.response.data as ApiErrorType;

        if (data?.errors && typeof data.errors === 'object' && data?.errors.length !== 0) {
            title = <Text strong>{data?.title || title}</Text>
            message = (
                <List
                    size="small"
                    dataSource={Object.entries(data.errors)}
                    renderItem={([field, messages]) => (
                        <List.Item>
                            <Text strong>{capitalize(field, /[-_]/g)}:</Text>&nbsp;
                            <Text type="danger">{(messages as string[]).join(', ')}</Text>
                        </List.Item>
                    )}
                />
            );
        } else if (data?.message) {
            title = <Text strong>{data?.title || title}</Text>
            message = (
                <Paragraph type="danger">
                    {data?.message || message}
                </Paragraph>
            );
        }
    } else if (error?.request) {
        message = (
            <Paragraph type="danger">
                No response from server. Please check your connection
            </Paragraph>
        );
    }

    notification.error({
        message: title,
        description: message,
        placement: 'topRight',
        duration: 5
    });

    return Promise.reject(error);
};

const successMessageHandler = (data: ApiSuccessType) => {
    const notification = getNotification();
    const title = <Text strong>{data.title}</Text>
    const message = (
        <Paragraph type="success">
            {data.message}
        </Paragraph>
    );

    notification.success({
        message: title,
        description: message,
        placement: 'topRight',
        duration: 4.5
    });
}

export {
    frontendErrorHandler,
    apiErrorHandler,
    successMessageHandler
};