// @generated
// This file is automatically generated by Kanel. Do not modify manually.

/** UUID for table */
export type Version = string;

/** Represents the table public.schema_migrations */
export default interface DBSchemaMigrations {
  /** Database type: pg_catalog.varchar */
  version: Version;
}

/** Represents the type for inserting entries for the table public.schema_migrations */
export interface DBSchemaMigrationsInsert {
  /** Database type: pg_catalog.varchar */
  version: Version;
}

/** Represents the type for updating entries for the table public.schema_migrations */
export interface DBSchemaMigrationsUpdate {
  /** Database type: pg_catalog.varchar */
  version?: Version;
}