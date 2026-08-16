#!/usr/bin/env bash
#
# Pingpang PostgreSQL backup script.
#
# Runs `pg_dump` against the pingpang-postgres-1 container, compresses the
# result, and prunes old backups to keep the last N. Safe to run from cron.
#
# Usage:
#   scripts/backup-postgres.sh            # defaults: keep 7, dir ./backups
#   BACKUP_DIR=/mnt/backups KEEP=30 scripts/backup-postgres.sh
#
# Environment overrides:
#   BACKUP_DIR   where to write .sql.gz files (default: ./backups)
#   KEEP         number of daily backups to retain   (default: 7)
#   CONTAINER    postgres container name             (default: pingpang-postgres-1)
#   DB_NAME      database name                        (default: pingpang)
#   DB_USER      database user                        (default: postgres)

set -euo pipefail

BACKUP_DIR="${BACKUP_DIR:-$(dirname "$0")/../backups}"
KEEP="${KEEP:-7}"
CONTAINER="${CONTAINER:-pingpang-postgres-1}"
DB_NAME="${DB_NAME:-pingpang}"
DB_USER="${DB_USER:-postgres}"

mkdir -p "$BACKUP_DIR"

TIMESTAMP="$(date +%Y%m%d_%H%M%S)"
OUTFILE="$BACKUP_DIR/${DB_NAME}_${TIMESTAMP}.sql.gz"

echo "[backup] dumping $DB_NAME from $CONTAINER -> $OUTFILE"

if ! docker exec "$CONTAINER" pg_dump -U "$DB_USER" -d "$DB_NAME" | gzip > "$OUTFILE"; then
  echo "[backup] ERROR: pg_dump failed" >&2
  rm -f "$OUTFILE"
  exit 1
fi

# Verify the dump is non-empty (a valid DB dump is at least a few hundred bytes).
SIZE="$(stat -c%s "$OUTFILE" 2>/dev/null || echo 0)"
if [ "$SIZE" -lt 100 ]; then
  echo "[backup] ERROR: dump suspiciously small (${SIZE} bytes), aborting" >&2
  rm -f "$OUTFILE"
  exit 1
fi

echo "[backup] OK: $OUTFILE ($(du -h "$OUTFILE" | cut -f1))"

# Prune old backups, keeping the newest $KEEP.
ls -1t "$BACKUP_DIR"/${DB_NAME}_*.sql.gz 2>/dev/null | tail -n +$((KEEP + 1)) | while read -r old; do
  echo "[backup] pruning $old"
  rm -f "$old"
done

echo "[backup] done (kept newest $KEEP)"
