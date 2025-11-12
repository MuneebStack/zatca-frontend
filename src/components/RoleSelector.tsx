import { axiosClient } from "@/services/axiosClient";
import type { RoleType } from "@/types/role";
import { Select } from "antd";
import { useEffect, useState } from "react";
import { capitalize } from "@/utils";

const { Option } = Select;

interface RoleSelectorProps {
    value?: string | number;
    onChange?: (id: string | number) => void;
    className?: string;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({ value, onChange, className }) => {
    const [roles, setRoles] = useState<RoleType[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const controller = new AbortController();
        setLoading(true);

        axiosClient
            .get("portal/roles", {
                params: { bypass_pagination: true },
                signal: controller.signal,
            })
            .then(({ data: responseData }) => {
                if (responseData?.data) {
                    setRoles(responseData.data.data);
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
            placeholder="Select Role"
            value={value}
            onChange={(value) => onChange?.(value)}
            className={className}
            loading={loading}
            disabled={loading}
        >
            {roles.map((role) => (
                <Option key={role.id} value={role.id}>
                    {capitalize(role.name)}
                </Option>
            ))}
        </Select>
    );
};
