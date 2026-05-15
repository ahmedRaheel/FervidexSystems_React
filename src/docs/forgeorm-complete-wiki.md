# ForgeORM Bible — Complete Enterprise Guide

# ForgeORM
## The Modern Enterprise ORM + Analytics + DataFrame Platform for .NET 8 & .NET 10

---

# Table of Contents

1. Introduction
2. Installation
3. Architecture Overview
4. ForgeDbContext
5. Query APIs
6. CRUD Operations
7. Record Mapping
8. Enum Mapping
9. Dynamic Queries
10. Search APIs
11. Split Queries
12. Graph Insert
13. Table-Valued Parameters (TVP)
14. Window Functions
15. Analytics Engine
16. Pivot Tables
17. DataFrame APIs
18. CSV Import
19. JSON Import
20. Save DataFrame to Database
21. Query DataFrames
22. Vertical Slice Architecture
23. Onion Architecture
24. CQRS
25. Minimal APIs
26. Transactions
27. Bulk Operations
28. Performance Optimization
29. Caching
30. Redis
31. Workflow Engine
32. AI Features
33. Vector Search
34. Telemetry & Logging
35. Multi Database Support
36. Best Practices
37. Advanced Enterprise Scenarios
38. Complete Example Project
39. Troubleshooting
40. Roadmap

---

# 1. Introduction

ForgeORM is a modern enterprise ORM and analytics framework for .NET.

It combines:

- EF-style developer experience
- Dapper-like performance philosophy
- Full SQL control
- Analytics engine
- Pandas-like DataFrame support
- Enterprise architecture support
- AI-ready extensibility

ForgeORM is designed for:

- Enterprise APIs
- CQRS systems
- Minimal APIs
- Distributed systems
- Analytics platforms
- High-performance services
- AI-first applications
- Financial systems
- Healthcare systems
- Government systems

---

# 2. Installation

## NuGet Packages

```bash
 dotnet add package ForgeORM.Core
 dotnet add package ForgeORM.Analytics
 dotnet add package ForgeORM.Workflow
```

## SQL Server Provider

```bash
 dotnet add package Microsoft.Data.SqlClient
```

## Analytics Support

```bash
 dotnet add package Microsoft.Data.Analysis
```

---

# 3. Architecture Overview

ForgeORM Architecture:

```text
Application
    ↓
ForgeDbContext
    ↓
Forge Query APIs
    ↓
ForgeAdo
    ↓
ADO.NET Provider
    ↓
Database
```

Modules:

```text
ForgeORM.Core
ForgeORM.Analytics
ForgeORM.Workflow
ForgeORM.VectorSearch
ForgeORM.AI
ForgeORM.DataFrame
```

---

# 4. ForgeDbContext

## Registration

```csharp
builder.Services.AddForgeOrm(options =>
{
    options.UseSqlServer(connectionString);
});
```

## Injection

```csharp
app.MapGet("/products", async (ForgeDbContext db) =>
{
    return await db.QueryAsync<Product>("SELECT * FROM Products");
});
```

---

# 5. Query APIs

## QueryAsync

```csharp
var products = await db.QueryAsync<Product>(
    "SELECT * FROM Products WHERE Price > @price",
    new { price = 100 });
```

## QuerySingleAsync

```csharp
var product = await db.QuerySingleOrDefaultAsync<Product>(
    "SELECT * FROM Products WHERE Id=@id",
    new { id });
```

## ExecuteAsync

```csharp
await db.ExecuteAsync(
    "UPDATE Products SET Price=@price WHERE Id=@id",
    new { id = 1, price = 500 });
```

## ExecuteScalarAsync

```csharp
var count = await db.ExecuteScalarAsync<int>(
    "SELECT COUNT(*) FROM Products");
```

---

# 6. CRUD Operations

## Insert

```csharp
await db.InsertAsync(product);
```

## Update

```csharp
await db.UpdateAsync(product);
```

## Delete

```csharp
await db.DeleteAsync<Product>(id);
```

## Find

```csharp
var product = await db.FindAsync<Product>(id);
```

---

# 7. Record Mapping

ForgeORM supports C# records automatically.

