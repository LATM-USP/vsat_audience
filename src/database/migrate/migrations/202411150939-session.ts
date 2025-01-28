import type { Kysely } from "kysely";

const TABLE_SESSION = "session";

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable(TABLE_SESSION)
    .addColumn("sid", "varchar", (col) => col.primaryKey())
    .addColumn("sess", "json", (col) => col.notNull())
    .addColumn("expire", "timestamp", (col) => col.notNull())
    .execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable(TABLE_SESSION).execute();
}
