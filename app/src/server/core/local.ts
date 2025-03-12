import { ENV } from "../configs/env";
import app from "./server.js";

export default {
	fetch: app.fetch,
	port: ENV.PORT,
};
