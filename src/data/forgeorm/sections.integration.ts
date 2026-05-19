export const integrationSections = [
  {
    id: 'csv-json-import-export',
    title: 'CSV and JSON Import / Export',
    eyebrow: 'Data Integration',
    status: 'Roadmap + Docs Restored',
    summary:
      'Import and export should support files and streams for APIs, ETL jobs, blob storage, migrations, SaaS admin uploads and data exchange with customers.',
    bullets: ['ImportCsvAsync', 'ImportJsonAsync', 'ExportCsvAsync', 'ExportJsonAsync', 'Dry run', 'Validate only'],
    code: `await db.ImportCsvAsync<Product>("products.csv", options =>
{
    options.HasHeader = true;
    options.BatchSize = 5000;
    options.Mode = ForgeImportMode.Upsert;
    options.Key = x => x.Code;
    options.ValidateBeforeWrite = true;
});

await using var stream = upload.OpenReadStream();
await db.ImportJsonAsync<Customer>(stream, options =>
{
    options.Mode = ForgeImportMode.Insert;
    options.DryRun = false;
});

await db.ExportCsvAsync<Order>("paid-orders.csv", q =>
    q.Where(x => x.Status == OrderStatus.Paid));
await db.ExportJsonAsync<Customer>("customers.json");`
  },
  {
    id: 'dataframe',
    title: 'DataFrame Like Pandas',
    eyebrow: 'Analytics',
    status: 'Implemented + Roadmap',
    summary:
      'DataFrame APIs support reporting and analytics workflows: dynamic rows, joins, missing value handling, correlation, time-series and export to CSV/JSON/Parquet.',
    bullets: ['Frame<T>()', 'Join frames', 'Fill nulls', 'Correlation', 'Moving average', 'Export Parquet'],
    code: `var frame = await db.Frame<Order>()
    .Where(x => x.CreatedAt >= from)
    .ToFrameAsync(ct);

var report = frame
    .GroupBy("CustomerId")
    .Sum("GrandTotal")
    .SortByDescending("GrandTotal")
    .Take(20);

await report.ExportCsvAsync("top-customers.csv");`
  },
  {
    id: 'analytics-olap',
    title: 'OLAP, Cubes and Reporting Engine',
    eyebrow: 'Analytics',
    status: 'Roadmap',
    summary:
      'The analytics roadmap includes cubes, dimensions, measures, precomputed aggregates, materialized query cache and dashboard-optimized snapshots.',
    bullets: ['Cube engine', 'Dimensions', 'Measures', 'Precomputed cubes', 'Materialized query cache', 'Dashboard refresh'],
    code: `var cube = await db.Cube<Order>()
    .Dimension(x => x.CustomerId)
    .Dimension(x => x.Status)
    .Measure("Revenue", x => x.Sum(o => o.GrandTotal))
    .BuildAsync(ct);

await db.MaterializeAsync("DailySales", refresh: ForgeRefreshPolicy.Hourly, ct);`
  },
  {
    id: 'search-vector-graph',
    title: 'Search, Vector and Graph Database Features',
    eyebrow: 'AI Ready Data',
    status: 'Roadmap',
    summary:
      'ForgeORM should support built-in full-text search, fuzzy ranking, semantic search, vector embeddings, hybrid RAG search and graph traversal APIs.',
    bullets: ['Full-text index', 'Fuzzy search', 'Embedding storage', 'Cosine similarity', 'Hybrid search', 'Nodes and edges'],
    code: `var products = await db.Search<Product>()
    .FullText("wireless keyboard")
    .Fuzzy()
    .Top(20)
    .ToListAsync(ct);

var matches = await db.Vector<Product>()
    .SearchAsync(queryEmbedding, topK: 10, metric: VectorMetric.Cosine, ct);

var path = await db.Graph()
    .From<Customer>(customerId)
    .Traverse("PLACED_ORDER")
    .ShortestPathTo<Product>(productId)
    .ToListAsync(ct);`
  },
  {
    id: 'ai-features',
    title: 'AI Query Understanding and Optimization',
    eyebrow: 'AI',
    status: 'Roadmap',
    summary:
      'AI features should explain queries, suggest indexes, detect over-fetching, generate APIs, generate CQRS handlers, create reports and understand schema context.',
    bullets: ['Natural language query', 'Index suggestions', 'Bad join detection', 'Schema explanation', 'API generation', 'Report generation'],
    code: `var answer = await db.AI.QueryAsync(
    "Top 10 customers by revenue last month",
    options => options.TenantId = tenantId,
    ct);

var suggestions = await db.AI.OptimizeAsync(
    "SELECT * FROM Orders WHERE CustomerId = @CustomerId ORDER BY CreatedAt DESC");`
  },
  {
    id: 'workflow-jobs-rules',
    title: 'Workflow, Background Jobs and Rule Engine',
    eyebrow: 'Enterprise Apps',
    status: 'Roadmap',
    summary:
      'Enterprise applications often need approval workflows, sagas, retry queues, cron jobs, dynamic business rules and pricing policies near the data layer.',
    bullets: ['Approval workflow', 'Saga orchestration', 'Distributed jobs', 'Retry queues', 'Cron', 'Policy rules'],
    code: `await db.Workflow<OrderApproval>()
    .StartAsync(new OrderApprovalRequest(orderId), ct);

await db.Jobs.EnqueueAsync(new RecalculateCustomerScore(customerId), ct);

var price = await db.Rules()
    .EvaluateAsync<PriceRuleResult>("PricingRules", new { ProductId = id, CustomerTier = tier });`
  }
] as const;
