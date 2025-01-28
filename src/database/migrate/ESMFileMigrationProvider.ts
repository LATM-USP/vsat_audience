import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import type { Migration, MigrationProvider } from "kysely";

/**
 * @see https://github.com/kysely-org/kysely/issues/277
 */
class ESMFileMigrationProvider implements MigrationProvider {
  constructor(private relativePath: string) {}

  async getMigrations(): Promise<Record<string, Migration>> {
    const migrations: Record<string, Migration> = Object.create(null);

    const __dirname = fileURLToPath(new URL(".", import.meta.url));
    const resolvedPath = path.resolve(__dirname, this.relativePath);

    const files = await fs.readdir(resolvedPath);

    for (const fileName of files) {
      if (!fileName.endsWith(".js")) {
        continue;
      }

      const basePath = new URL(
        this.relativePath,
        import.meta.url,
      ).pathname.replace("/C:", "file://C:/");

      const importPath = path.join(basePath, fileName);

      const migration = await import(importPath);

      const migrationKey = fileName.substring(0, fileName.lastIndexOf("."));

      migrations[migrationKey] = migration;
    }

    return migrations;
  }
}

export default ESMFileMigrationProvider;
