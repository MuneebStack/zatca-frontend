import { Flex, Spin } from "antd";

export const BlockLoader = () => {
    return (
        <Flex className="absolute inset-0 z-10" justify="center" align="center">
            <Spin size="large" />
        </Flex>
    );
};
