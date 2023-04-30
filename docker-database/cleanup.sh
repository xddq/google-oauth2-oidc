#!/bin/bash
#
# deletes all backups that are older than the max age for a given path.

MAX_AGE_IN_DAYS=7
BACKUP_PATH="/backups"

# removes files older than or equal to max age
find "$BACKUP_PATH" -type f -mtime "+$MAX_AGE_IN_DAYS" | xargs rm

