export const performanceSections = [
  {
    id: 'performance-engine',
    title: 'Performance Engine: DataReader, MSIL and Caches',
    eyebrow: 'Performance',
    status: 'Implemented + Optimizing',
    summary:
      'The performance engine should use a universal DataReader pipeline, cached MSIL deserializers, cached parameter writers and ConcurrentDictionary caches across every typed query method.',
    bullets: ['DbDataReader everywhere', 'Reflection.Emit materializers', 'Cached parameter writers', 'No list allocation for single rows', 'SequentialAccess', 'ConcurrentDictionary caches'],
    code: `// Internal direction for every query API:
// 1. Create command
// 2. Bind parameters through cached writer
// 3. Execute DbDataReader
// 4. Materialize through cached MSIL deserializer
// 5. Return typed result

var order = await db.QueryFirstOrDefaultAsync<OrderDto>(
    BenchmarkSql.QueryById,
    new { Id = id },
    cancellationToken: ct);`
  },
  {
    id: 'compiled-query-cache',
    title: 'Compiled Query Cache and Query Plan Analysis',
    eyebrow: 'Performance',
    status: 'Roadmap',
    summary:
      'Compiled queries cache generated SQL, parameter extraction, materializer plans and execution metadata. Explain APIs expose index scans, missing indexes and expensive operations.',
    bullets: ['Compiled SQL', 'Parameter map', 'Materializer plan', 'ExplainAsync', 'Missing index hints', 'Parameter sniffing protection'],
    code: `var compiled = db.CompiledQuery<OrderDto>("HighValueOrders")
    .Sql("""
        SELECT Id, OrderNo, GrandTotal
        FROM dbo.Orders
        WHERE GrandTotal > @MinTotal
        ORDER BY Id DESC
        """);

var rows = await compiled.ExecuteAsync(new { MinTotal = 10000m }, ct);
var plan = await db.Set<Order>().Where(x => x.GrandTotal > 10000).ExplainAsync(ct);`
  },
  {
    id: 'memory-optimization',
    title: 'Memory, ArrayPool and Zero-Allocation Readers',
    eyebrow: 'Performance',
    status: 'Roadmap',
    summary:
      'Enterprise-scale performance requires ArrayPool<T>, object pooling, Span<T>, Memory<T>, reusable buffers and allocation-aware reader loops.',
    bullets: ['ArrayPool<T>', 'Object pooling', 'Span<T>', 'Memory<T>', 'Reusable buffers', 'Zero-allocation readers'],
    code: `var buffer = ArrayPool<OrderDto>.Shared.Rent(batchSize);
try
{
    var count = await db.Set<Order>()
        .Where(x => x.CreatedAt >= from)
        .ReadIntoAsync(buffer, ct);
}
finally
{
    ArrayPool<OrderDto>.Shared.Return(buffer, clearArray: true);
}`
  },
  {
    id: 'parallel-vectorized',
    title: 'Parallel and Vectorized Execution',
    eyebrow: 'Analytics Performance',
    status: 'Roadmap',
    summary:
      'Analytics workloads benefit from parallel execution, SIMD filtering, vectorized aggregation, columnar scans and provider-level bulk paths.',
    bullets: ['Parallel queries', 'MaxDegreeOfParallelism', 'SIMD filtering', 'Vectorized joins', 'Columnar scans', 'Arrow/Parquet'],
    code: `var revenue = await db.Frame<Order>()
    .Where(x => x.CreatedAt >= from)
    .Parallel()
    .MaxDegreeOfParallelism(8)
    .SumAsync(x => x.GrandTotal, ct);

var filtered = frame.Vectorized()
    .Where("GrandTotal", ForgeVectorOperator.GreaterThan, 10000m)
    .Aggregate("GrandTotal", ForgeAggregate.Sum);`
  },
  {
    id: 'benchmarks',
    title: 'BenchmarkDotNet Performance Comparisons',
    eyebrow: 'Benchmarks',
    status: 'Implemented',
    summary:
      'The benchmark suite compares ForgeORM with Dapper and EF Core across query-by-id, search/paging, insert, graph insert, bulk operations and expression-vs-SQL APIs.',
    bullets: ['Dapper comparison', 'EF Core comparison', 'Query by ID', 'Search paging', 'Insert', 'Graph operations'],
    code: `[MemoryDiagnoser]
[SimpleJob(warmupCount: 3, iterationCount: 10)]
public class QueryByIdBenchmarks
{
    [Benchmark(Baseline = true)]
    public Task<OrderDto?> Dapper_Query_By_Id() => dapper.GetByIdAsync(Id);

    [Benchmark]
    public Task<OrderDto?> ForgeORM_Query_By_Id() =>
        forgeDb.QueryFirstOrDefaultAsync<OrderDto>(BenchmarkSql.QueryById, new { Id });
}`
  }
] as const;
