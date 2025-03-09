import { handle } from "hono/aws-lambda";
import app from "./core/server.ts";

//

export const handler = handle(app);
