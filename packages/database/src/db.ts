/**
 * @file All database calls will go through this file. We also set up connection
 * pooling here.
 *
 * Project structure as suggested here: https://node-postgres.com/
 */

import "dotenv/config";
import { Pool, PoolClient, QueryConfig, QueryResultRow } from "pg";
import { Logger } from "@app/utils";

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
});

/**
 * Use this function every time you run a query against the database that is not
 * a transaction. Will use the pooled connection. If you want to execute a
 * transaction, you have to use getClientForTransaction instead!
 * @see {@link getClientForTransaction} for executing transactions.
 *
 * @example
 * Inserting a user into the users table and returning the id of the inserted
 * user.
 *
 * const queryConfig = {
 *   text: `INSERT INTO users(firstname, lastname, email)
 *          VALUES($1, $2, $3)
 *          RETURNING *`,
 *   params: ['max','power', 'max@example.com']
 * }
 * const userIdRows = await query(queryConfig)
 *
 * @returns rows An array of rows containing the result of the executed command
 * based on the given queryconfig.
 */
const query = async <R extends QueryResultRow = any, V extends any[] = any[]>(
  queryConfig: QueryConfig<V>
) => {
  const start = Date.now();
  const result = await pool.query<R, V>(queryConfig);
  const duration = Date.now() - start;
  Logger.log("executed query", {
    text: queryConfig.text,
    values: queryConfig.values,
    duration,
    rowCount: result.rowCount,
  });
  return result.rows;
};

/**
 * Only use this for transaction. Otherwise use query instead!
 * @see {@link query} for executing a query that is not part of a transaction.
 */
// TODO: try to implement like the node-postgres example but typesafe? Or use
// ts-ignore for first implementation?
// src: https://node-postgres.com/guides/project-structure
const getClientForTransaction = async (): Promise<PoolClient> => {
  return pool.connect();
};

export const Database = {
  query,
  getClientForTransaction,
  pool,
};
