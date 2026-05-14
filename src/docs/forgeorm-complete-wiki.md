# ForgeORM Complete Enterprise Wiki

> AI-first enterprise ORM, data platform, vector search, RAG, workflow, reporting, and low-code platform for modern .NET applications.

---

## 1. Introduction

ForgeORM is designed for enterprise-grade .NET systems where developers need more than a traditional ORM.

It combines:

- ORM
- Micro ORM
- LINQ provider
- Query builder
- Multi-database providers
- Bulk operations
- Redis caching
- Multi-tenancy
- Auditing
- Outbox
- Reporting
- Telemetry
- Security
- Vector search
- AI querying
- AI diagnostics
- AI optimization
- AI code generation
- AI migrations
- RAG engine
- Workflow engine
- Event sourcing
- Realtime engine
- AI agents
- Low-code ERP generator
- React Studio
- SaaS platform
- Marketplace

---

## 2. Supported Databases

| Database | Support |
|---|---|
| SQL Server | Supported |
| PostgreSQL | Supported |
| MySQL | Supported |
| MariaDB | Supported |
| SQLite | Supported |
| Oracle | Supported |
| MongoDB | Planned/Provider |
| CosmosDB | Planned/Provider |
| Redis | Cache / Vector / PubSub |
| PostgreSQL pgvector | Vector Search |
| Qdrant | Vector Store |
| Pinecone | Vector Store |
| Weaviate | Vector Store |

---

## 3. Installation

### SQL Server

```bash
dotnet add package ForgeORM.SqlServer
```

### PostgreSQL

```bash
dotnet add package ForgeORM.PostgreSql
```

### MySQL

```bash
dotnet add package ForgeORM.MySql
```

### Oracle

```bash
dotnet add package ForgeORM.Oracle
```

### Redis Cache

```bash
dotnet add package ForgeORM.Caching.Redis
```

### AI

```bash
dotnet add package ForgeORM.AI
```

### Vector Search

```bash
dotnet add package ForgeORM.Vector
```

---

## 4. Basic Setup

### SQL Server

```csharp
builder.Services.AddForgeOrm(options =>
{
    options.UseSqlServer(configuration.GetConnectionString("Default"));
});
```

### PostgreSQL

```csharp
builder.Services.AddForgeOrm(options =>
{
    options.UsePostgreSql(configuration.GetConnectionString("Default"));
});
```

### MySQL

```csharp
builder.Services.AddForgeOrm(options =>
{
    options.UseMySql(configuration.GetConnectionString("Default"));
});
```

### Oracle

```csharp
builder.Services.AddForgeOrm(options =>
{
    options.UseOracle(configuration.GetConnectionString("Default"));
});
```

---

## 5. Core ORM

### Query Entity

```csharp
var customers = await db.Query<Customer>()
    .Where(x => x.IsActive)
    .ToListAsync();
```

### Insert Entity

```csharp
await db.InsertAsync(customer);
```

### Update Entity

```csharp
await db.UpdateAsync(customer);
```

### Delete Entity

```csharp
await db.DeleteAsync(customer);
```

### SQL Server Output

```sql
SELECT *
FROM [Customers]
WHERE [IsActive] = 1;
```

### PostgreSQL Output

```sql
SELECT *
FROM "Customers"
WHERE "IsActive" = true;
```

### MySQL Output

```sql
SELECT *
FROM `Customers`
WHERE `IsActive` = 1;
```

### Oracle Output

```sql
SELECT *
FROM Customers
WHERE IsActive = 1;
```

---

## 6. Query Builder

```csharp
var query = db.Query<Product>()
    .Where(x => x.Price > 100)
    .OrderByDescending(x => x.CreatedAt)
    .Take(10);
```

### Dynamic Filters

```csharp
var query = db.Query<Customer>()
    .When(!string.IsNullOrWhiteSpace(filter.Name),
        q => q.Where(x => x.Name.Contains(filter.Name)))
    .When(filter.Country is not null,
        q => q.Where(x => x.Country == filter.Country));
```

