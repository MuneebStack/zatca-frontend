import { USER } from './user';
import { ROLE } from './role';
import { PERMISSION } from './permission';
import { NAVIGATION } from './navigation';
import { WIDGET } from './widget';
import { PERSONAL_ACCESS_TOKEN } from './personalAccessToken';
import { DATA_ACCESS } from './dataAccess';

export const PERMISSIONS = {
  user: USER,
  role: ROLE,
  permission: PERMISSION,
  navigation: NAVIGATION,
  widget: WIDGET,
  personal_access_token: PERSONAL_ACCESS_TOKEN,
  data_access: DATA_ACCESS,
} as const;

export type ModuleName = keyof typeof PERMISSIONS;
export type ModulePermissions<T extends ModuleName> = keyof typeof PERMISSIONS[T];