import type { AsyncLocalStorage } from "node:async_hooks";

import type { Kysely } from "kysely";
import type { Logger } from "pino";

export default function withTransaction<Database>(
  log: Logger,
  db: Kysely<Database>,
  storage: AsyncLocalStorage<Kysely<Database>>,
  thisArg = null,
): [typeof transactional, typeof getDatabase] {
  const getDatabase = () => storage.getStore() ?? db;

  function transactional<
    F extends (
      // biome-ignore lint/suspicious/noExplicitAny: it's fine here
      ...args: any[]
      // biome-ignore lint/suspicious/noExplicitAny: it's fine here
    ) => ReturnType<F> extends Promise<any> ? ReturnType<F> : never,
  >(fn: F): (...args: Parameters<F>) => ReturnType<F> {
    return (...args) => {
      const action = () => fn.apply(thisArg, args);

      const db = getDatabase();

      if (db.isTransaction) {
        log.trace("Running in existing transaction");
        return action();
      }

      log.trace("Running in new transaction");
      return db
        .transaction()
        .execute((tx) => storage.run(tx, action)) as ReturnType<F>;
    };
  }

  return [transactional, getDatabase];
}
