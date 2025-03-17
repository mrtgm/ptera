SELECT
  query,
  calls,
  total_exec_time,
  mean_exec_time,
  rows,
  shared_blks_read,
  shared_blks_hit
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;
