import { PrismaClient } from "@prisma/client";
//import { PrismaClient } from '@prisma/client/edge'

import { env } from "../env/server.mjs";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

import { drizzle } from "drizzle-orm/planetscale-serverless";
import { connect } from "@planetscale/database";
import * as schema from "../schema";

export const db = drizzle(
  connect({
    url: env.DATABASE_URL,
  }),
  { logger: true, schema: schema }
);
