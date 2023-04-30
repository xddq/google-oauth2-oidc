#!/bin/bash
#
# Creates a backup of the current psql cluster. Works for alpine
# based psql.
mkdir -p /backups
pg_dumpall --clean -U "$POSTGRES_USER" > /backups/db-dump-$(date -Iseconds).sql