---

## 7. LINQ Provider

### Includes

```csharp
var orders = await db.Query<Order>()
    .Include(x => x.Items)
    .ThenInclude(x => x.Product)
    .ToListAsync();
```

### Aggregates

```csharp
var total = await db.Query<Order>()
    .SumAsync(x => x.Total);
```

### Group By

```csharp
var report = await db.Query<Order>()
    .GroupBy(x => x.Country)
    .Select(x => new
    {
        Country = x.Key,
        Total = x.Sum(y => y.Total)
    })
    .ToListAsync();
```

---

## 8. Raw SQL

```csharp
var products = await db.SqlAsync<Product>(
    "SELECT * FROM Products WHERE Price > @Price",
    new { Price = 100 });
```

---

## 9. Stored Procedures

```csharp
var products = await db.StoredProcedureAsync<Product>(
    "sp_GetProducts",
    new { CategoryId = 10 });
```

---

## 10. Bulk Operations

### Bulk Insert

```csharp
await db.BulkInsertAsync(products);
```

### Bulk Update

```csharp
await db.BulkUpdateAsync(products);
```

### Bulk Delete

```csharp
await db.BulkDeleteAsync(products);
```

### Bulk Merge / Upsert

```csharp
await db.BulkMergeAsync(products);
```

### SQL Server Strategy

Uses SQL Server bulk copy.

```sql
BULK INSERT Products
FROM 'products.csv';
```

### PostgreSQL Strategy

Uses COPY.

```sql
COPY Products FROM STDIN;
```

### MySQL Strategy

Uses batched INSERT.

```sql
INSERT INTO Products(Name, Price)
VALUES (...), (...), (...);
```

---

## 11. Multi-Tenancy

### Enable

```csharp
builder.Services.AddForgeOrm(options =>
{
    options.EnableMultiTenancy();
});
```

### Tenant Provider

```csharp
public sealed class HeaderTenantProvider : ITenantProvider
{
    private readonly IHttpContextAccessor _http;

    public HeaderTenantProvider(IHttpContextAccessor http)
    {
        _http = http;
    }

    public string TenantId =>
        _http.HttpContext?.Request.Headers["X-Tenant-Id"].FirstOrDefault()
        ?? "default";
}
```

### Tenant Query

```csharp
var customers = await db.Query<Customer>()
    .WhereTenant()
    .ToListAsync();
```

### Supported Tenancy Models

| Model | Description |
|---|---|
| Shared Database | TenantId column |
| Shared Schema | Same tables, tenant filters |
| Dedicated Database | One DB per tenant |
| Sharded Tenancy | Tenant routing |

---

## 12. Auditing

### Enable

```csharp
builder.Services.AddForgeOrm(options =>
{
    options.EnableAuditing();
});
```

### Auditable Entity

```csharp
public abstract class AuditableEntity
{
    public DateTimeOffset CreatedAt { get; set; }
    public string? CreatedBy { get; set; }
    public DateTimeOffset? UpdatedAt { get; set; }
    public string? UpdatedBy { get; set; }
}
```

### Soft Delete

```csharp
public interface ISoftDelete
{
    bool IsDeleted { get; set; }
}
```

---

## 13. Outbox Pattern

### Save Event

```csharp
await outbox.SaveAsync(new OrderCreatedEvent(order.Id));
```

### Publish Events

```csharp
await outboxPublisher.PublishPendingAsync();
```

### Outbox Table

```sql
CREATE TABLE OutboxMessages
(
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    Type NVARCHAR(500) NOT NULL,
    Payload NVARCHAR(MAX) NOT NULL,
    CreatedAt DATETIME2 NOT NULL,
    ProcessedAt DATETIME2 NULL
);
```

---

## 14. Reporting Engine

### Dynamic Report

```csharp
var report = await db.Reporting<Order>()
    .GroupBy(x => x.Country)
    .Sum(x => x.Total)
    .ToListAsync();
```

### Pivot Report

