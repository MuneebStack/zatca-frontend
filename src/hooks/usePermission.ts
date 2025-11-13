import { PERMISSIONS, type ModuleName, type ModulePermissions } from '@/permissions';
import { useAuth } from '@/providers/AuthContext';

export const usePermission = () => {
    const { user, userPermissions } = useAuth();
    
    const hasPermission = (permission: string) => 
        user?.roles?.some((role) => role.name === "super-admin") ||
        userPermissions.includes(permission);

    const hasModulePermission = <T extends ModuleName>(module: T, action: ModulePermissions<T>) => {
        const permissionName = PERMISSIONS[module][action] as string;
        return hasPermission(permissionName);
    };

    return { hasPermission, hasModulePermission };
};