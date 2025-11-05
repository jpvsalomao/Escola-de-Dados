import * as duckdb from "@duckdb/duckdb-wasm";
import { config } from "./config";

let db: duckdb.AsyncDuckDB | null = null;
let conn: duckdb.AsyncDuckDBConnection | null = null;

/**
 * Initialize DuckDB-WASM instance
 */
export async function initDuckDB(): Promise<duckdb.AsyncDuckDB> {
  if (db) return db;

  const JSDELIVR_BUNDLES = duckdb.getJsDelivrBundles();

  const bundle = await duckdb.selectBundle(JSDELIVR_BUNDLES);

  const worker_url = URL.createObjectURL(
    new Blob([`importScripts("${bundle.mainWorker}");`], { type: "text/javascript" })
  );

  const worker = new Worker(worker_url);
  const logger = new duckdb.ConsoleLogger();

  db = new duckdb.AsyncDuckDB(logger, worker);
  await db.instantiate(bundle.mainModule, bundle.pthreadWorker);
  URL.revokeObjectURL(worker_url);

  return db;
}

/**
 * Get or create a connection to DuckDB
 */
export async function getConnection(): Promise<duckdb.AsyncDuckDBConnection> {
  if (!db) {
    await initDuckDB();
  }
  if (!conn) {
    conn = await db!.connect();
  }
  return conn;
}

/**
 * Execute a SQL query and return results
 */
export async function executeQuery(sql: string): Promise<unknown[]> {
  const connection = await getConnection();
  const result = await connection.query(sql);
  return result.toArray().map((row) => row.toJSON());
}

/**
 * Execute a SQL query with timeout
 */
export async function executeQueryWithTimeout(
  sql: string,
  timeoutMs: number = config.limits.timeoutMs
): Promise<{ data: unknown[]; elapsedMs: number }> {
  const start = performance.now();

  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error(`Query timeout after ${timeoutMs}ms`)), timeoutMs);
  });

  const queryPromise = executeQuery(sql);

  const data = await Promise.race([queryPromise, timeoutPromise]);
  const elapsedMs = performance.now() - start;

  return { data, elapsedMs };
}

/**
 * Load a Parquet file into DuckDB
 */
export async function loadParquet(tableName: string, url: string): Promise<void> {
  const connection = await getConnection();
  await connection.query(`CREATE OR REPLACE TABLE ${tableName} AS SELECT * FROM '${url}'`);
}

/**
 * Check if a table exists
 */
export async function tableExists(tableName: string): Promise<boolean> {
  const connection = await getConnection();
  const result = await connection.query(
    `SELECT COUNT(*) as count FROM information_schema.tables WHERE table_name = '${tableName}'`
  );
  const rows = result.toArray();
  return rows.length > 0 && rows[0].toJSON().count > 0;
}

/**
 * Get table schema
 */
export async function getTableSchema(
  tableName: string
): Promise<Array<{ name: string; type: string }>> {
  const connection = await getConnection();
  const result = await connection.query(`DESCRIBE ${tableName}`);
  const rows = result.toArray();
  return rows.map((row) => {
    const json = row.toJSON() as { column_name: string; column_type: string };
    return { name: json.column_name, type: json.column_type };
  });
}

/**
 * Drop a table if it exists
 */
export async function dropTable(tableName: string): Promise<void> {
  const connection = await getConnection();
  await connection.query(`DROP TABLE IF EXISTS ${tableName}`);
}

/**
 * Close the connection and database
 */
export async function close(): Promise<void> {
  if (conn) {
    await conn.close();
    conn = null;
  }
  if (db) {
    await db.terminate();
    db = null;
  }
}
