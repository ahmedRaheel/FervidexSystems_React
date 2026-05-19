export const operationSections = [
  {
    id: 'crud-commands',
    title: 'Insert, Update, Delete and Execute',
    eyebrow: 'Commands',
    status: 'Implemented + Optimizing',
    summary:
      'Command APIs should use cached scalar property plans, ignore navigation properties, normalize DateTime values, store enum values as numeric columns, and return generated keys safely.',
    bullets: ['InsertAsync', 'InsertFastAsync direction', 'UpdateAsync', 'DeleteAsync', 'ExecuteAsync', 'Generated identity assignment'],
    code: `var id = await db.InsertAsync(new Order
{
    CustomerId = customerId,
    OrderNo = "ORD-1001",
    Status = OrderStatus.Processing,
    GrandTotal = 3200,
    CreatedAt = DateTime.UtcNow
}, ct);

await db.UpdateAsync(order, ct);
await db.DeleteAsync<Order>(id, ct);`
  },
  {
    id: 'graph-persistence',
    title: 'Graph Insert, Update and Delete',
    eyebrow: 'Object Graphs',
    status: 'Implemented + Hardening',
    summary:
      'Graph operations persist aggregate roots and child collections transactionally. SQL generation must use scalar non-identity columns and treat List<T> and class properties as relationships, not columns.',
    bullets: ['Parent identity returned', 'Child FK propagation', 'Insert children', 'Update children', 'Delete missing children', 'Transaction-safe graph operations'],
    code: `var order = new Order
{
    CustomerId = customerId,
    OrderNo = "ORD-GRAPH-001",
    Items =
    [
        new OrderItem { ProductId = 10, Quantity = 2, UnitPrice = 150 },
        new OrderItem { ProductId = 11, Quantity = 1, UnitPrice = 300 }
    ]
};

await db.InsertGraphAsync(order, ct);
await db.UpdateGraphAsync(order, ct);
await db.DeleteGraphAsync<Order>(order.Id, ct);

// Navigations are never emitted as SQL columns:
// Order.Customer and Order.Items are graph relationships only.`
  },
  {
    id: 'include-split-query',
    title: 'Include Split Query for Navigations',
    eyebrow: 'Mapping',
    status: 'Implemented',
    summary:
      'Navigation loading should be explicit through Include expressions. Parent-only queries stay fast; child/reference loading runs only when requested and uses split queries.',
    bullets: ['Include collection', 'Include reference', 'Split query', 'Parent-only default', 'One-to-one mapping', 'One-to-many mapping'],
    code: `var order = await db.Set<Order>()
    .Where(x => x.Id == id)
    .Include(x => x.Customer)
    .Include(x => x.Items)
    .FirstOrDefaultAsync(ct);

// Without Include, ForgeORM reads only scalar parent columns.
var parentOnly = await db.Set<Order>()
    .Where(x => x.Id == id)
    .FirstOrDefaultAsync(ct);`
  },
  {
    id: 'bulk-operations',
    title: 'Bulk Insert, Update, Delete and Sync',
    eyebrow: 'Bulk',
    status: 'Implemented + Roadmap',
    summary:
      'Bulk APIs are required for enterprise imports, integrations, pricing updates and nightly synchronization. Provider implementations should use TVP, SqlBulkCopy, COPY, MERGE or provider-native paths.',
    bullets: ['BulkInsertAsync', 'BulkUpdateAsync', 'BulkDeleteAsync', 'BulkSyncAsync', 'TVP/MERGE', 'COPY/ON CONFLICT'],
    code: `await db.BulkInsertAsync(products, options =>
{
    options.BatchSize = 5000;
    options.UseProviderNativePath = true;
}, ct);

await db.SyncAsync<Product>(rows, key: x => x.Code, options =>
{
    options.InsertMissing = true;
    options.UpdateExisting = true;
    options.DeleteMissing = false;
});`
  },
  {
    id: 'stored-procedures',
    title: 'Stored Procedures and Multiple Result Sets',
    eyebrow: 'Database Objects',
    status: 'Implemented',
    summary:
      'Stored procedures remain important in enterprise systems for reports, TVP-driven writes, output parameters, approval flows and legacy integrations.',
    bullets: ['Query procedure', 'Execute procedure', 'Output parameters', 'Return values', 'Multiple grids', 'Command timeout'],
    code: `var report = await db.QueryProcedureAsync<OrderSummaryDto>(
    "dbo.GetCustomerOrderSummary",
    new { CustomerId = customerId, FromDate = from, ToDate = to },
    cancellationToken: ct);

await using var grid = await db.QueryMultipleAsync("dbo.GetDashboard", new { TenantId = tenantId }, ct);
var orders = await grid.ReadAsync<OrderDto>();
var totals = await grid.ReadFirstOrDefaultAsync<DashboardTotals>();`
  },
  {
    id: 'table-valued-parameters',
    title: 'Table-Valued Parameters',
    eyebrow: 'SQL Server',
    status: 'Implemented',
    summary:
      'TVPs provide high-throughput SQL Server input for batch filters, bulk upserts, graph writes and stored procedures.',
    bullets: ['Strongly typed rows', 'DataTable adapter', 'Bulk search ids', 'Bulk upsert procedure', 'Graph write support', 'SQL Server optimized path'],
    code: `CREATE TYPE dbo.OrderLineTvp AS TABLE
(
    ProductId INT NOT NULL,
    Quantity INT NOT NULL,
    UnitPrice DECIMAL(18,2) NOT NULL
);

var tvp = ForgeTvp.Create("dbo.OrderLineTvp", lines)
    .Column(x => x.ProductId)
    .Column(x => x.Quantity)
    .Column(x => x.UnitPrice);

await db.ExecuteProcedureAsync("dbo.CreateOrderWithLines", new { CustomerId = id, Lines = tvp }, ct);`
  },
  {
    id: 'transactions-reliability',
    title: 'Transactions, Retry and Reliability Policies',
    eyebrow: 'Production',
    status: 'Roadmap',
    summary:
      'Production hardening includes retry policies, deadlock retry, timeout policy, circuit breakers, isolation helpers, idempotency and outbox/inbox patterns.',
    bullets: ['Retry policy', 'Deadlock retry', 'Circuit breaker', 'Timeouts', 'Snapshot transactions', 'Outbox/inbox'],
    code: `await db.ExecuteInTransactionAsync(async tx =>
{
    await db.InsertGraphAsync(order, tx, ct);
    await db.SaveOutboxAsync(new OrderCreatedEvent(order.Id), tx, ct);
}, options =>
{
    options.IsolationLevel = IsolationLevel.Snapshot;
    options.RetryDeadlocks = true;
    options.TimeoutSeconds = 30;
});`
  }
] as const;