```csharp
var pivot = await db.Reporting<Sale>()
    .Pivot(row: x => x.Country, column: x => x.Year)
    .Sum(x => x.Amount)
    .ToListAsync();
```

### Export

```csharp
await report.ExportExcelAsync();
await report.ExportCsvAsync();
await report.ExportPdfAsync();
```

---

## 15. Telemetry

### Enable

```csharp
builder.Services.AddForgeOrm(options =>
{
    options.EnableTelemetry();
});
```

### OpenTelemetry

```csharp
builder.Services.AddOpenTelemetry()
    .WithTracing(tracing =>
    {
        tracing.AddAspNetCoreInstrumentation();
        tracing.AddHttpClientInstrumentation();
        tracing.AddSource("ForgeORM");
    });
```

### Captured Metrics

- Query duration
- Query count
- Slow queries
- Cache hit ratio
- Cache miss ratio
- Bulk operation duration
- Failed commands
- Tenant usage
- AI token usage

---

## 16. Redis Caching

ForgeORM does not host Redis. The application owner provides Redis.

### Enable Redis Cache

```csharp
builder.Services.AddForgeOrm()
    .AddRedisCache(options =>
    {
        options.ConnectionString = configuration["Redis:ConnectionString"];
        options.InstanceName = "ForgeORM";
    });
```

### Query Cache

```csharp
var products = await db.Query<Product>()
    .Cache(TimeSpan.FromMinutes(5))
    .ToListAsync();
```

### Cache Tags

```csharp
var products = await db.Query<Product>()
    .Cache(TimeSpan.FromMinutes(5))
    .CacheTag("products")
    .ToListAsync();
```

### Tenant-Aware Cache Key

```text
tenant:{tenantId}:entity:{entityName}:query:{hash}
```

---

## 17. Security

### SQL Injection Protection

ForgeORM uses parameterized queries.

```csharp
await db.SqlAsync<Product>(
    "SELECT * FROM Products WHERE Name = @Name",
    new { Name = input });
```

### Masking

```csharp
var masked = masking.MaskEmail("user@example.com");
```

### Encryption

```csharp
var encrypted = encryption.Encrypt("sensitive-value");
var plain = encryption.Decrypt(encrypted);
```

### Row-Level Security

```csharp
builder.Services.AddForgeOrm(options =>
{
    options.EnableRowLevelSecurity();
});
```

---

## 18. Vector Search

### Insert Vector

```csharp
await vectorStore.UpsertAsync(
    id: "doc-1",
    vector: embedding,
    metadata: new { Title = "Customer Policy" });
```

### Search Vector

```csharp
var results = await vectorStore.SearchAsync(
    vector: queryEmbedding,
    topK: 5);
```

### PostgreSQL pgvector

```sql
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE Documents
(
    Id TEXT PRIMARY KEY,
    Content TEXT NOT NULL,
    Embedding VECTOR(1536)
);
```

### SQL Server Vector Search

```sql
CREATE TABLE Documents
(
    Id NVARCHAR(100) PRIMARY KEY,
    Content NVARCHAR(MAX),
    Embedding VECTOR(1536)
);
```

### Redis Vector

```text
FT.CREATE idx:documents ON HASH PREFIX 1 doc:
SCHEMA content TEXT embedding VECTOR FLAT 6 TYPE FLOAT32 DIM 1536 DISTANCE_METRIC COSINE
```

---

## 19. AI Provider Strategy

ForgeORM should not force one AI provider.

Users can bring:

- OpenAI
- Azure OpenAI
- Gemini
- Claude
- Ollama
- OpenRouter
- DeepSeek
- Groq
- Mistral
- Local LLMs

### AI Provider Abstraction

```csharp
public interface IForgeAiProvider
{
    Task<string> CompleteAsync(string prompt, CancellationToken cancellationToken = default);

    Task<float[]> EmbeddingAsync(string text, CancellationToken cancellationToken = default);
}
```

---

## 20. OpenAI Setup

