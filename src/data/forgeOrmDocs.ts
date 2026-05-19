export type ForgeOrmDocSection = {
  id: string;
  title: string;
  eyebrow: string;
  summary: string;
  bullets: string[];
  code: string;
  status?: 'Implemented' | 'In Progress' | 'Enterprise Roadmap';
};

export const forgeOrmDocSections: ForgeOrmDocSection[] = [
  {
    id: 'overview',
    title: 'ForgeORM Enterprise Data Platform',
    eyebrow: 'Corporate overview',
    status: 'Implemented',
    summary: 'ForgeORM combines a Dapper-style execution engine with enterprise ORM capabilities: expression queries, raw SQL, QueryAst, graph persistence, bulk operations, temporal history, analytics, import/export, monitoring, and AI-ready extensions.',
    bullets: ['Micro ORM performance direction', 'Db.Set<T>() expression API', 'Raw SQL and stored procedures', 'Graph and bulk operations', 'Temporal and audit history', 'Analytics and AI roadmap'],
    code: `builder.Services.AddForgeOrm(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("Default"));
    options.EnableOpenTelemetry = true;
    options.EnableQueryMonitoring = true;
    options.EnableSafeSqlIdentifiers = true;
});

app.MapGet("/orders/{id:int}", async (int id, ForgeDbContext db, CancellationToken ct) =>
{
    var order = await db.QueryFirstOrDefaultAsync<OrderDto>(
        "SELECT Id, OrderNo, CustomerId, GrandTotal FROM dbo.Orders WHERE Id = @Id",
        new { Id = id },
        cancellationToken: ct);

    return order is null ? Results.NotFound() : Results.Ok(order);
});`
  },
  {
    id: 'installation',
    title: 'Installation and Package Structure',
    eyebrow: 'Getting started',
    status: 'Implemented',
    summary: 'Keep the core runtime small and add provider-specific packages only when needed. The documentation presents ForgeORM like a professional product, not a single demo library.',
    bullets: ['ForgeORM.Core', 'ForgeORM.SqlServer', 'ForgeORM.PostgreSql', 'ForgeORM.MySql', 'ForgeORM.Oracle', 'ForgeORM.AspNetCore'],
    code: `dotnet add package ForgeORM.Core
dotnet add package ForgeORM.SqlServer
dotnet add package ForgeORM.AspNetCore

// Optional enterprise packages
dotnet add package ForgeORM.Analytics
dotnet add package ForgeORM.AI
dotnet add package ForgeORM.VectorSearch`
  },
  {
    id: 'execution-engine',
    title: 'High Performance Execution Engine',
    eyebrow: 'Performance',
    status: 'In Progress',
    summary: 'The core execution path is documented around DbDataReader, cached query plans, Reflection.Emit/MSIL materializers, cached parameter writers, and ConcurrentDictionary caches.',
    bullets: ['DbDataReader direct mapping', 'Reflection.Emit MSIL deserializers', 'ConcurrentDictionary plan caches', 'Cached parameter binding', 'Single-row methods avoid List<T>', 'SequentialAccess reader mode'],
    code: `var order = await db.QueryFirstOrDefaultAsync<OrderDto>(
    "SELECT Id, OrderNo, GrandTotal FROM dbo.Orders WHERE Id = @Id",
    new { Id = orderId },
    cancellationToken: ct);

// Internally:
// SQL + result shape -> cached MSIL materializer
// parameter type -> cached parameter writer
// reader -> DTO directly, without reflection per row`
  },
  {
    id: 'dbset',
    title: 'Db.Set<T>() Expression Queries',
    eyebrow: 'Expression API',
    status: 'Implemented',
    summary: 'Use familiar expression syntax for application queries while keeping SQL generation visible and controlled.',
    bullets: ['Where', 'OrderBy / OrderByDescending', 'Skip / Take', 'FirstOrDefault', 'Any / Count', 'Sum / Average / Min / Max'],
    code: `var page = await db.Set<Order>()
    .Where(x => x.CustomerId == customerId)
    .OrderByDescending(x => x.Id)
    .Skip(0)
    .Take(50)
    .ToListAsync(ct);

var total = await db.Set<Order>()
    .Where(x => x.CustomerId == customerId)
    .SumAsync(x => x.GrandTotal, ct);`
  },
  {
    id: 'include-split-query',
    title: 'Include with Split Query Loading',
    eyebrow: 'Relationships',
    status: 'Implemented',
    summary: 'Child and reference navigation loading is explicit. Parent-only queries stay fast, and Include triggers split queries only for selected navigations.',
    bullets: ['Include collection navigation', 'Include reference navigation', 'Parent-only default', 'One-to-many split query', 'One-to-one/reference split query', 'Avoids accidental SELECT navigation columns'],
    code: `var order = await db.Set<Order>()
    .Where(x => x.Id == orderId)
    .Include(x => x.Customer)
    .Include(x => x.Items)
    .FirstOrDefaultAsync(ct);

// Parent query selects scalar columns only.
// Child query loads Items WHERE OrderId IN (...).
// Reference query loads Customer WHERE Id = @CustomerId.`
  },
  {
    id: 'raw-sql',
    title: 'Raw SQL Query Methods',
    eyebrow: 'Dapper-style control',
    status: 'Implemented',
    summary: 'Raw SQL APIs provide direct control for developers who want Dapper-like performance and predictable SQL.',
    bullets: ['QueryAsync', 'QueryFirstAsync', 'QueryFirstOrDefaultAsync', 'QuerySingleAsync', 'QuerySingleOrDefaultAsync', 'ScalarAsync'],
    code: `var orders = await db.QueryAsync<OrderDto>(
    """
    SELECT Id, OrderNo, CustomerId, GrandTotal
    FROM dbo.Orders
    WHERE CustomerId = @CustomerId
    ORDER BY Id DESC
    """,
    new { CustomerId = customerId },
    cancellationToken: ct);

var count = await db.ScalarAsync<int>(
    "SELECT COUNT(1) FROM dbo.Orders WHERE CustomerId = @CustomerId",
    new { CustomerId = customerId }, ct);`
  },
  {
    id: 'stored-procedures',
    title: 'Stored Procedures and Functions',
    eyebrow: 'Database objects',
    status: 'Implemented',
    summary: 'Stored procedure APIs are documented for read models, reporting, commands, output parameters, and enterprise database contracts.',
    bullets: ['QueryProcedureAsync', 'ExecuteProcedureAsync', 'Output parameters', 'Return values', 'Multiple result sets', 'Command timeout'],
    code: `var summary = await db.QueryProcedureAsync<OrderSummaryDto>(
    "dbo.GetCustomerOrderSummary",
    new
    {
        CustomerId = customerId,
        FromDate = fromDate,
        ToDate = toDate
    },
    cancellationToken: ct);

await db.ExecuteProcedureAsync("dbo.MarkOrderPaid", new
{
    OrderId = orderId,
    PaidAt = DateTimeOffset.UtcNow
}, ct);`
  },
  {
    id: 'tvp',
    title: 'Table-Valued Parameters',
    eyebrow: 'SQL Server',
    status: 'Implemented',
    summary: 'TVP examples are included for batch filters, stored procedures, search screens, and bulk order creation.',
    bullets: ['Strongly typed TVP builder', 'DataTable support', 'Bulk filters', 'Procedure input', 'Graph persistence', 'SQL Server optimized'],
    code: `CREATE TYPE dbo.OrderLineTvp AS TABLE
(
    ProductId INT NOT NULL,
    Quantity INT NOT NULL,
    UnitPrice DECIMAL(18,2) NOT NULL
);

var lines = ForgeTvp.Create("dbo.OrderLineTvp", request.Items)
    .Column(x => x.ProductId)
    .Column(x => x.Quantity)
    .Column(x => x.UnitPrice);

await db.ExecuteProcedureAsync("dbo.CreateOrder", new { request.CustomerId, Lines = lines }, ct);`
  },
  {
    id: 'forge-sql',
    title: 'ForgeSQL Fluent Builder',
    eyebrow: 'SQL builder',
    status: 'Implemented',
    summary: 'ForgeSQL is documented as a fluent builder for readable SQL generation with joins, unions, group by, having, pagination, and provider rendering.',
    bullets: ['Columns', 'Joins and APPLY', 'WhereIf', 'GroupBy and Having', 'Union / UnionAll', 'Provider rendering'],
    code: `var rows = await ForgeSql.Select<Order>()
    .Columns(x => x.Id, x => x.CustomerId, x => x.OrderNo, x => x.GrandTotal)
    .From("dbo.Orders")
    .Where(x => x.CustomerId == customerId)
    .OrderByDescending(x => x.Id)
    .Skip(0)
    .Take(20)
    .ToListAsync<Order, Order>(_db);`
  },
  {
    id: 'query-ast',
    title: 'QueryAst Compiler Model',
    eyebrow: 'Provider compiler',
    status: 'Implemented',
    summary: 'QueryAst keeps query intent separate from provider-specific rendering. It enables safe SQL generation across SQL Server, PostgreSQL, MySQL, and Oracle.',
    bullets: ['Provider-independent AST', 'Safe identifiers', 'Expression visitor', 'Parameterization', 'Renderer tests', 'Optimization hooks'],
    code: `var ast = QueryAst.Select("Orders")
    .Column("Id")
    .Column("OrderNo")
    .Where(Binary.Eq(Column("CustomerId"), Parameter("customerId")))
    .OrderBy(Column("Id"), SortDirection.Desc)
    .Page(skip: 0, take: 20);

var sqlServerSql = sqlServerRenderer.Render(ast);
var postgresSql = postgresRenderer.Render(ast);`
  },
  {
    id: 'cte-subquery',
    title: 'CTE, Recursive CTE and Subqueries',
    eyebrow: 'Advanced SQL',
    status: 'In Progress',
    summary: 'Complex query sections cover CTE, recursive CTE, EXISTS/NOT EXISTS, correlated subqueries, APPLY/lateral joins, and CASE expressions.',
    bullets: ['Recursive CTE', 'Exists / NotExists', 'Correlated subqueries', 'Cross Apply / Outer Apply', 'Case / When', 'Dynamic projection'],
    code: `var highValueCustomers = ForgeSql
    .With("CustomerRevenue", cte => cte
        .Select("CustomerId", "SUM(GrandTotal) AS Revenue")
        .From("dbo.Orders")
        .GroupBy("CustomerId"))
    .Select("c.Id", "c.Name", "r.Revenue")
    .From("dbo.Customers c")
    .InnerJoin("CustomerRevenue r", "r.CustomerId = c.Id")
    .Where("r.Revenue > @MinRevenue", new { MinRevenue = 10000 })
    .Render();`
  },
  {
    id: 'temporal',
    title: 'Temporal Table Support',
    eyebrow: 'Audit and history',
    status: 'Implemented',
    summary: 'Temporal table examples are included for point-in-time reads, history timelines, date ranges, and enabling system-versioned tables.',
    bullets: ['TemporalAll', 'TemporalAsOf', 'TemporalBetween', 'TemporalContainedIn', 'History table SQL', 'Point-in-time restore roadmap'],
    code: `var oldOrder = await db.Set<Order>()
    .TemporalAsOf(auditTime)
    .Where(x => x.Id == orderId)
    .FirstOrDefaultAsync(ct);

var history = await ForgeSql.Select<Order>()
    .TemporalBetween(from, to)
    .From("dbo.Orders")
    .Where(x => x.Id == orderId)
    .ToListAsync<Order, Order>(db);`
  },
  {
    id: 'graph',
    title: 'Graph Insert, Update and Delete',
    eyebrow: 'Aggregate persistence',
    status: 'Implemented',
    summary: 'Graph persistence shows how ForgeORM handles parent-child aggregates transactionally without treating navigation properties as database columns.',
    bullets: ['GraphInsertAsync', 'GraphUpdateAsync', 'GraphDeleteAsync', 'Generated key propagation', 'Delete missing children', 'Scalar-only SQL columns'],
    code: `var order = new Order
{
    CustomerId = customerId,
    OrderNo = "ORD-1001",
    Items = request.Items.Select(x => new OrderItem
    {
        ProductId = x.ProductId,
        Quantity = x.Quantity,
        UnitPrice = x.UnitPrice
    }).ToList()
};

await db.GraphInsertAsync(order, cfg => cfg
    .Include(x => x.Items)
    .UseTransaction()
    .ReturnGeneratedKeys(), ct);

await db.GraphDeleteAsync<Order>(order.Id, cfg => cfg
    .Include(x => x.Items)
    .DeleteChildrenFirst(), ct);`
  },
  {
    id: 'bulk-sync',
    title: 'Bulk Insert, Update, Delete, Merge and Sync',
    eyebrow: 'High volume writes',
    status: 'In Progress',
    summary: 'Bulk sections cover batching, TVPs, MERGE, provider-specific COPY/ON CONFLICT support, and SyncAsync for source-of-truth operations.',
    bullets: ['BulkInsertAsync', 'BulkUpdateAsync', 'BulkDeleteAsync', 'BulkMergeAsync', 'SyncAsync', 'Batch size and transactions'],
    code: `await db.SyncAsync<Product>(products,
    key: x => x.Code,
    options =>
    {
        options.InsertMissing = true;
        options.UpdateExisting = true;
        options.DeleteMissing = false;
        options.BatchSize = 5000;
    }, ct);`
  },
  {
    id: 'import-export',
    title: 'Import from CSV / JSON and Export Data',
    eyebrow: 'Data integration',
    status: 'Enterprise Roadmap',
    summary: 'Import/export was restored as a first-class documentation area: CSV, JSON, validation, dry-run, upsert, and export scenarios.',
    bullets: ['ImportCsvAsync', 'ImportJsonAsync', 'ExportCsvAsync', 'ExportJsonAsync', 'DryRun / ValidateOnly', 'Upsert from file'],
    code: `await db.ImportCsvAsync<Product>("products.csv", options =>
{
    options.HasHeader = true;
    options.BatchSize = 5000;
    options.ValidateBeforeInsert = true;
    options.Mode = ForgeImportMode.Upsert;
    options.Key = x => x.Code;
}, ct);

await db.ImportJsonAsync<Customer>("customers.json", options =>
{
    options.Mode = ForgeImportMode.Insert;
    options.DryRun = false;
}, ct);

await db.ExportCsvAsync<Order>("paid-orders.csv",
    query => query.Where(x => x.Status == OrderStatus.Paid), ct);`
  },
  {
    id: 'paging-streaming',
    title: 'Keyset Paging, Streaming and Batch Processing',
    eyebrow: 'Million-record support',
    status: 'In Progress',
    summary: 'The docs show OFFSET paging for small screens and keyset/streaming/batch APIs for millions of rows.',
    bullets: ['Keyset paging', 'StreamAsync', 'ProcessInBatchesAsync', 'SequentialAccess', 'Backpressure', 'Cancellation'],
    code: `await foreach (var row in db.Set<Order>()
    .Where(x => x.Id > lastId)
    .OrderBy(x => x.Id)
    .StreamAsync(ct))
{
    await processor.HandleAsync(row, ct);
}

await db.Set<Order>().ProcessInBatchesAsync(
    batchSize: 5000,
    processor: async rows => await archive.SaveAsync(rows, ct),
    cancellationToken: ct);`
  },
  {
    id: 'execution-options',
    title: 'Execution Options, Locking and Consistency',
    eyebrow: 'Enterprise controls',
    status: 'In Progress',
    summary: 'Execution options unify lock hints, consistency, timeout, caching, monitoring, read replicas, and query tags across query types.',
    bullets: ['NoLock', 'SnapshotRead', 'TimeoutSeconds', 'QueryTag', 'UseReadReplica', 'Monitoring/profiling'],
    code: `var products = await db.Set<Product>()
    .NoLock()
    .QueryTag("Catalog dashboard")
    .UseReadReplica()
    .Where(x => x.IsActive)
    .ToListAsync(ct);

var sql = db.Set<Product>()
    .WithReadConsistency(ForgeReadConsistency.Snapshot)
    .ToSql();`
  },
  {
    id: 'query-monitor',
    title: 'Query Monitor and Observability',
    eyebrow: 'Operations',
    status: 'In Progress',
    summary: 'The corporate documentation includes operational features: slow query viewer, deadlock tracking, lock waits, OpenTelemetry spans, query hash, and tenant metrics.',
    bullets: ['Slow query log', 'Deadlock tracking', 'Connection pool diagnostics', 'OpenTelemetry spans', 'Tenant tags', 'Cache hit/miss'],
    code: `builder.Services.AddForgeOrm(options =>
{
    options.EnableMonitoring = true;
    options.SlowQueryThreshold = TimeSpan.FromMilliseconds(250);
});

ForgeQueryMonitor.OnSlowQuery += entry =>
{
    logger.LogWarning("Slow SQL {Hash} took {Elapsed}ms", entry.SqlHash, entry.ElapsedMs);
};`
  },
  {
    id: 'dataframe',
    title: 'DataFrame like pandas',
    eyebrow: 'Analytics',
    status: 'Enterprise Roadmap',
    summary: 'DataFrame docs cover table-like analytics, joins, fill nulls, duplicate removal, moving averages, correlation, and Parquet/CSV export.',
    bullets: ['Frame<T>()', 'Join / Merge', 'FillNull', 'Correlation matrix', 'Moving average', 'Export Parquet / CSV'],
    code: `var sales = await db.Frame<Order>()
    .Where(x => x.OrderDate >= from)
    .GroupBy(x => x.CustomerId)
    .Aggregate(g => new
    {
        Revenue = g.Sum(x => x.GrandTotal),
        Orders = g.Count()
    })
    .ToFrameAsync(ct);

await sales.FillNull(0).ExportParquetAsync("sales.parquet", ct);`
  },
  {
    id: 'olap',
    title: 'OLAP Cubes and Columnar Analytics',
    eyebrow: 'Analytics roadmap',
    status: 'Enterprise Roadmap',
    summary: 'The roadmap includes a real OLAP engine with dimensions, measures, precomputed cubes, SIMD aggregation, and columnar scans.',
    bullets: ['Dimensions and measures', 'Precomputed cubes', 'Columnar layout', 'SIMD filtering', 'Vectorized joins', 'Dashboard cache'],
    code: `var cube = await db.Cube<Order>()
    .Dimension(x => x.CustomerId)
    .Dimension(x => x.OrderDate.Month)
    .Measure("Revenue", x => x.Sum(o => o.GrandTotal))
    .MaterializeAsync("MonthlyCustomerRevenue", ct);`
  },
  {
    id: 'ai',
    title: 'AI Query Understanding and Optimization',
    eyebrow: 'AI native',
    status: 'Enterprise Roadmap',
    summary: 'AI sections are documented as roadmap features: natural-language query generation, optimization suggestions, missing indexes, and schema understanding.',
    bullets: ['AI query generation', 'Index recommendations', 'Bad join detection', 'API/DTO generation', 'ERD generation', 'Report generation'],
    code: `var result = await db.AI.QueryAsync(
    "Top 10 customers by revenue last month",
    options =>
    {
        options.ExplainSql = true;
        options.ValidateIdentifiers = true;
        options.TenantId = tenantId;
    }, ct);`
  },
  {
    id: 'vector-search',
    title: 'Vector Search and RAG Support',
    eyebrow: 'AI data',
    status: 'Enterprise Roadmap',
    summary: 'Vector docs include embedding storage, cosine similarity, ANN search, hybrid search, semantic filters, and RAG integration.',
    bullets: ['Embedding storage', 'Cosine similarity', 'ANN search', 'Hybrid keyword + vector', 'RAG context retrieval', 'Tenant filtered vectors'],
    code: `var matches = await db.Vector<Product>()
    .SearchAsync(new ForgeVectorSearchRequest
    {
        VectorColumn = "Embedding",
        QueryVector = embedding,
        TopK = 10,
        FilterSql = "TenantId = @TenantId AND IsDeleted = 0",
        Parameters = new { TenantId = tenantId }
    }, ct);`
  },
  {
    id: 'search-engine',
    title: 'Built-in Full Text and Semantic Search',
    eyebrow: 'Search',
    status: 'Enterprise Roadmap',
    summary: 'The documentation now preserves search-engine features: tokenization, ranking, fuzzy search, full-text indexing, semantic search, and hybrid retrieval.',
    bullets: ['Full-text index', 'Tokenization', 'Ranking', 'Fuzzy search', 'Semantic search', 'Hybrid search'],
    code: `var products = await db.Search<Product>()
    .Text("wireless keyboard")
    .Fuzzy(distance: 2)
    .RankBy(ForgeSearchRank.Bm25)
    .Take(20)
    .ToListAsync(ct);`
  },
  {
    id: 'graph-database',
    title: 'Graph Database Features',
    eyebrow: 'Graph analytics',
    status: 'Enterprise Roadmap',
    summary: 'Graph database support is retained in the roadmap: nodes, edges, traversal, shortest path, and graph analytics.',
    bullets: ['Nodes and edges', 'Traversal', 'Shortest path', 'Graph analytics', 'Relationship queries', 'Fraud/network scenarios'],
    code: `var path = await db.Graph()
    .From<Customer>(customerId)
    .Traverse<Order>("PLACED")
    .Traverse<Product>("CONTAINS")
    .ShortestPathTo<Product>(targetProductId)
    .ExecuteAsync(ct);`
  },
  {
    id: 'workflow-jobs-rules',
    title: 'Workflow, Background Jobs and Rule Engine',
    eyebrow: 'Enterprise platform',
    status: 'Enterprise Roadmap',
    summary: 'Workflow, jobs, and rules are documented as future platform capabilities for approvals, sagas, retry queues, cron jobs, and policy evaluation.',
    bullets: ['Approval workflows', 'State machines', 'Saga orchestration', 'Distributed jobs', 'Cron and priority queues', 'Dynamic business rules'],
    code: `await db.Workflow("OrderApproval")
    .StartAsync(new OrderApprovalContext
    {
        OrderId = order.Id,
        RequestedBy = userId,
        Amount = order.GrandTotal
    }, ct);

var price = await db.Rules()
    .EvaluateAsync<PriceResult>("EnterpriseDiscountPolicy", order, ct);`
  },
  {
    id: 'sync-cdc-realtime',
    title: 'CDC, Synchronization and Real-time Subscriptions',
    eyebrow: 'Integration',
    status: 'Enterprise Roadmap',
    summary: 'Data synchronization sections cover CDC, incremental sync, offline sync, conflict resolution, live queries, SignalR, and change feeds.',
    bullets: ['CDC', 'Replication', 'Offline sync', 'Conflict resolution', 'Live queries', 'SignalR change feeds'],
    code: `await db.SyncEngine()
    .FromTable<Order>()
    .UseChangeTracking()
    .PushToReplica("ReportingDb")
    .ResolveConflicts(ForgeConflictPolicy.SourceWins)
    .RunAsync(ct);

await foreach (var change in db.Set<Order>().SubscribeAsync(ct))
{
    await hub.Clients.All.SendAsync("orderChanged", change, ct);
}`
  },
  {
    id: 'distributed-systems',
    title: 'Distributed Systems and Sharding',
    eyebrow: 'Cloud native',
    status: 'Enterprise Roadmap',
    summary: 'Enterprise distributed features are retained: shard routing, read/write split, distributed locks, leader election, circuit breakers, and service discovery.',
    bullets: ['Shard routing', 'Cross-shard queries', 'Read/write split', 'Distributed locks', 'Leader election', 'Circuit breakers'],
    code: `var orders = await db.Set<Order>()
    .UseShard("EU")
    .UnionShard("US")
    .UseReadReplica()
    .Where(x => x.CreatedAt >= from)
    .ToListAsync(ct);

await using var lease = await db.DistributedLock.AcquireAsync("nightly-sync", ct);`
  },
  {
    id: 'security-governance',
    title: 'Security, Governance and Data Lineage',
    eyebrow: 'Compliance',
    status: 'Enterprise Roadmap',
    summary: 'Security and governance docs cover SQL injection validation, whitelists, tenant isolation, PII classification, masking, audit logging, and lineage graphs.',
    bullets: ['SQL injection validator', 'Identifier whitelist', 'Tenant isolation checks', 'PII masking', 'Lineage graph', 'Compliance audit'],
    code: `builder.Services.AddForgeOrmSecurity(options =>
{
    options.RequireIdentifierWhitelist = true;
    options.EnableTenantIsolationValidation = true;
    options.MaskPiiColumns = true;
});

await db.Lineage.RecordAccessAsync("Orders", userId, ForgeAccessType.Read, ct);`
  },
  {
    id: 'migrations',
    title: 'Migrations and Schema Management',
    eyebrow: 'Schema lifecycle',
    status: 'Enterprise Roadmap',
    summary: 'Migration docs include schema diff, rollback, zero-downtime migration, online index rebuild, data migration plans, and create/alter table from entity.',
    bullets: ['Schema diff', 'Rollback scripts', 'Zero downtime', 'Online index rebuild', 'Seed data', 'Version history table'],
    code: `var plan = await db.Schema
    .DiffAsync(from: "Production", to: typeof(Order).Assembly, ct);

await db.Schema.ApplyMigrationAsync(plan, options =>
{
    options.GenerateRollback = true;
    options.UseOnlineIndexRebuild = true;
}, ct);`
  },
  {
    id: 'admin-studio',
    title: 'Admin Dashboard and Visual Studio',
    eyebrow: 'Commercial platform',
    status: 'Enterprise Roadmap',
    summary: 'The website now positions ForgeORM as part of a corporate platform with monitoring, designer, ERD, migration dashboard, report builder, and AI agents.',
    bullets: ['Query monitor', 'Slow query viewer', 'ERD designer', 'Migration dashboard', 'Report builder', 'AI coding agents'],
    code: `builder.Services.AddForgeOrmStudio(options =>
{
    options.EnableQueryMonitor = true;
    options.EnableMigrationDashboard = true;
    options.EnableReportDesigner = true;
    options.EnableAiAgents = true;
});`
  }
];

export const forgeOrmDocGroups: [string, string[]][] = [
  ['Start', ['overview', 'installation', 'execution-engine']],
  ['Core APIs', ['dbset', 'include-split-query', 'raw-sql', 'stored-procedures', 'tvp']],
  ['Query Power', ['forge-sql', 'query-ast', 'cte-subquery', 'temporal']],
  ['Writes', ['graph', 'bulk-sync', 'import-export']],
  ['Scale', ['paging-streaming', 'execution-options', 'query-monitor']],
  ['Analytics & AI', ['dataframe', 'olap', 'ai', 'vector-search', 'search-engine']],
  ['Enterprise Roadmap', ['graph-database', 'workflow-jobs-rules', 'sync-cdc-realtime', 'distributed-systems', 'security-governance', 'migrations', 'admin-studio']]
];
