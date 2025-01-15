// inspired by remix-utils https://github.com/sergiodxa/remix-utils

import { ReactNode } from "react";
import { useHydrated } from "~/hooks/useHydrated";

type Props = {
  children: () => ReactNode;
  fallback?: ReactNode;
};

const ClientOnly = ({ children, fallback = null }: Props) => {
  return useHydrated() ? <>{children()}</> : <>{fallback}</>;
};

export default ClientOnly;
