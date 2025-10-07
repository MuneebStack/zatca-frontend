import { axiosClient } from '@/services/axiosClient';
import type { UserType } from '@/types/user';
import type { PaginationType } from '@/types';

const fetchUsers = async (
    signal?: AbortSignal,
    params?: Record<string, any>,
): Promise<{ data: UserType[]; meta?: PaginationType }> => {
    const response = await axiosClient.get(
        'portal/users',
        { signal, params },
    );
    const payload = response.data?.data;

    return {
        data: payload?.data || [],
        meta: payload?.meta,
    };
};

export { fetchUsers };