```csharp
builder.Services.AddForgeOrm()
    .AddOpenAI(options =>
    {
        options.ApiKey = configuration["AI:OpenAI:ApiKey"];
        options.Model = "gpt-4.1";
    });
```

---

## 21. Gemini Setup

```csharp
builder.Services.AddForgeOrm()
    .AddGemini(options =>
    {
        options.ApiKey = configuration["AI:Gemini:ApiKey"];
        options.Model = "gemini-2.5-pro";
    });
```

---

## 22. Claude Setup

```csharp
builder.Services.AddForgeOrm()
    .AddClaude(options =>
    {
        options.ApiKey = configuration["AI:Claude:ApiKey"];
        options.Model = "claude-sonnet-4";
    });
```

---

## 23. Ollama Setup

```csharp
builder.Services.AddForgeOrm()
    .AddOllama(options =>
    {
        options.Endpoint = "http://localhost:11434";
        options.Model = "llama3";
    });
```

---

## 24. AI Querying

```csharp
var customers = await ai.QueryAsync<Customer>(
    "Get top 10 active customers from Dubai who purchased in last 30 days");
```

### Pipeline

```text
Natural language
  -> intent analysis
  -> schema context
  -> query generation
  -> SQL safety validation
  -> execution
  -> result shaping
```

---

## 25. AI Diagnostics

```csharp
var analysis = await aiDiagnostics.AnalyzeQueryAsync(sql);
```

### Example Output

```text
Potential missing index on Orders.CustomerId.
Query scans a large table.
Consider adding pagination.
```

---

## 26. AI Optimization

```csharp
var optimized = await aiOptimizer.OptimizeAsync(sql);
```

### Example Suggestion

```sql
CREATE INDEX IX_Orders_CustomerId_CreatedAt
ON Orders(CustomerId, CreatedAt);
```

---

## 27. AI Code Generation

### Generate Repository

```csharp
var code = await aiCodeGenerator.GenerateRepositoryAsync<Customer>();
```

### Generate Minimal API

```csharp
var api = await aiCodeGenerator.GenerateMinimalApiAsync<Product>();
```

### Generate DTOs

```csharp
var dto = await aiCodeGenerator.GenerateDtoAsync<Customer>();
```

---

## 28. AI Migrations

```csharp
var migration = await aiMigrationPlanner.GenerateMigrationPlanAsync(
    oldSchema,
    newSchema);
```

---

## 29. RAG Engine

### Upload Document

```csharp
await rag.UploadAsync(fileStream, "policy.pdf");
```

### Chunk

```csharp
var chunks = await rag.ChunkAsync(document);
```

### Embed

```csharp
await rag.GenerateEmbeddingsAsync(chunks);
```

### Ask

```csharp
var answer = await rag.AskAsync(
    "What is the refund policy?");
```

### Architecture

```text
Document
  -> chunking
  -> embeddings
  -> vector store
  -> semantic retrieval
  -> LLM response
```

---

## 30. Workflow Engine

### Start Workflow

```csharp
await workflow.StartAsync("OrderApproval", new
{
    OrderId = order.Id
});
```

### Workflow Definition

```csharp
var workflow = WorkflowDefinition.Create("OrderApproval")
    .Step("ValidateOrder")
    .Step("ReserveInventory")
    .Step("RequestApproval")
    .Step("CompleteOrder");
```

### Compensation

```csharp
await workflow.CompensateAsync(instanceId);
```

---

## 31. Visual Workflow Designer

The React Studio can display workflow nodes.

```json
{
  "nodes": [
    { "id": "start", "type": "start" },
    { "id": "validate", "type": "action", "label": "Validate Order" },
    { "id": "approve", "type": "approval", "label": "Manager Approval" }
  ],
  "edges": [
    { "from": "start", "to": "validate" },
    { "from": "validate", "to": "approve" }
  ]
}
```

---

## 32. Event Sourcing

### Append Event

```csharp
await eventStore.AppendAsync(
    streamId: order.Id.ToString(),
    @event: new OrderCreated(order.Id));
```

### Read Stream