```csharp
public sealed record ProductSummary(
    int Id,
    string Name,
    decimal Price);
```

Usage:

```csharp
var result = await db.QueryAsync<ProductSummary>(
    "SELECT Id, Name, Price FROM Products");
```

---

# 8. Enum Mapping

## Enum

```csharp
public enum OrderStatus
{
    Draft = 1,
    Paid = 2,
    Cancelled = 3
}
```

## Entity

```csharp
public sealed class Order
{
    public int Id { get; set; }
    public OrderStatus Status { get; set; }
}
```

ForgeORM automatically converts:

- int → enum
- string → enum
- enum → database value

---

# 9. Dynamic Queries

```csharp
var result = await db.QueryDynamicAsync(
    "SELECT * FROM Orders");
```

Result:

```json
[
  {
    "Id": 1,
    "OrderNo": "ORD-1001"
  }
]
```

---

# 10. Search APIs

## Search

```csharp
var result = await db.Search<Product>()
    .OptionalLike(x => x.Name, request.Name)
    .OptionalBetween(x => x.Price, request.MinPrice, request.MaxPrice)
    .Page(1, 20)
    .ToPagedAsync();
```

## When To Use

Use Search APIs when:

- Dynamic filtering required
- Paging required
- Admin grids
- Search screens
- APIs with many optional filters

---

# 11. Split Queries

## One To One

```csharp
var orders = await db.Split<Order>()
    .IncludeOne<Customer>(x => x.CustomerId)
    .ToListAsync();
```

## One To Many

```csharp
var orders = await db.Split<Order>()
    .IncludeMany<OrderItem>(x => x.Items)
    .ToListAsync();
```

## When To Use

Use split queries when:

- Large graph loading
- Avoid cartesian explosion
- Better performance
- Enterprise reporting

---

# 12. Graph Insert

## Parent Child Insert

```csharp
await db.InsertGraphAsync<Order, CreateOrderDto>(dto);
```

Automatically:

- inserts parent
- inserts children
- manages foreign keys
- wraps transaction

---

# 13. Table-Valued Parameters (TVP)

## High Performance Bulk Insert

```csharp
await db.InsertGraphAsync<Order, CreateOrderDto>(
    dto,
    graph =>
    {
        graph.Children<OrderItem>(x => x.Items)
            .UseSqlServerTvp(
                tableType: "dbo.OrderItemTvp",
                procedure: "dbo.InsertOrderItemsTvp");
    });
```

## When To Use

Use TVP when:

- Large child collections
- Bulk insert
- Enterprise batch systems
- Financial imports
- ERP systems

---

# 14. Window Functions

## Row Number

```csharp
.RowNumber()
    .PartitionBy(x => x.CustomerId)
    .OrderByDescending(x => x.CreatedAt)
    .As("RowNo")
```

## Rank

```csharp
.Rank()
    .PartitionBy(x => x.CustomerId)
    .OrderByDescending(x => x.GrandTotal)
    .As("RankNo")
```

## Running Total

```csharp
.Sum(x => x.GrandTotal)
    .PartitionBy(x => x.CustomerId)
    .OrderBy(x => x.CreatedAt)
    .RowsBetweenUnboundedPrecedingAndCurrentRow()
    .As("RunningSales")
```

---

# 15. Analytics Engine

## Analytics Query

```csharp
var result = await db.Analytics<Order>()
    .From("Orders")
    .Select(x => x.Id)
    .Select(x => x.OrderNo)
    .ToDynamicListAsync();
```

## Supported Functions

- RowNumber
- Rank
- DenseRank
- Ntile
- Lag
- Lead
- FirstValue
- LastValue
- PercentileCont
- PercentileDisc
- Avg
- Sum
- Min
- Max
- Count

---

# 16. Pivot Tables

## Pivot Query

```csharp
var sql = db.Pivot<Order>()
    .From("Orders")
    .Rows(x => x.CustomerId)
    .Columns(x => x.Status)
    .Values(x => x.GrandTotal)
    .Aggregate("SUM")
    .Render("Draft", "Paid", "Cancelled");
```

---

# 17. DataFrame APIs

ForgeORM supports pandas-like DataFrames.

