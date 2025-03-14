import { getContext } from "hono/context-storage";

import type { User } from "@/schemas/users/domain/user";
import type { HttpBindings } from "@hono/node-server";

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