```csharp
var events = await eventStore.ReadStreamAsync(order.Id.ToString());
```

### Replay Projection

```csharp
await projection.ReplayAsync("orders");
```

---

## 33. Realtime Engine

### SignalR Setup

```csharp
builder.Services.AddSignalR();

app.MapHub<ForgeRealtimeHub>("/forgeorm/realtime");
```

### Subscribe to Entity Changes

```csharp
await realtime.SubscribeAsync<Order>();
```

---

## 34. AI Agents

### Query Agent

```csharp
await aiAgents.RunAsync("query-agent", new
{
    Task = "Find slow reporting queries"
});
```

### Optimization Agent

```csharp
await aiAgents.RunAsync("optimization-agent", new
{
    Task = "Recommend indexes"
});
```

### Reporting Agent

```csharp
await aiAgents.RunAsync("reporting-agent", new
{
    Task = "Generate sales report"
});
```

---

## 35. Semantic Schema Understanding

```csharp
var model = await schemaAnalyzer.AnalyzeAsync();
```

### Output

```json
{
  "entities": ["Customer", "Order", "Product"],
  "relationships": ["Customer has many Orders", "Order has many Products"],
  "aggregates": ["CustomerAggregate", "OrderAggregate"]
}
```

---

## 36. Low-Code ERP Generator

### Prompt

```text
Generate ERP for manufacturing company with inventory, sales, procurement, HR, finance, approvals, reports.
```

### Generated Modules

- Inventory
- Sales
- Procurement
- Finance
- HR
- CRM
- Workflow approvals
- Dashboards
- Reports
- APIs
- Permissions

---

## 37. API Gateway and Service Mesh

### Gateway Features

- Rate limiting
- Authentication
- Authorization
- Retries
- Circuit breaker
- API aggregation
- Distributed tracing

### YARP Example

```json
{
  "ReverseProxy": {
    "Routes": {
      "forgeorm-api": {
        "ClusterId": "api",
        "Match": {
          "Path": "/api/{**catch-all}"
        }
      }
    }
  }
}
```

---

## 38. Distributed Query Engine

```csharp
var result = await distributedQuery.QueryAsync(new DistributedQueryRequest
{
    Sources = ["sqlserver", "postgresql", "mongodb"],
    Query = "Get customer sales summary"
});
```

---

## 39. Data Virtualization

```csharp
var result = await virtualization.QueryAsync("customers")
    .From("sqlserver")
    .Join("crm-api")
    .ExecuteAsync();
```

---

## 40. Cloud Deployment Generator

### Docker

```bash
forgeorm generate docker
```

### Kubernetes

```bash
forgeorm generate k8s
```

### Terraform

```bash
forgeorm generate terraform --provider azure
```

---

## 41. Infrastructure as Code

### Terraform Azure SQL Example

```hcl
resource "azurerm_mssql_server" "forgeorm" {
  name                         = "forgeorm-sql"
  resource_group_name          = azurerm_resource_group.main.name
  location                     = azurerm_resource_group.main.location
  administrator_login          = "sqladmin"
  administrator_login_password = var.sql_password
}
```

---

## 42. Distributed Cache Cluster

### Redis Cluster

```csharp
builder.Services.AddForgeOrm()
    .AddRedisCache(options =>
    {
        options.ConnectionString = configuration["Redis:ClusterConnectionString"];
        options.UseCluster = true;
    });
```

---

## 43. AI Security Analyzer

```csharp
var result = await securityAnalyzer.AnalyzeAsync(sql);
```

### Detects

- Unsafe raw SQL
- Tenant filter missing
- SQL injection risk
- Sensitive columns exposed
- Missing authorization policy

---

## 44. AI Observability

```csharp
var recommendation = await observabilityAi.AnalyzeAsync(metrics);
```

### Example Output

```text
Orders report query latency increased 45%.
Cache hit ratio dropped below 40%.
Recommended action: add index on Orders.CreatedAt.
```

---

## 45. Time Travel Queries

