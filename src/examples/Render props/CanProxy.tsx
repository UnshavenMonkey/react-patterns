import type { ReactNode } from "react";

type Permission = "admin" | "editor" | "viewer";

type CurrentUser = {
  name: string;
  permissions: Permission[];
};

type PermissionState = {
  allowed: boolean;
  disabled: boolean;
  user: CurrentUser;
};

type CanProxyProps = {
  permission: Permission;
  user: CurrentUser;
  fallback?: ReactNode;
  children: ReactNode | ((state: PermissionState) => ReactNode);
};

const CanProxy = ({ permission, user, fallback = null, children }: CanProxyProps) => {
  const allowed = user.permissions.includes(permission);
  const permissionState = {
    allowed,
    disabled: !allowed,
    user,
  };

  if (typeof children === "function") {
    return children(permissionState);
  }

  return allowed ? children : fallback;
};

export default CanProxy;
export type { CurrentUser, Permission };
