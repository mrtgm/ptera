import { handle } from 'hono/vercel'
import app from "./core/server.ts";

export const handler = handle(app);