```csharp
var orders = await db.Query<Order>()
    .AsOf(DateTime.UtcNow.AddDays(-30))
    .ToListAsync();
```

### SQL Server Temporal Table

```sql
SELECT *
FROM Orders
FOR SYSTEM_TIME AS OF '2026-01-01T00:00:00';
```

### PostgreSQL History Table

```sql
SELECT *
FROM OrdersHistory
WHERE ValidFrom <= @AsOf AND ValidTo > @AsOf;
```

---

## 46. Offline Sync

### Initialize Local Store

```csharp
await sync.InitializeOfflineStoreAsync();
```

### Sync Changes

```csharp
await sync.SynchronizeAsync();
```

### Conflict Resolution

```csharp
await sync.ResolveConflictsAsync(ConflictStrategy.ServerWins);
```

---

## 47. Marketplace

### Install Template

```bash
forgeorm marketplace install erp-inventory-module
```

### Marketplace Items

- Providers
- Templates
- AI agents
- Reports
- Workflows
- ERP modules
- CRM modules
- Dashboard packs

---

## 48. Enterprise Identity Platform

### RBAC

```csharp
policy.RequireRole("Admin");
```

### ABAC

```csharp
policy.RequireClaim("department", "Finance");
```

### Policy Engine

```csharp
await policyEngine.AuthorizeAsync(user, "orders.approve");
```

---

## 49. AI Memory System

```csharp
await aiMemory.SaveAsync("schema-summary", schemaDescription);

var memory = await aiMemory.GetAsync("schema-summary");
```

### Memory Types

- Schema memory
- Query history
- Optimization history
- User preference memory
- Tenant-specific memory
- Project memory

---

## 50. React Studio

### Studio Sections

- Dashboard
- Database Explorer
- ERD Designer
- Query Visualizer
- API Tester
- AI Chat
- RAG Documents
- Workflow Designer
- Reports
- Monitoring
- Marketplace
- Tenants
- Security
- Migrations

### Example Route Config

```tsx
export const routes = [
  { path: "/dashboard", label: "Dashboard" },
  { path: "/database", label: "Database Explorer" },
  { path: "/erd", label: "ERD Designer" },
  { path: "/query", label: "Query Visualizer" },
  { path: "/api-tester", label: "API Tester" },
  { path: "/ai", label: "AI Assistant" },
  { path: "/rag", label: "RAG Documents" },
  { path: "/workflow", label: "Workflow Designer" },
  { path: "/reports", label: "Reports" },
  { path: "/monitoring", label: "Monitoring" }
];
```

---

## 51. API Testing

```csharp
var response = await apiTester.SendAsync(new ApiTestRequest
{
    Method = "GET",
    Url = "/api/products"
});
```

---

## 52. Monitoring Dashboard

### Metrics Endpoint

```http
GET /api/studio/monitoring/metrics
```

### Response

```json
{
  "queriesPerMinute": 120,
  "averageQueryMs": 18,
  "cacheHitRatio": 0.82,
  "slowQueries": 3,
  "activeTenants": 12
}
```

---

## 53. SaaS Platform

### Tenant Endpoint

```http
GET /api/studio/tenants
```

### Tenant Model

```csharp
public sealed record TenantDto(
    string Id,
    string Name,
    string Plan,
    bool IsActive);
```

---

## 54. GraphQL

```csharp
builder.Services.AddForgeGraphQL();

app.MapGraphQL("/graphql");
```

---

## 55. OData

```csharp
builder.Services.AddForgeOData();

app.MapODataRoute("odata", "odata");
```

---

## 56. CQRS

### Command

```csharp
public sealed record CreateProductCommand(
    string Name,
    decimal Price);
```

### Handler

```csharp
public sealed class CreateProductHandler
{
    public Task Handle(CreateProductCommand command)
    {
        return Task.CompletedTask;
    }
}
```

### Query

```csharp
public sealed record GetProductsQuery;
```

---

## 57. SQL Server Full Example