## Create Frame

```csharp
var frame = await db.Frame<Order>()
    .ToFrameAsync();
```

## GroupBy

```csharp
var grouped = frame.GroupBy("CustomerId");
```

## Aggregation

```csharp
var result = grouped.Agg(new
{
    Total = ForgeAgg.Sum("GrandTotal"),
    Avg = ForgeAgg.Avg("GrandTotal")
});
```

---

# 18. CSV Import

## Import CSV

```csharp
var frame = ForgeDataFrame.ReadCsv("orders.csv");
```

## Query CSV

```csharp
var result = frame
    .Where("GrandTotal > 1000")
    .OrderByDescending("GrandTotal");
```

---

# 19. JSON Import

## Import JSON

```csharp
var frame = ForgeDataFrame.ReadJson("orders.json");
```

---

# 20. Save DataFrame To Database

```csharp
await frame.ToTableAsync(
    db,
    "ImportedOrders");
```

---

# 21. Query DataFrames

```csharp
var result = frame
    .Filter(x => x["GrandTotal"] > 1000)
    .Select("OrderNo", "GrandTotal")
    .Take(20);
```

---

# 22. Vertical Slice Architecture

## Recommended Structure

```text
Features/
 ├── Orders/
 │    ├── Create/
 │    ├── Update/
 │    ├── Search/
 │    └── Analytics/
```

---

# 23. Onion Architecture

## Layers

```text
Domain
Application
Infrastructure
API
```

ForgeORM belongs inside Infrastructure.

---

# 24. CQRS

## Query Handler

```csharp
public sealed class GetOrdersHandler
{
    private readonly ForgeDbContext _db;

    public async Task<IReadOnlyList<OrderDto>> Handle()
    {
        return await _db.QueryAsync<OrderDto>(
            "SELECT * FROM Orders");
    }
}
```

---

# 25. Minimal APIs

```csharp
app.MapGet("/orders", async (ForgeDbContext db) =>
{
    return await db.QueryAsync<Order>(
        "SELECT * FROM Orders");
});
```

---

# 26. Transactions

```csharp
await using var tx = await db.BeginTransactionAsync();

await db.InsertAsync(order);
await db.InsertAsync(items);

await tx.CommitAsync();
```

---

# 27. Bulk Operations

## Bulk Insert

```csharp
await db.BulkInsertAsync(products);
```

## Bulk Update

```csharp
await db.BulkUpdateAsync(products);
```

---

# 28. Performance Optimization

ForgeORM optimizations:

- Pure ADO.NET
- Fast materialization
- Constructor mapping
- Minimal allocations
- Split queries
- TVP batching
- Dynamic SQL rendering
- Query reuse

---

# 29. Caching

```csharp
await db.Cacheable(TimeSpan.FromMinutes(5))
    .QueryAsync<Product>(sql);
```

---

# 30. Redis

```csharp
builder.Services.AddStackExchangeRedisCache(...);
```

---

# 31. Workflow Engine

Features:

- Saga orchestration
- Compensation
- Retry handling
- Workflow persistence
- Distributed workflows

---

# 32. AI Features

Features:

- AI query optimization
- AI diagnostics
- AI CRUD generation
- AI analytics
- AI recommendations

---

# 33. Vector Search

```csharp
var result = await vectorStore.SearchAsync(vector);
```

---

# 34. Telemetry & Logging

Supports:

- OpenTelemetry
- Serilog
- Seq
- Structured logging
- Query tracing

---

# 35. Multi Database Support

Supported:

- SQL Server
- PostgreSQL
- MySQL
- Oracle
- SQLite

---

# 36. Best Practices

## Recommended

- Use split queries for large graphs
- Use TVP for large inserts
- Use search APIs for admin grids
- Use analytics engine for reports
- Use DataFrames for CSV/JSON analytics
- Keep raw SQL for advanced scenarios

## Avoid

- N+1 queries
- huge joins
- loading unnecessary columns
- over-fetching data

---

# 37. Advanced Enterprise Scenarios

## ERP Systems

Use:

- TVP
- Graph insert
- Analytics
- Pivot tables
- CQRS

