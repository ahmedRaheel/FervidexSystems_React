export const forgeOrmDocSections = [
  {
    id: 'overview',
    title: 'ForgeORM Overview',
    eyebrow: 'Platform',
    summary: 'ForgeORM is an enterprise micro ORM for .NET APIs, reporting workloads, analytics workflows and AI-ready data products.',
    bullets: ['Dapper-style SQL control', 'EF-style Db.Set<T>() convenience', 'QueryAst builder', 'Stored procedures and TVPs', 'Analytics, DataFrame and vector search', 'Graph insert/update/delete'],
    code: `builder.Services.AddForgeOrm(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("Default"));
    options.EnableQueryAnalytics = true;
    options.EnableSafeSqlIdentifiers = true;
    options.EnableOpenTelemetry = true;
});

app.MapGet("/products", async (ForgeDbContext db, CancellationToken ct) =>
{
    var products = await db.QueryAsync<ProductDto>(
        "SELECT Id, Name, Price FROM Products WHERE IsDeleted = 0",
        cancellationToken: ct);

    return Results.Ok(products);
});`
  },
  {
    id: 'installation',
    title: 'Installation and Packages',
    eyebrow: 'Getting Started',
    summary: 'Install only the packages needed for your runtime: core data access, provider package, analytics, AI, vector or ASP.NET Core integration.',
    bullets: ['Core package', 'SQL Server provider', 'Analytics package', 'AI extensions', 'ASP.NET Core integration', 'Multi-target .NET 8 and .NET 10'],
    code: `dotnet add package ForgeORM.Core
dotnet add package ForgeORM.SqlServer
dotnet add package ForgeORM.AspNetCore
dotnet add package ForgeORM.Analytics
dotnet add package ForgeORM.AI
dotnet add package ForgeORM.VectorSearch`
  },
  {
    id: 'dbcontext',
    title: 'ForgeDbContext and Db.Set<T>() Methods',
    eyebrow: 'Core API',
    summary: 'Use ForgeDbContext for raw SQL, commands, transactions and high-level entity operations. Db.Set<T>() gives a familiar typed surface without forcing EF Core.',
    bullets: ['Set<T>()', 'Where', 'OrderBy', 'Skip/Take', 'First/Single', 'Any/Count/Sum/Average/Min/Max'],
    code: `var paidOrders = await db.Set<Order>()
    .Where(x => x.Status == OrderStatus.Paid)
    .OrderByDescending(x => x.Id)
    .Skip(0)
    .Take(20)
    .ToListAsync(ct);

var exists = await db.Set<Order>().AnyAsync(x => x.CustomerId == customerId, ct);
var total = await db.Set<Order>().SumAsync(x => x.GrandTotal, ct);
var count = await db.Set<Order>().CountAsync(x => x.Status == OrderStatus.Processing, ct);
var first = await db.Set<Order>().FirstOrDefaultAsync(x => x.Id == id, ct);`
  },
  {
    id: 'query-apis',
    title: 'Query APIs',
    eyebrow: 'Read Data',
    summary: 'Query APIs cover list results, first/single record behavior, scalar values, dynamic results and multiple result sets.',
    bullets: ['QueryAsync', 'QueryFirstAsync', 'QueryFirstOrDefaultAsync', 'QuerySingleAsync', 'QuerySingleOrDefaultAsync', 'ScalarAsync'],
    code: `var orders = await db.QueryAsync<OrderDto>(sql, new { customerId }, ct);
var order = await db.QueryFirstOrDefaultAsync<OrderDto>(
    "SELECT * FROM Orders WHERE Id = @Id", new { Id = id }, ct);

var total = await db.ScalarAsync<decimal>(
    "SELECT SUM(GrandTotal) FROM Orders WHERE CustomerId = @CustomerId",
    new { CustomerId = customerId }, ct);`
  },
  {
    id: 'commands',
    title: 'Execute, Insert, Update and Delete',
    eyebrow: 'Commands',
    summary: 'Command APIs should be explicit, transaction-aware and clear about affected rows, generated keys and cancellation behavior.',
    bullets: ['ExecuteAsync', 'InsertAsync', 'UpdateAsync', 'DeleteAsync', 'Return identity', 'CancellationToken support'],
    code: `var id = await db.InsertAsync(new Product
{
    Name = "Keyboard",
    Price = 120,
    CreatedAt = DateTime.UtcNow
}, ct);

await db.ExecuteAsync(
    "UPDATE Products SET Price = @Price WHERE Id = @Id",
    new { Id = id, Price = 150 }, ct);

await db.DeleteAsync<Product>(id, ct);`
  },
  {
    id: 'stored-procedures',
    title: 'Stored Procedures',
    eyebrow: 'Database Objects',
    summary: 'ForgeORM should support stored procedures for commands, queries, output parameters, return values and enterprise reporting procedures.',
    bullets: ['Query procedure', 'Execute procedure', 'Output parameters', 'Return values', 'Multiple result sets', 'Provider-specific command type'],
    code: `var rows = await db.QueryProcedureAsync<OrderSummaryDto>(
    "dbo.GetCustomerOrderSummary",
    new
    {
        CustomerId = customerId,
        FromDate = fromDate,
        ToDate = toDate
    }, ct);

var result = await db.ExecuteProcedureAsync("dbo.MarkOrderAsPaid", new
{
    OrderId = orderId,
    PaidAt = DateTimeOffset.UtcNow
}, ct);`
  },
  {
    id: 'table-valued-parameters',
    title: 'Table-Valued Parameters',
    eyebrow: 'SQL Server',
    summary: 'TVPs are essential for high-performance batch input, search filters, bulk procedure calls and graph persistence pipelines.',
    bullets: ['Create user-defined table type', 'Pass DataTable or strongly typed rows', 'Bulk search ids', 'Bulk upsert procedure', 'SQL Server optimized path'],
    code: `-- SQL Server type
CREATE TYPE dbo.OrderLineTvp AS TABLE
(
    ProductId INT NOT NULL,
    Quantity INT NOT NULL,
    UnitPrice DECIMAL(18,2) NOT NULL
);

// C# usage
var tvp = ForgeTvp.Create("dbo.OrderLineTvp", lines)
    .Column(x => x.ProductId)
    .Column(x => x.Quantity)
    .Column(x => x.UnitPrice);

await db.ExecuteProcedureAsync("dbo.CreateOrderWithLines", new
{
    CustomerId = request.CustomerId,
    Lines = tvp
}, ct);`
  },
  {
    id: 'query-builder',
    title: 'Fluent Query Builder',
    eyebrow: 'SQL Builder',
    summary: 'The builder should generate readable SQL while keeping developers close to actual database behavior.',
    bullets: ['Select/From', 'Inner/Left joins', 'Where and optional filters', 'GroupBy/Having', 'Union/UnionAll', 'Pagination'],
    code: `var query = ForgeSql.Select<Order>()
    .From("dbo.Orders o")
    .InnerJoin("dbo.Customers c", "c.Id = o.CustomerId")
    .Columns("o.Id", "o.OrderNo", "c.Name AS CustomerName", "o.GrandTotal")
    .Where("o.IsDeleted = 0")
    .WhereIf(customerId is not null, "o.CustomerId = @CustomerId", new { CustomerId = customerId })
    .GroupBy("o.Id", "o.OrderNo", "c.Name", "o.GrandTotal")
    .Having("SUM(o.GrandTotal) > @MinTotal", new { MinTotal = 1000 })
    .OrderByDescending("o.Id")
    .Skip(0)
    .Take(20)
    .Render();`
  },
  {
    id: 'query-ast',
    title: 'QueryAst Architecture',
    eyebrow: 'Compiler Core',
    summary: 'QueryAst separates query intent from SQL rendering so SQL Server, PostgreSQL, MySQL and Oracle can render provider-specific SQL safely.',
    bullets: ['Immutable query model', 'Provider renderers', 'Safe identifiers', 'Expression visitor', 'SQL parameterization', 'Testable query output'],
    code: `var ast = QueryAst.Select("Orders")
    .Column("Id")
    .Column("OrderNo")
    .Where(Binary.Eq(Column("CustomerId"), Parameter("customerId")))
    .OrderBy(Column("Id"), SortDirection.Desc)
    .Page(skip: 0, take: 20);

var sql = sqlServerRenderer.Render(ast);
var pgSql = postgresRenderer.Render(ast);`
  },
  {
    id: 'cte',
    title: 'CTE and Recursive CTE',
    eyebrow: 'Advanced SQL',
    summary: 'CTEs are needed for reporting, hierarchy traversal, temporary query decomposition and readable enterprise SQL.',
    bullets: ['WITH query', 'Recursive hierarchy', 'Reusable query blocks', 'Provider notes', 'CTE in QueryAst', 'CTE with pagination'],
    code: `var sql = ForgeSql.With("RecentOrders", cte => cte
        .Select("Id", "CustomerId", "GrandTotal")
        .From("Orders")
        .Where("CreatedAt >= @FromDate"))
    .Select("c.Name", "SUM(r.GrandTotal) AS Revenue")
    .From("RecentOrders r")
    .InnerJoin("Customers c", "c.Id = r.CustomerId")
    .GroupBy("c.Name")
    .Render();`
  },
  {
    id: 'pivot',
    title: 'Pivot and Dynamic Pivot',
    eyebrow: 'Reporting',
    summary: 'Pivot support makes ForgeORM useful for dashboard APIs, Excel-style outputs and reporting systems.',
    bullets: ['Static pivot', 'Dynamic pivot', 'Safe column validation', 'Monthly revenue reports', 'Aggregate selection', 'Export to DataFrame'],
    code: `var report = await db.PivotAsync(new ForgePivotRequest
{
    SourceSql = "SELECT Region, FORMAT(OrderDate, 'yyyy-MM') AS MonthKey, GrandTotal FROM Orders",
    RowColumn = "Region",
    PivotColumn = "MonthKey",
    ValueColumn = "GrandTotal",
    Aggregate = ForgeAggregate.Sum,
    AllowedPivotValues = months
}, ct);`
  },
  {
    id: 'temporal-tables',
    title: 'Temporal Tables and History Queries',
    eyebrow: 'Audit',
    summary: 'SQL Server temporal table support helps retrieve old versions, compare changes and build audit/history screens.',
    bullets: ['FOR SYSTEM_TIME AS OF', 'Between dates', 'History compare', 'Audit API', 'Soft delete with temporal', 'Compliance reporting'],
    code: `var oldOrder = await db.QueryFirstOrDefaultAsync<OrderHistoryDto>(
    """
    SELECT *
    FROM dbo.Orders FOR SYSTEM_TIME AS OF @PointInTime
    WHERE Id = @OrderId
    """,
    new { OrderId = id, PointInTime = auditDate }, ct);

var timeline = await db.QueryAsync<OrderHistoryDto>(
    "SELECT * FROM dbo.Orders FOR SYSTEM_TIME BETWEEN @From AND @To WHERE Id = @OrderId",
    new { OrderId = id, From = from, To = to }, ct);`
  },
  {
    id: 'graph-persistence',
    title: 'Graph Insert, Update and Delete',
    eyebrow: 'Object Graphs',
    summary: 'Graph persistence should save parent-child aggregates transactionally and handle inserts, updates and deletes across child lists.',
    bullets: ['Insert parent with children', 'Deep graph insert', 'Update modified children', 'Insert new children', 'Delete missing children', 'Transactional save'],
    code: `var order = new Order
{
    CustomerId = request.CustomerId,
    OrderNo = request.OrderNo,
    Items = request.Items.Select(x => new OrderItem
    {
        ProductId = x.ProductId,
        Quantity = x.Quantity,
        UnitPrice = x.UnitPrice
    }).ToList()
};

await db.GraphInsertAsync(order, options => options
    .Include(x => x.Items)
    .UseTransaction()
    .ReturnGeneratedKeys(), ct);

await db.GraphUpdateAsync(order, options => options
    .Include(x => x.Items)
    .DeleteMissingChildren()
    .MatchChildrenBy(x => x.Id), ct);`
  },
  {
    id: 'bulk',
    title: 'Bulk Insert, Update, Delete and Merge',
    eyebrow: 'Performance',
    summary: 'Bulk APIs should handle high-volume enterprise operations with batching, TVPs, provider-specific optimized paths and transaction support.',
    bullets: ['BulkInsertAsync', 'BulkUpdateAsync', 'BulkDeleteAsync', 'BulkMergeAsync', 'Batch size', 'Column mapping'],
    code: `await db.BulkInsertAsync(products, new ForgeBulkOptions
{
    BatchSize = 5000,
    DestinationTable = "dbo.Products",
    KeepIdentity = false,
    UseInternalTransaction = true
}, ct);

await db.BulkMergeAsync(customers, options => options
    .Into("dbo.Customers")
    .MatchOn(x => x.Email)
    .UpdateWhenMatched()
    .InsertWhenNotMatched(), ct);`
  },
  {
    id: 'split-queries',
    title: 'Split Queries and Multi Mapping',
    eyebrow: 'Relationships',
    summary: 'Split queries avoid cartesian explosion when loading one-to-many and many-to-many object graphs.',
    bullets: ['One-to-one', 'One-to-many', 'Many-to-many', 'Avoid duplicate parent rows', 'DTO shape mapping', 'Multiple result sets'],
    code: `var order = await db.SplitQueryAsync<OrderDto>(new ForgeSplitQuery
{
    ParentSql = "SELECT * FROM Orders WHERE Id = @Id",
    Children =
    [
        Split.Child<OrderItemDto>("Items", "SELECT * FROM OrderItems WHERE OrderId = @Id"),
        Split.Child<PaymentDto>("Payments", "SELECT * FROM Payments WHERE OrderId = @Id")
    ],
    Parameters = new { Id = orderId }
}, ct);`
  },
  {
    id: 'analytics',
    title: 'Query Analytics and Performance Diagnostics',
    eyebrow: 'Observability',
    summary: 'ForgeORM should record timings, parameters, row counts, slow query events and optimization suggestions without leaking secrets.',
    bullets: ['Query timings', 'Slow query detection', 'Row count', 'Parameter sanitization', 'Execution profile', 'OpenTelemetry spans'],
    code: `db.Analytics.OnQueryCompleted += e =>
{
    logger.LogInformation("SQL {Name} took {ElapsedMs}ms and returned {Rows} rows",
        e.OperationName,
        e.Elapsed.TotalMilliseconds,
        e.RowCount);
};

var profile = await db.ProfileAsync<OrderDto>(sql, parameters, ct);
return Results.Ok(new { profile.Elapsed, profile.RowCount, profile.SqlHash });`
  },
  {
    id: 'dataframe',
    title: 'DataFrame Like Pandas',
    eyebrow: 'Analytics',
    summary: 'ForgeDataFrame brings pandas-style data loading, cleaning, grouping, pivoting and export workflows into .NET.',
    bullets: ['Read CSV/JSON', 'Clean dirty data', 'Filter rows', 'GroupBy aggregate', 'Pivot', 'Save to database'],
    code: `var frame = await ForgeDataFrame.ReadCsvAsync(stream, new CsvImportOptions
{
    HasHeader = true,
    TrimValues = true,
    ConvertEmptyToNull = true,
    ContinueOnBadRows = true
});

var monthly = frame
    .Where(row => row.Decimal("Amount") > 0)
    .GroupBy("Region", "Month")
    .Aggregate("Amount", ForgeAggregate.Sum)
    .Pivot(row: "Region", column: "Month", value: "Amount");

await db.SaveDataFrameAsync(monthly, "dbo.MonthlyRevenueSnapshot", ct);`
  },
  {
    id: 'ai',
    title: 'AI Usage and SQL Intelligence',
    eyebrow: 'AI',
    summary: 'AI features should help explain SQL, detect risky patterns, recommend indexes and generate safe query drafts from schema context.',
    bullets: ['Natural language to SQL', 'SQL explanation', 'Index suggestions', 'Security review', 'N+1 detection', 'DataFrame insights'],
    code: `var review = await db.Ai.ReviewQueryAsync(new ForgeAiQueryReviewRequest
{
    Sql = sql,
    Provider = ForgeProvider.SqlServer,
    IncludeSecurityReview = true,
    IncludeIndexAdvice = true,
    IncludeRewriteSuggestions = true
}, ct);

var insight = await db.Ai.AnalyzeDataFrameAsync(monthly, new ForgeAiDataFrameOptions
{
    Goal = "Find revenue anomalies and explain trend changes"
}, ct);`
  },
  {
    id: 'vector-search',
    title: 'Vector Search and RAG',
    eyebrow: 'AI Retrieval',
    summary: 'Vector search enables semantic document lookup, hybrid SQL filters and RAG pipelines for AI applications.',
    bullets: ['Embedding storage', 'Cosine similarity', 'Top K', 'Hybrid SQL + vector', 'Tenant filtering', 'RAG endpoints'],
    code: `var matches = await db.Vector.SearchAsync(new ForgeVectorSearchRequest
{
    Table = "KnowledgeDocuments",
    TextColumn = "Content",
    VectorColumn = "Embedding",
    QueryVector = embedding,
    TopK = 5,
    FilterSql = "TenantId = @TenantId AND IsDeleted = 0",
    Parameters = new { TenantId = tenantId }
}, ct);`
  },
  {
    id: 'transactions',
    title: 'Transactions and Unit of Work',
    eyebrow: 'Consistency',
    summary: 'Every graph, bulk and command operation should work inside explicit transactions for enterprise consistency.',
    bullets: ['BeginTransactionAsync', 'CommitAsync', 'RollbackAsync', 'Use existing transaction', 'Nested operation support', 'Outbox coordination'],
    code: `await using var tx = await db.BeginTransactionAsync(ct);
try
{
    var orderId = await db.InsertAsync(order, ct);
    await db.BulkInsertAsync(items.Select(x => x with { OrderId = orderId }), ct);
    await db.Outbox.EnqueueAsync(new OrderCreated(orderId), ct);
    await tx.CommitAsync(ct);
}
catch
{
    await tx.RollbackAsync(ct);
    throw;
}`
  },
  {
    id: 'minimal-api',
    title: 'Minimal API Endpoints',
    eyebrow: 'ASP.NET Core',
    summary: 'Docs should show full endpoint examples, not isolated snippets, so developers know exactly how to use ForgeORM in real APIs.',
    bullets: ['Separate endpoint files', 'Tags', 'Validation', 'CancellationToken', 'Typed responses', 'Swagger/Scalar friendly'],
    code: `public static class OrderEndpoints
{
    public static IEndpointRouteBuilder MapOrderEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/orders").WithTags("Orders");

        group.MapGet("/{id:int}", async (int id, ForgeDbContext db, CancellationToken ct) =>
        {
            var order = await db.QueryFirstOrDefaultAsync<OrderDto>(
                "SELECT * FROM Orders WHERE Id = @Id", new { Id = id }, ct);

            return order is null ? Results.NotFound() : Results.Ok(order);
        });

        return app;
    }
}`
  }
];

export const forgeOrmDocGroups = [
  ['Start', ['overview', 'installation', 'dbcontext']],
  ['Core Data Access', ['query-apis', 'commands', 'stored-procedures', 'table-valued-parameters']],
  ['Advanced SQL', ['query-builder', 'query-ast', 'cte', 'pivot', 'temporal-tables']],
  ['Enterprise Operations', ['graph-persistence', 'bulk', 'split-queries', 'transactions', 'minimal-api']],
  ['Analytics & AI', ['analytics', 'dataframe', 'ai', 'vector-search']]
];