```csharp
builder.Services.AddForgeOrm(options =>
{
    options.UseSqlServer(configuration.GetConnectionString("SqlServer"));
    options.EnableCaching();
    options.EnableAuditing();
    options.EnableTelemetry();
    options.EnableMultiTenancy();
    options.EnableOutbox();
});
```

---

## 58. PostgreSQL Full Example

```csharp
builder.Services.AddForgeOrm(options =>
{
    options.UsePostgreSql(configuration.GetConnectionString("PostgreSql"));
    options.EnableVectorSearch();
    options.EnableCaching();
    options.EnableTelemetry();
});
```

---

## 59. MySQL Full Example

```csharp
builder.Services.AddForgeOrm(options =>
{
    options.UseMySql(configuration.GetConnectionString("MySql"));
    options.EnableCaching();
});
```

---

## 60. Oracle Full Example

```csharp
builder.Services.AddForgeOrm(options =>
{
    options.UseOracle(configuration.GetConnectionString("Oracle"));
    options.EnableAuditing();
});
```

---

## 61. MongoDB Full Example

```csharp
builder.Services.AddForgeOrm(options =>
{
    options.UseMongoDb(configuration.GetConnectionString("MongoDb"));
});
```

---

## 62. CosmosDB Full Example

```csharp
builder.Services.AddForgeOrm(options =>
{
    options.UseCosmos(configuration["Cosmos:ConnectionString"]);
});
```

---

## 63. Docker Deployment

```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY ./publish .
ENTRYPOINT ["dotnet", "ForgeORM.SampleApi.dll"]
```

---

## 64. Kubernetes Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: forgeorm-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: forgeorm-api
  template:
    metadata:
      labels:
        app: forgeorm-api
    spec:
      containers:
        - name: forgeorm-api
          image: forgeorm/api:latest
          ports:
            - containerPort: 8080
```

---

## 65. GitHub Actions

```yaml
name: Build ForgeORM

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup .NET
        uses: actions/setup-dotnet@v4
        with:
          dotnet-version: 10.0.x
      - name: Restore
        run: dotnet restore
      - name: Build
        run: dotnet build --configuration Release --no-restore
      - name: Test
        run: dotnet test --configuration Release --no-build
```

---

## 66. Best Practices

Use ForgeORM with:

- Clean Architecture
- Vertical Slice Architecture
- CQRS
- Outbox Pattern
- Event Sourcing
- OpenTelemetry
- Redis caching
- Tenant-aware security
- AI diagnostics
- Central package management
- Docker
- Kubernetes
- CI/CD

---

## 67. Recommended Production Stack

| Area | Recommended |
|---|---|
| Primary DB | PostgreSQL or SQL Server |
| Cache | Redis |
| Messaging | Kafka or RabbitMQ |
| Vector | pgvector or Qdrant |
| AI | BYO OpenAI/Gemini/Claude/Ollama |
| Telemetry | OpenTelemetry |
| Logs | Serilog + Seq |
| Deployment | Kubernetes |
| Gateway | YARP |
| Auth | Keycloak / OpenIddict |

---

## 68. Product Positioning

ForgeORM should be positioned as:

> AI-first enterprise data platform for modern .NET applications.

Not only:

> Another ORM.

---

## 69. V1 → V4 Roadmap

### V1

- Core ORM
- LINQ provider
- Query builder
- SQL generation
- SQL Server
- PostgreSQL

### V2

- Bulk operations
- Redis caching
- Multi-tenancy
- Auditing
- Outbox
- Reporting
- Telemetry
- Security

### V3

- AI querying
- AI diagnostics
- AI optimization
- AI code generation
- AI migrations
- Vector search
- RAG

### V4

- React Studio
- Workflow designer
- ERD designer
- API tester
- SaaS platform
- AI agents
- Marketplace
- Low-code ERP generator
- Monitoring dashboards

---

## 70. Final Vision

ForgeORM evolves into:

- ORM
- Enterprise data platform
- AI backend platform
- RAG engine
- Workflow system
- Low-code ERP/CRM generator
- SaaS platform
- AI enterprise operating system for .NET