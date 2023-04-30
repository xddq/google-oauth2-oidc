#!/bin/bash
#
# restore psql from backup. Need to pass the filename to the script.

if [ -z $1 ]; then
    echo "Need to pass filename as argument! E.g. ./restore.sh latest-dump.sql"
    exit 1
fi

# psql -U "$POSTGRES_USER" -f /backups/db-dump-latest.sql postgres
psql -U "$POSTGRES_USER" -f "$1" postgres

