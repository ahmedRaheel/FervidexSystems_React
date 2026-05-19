export const enterpriseSections = [
  {
    id: 'temporal-tables',
    title: 'Temporal Tables and History Queries',
    eyebrow: 'Audit',
    status: 'Implemented + Expanding',
    summary:
      'Temporal support covers point-in-time reads, all-history queries, date ranges, contained-in ranges, audit timeline screens, restore workflows and SQL generation helpers.',
    bullets: ['TemporalAll', 'TemporalAsOf', 'TemporalBetween', 'TemporalContainedIn', 'TemporalAsOfByIdAsync', 'GenerateEnableTemporalSql'],
    code: `var orderYesterday = await db.Set<Order>()
    .TemporalAsOf(DateTime.UtcNow.AddDays(-1))
    .Where(x => x.Id == orderId)
    .FirstOrDefaultAsync(ct);

var history = await ForgeSql.Select<Order>()
    .TemporalBetween(from, to)
    .Where(x => x.Id == orderId)
    .ToListAsync<Order, Order>(db, ct);

var script = db.GenerateEnableTemporalSql<Order>(historyTable: "dbo.OrdersHistory");`
  },
  {
    id: 'execution-options',
    title: 'Execution Options, Locking and Read Consistency',
    eyebrow: 'Enterprise Queries',
    status: 'Implemented + Roadmap',
    summary:
      'Execution options centralize lock behavior, consistency level, timeout, profiling, caching, monitoring, read replica routing and query tagging for every query surface.',
    bullets: ['NoLock', 'SnapshotRead', 'QueryTag', 'TimeoutSeconds', 'UseReadReplica', 'EnableProfiling'],
    code: `var orders = await db.Set<Order>()
    .Where(x => x.CustomerId == customerId)
    .NoLock()
    .QueryTag("Admin dashboard recent orders")
    .UseReadReplica()
    .ToListAsync(ct);

var sql = db.Set<Order>()
    .Where(x => x.Status == OrderStatus.Paid)
    .ToSql();`
  },
  {
    id: 'streaming-batching',
    title: 'Real Async Streaming and Batch Processing',
    eyebrow: 'Scale',
    status: 'Roadmap',
    summary:
      'Large datasets should stream through SequentialAccess with cancellation and batch callbacks instead of loading millions of rows into memory.',
    bullets: ['StreamAsync', 'SequentialAccess', 'Backpressure', 'Cancellation', 'ProcessInBatchesAsync', 'Low allocation readers'],
    code: `await foreach (var order in db.Set<Order>()
    .Where(x => x.CreatedAt >= from)
    .StreamAsync(ct))
{
    await processor.HandleAsync(order, ct);
}

await db.Set<Order>()
    .Where(x => x.Status == OrderStatus.Pending)
    .ProcessInBatchesAsync(5000, async rows =>
    {
        await reconciliation.ProcessAsync(rows, ct);
    }, ct);`
  },
  {
    id: 'query-monitor',
    title: 'Query Monitor and Observability',
    eyebrow: 'Operations',
    status: 'Roadmap',
    summary:
      'ForgeORM should provide slow query tracking, deadlock metrics, lock wait telemetry, connection pool diagnostics, cache hit ratio and tenant-level metrics.',
    bullets: ['Slow query viewer', 'Query heatmap', 'Deadlocks', 'Connection wait', 'Cache hit/miss', 'OpenTelemetry spans'],
    code: `builder.Services.AddForgeOrm(options =>
{
    options.EnableQueryMonitoring = true;
    options.SlowQueryThreshold = TimeSpan.FromMilliseconds(300);
});

ForgeQueryMonitor.OnSlowQuery += evt =>
{
    logger.LogWarning("Slow ForgeORM query {SqlHash} took {Duration}ms", evt.SqlHash, evt.DurationMs);
};`
  },
  {
    id: 'multi-tenant-sharding',
    title: 'Multi-Tenant, Sharding and Read Replicas',
    eyebrow: 'Cloud Scale',
    status: 'Roadmap',
    summary:
      'Enterprise SaaS systems need tenant filters, tenant connection resolution, shard routing, cross-shard queries, read/write split and replica awareness.',
    bullets: ['Tenant filter', 'Shard resolver', 'UseShard', 'UnionShards', 'Read/write split', 'Tenant-aware cache keys'],
    code: `var rows = await db.Set<Order>()
    .UseShard("EU")
    .Where(x => x.TenantId == tenantId)
    .ToListAsync(ct);

var allRegions = await db.Set<Order>()
    .UseShard("EU")
    .UseShard("US")
    .UnionShards()
    .ToListAsync(ct);`
  },
  {
    id: 'security-governance',
    title: 'Security, Governance and Data Lineage',
    eyebrow: 'Compliance',
    status: 'Roadmap',
    summary:
      'Security features should include SQL injection validation, identifier whitelisting, tenant isolation checks, field encryption, PII classification and lineage graph tracking.',
    bullets: ['SQL validator', 'Identifier whitelist', 'PII masking', 'Tenant isolation', 'Audit logging', 'Lineage graph'],
    code: `builder.Services.AddForgeOrmSecurity(options =>
{
    options.EnableSqlInjectionValidation = true;
    options.EnableIdentifierWhitelist = true;
    options.EnablePiiMasking = true;
});

await db.AuditAsync(new DataAccessAudit
{
    UserId = userId,
    Table = "Orders",
    Purpose = "Customer support investigation"
});`
  }
] as const;
