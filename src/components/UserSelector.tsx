import { axiosClient } from "@/services/axiosClient";
import type { UserType } from "@/types/user";
import { Select } from "antd";
import { useEffect, useState } from "react";
import { capitalize } from "@/utils";

const { Option } = Select;

interface UserSelectorProps {
    value?: string | number;
    onChange?: (id: string | number) => void;
    className?: string;
}

export const UserSelector: React.FC<UserSelectorProps> = ({ value, onChange, className }) => {
    const [users, setUsers] = useState<UserType[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const controller = new AbortController();
        setLoading(true);

        axiosClient
            .get("portal/users", {
                params: { bypass_pagination: true },
                signal: controller.signal,
            })
            .then(({ data: responseData }) => {
                if (responseData?.data) {
                    setUsers(responseData.data.data);
                }
            })
            .catch(() => { })
            .finally(() => setLoading(false));

        return () => controller.abort();
    }, []);

    return (
        <Select
            showSearch
            allowClear
            placeholder="Select User"
            className={className}
            value={value}
            onChange={(value) => onChange?.(value)}
            loading={loading}
            disabled={loading}
        >
            {users.map((user) => (
                <Option key={user.id} value={user.id}>
                    {capitalize(user.name)}
                </Option>
            ))}
        </Select>
    );
};
