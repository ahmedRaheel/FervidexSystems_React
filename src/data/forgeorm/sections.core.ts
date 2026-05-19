export const coreSections = [
  {
    id: 'platform-overview',
    title: 'ForgeORM Enterprise Data Platform',
    eyebrow: 'Platform',
    status: 'Implemented + Roadmap',
    summary:
      'ForgeORM is positioned as a high-performance enterprise ORM and data platform: raw SQL speed, expression APIs, QueryAst, ForgeSQL, graph persistence, temporal history, analytics, imports, search, AI and operational tooling.',
    bullets: [
      'Dapper-like raw SQL control',
      'EF-style Db.Set<T>() developer experience',
      'MSIL data-reader materialization direction',
      'Enterprise roadmap clearly documented',
      'Provider-first architecture',
      'Benchmarks versus Dapper and EF Core'
    ],
    code: `builder.Services.AddForgeOrm(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("Default"));
    options.EnableOpenTelemetry = true;
    options.EnableSafeSqlIdentifiers = true;
    options.EnableQueryMonitoring = true;
});

app.MapGet("/orders/{id:int}", async (int id, ForgeDbContext db, CancellationToken ct) =>
{
    var order = await db.QueryFirstOrDefaultAsync<OrderDto>(
        """
        SELECT Id, OrderNo, CustomerId, GrandTotal, CreatedAt
        FROM dbo.Orders
        WHERE Id = @Id
        """,
        new { Id = id },
        cancellationToken: ct);

    return order is null ? Results.NotFound() : Results.Ok(order);
});`
  },
  {
    id: 'installation',
    title: 'Installation and Package Structure',
    eyebrow: 'Getting Started',
    status: 'Implemented',
    summary:
      'Install only what your service needs. The package strategy separates core abstractions, provider implementations, ASP.NET Core integration, analytics, AI, and optional enterprise extensions.',
    bullets: [
      'ForgeORM.Core',
      'ForgeORM.SqlServer',
      'ForgeORM.PostgreSql',
      'ForgeORM.MySql',
      'ForgeORM.Oracle',
      'ForgeORM.AspNetCore'
    ],
    code: `dotnet add package ForgeORM.Core
dotnet add package ForgeORM.SqlServer
dotnet add package ForgeORM.AspNetCore

// Optional enterprise packages
dotnet add package ForgeORM.Analytics
dotnet add package ForgeORM.AI
dotnet add package ForgeORM.VectorSearch
dotnet add package ForgeORM.AdminDashboard`
  },
  {
    id: 'dbcontext',
    title: 'ForgeDbContext and Db.Set<T>()',
    eyebrow: 'Core API',
    status: 'Implemented',
    summary:
      'Use Db.Set<T>() for strongly typed expression queries while keeping the raw SQL surface available for direct control and high-performance scenarios.',
    bullets: ['Where', 'OrderBy / OrderByDescending', 'Skip / Take', 'FirstOrDefault', 'Any / Count', 'Sum / Average / Min / Max'],
    code: `var page = await db.Set<Order>()
    .Where(x => x.CustomerId == customerId)
    .OrderByDescending(x => x.Id)
    .Skip(0)
    .Take(50)
    .ToListAsync(ct);

var exists = await db.Set<Order>()
    .Where(x => x.Status == OrderStatus.Paid)
    .AnyAsync(ct);

var total = await db.Set<Order>()
    .Where(x => x.CustomerId == customerId)
    .SumAsync(x => x.GrandTotal, ct);`
  },
  {
    id: 'query-methods',
    title: 'Query Methods and MSIL Materialization',
    eyebrow: 'Performance',
    status: 'Implemented + Optimizing',
    summary:
      'All typed query methods should run through the same DbDataReader execution pipeline with cached Reflection.Emit materializers and cached parameter writers.',
    bullets: ['QueryAsync', 'QueryFirstOrDefaultAsync', 'QuerySingleOrDefaultAsync', 'ScalarAsync', 'Stored procedures', 'Multiple result sets'],
    code: `var rows = await db.QueryAsync<OrderDto>(
    "SELECT Id, OrderNo, GrandTotal FROM dbo.Orders WHERE CustomerId = @CustomerId",
    new { CustomerId = customerId },
    cancellationToken: ct);

var order = await db.QueryFirstOrDefaultAsync<OrderDto>(
    "SELECT TOP 1 Id, OrderNo, GrandTotal FROM dbo.Orders WHERE Id = @Id",
    new { Id = orderId },
    cancellationToken: ct);

// Internal direction:
// DbDataReader -> cached MSIL deserializer -> T
// ConcurrentDictionary<ShapeKey, Func<DbDataReader,T>>`
  },
  {
    id: 'forge-sql',
    title: 'ForgeSQL Fluent Builder',
    eyebrow: 'SQL Builder',
    status: 'Implemented',
    summary:
      'ForgeSQL gives developers a readable SQL-building API for dynamic filters, joins, grouping, unions, paging, and provider-safe rendering.',
    bullets: ['Select / From', 'Join / Apply', 'WhereIf', 'GroupBy / Having', 'Union / UnionAll', 'Provider rendering'],
    code: `var orders = await ForgeSql.Select<Order>()
    .Columns(x => x.Id, x => x.CustomerId, x => x.OrderNo, x => x.GrandTotal)
    .From("dbo.Orders")
    .Where(x => x.CustomerId == customerId)
    .OrderByDescending(x => x.Id)
    .Skip(0)
    .Take(25)
    .ToListAsync<Order, Order>(db, ct);`
  },
  {
    id: 'query-ast',
    title: 'QueryAst Compiler Core',
    eyebrow: 'Compiler',
    status: 'Implemented + Expanding',
    summary:
      'QueryAst separates query intent from SQL rendering so ForgeORM can support SQL Server, PostgreSQL, MySQL, Oracle and future providers without duplicating query logic.',
    bullets: ['Immutable AST model', 'Provider-specific renderers', 'Safe identifiers', 'Expression visitor', 'Parameter model', 'Testable SQL output'],
    code: `var ast = QueryAst.Select("Orders")
    .Column("Id")
    .Column("OrderNo")
    .Column("GrandTotal")
    .Where(Binary.Eq(Column("CustomerId"), Parameter("CustomerId")))
    .OrderBy(Column("Id"), SortDirection.Desc)
    .Page(skip: 0, take: 25);

var sql = sqlServerRenderer.Render(ast);`
  }
] as const;