## Financial Systems

Use:

- Window functions
- Percentiles
- Running totals
- Split queries

## Healthcare

Use:

- Search APIs
- Analytics
- DataFrames

---

# 38. Complete Example Project

```text
src/
 ├── API
 ├── Application
 ├── Domain
 ├── Infrastructure
 └── Features
```

Features:

- Orders
- Products
- Customers
- Payments
- Shipments
- Analytics

---

# 39. Troubleshooting

## Enum Issues

Add:

```csharp
builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.Converters.Add(
        new JsonStringEnumConverter());
});
```

## IN Query Issues

Use:

```sql
WHERE Id IN @Ids
```

ForgeORM automatically expands parameters.

## Record Mapping Issues

Ensure SQL column names match constructor names.

---

# 40. Roadmap

Upcoming:

- Source generators
- LINQ provider
- Query compilation cache
- Distributed DataFrames
- DuckDB integration
- Parquet support
- GPU acceleration
- AI query planning
- Visual analytics
- Dashboard engine

---

# Conclusion

ForgeORM is designed to become:

```text
ORM + Analytics + DataFrame + AI + Enterprise Platform
```

It combines:

- ORM
- Query builder
- Analytics engine
- Pivot engine
- DataFrame processing
- AI tooling
- Enterprise architecture support

inside one modern .NET ecosystem.



---

# 41. Stream-Based CSV and JSON Imports

ForgeORM DataFrame APIs should support both path-based imports and stream-based imports. Stream support is important for ASP.NET Core uploads, Azure Blob Storage, S3, message pipelines, and enterprise ETL scenarios where writing temporary files is not ideal.

## CSV Upload Example

```csharp
app.MapPost("/dataframes/import/csv-to-table", async (
    IFormFile file,
    string tableName,
    ForgeDbContext db,
    CancellationToken ct) =>
{
    if (!ForgeSqlNameValidator.IsSafeIdentifier(tableName))
        return Results.BadRequest("Invalid tableName.");

    await using var stream = file.OpenReadStream();

    var frame = await ForgeDataFrame.FromCsvAsync(stream, ct);

    await frame.ToTableAsync(
        db,
        tableName: tableName,
        cancellationToken: ct);

    return Results.Ok(new
    {
        tableName,
        file.FileName,
        rows = frame.RowCount,
        columns = frame.Columns
    });
});
```

## JSON Upload Example

```csharp
app.MapPost("/dataframes/import/json-to-table", async (
    IFormFile file,
    string tableName,
    ForgeDbContext db,
    CancellationToken ct) =>
{
    if (!ForgeSqlNameValidator.IsSafeIdentifier(tableName))
        return Results.BadRequest("Invalid tableName.");

    await using var stream = file.OpenReadStream();

    var frame = await ForgeDataFrame.FromJsonAsync(stream, ct);

    await frame.ToTableAsync(
        db,
        tableName: tableName,
        cancellationToken: ct);

    return Results.Ok(new
    {
        tableName,
        file.FileName,
        rows = frame.RowCount,
        columns = frame.Columns
    });
});
```

---

# 42. Dirty Data Handling

CSV and JSON imports often contain placeholder values. ForgeORM should treat these values as null-like values during import and table persistence.

```text
?, -, --, NA, N/A, NULL, null, nan, none
```

These values should become:

```sql
NULL
```

This behavior is similar to pandas and prevents errors such as:

```text
Error converting data type nvarchar to numeric
```

## Example CSV

```csv
Country,Sales
USA,100
Canada,?
UK,N/A
```

Expected database result:

```text
USA     100
Canada  NULL
UK      NULL
```

---

# 43. Safe SQL Identifier Validation

When users provide dynamic table names for CSV or JSON imports, the name must be validated.

```csharp
if (!ForgeSqlNameValidator.IsSafeIdentifier(tableName))
    return Results.BadRequest("Invalid tableName.");
```

ForgeORM should escape identifiers internally:

```sql
[Country], [Continent], [1980], [1981]
```

This fixes numeric CSV column names and prevents invalid SQL.

---

# 44. DataFrame Persistence to SQL Tables

