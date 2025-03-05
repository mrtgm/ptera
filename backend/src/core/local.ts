import { ENV } from "../configs/env.ts";
import app from "./server.ts";

export default {
	fetch: app.fetch,
	port: ENV.BACKEND_PORT ?? "8000",
};
