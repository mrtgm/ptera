import { getContext } from "hono/context-storage";

import type { HttpBindings } from "@hono/node-server";
import type { User } from "@ptera/schema";

export type Env = {
  Variables: {
    user: User;
  };
  Bindings: HttpBindings;
};

// https://hono.dev/docs/middleware/builtin/context-storage#usage
export const getContextUser = () => {
  return getContext<Env>().var.user;
};