ForgeORM DataFrame can create a SQL table from CSV or JSON data and insert rows safely.

```csharp
await frame.ToTableAsync(
    db,
    tableName: "ImportedOrders",
    cancellationToken: ct);
```

DataFrame persistence should include:

- schema inference
- null-like value conversion
- numeric column support
- identifier escaping
- parameterized inserts
- safe table names

---

# 45. Analytics Execution Pipeline

Analytics queries can render SQL or execute directly.

## Render SQL

```csharp
var sql = db.Analytics<Order>()
    .From("Orders")
    .Select(x => x.Id)
    .RowNumber()
        .PartitionBy(x => x.CustomerId)
        .OrderByDescending(x => x.CreatedAt)
        .As("RowNo")
    .Render()
    .Sql;
```

## Execute Analytics

```csharp
var result = await db.Analytics<Order>()
    .From("Orders")
    .Select(x => x.Id)
    .Select(x => x.OrderNo)
    .Select(x => x.CustomerId)
    .Select(x => x.GrandTotal)
    .RowNumber()
        .PartitionBy(x => x.CustomerId)
        .OrderByDescending(x => x.CreatedAt)
        .As("RowNo")
    .ToDynamicListAsync(ct);
```

Use named arguments internally so `CancellationToken` is never passed as SQL parameters.

---

# 46. ForgeORM.AspNetCore Integration

ASP.NET Core applications should reference the integration package so setup is simple.

```bash
dotnet add package ForgeORM.AspNetCore
```

Recommended setup:

```csharp
builder.Services.AddForgeOrm(options =>
{
    options.UseSqlServer(connectionString);
    options.EnableAnalytics();
    options.EnableCaching();
    options.EnableTelemetry();
});

app.UseForgeOrm();
```

The integration package should wire:

- ForgeDbContext
- QueryAst services
- Analytics services
- DataFrame services
- JSON enum options
- health checks
- middleware
- telemetry

---

# 47. QueryAst Architecture

Advanced query features belong in QueryAst, not low-level Core.

```text
ForgeORM.Core       -> ADO.NET engine, materializer, CRUD, transactions
ForgeORM.QueryAst   -> query builders, search, SplitGraph, SQL rendering
ForgeORM.Analytics  -> DataFrames, analytics, pivot, pandas-like APIs
ForgeORM.AspNetCore -> DI, middleware, web integration
```

This keeps the core stable and allows advanced modules to evolve without breaking existing users.

---

# 48. Regression Testing Strategy

ForgeORM should include regression tests for every bug fixed.

Recommended test areas:

```text
ForgeORM.Core.Tests
ForgeORM.QueryAst.Tests
ForgeORM.Analytics.Tests
ForgeORM.DataFrame.Tests
ForgeORM.AspNetCore.Tests
```

Test cases should cover:

- record constructor mapping
- enum mapping
- `IN @Ids` expansion
- CancellationToken not bound as parameter
- CSV dirty-data import
- JSON dirty-data import
- numeric CSV headers
- safe table-name validation
- analytics SQL rendering
- analytics dynamic execution
- SplitGraph one-to-one and one-to-many

---

# 49. ForgeCommerce Demo

ForgeCommerce is the official demo repository for ForgeORM.

```text
https://github.com/ahmedRaheel/ForgeCommerce
```

It demonstrates:

- Minimal APIs
- ForgeDbContext
- Search APIs
- SplitGraph
- record mapping
- enum mapping
- analytics window functions
- DataFrame CSV/JSON import
- table creation from uploaded files
- TVP graph insert
- Swagger

---

# 50. Enterprise Security Best Practices

Always validate dynamic identifiers. Always parameterize values. Never concatenate user values into SQL.

Safe:

```csharp
await db.QueryAsync<Order>(
    "SELECT * FROM Orders WHERE CustomerId = @customerId",
    new { customerId });
```

Unsafe:

```csharp
await db.QueryAsync<Order>(
    $"SELECT * FROM Orders WHERE CustomerId = {customerId}");
```

ForgeORM should provide secure defaults for:

- dynamic table names
- CSV/JSON imports
- DataFrame persistence
- query builders
- analytics execution
- stored procedure parameters
