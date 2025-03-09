import { ENV } from "~/configs/env";
import * as schema from "./schema";

import { RDSDataClient } from "@aws-sdk/client-rds-data";
import { drizzle } from "drizzle-orm/aws-data-api/pg";
import { env, isDebug } from "std-env";

const client = new RDSDataClient({
	region: "us-west-1",
	endpoint: "http://127.0.0.1:8080",
});

export const db = drizzle(client, {
	database: ENV.DB_NAME,
	secretArn: ENV.SECRET_ARN,
	resourceArn: ENV.CLUSTER_ARN,
	schema,
});
