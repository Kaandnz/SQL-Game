import { PGlite } from "@electric-sql/pglite";
import { DATASETS } from "@/lib/data/datasets";
import { validateSafeQuery } from "@/lib/db/security-guard";

// Cache instances per dataset ID
const dbInstances = new Map<string, { db: PGlite; ready: Promise<void> }>();

async function initDatasetDb(datasetId: string): Promise<PGlite> {
  const dataset = DATASETS[datasetId] || DATASETS["ecommerce"];
  const db = new PGlite();

  const initPromise = (async () => {
    // Run seed SQL for the dataset
    await db.exec(dataset.seedSql);
  })();

  dbInstances.set(datasetId, { db, ready: initPromise });
  await initPromise;
  return db;
}

export async function getDbInstance(datasetId: string): Promise<PGlite> {
  const existing = dbInstances.get(datasetId);
  if (existing) {
    await existing.ready;
    return existing.db;
  }
  return initDatasetDb(datasetId);
}

export async function resetDatasetDb(datasetId: string): Promise<void> {
  const existing = dbInstances.get(datasetId);
  if (existing) {
    const dataset = DATASETS[datasetId] || DATASETS["ecommerce"];
    await existing.db.exec(dataset.seedSql);
  } else {
    await initDatasetDb(datasetId);
  }
}

export interface QueryExecutionOutput {
  success: boolean;
  rows: Record<string, any>[];
  columns: string[];
  executionTimeMs: number;
  rowCount: number;
  error?: string;
  isSecurityViolation?: boolean;
}

export async function executeUserQuery(
  datasetId: string,
  sql: string,
  options: { bypassSecurity?: boolean } = {}
): Promise<QueryExecutionOutput> {
  const startTime = performance.now();

  // 1. Security check
  if (!options.bypassSecurity) {
    const security = validateSafeQuery(sql);
    if (!security.isSafe) {
      return {
        success: false,
        rows: [],
        columns: [],
        executionTimeMs: 0,
        rowCount: 0,
        error: security.violationMessage,
        isSecurityViolation: true,
      };
    }
  }

  try {
    const db = await getDbInstance(datasetId);

    // Enforce a 4-second timeout limit for queries
    const queryPromise = db.query(sql);
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Query timeout: Sorgu 4 saniyelik zaman aşımına uğradı.")), 4000)
    );

    const result = (await Promise.race([queryPromise, timeoutPromise])) as any;
    const executionTimeMs = Math.round(performance.now() - startTime);

    const rows = result.rows || [];
    const columns = result.fields ? result.fields.map((f: any) => f.name) : (rows.length > 0 ? Object.keys(rows[0]) : []);

    return {
      success: true,
      rows,
      columns,
      executionTimeMs,
      rowCount: rows.length,
    };
  } catch (err: any) {
    const executionTimeMs = Math.round(performance.now() - startTime);
    return {
      success: false,
      rows: [],
      columns: [],
      executionTimeMs,
      rowCount: 0,
      error: err.message || "Bilinmeyen veritabanı yürütme hatası.",
    };
  }
}
