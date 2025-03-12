import { handle } from 'hono/vercel'
import app from "../../../server/core/server";

export const handler = handle(app);

export const GET = handle(app)
