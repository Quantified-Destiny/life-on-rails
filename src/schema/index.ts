import type { InferModel } from "drizzle-orm";
import * as schema from "./schema";

export * from "./schema";

export default schema;

export type Schema = typeof schema;

export type Memo = InferModel<typeof schema.memo, "select">;
