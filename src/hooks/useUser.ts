import { useEffect, useState } from "react";
import { fetchUsers } from "@/api/user";
import type { UserType } from "@/types/user";
import type { PaginationType } from "@/types";

const useUsers = (params?: Record<string, any>) => {
    const [users, setUsers] = useState<UserType[]>([]);
    const [pagination, setPagination] = useState<PaginationType>({
        current: 1,
        pageSize: 10,
        total: 0,
    });
    const [userLoading, setUserLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();

        setUserLoading(true);
        fetchUsers(controller.signal, params)
            .then((response) => {
                setUsers(response.data);
                response?.meta && setPagination(response.meta);
            })
            .catch((error) => (error))
            .finally(() => setUserLoading(false));

        return () => controller.abort();
    }, [pagination?.current, pagination?.pageSize]);

    return { users, pagination, userLoading, setUsers, setPagination, setUserLoading };
};

export { useUsers };