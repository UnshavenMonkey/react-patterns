import type { ReactNode } from "react";

type Session = {
  token: string | null;
  userName: string;
};

type ProtectedRouteProps = {
  session: Session;
  fallback: ReactNode;
  children: ReactNode | ((session: Session) => ReactNode);
};

const ProtectedRoute = ({ session, fallback, children }: ProtectedRouteProps) => {
  if (!session.token) {
    return fallback;
  }

  if (typeof children === "function") {
    return children(session);
  }

  return children;
};

export default ProtectedRoute;
export type { Session };
