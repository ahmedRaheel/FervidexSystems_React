import React, {useMemo, useState} from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowRight, BadgeCheck, BarChart3, BookOpen, Boxes, BrainCircuit, CheckCircle2, Code2, Copy, Database, FileText, Layers3, Menu, Moon, Play, Search, ShieldCheck, Sparkles, Star, Sun, TerminalSquare, Workflow, X, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import './styles.css';
import ForgeOrmWikiPage from './pages/ForgeOrmWikiPage.jsx';

const logo='/assets/images/fervidex-logo.png';
const nav=[['home','Home'],['products','Products'],['wiki','Wiki'],['forgeorm-full-wiki','ForgeORM Docs'],['playground','Playground'],['api','API Docs'],['blog','Blog'],['about','About']];

const ormV1=['Fast QueryAsync / ExecuteAsync APIs','Raw SQL mapping','Stored procedure execution','Multiple result set mapping','Expression-based filtering','Fluent query builder','Optional filters','Pagination','DTO projection','Safe interpolated SQL'];
const ormV2=['Bulk insert/update/delete','Provider packages for SQL Server, PostgreSQL, MySQL, Oracle','Unit of Work helpers','Transactions','Multi-tenancy filters','Auditing fields','Soft delete','Change history','Redis/in-memory cache adapters','OpenTelemetry spans'];
const ormV3=['Outbox pattern','Reporting DSL','Dynamic pivot-friendly filters','JSON result streaming','Split queries for hierarchies','ToShape<T>() projection concept','Source-generator mapping roadmap','Vector search extension points','AI query explanation','AI diagnostics'];
const ormV4=['React Studio','ERD designer','Query visualizer','API testing console','SaaS workspace','Monitoring dashboards','AI optimization','AI code generation','AI migrations','Enterprise architecture memory'];
const pdfFeatures=['HTML/CSS to PDF rendering','Structured layout tree and paint engine','Headers and footers','Table pagination','Card/report rendering','Unicode and RTL planning','Large PDF streaming','CLI tooling','Minimal API integration','Word/Excel/PDF conversion roadmap','Image handling roadmap','NuGet packaging'];

function App(){
  const normalizeHash = () => location.hash?.replace('#','') || 'home';
  const [page,setPage]=useState(normalizeHash());
  const [open,setOpen]=useState(false);
  const [theme,setTheme]=useState(localStorage.theme||'dark');
  React.useEffect(()=>{document.documentElement.dataset.theme=theme;localStorage.theme=theme},[theme]);
  React.useEffect(()=>{
    const onHash=()=>setPage(normalizeHash());
    window.addEventListener('hashchange', onHash);
    return ()=>window.removeEventListener('hashchange', onHash);
  },[]);
  const go=p=>{setPage(p);location.hash=p;setOpen(false);scrollTo(0,0)};
  return <><Header page={page} go={go} open={open} setOpen={setOpen} theme={theme} setTheme={setTheme}/><main>{page==='home'&&<Home go={go}/>} {page==='products'&&<Products go={go}/>} {page==='wiki'&&<Wiki/>} {page==='forgeorm-full-wiki'&&<ForgeOrmWikiPage/>} {page==='playground'&&<Playground/>} {page==='api'&&<ApiDocs/>} {page==='blog'&&<Blog setPage={setPage}/>} {page.startsWith('article-')&&<ArticlePage slug={page}/>} {page==='about'&&<About/>}</main><Footer go={go}/></>;
}

function Header({page,go,open,setOpen,theme,setTheme}){return <header className="nav"><div className="brand" onClick={()=>go('home')}><img src={logo}/><span>Fervidex Systems</span></div><button className="hamb" onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button><nav className={open?'show':''}>{nav.map(([k,v])=><button className={page===k?'active':''} onClick={()=>go(k)} key={k}>{v}</button>)}<button className="theme" onClick={()=>setTheme(theme==='dark'?'light':'dark')}>{theme==='dark'?<Sun/>:<Moon/>}</button></nav></header>}

function Home({go}){return <><Hero go={go}/><Badges/><Section title="Enterprise-grade product features" sub="The site now includes dark/light theme, AI animated hero, searchable docs, playgrounds, PDF demo, Wiki sidebar, syntax-highlighted examples, SEO metadata, blog, API docs, charts, NuGet badges and GitHub stars UI."><div className="grid three"><Card title="ForgeORM" icon={<Database/>} desc="Micro ORM with SQL intelligence, bulk operations, multi-tenancy, outbox, caching, telemetry, AI and vector-ready extension points."/><Card title="ForgePDF" icon={<FileText/>} desc="HTML/CSS to PDF engine for reports, invoices and enterprise documents with CLI and API usage examples."/><Card title="Developer Studio" icon={<BrainCircuit/>} desc="Roadmap for React Studio, ERD designer, query visualizer, API testing, SaaS dashboards and AI optimization."/></div></Section><Benchmarks/><CTA go={go}/></>}
function Hero({go}){return <section className="hero"><div className="orb o1"/><div className="orb o2"/><div className="gridlines"/><motion.div initial={{opacity:0,y:22}} animate={{opacity:1,y:0}} className="heroText"><span className="eyebrow"><Sparkles size={16}/> AI-powered developer platform</span><h1>High-graphics React website for ForgeORM, ForgePDF and Fervidex Systems.</h1><p>Comprehensive product pages, searchable Wiki, interactive examples, API help, benchmarks and marketplace-ready content for your .NET and AI engineering tools.</p><div className="actions"><button onClick={()=>go('wiki')}>Open Wiki <BookOpen size={18}/></button><button className="ghost" onClick={()=>go('playground')}>Try Playground <Play size={18}/></button></div></motion.div><motion.div initial={{opacity:0,scale:.92}} animate={{opacity:1,scale:1}} transition={{delay:.15}} className="aiPanel"><div className="glassTop"><TerminalSquare/><span>AI Architecture Console</span></div><pre><code>{`dotnet add package ForgeORM
await db.QueryAsync<ProductDto>(query);
await db.BulkInsertAsync(products);
await renderer.RenderHtmlAsync(html);
forgepdf render invoice.html invoice.pdf`}</code></pre><div className="pulseRows"><span/><span/><span/></div><div className="metrics"><b>V1–V4</b><span>Roadmap</span><b>20+</b><span>ORM features</span><b>PDF</b><span>Engine</span></div></motion.div></section>}
function Badges(){return <div className="badges"><span><BadgeCheck/> NuGet: ForgeORM</span><span><BadgeCheck/> NuGet: ForgePDF</span><span><Star/> GitHub Stars: 1.2k+</span><span><Star/> Production-ready docs</span></div>}
function Products({go}){return <><PageHero title="Products" desc="A complete ecosystem for data access, document rendering, architecture scaffolding and enterprise delivery."/><div className="productGrid"><Product name="ForgeORM" tag="V1–V4 data platform roadmap" icon={<Database/>} bullets={[...ormV1.slice(0,4),...ormV2.slice(0,4),...ormV3.slice(0,2),...ormV4.slice(0,2)]} go={go}/><Product name="ForgePDF" tag="HTML/CSS to PDF engine" icon={<FileText/>} bullets={pdfFeatures} go={go}/><Product name="OnionForge" tag="Onion Architecture + DDD + CQRS" icon={<Layers3/>} bullets={['Clean Architecture scaffolding','Commands and queries','Handlers and endpoints','AI code suggestions','VS / VS Code / CLI packaging']} go={go}/><Product name="SliceForge" tag="Vertical Slice generator" icon={<Boxes/>} bullets={['Feature-first modules','CRUD endpoints','Minimal APIs','Dependency wiring','Marketplace-ready developer experience']} go={go}/></div></>}
function Product({name,tag,icon,bullets,go}){return <motion.article whileHover={{y:-6}} className="product"><div className="phead">{icon}<div><h3>{name}</h3><span>{tag}</span></div></div><ul>{bullets.map(x=><li key={x}><CheckCircle2/> {x}</li>)}</ul><button onClick={()=>name==='ForgeORM'?go('forgeorm-full-wiki'):go('wiki')}>Read Wiki <ArrowRight size={16}/></button></motion.article>}

function Wiki(){
  const [q,setQ]=useState('');
  const docs=useMemo(()=>wikiDocs.filter(d=>(d.title+d.body+d.items.join(' ')+d.code).toLowerCase().includes(q.toLowerCase())),[q]);
  const scrollDoc=(id)=>{const el=document.getElementById(id); if(el) el.scrollIntoView({behavior:'smooth',block:'start'});};
  const links=[['orm-v1','ForgeORM V1'],['orm-v2','ForgeORM V2'],['orm-v3','ForgeORM V3'],['orm-v4','ForgeORM V4'],['pdf','ForgePDF'],['ai','AI & Redis'],['help','Help / FAQ']];
  return <><PageHero title="ForgeORM + ForgePDF Wiki" desc="Comprehensive feature documentation, examples and help pages for product users, clients and marketplace visitors."/><div className="searchBox"><Search/><input placeholder="Search docs: V1, V2, bulk, Redis, outbox, vector, AI, PDF, header, footer..." value={q} onChange={e=>setQ(e.target.value)}/></div><div className="wikiLayout"><aside>{links.map(([id,label])=><button className="wikiSideLink" type="button" key={id} onClick={()=>scrollDoc(id)}>{label}</button>)}<button className="sideCta" onClick={()=>{location.hash='forgeorm-full-wiki'; scrollTo(0,0)}}>Open Complete ForgeORM Wiki</button></aside><section>{docs.map(d=><Doc key={d.id} {...d}/>)}</section></div></>}
const wikiDocs=[
{id:'orm-v1',title:'ForgeORM V1 — Core Micro ORM Foundation',body:'V1 should establish the stable core: simple APIs, high performance, safe SQL, stored procedures, query builder, DTO projection and optional filters. This makes ForgeORM immediately useful for real projects before advanced features are added.',items:ormV1,code:`// V1: raw SQL + DTO projection
var customers = await db.QueryAsync<CustomerListDto>(
    "SELECT Id, Name, Email FROM Customers WHERE IsDeleted = 0 AND Name LIKE @search",
    new { search = $"%{search}%" });

// V1: optional filters + pagination
var query = ForgeSql.Select<Customer>()
    .From("Customers c")
    .Columns("c.Id", "c.Name", "c.Email", "c.CreatedAt")
    .WhereIf(!string.IsNullOrWhiteSpace(search), "c.Name LIKE @search", new { search = $"%{search}%" })
    .WhereIf(status != null, "c.Status = @status", new { status })
    .OrderByDescending("c.Id")
    .Page(page, pageSize);

var result = await db.QueryAsync<CustomerListDto>(query);`},
{id:'orm-v2',title:'ForgeORM V2 — Enterprise Operations',body:'V2 adds enterprise features required in real SaaS and line-of-business systems: bulk operations, transactions, multi-tenancy, auditing, soft delete, history, Redis cache adapters and telemetry.',items:ormV2,code:`// V2: bulk operations
await db.BulkInsertAsync(products, batchSize: 5000);
await db.BulkUpdateAsync(products, key: x => x.Id);
await db.BulkDeleteAsync<Product>(ids);

// V2: tenant-aware query
var invoices = await db.QueryAsync<InvoiceDto>(
    ForgeSql.Select<Invoice>()
        .From("Invoices i")
        .Tenant("i.TenantId", tenantId)
        .Where("i.IsDeleted = 0")
        .OrderByDescending("i.InvoiceDate"));

// V2: cache adapter is configured by the user application
services.AddForgeOrmCaching();
services.AddStackExchangeRedisCache(o => o.Configuration = configuration["Redis:ConnectionString"]);`},
{id:'orm-v3',title:'ForgeORM V3 — Intelligence, Reporting, Outbox and Vector Search',body:'V3 is where ForgeORM becomes more than a micro ORM. It adds outbox reliability, reporting DSL, split queries, JSON streaming, AI diagnostics and vector search extension points for RAG and semantic applications.',items:ormV3,code:`// V3: outbox event
await db.TransactionAsync(async tx =>
{
    await tx.InsertAsync(order);
    await tx.Outbox.EnqueueAsync(new OrderCreated(order.Id, order.CustomerId));
});

// V3: vector search extension point
var matches = await db.VectorSearchAsync<ProductEmbedding>(new VectorSearchRequest
{
    Vector = embedding,
    Top = 10,
    FilterSql = "TenantId = @tenantId",
    Parameters = new { tenantId }
});

// V3: AI diagnostics
var explanation = await db.Ai.ExplainQueryAsync(query, provider: "OpenAI|Gemini|Claude|Private");`},
{id:'orm-v4',title:'ForgeORM V4 — Studio, SaaS Platform and AI Automation',body:'V4 is the viral product layer: React Studio, ERD designer, query visualizer, API testing, SaaS dashboard, monitoring, AI optimization, AI code generation and AI migrations.',items:ormV4,code:`// V4: AI migration generation concept
var migration = await forgeStudio.GenerateMigrationAsync(new MigrationPrompt
{
    DatabaseProvider = "SqlServer",
    ExistingSchema = schemaSnapshot,
    Requirement = "Add product inventory tracking with audit history and tenant isolation"
});

// V4: query visualizer concept
var plan = await forgeStudio.AnalyzeQueryPlanAsync(sql, parameters);
var optimizedSql = await forgeStudio.Ai.OptimizeSqlAsync(sql, providerOptions);`},
{id:'pdf',title:'ForgePDF Wiki — Rendering, CLI and Live Demo Help',body:'ForgePDF is positioned as a custom HTML/CSS to PDF engine for invoices, reports, enterprise statements and multilingual documents. It should ship with library APIs, CLI, Minimal API samples and accurate layout guidance.',items:pdfFeatures,code:`// ForgePDF Minimal API example
app.MapPost("/api/pdf/render", async (RenderPdfRequest request, IForgePdfRenderer renderer) =>
{
    var pdf = await renderer.RenderHtmlAsync(request.Html, new PdfRenderOptions
    {
        PageSize = PdfPageSize.A4,
        RepeatHeader = true,
        RepeatFooter = true,
        EnableTablePagination = true
    });

    return Results.File(pdf, "application/pdf", "document.pdf");
});

// CLI example
// forgepdf render invoice.html invoice.pdf --page A4 --header --footer`},
{id:'ai',title:'AI Endpoint and Redis Strategy',body:'Do not pay for a fixed built-in AI model for every user. The best product strategy is provider-agnostic AI: let users bring their own OpenAI, Gemini, Claude, Azure OpenAI, local LLM or private gateway endpoint. Redis should not be hardcoded; provide adapters and let the user configure their own Redis server.',items:['Bring-your-own AI endpoint','Support OpenAI, Gemini, Claude, Azure OpenAI and private LLMs','Keep API key in user configuration','Expose Redis adapter but do not own Redis hosting','Allow in-memory cache for local/dev','Provide safe defaults and interfaces'],code:`services.AddForgeOrmAi(options =>
{
    options.Provider = configuration["AI:Provider"];      // OpenAI, Gemini, Claude, Private
    options.Endpoint = configuration["AI:Endpoint"];      // user-owned endpoint
    options.ApiKey = configuration["AI:ApiKey"];          // user-owned key
    options.Model = configuration["AI:Model"];
});

services.AddForgeOrmRedisCaching(options =>
{
    options.ConnectionString = configuration["Redis:ConnectionString"];
    options.DefaultTtl = TimeSpan.FromMinutes(10);
});`},
{id:'help',title:'Help / FAQ',body:'Recommended packaging: keep the core fast and dependency-light, then add provider-specific packages and optional adapters. This avoids bloated dependencies and makes NuGet packages easier to understand.',items:['ForgeORM.Core','ForgeORM.SqlServer','ForgeORM.PostgreSql','ForgeORM.RedisCaching','ForgeORM.AI.Abstractions','ForgePDF.Core','ForgePDF.Cli','ForgePDF.AspNetCore'],code:`dotnet add package ForgeORM.Core
dotnet add package ForgeORM.SqlServer
dotnet add package ForgeORM.RedisCaching
dotnet add package ForgePDF.Core
dotnet tool install --global ForgePDF.Cli`}
];
function Doc({id,title,body,items,code}){return <article id={id} className="doc"><h2>{title}</h2><p>{body}</p><div className="chips">{items.map(i=><span key={i}>{i}</span>)}</div><div className="codeHead"><span>Example</span><Copy size={16}/></div><pre className="syntax"><code>{code}</code></pre></article>}

function Playground(){const [entity,setEntity]=useState('Product');const [min,setMin]=useState('100');const [page,setPage]=useState('1');const sql=`SELECT p.Id, p.Name, p.Price, c.Name AS CategoryName\nFROM ${entity}s p\nLEFT JOIN Categories c ON p.CategoryId = c.Id\nWHERE p.IsDeleted = 0 AND p.Price >= @minPrice\nORDER BY p.Id DESC\nOFFSET ${(Number(page)-1)*20} ROWS FETCH NEXT 20 ROWS ONLY;`; const html='<header>Invoice #1001</header><main><h1>Fervidex Systems</h1><table><tr><td>ForgePDF</td><td>$99</td></tr></table></main><footer>Thank you</footer>'; return <><PageHero title="Interactive Playground" desc="Try the ORM query visualizer concept and ForgePDF live demo UI that can later connect to real APIs."/><div className="playGrid"><section className="tool"><h2>ORM Query Playground</h2><label>Entity<input value={entity} onChange={e=>setEntity(e.target.value)}/></label><label>Minimum Price<input value={min} onChange={e=>setMin(e.target.value)}/></label><label>Page<input value={page} onChange={e=>setPage(e.target.value)}/></label><pre className="syntax"><code>{sql}</code></pre></section><section className="tool"><h2>PDF Live Demo</h2><textarea defaultValue={html}/><div className="pdfPreview"><h3>PDF Preview</h3><p>Invoice #1001</p><b>Fervidex Systems</b><table><tbody><tr><td>ForgePDF</td><td>$99</td></tr></tbody></table><small>Rendered preview placeholder — connect this panel to ForgePDF API.</small></div></section></div></>}
function ApiDocs(){return <><PageHero title="API Documentation" desc="Sample endpoints to document ForgeORM and ForgePDF demos."/><div className="apiList">{[['POST','/api/pdf/render','Render HTML to PDF and return application/pdf.'],['POST','/api/orm/query','Execute safe query builder request.'],['POST','/api/orm/bulk/products','Bulk import products.'],['GET','/api/orm/benchmarks','Return benchmark metrics for charts.'],['POST','/api/ai/explain-query','Explain or optimize SQL using user-owned AI endpoint.']].map(x=><div className="endpoint" key={x[1]}><b>{x[0]}</b><code>{x[1]}</code><span>{x[2]}</span></div>)}</div></>}
function Blog({setPage}){const go=(e,slug)=>{e.preventDefault();setPage(slug);location.hash=slug;scrollTo(0,0)};return <><PageHero title="Blog Engine" desc="SEO-ready articles connected to full pages with code examples, product positioning and implementation guidance."/><div className="blogGrid">{articles.map((p,i)=><article className="post" key={p.slug}><span>{p.category} · Article {i+1}</span><h2>{p.title}</h2><p>{p.summary}</p><a className="readArticle" href={`#${p.slug}`} onClick={(e)=>go(e,p.slug)}>Read article</a></article>)}</div></>}

const articles=[
{slug:'article-forgeorm-viral',category:'ForgeORM',title:'Why ForgeORM can become a viral .NET data platform',summary:'A product strategy article explaining how ForgeORM can go beyond Dapper-style data access and become a complete SQL intelligence layer.',sections:[
['The opportunity','Most .NET teams either use EF Core for productivity or Dapper for speed. ForgeORM can win attention by combining micro-ORM performance with enterprise features that usually require many separate libraries.'],
['What makes it different','The viral angle is not only QueryAsync. It is optional filters, query builder, safe SQL interpolation, stored procedures, bulk operations, multi-tenancy, auditing, outbox, telemetry, vector search and AI-assisted diagnostics in one coherent developer experience.'],
['V1 to V4 positioning','V1 should be fast and simple. V2 should be enterprise-ready. V3 should add intelligence, outbox, reporting and vector search. V4 should become the Studio layer with ERD designer, query visualizer, SaaS dashboard and AI migration support.'],
['Go-to-market examples','Publish BenchmarkDotNet results, short LinkedIn demos, NuGet quick-start snippets and sample APIs showing real business scenarios such as products, invoices, customers and reports.']
],code:`// A viral ForgeORM example should be short, powerful and practical
var result = await db.QueryAsync<ProductDto>(
    ForgeSql.Select<Product>()
        .From("Products p")
        .LeftJoin<Category>("Categories c", "p.CategoryId = c.Id")
        .Columns("p.Id", "p.Name", "p.Price", "c.Name AS CategoryName")
        .WhereIf(search.HasValue(), "p.Name LIKE @search", new { search = $"%{search}%" })
        .Tenant("p.TenantId", tenantId)
        .OrderByDescending("p.Id")
        .Page(page, pageSize));`},
{slug:'article-ai-strategy',category:'AI',title:'Provider-agnostic AI strategy for developer tools',summary:'How ForgeORM and Fervidex products can support OpenAI, Gemini, Claude, Azure OpenAI and private AI endpoints without forcing vendor cost.',sections:[
['Why bring-your-own AI is better','Bundling your own AI for every customer creates direct recurring cost, billing complexity and data privacy concerns. A bring-your-own endpoint strategy makes enterprise adoption easier because customers keep control of keys, endpoints and compliance.'],
['Supported providers','Design the abstraction to support OpenAI, Azure OpenAI, Gemini, Claude, local LLMs and private API gateways. The application should not care which provider is behind the interface.'],
['Security model','Never store API keys in source code. Use environment variables, Azure App Settings, Key Vault, GitHub Actions secrets or customer-managed configuration.'],
['Product features enabled by AI','AI can explain SQL, optimize queries, generate migrations, suggest indexes, detect N+1 patterns, generate DTOs and create sample Minimal API endpoints.']
],code:`services.AddForgeOrmAi(options =>
{
    options.Provider = configuration["AI:Provider"];      // OpenAI, Gemini, Claude, AzureOpenAI, Private
    options.Endpoint = configuration["AI:Endpoint"];
    options.ApiKey = configuration["AI:ApiKey"];
    options.Model = configuration["AI:Model"];
});

var diagnosis = await db.Ai.ExplainQueryAsync(sql, new AiExplainOptions
{
    IncludeIndexes = true,
    IncludeExecutionPlanHints = true
});`},
{slug:'article-forgepdf-engine',category:'ForgePDF',title:'Building a custom HTML/CSS to PDF engine in .NET',summary:'A technical article for explaining ForgePDF rendering, layout boxes, pagination, CLI usage and API integration.',sections:[
['Why custom PDF rendering matters','Enterprise systems need invoices, statements, score reports and regulatory documents. A custom engine gives you control over layout, headers, footers, pagination and streaming.'],
['Core architecture','ForgePDF should parse HTML/CSS into a DOM and computed style tree, convert it into layout boxes, paginate content, then paint text, borders, images, tables and repeated headers or footers.'],
['Hard problems','The important challenges are table pagination, card overflow, exact sizing, image rendering, RTL text, Urdu/Arabic shaping and consistent output between browser preview and PDF.'],
['Developer experience','Ship a library, ASP.NET Core integration, CLI tool and clear samples. Users should be able to render a PDF from a Minimal API endpoint or command line in minutes.']
],code:`app.MapPost("/api/pdf/render", async (RenderPdfRequest request, IForgePdfRenderer renderer) =>
{
    var bytes = await renderer.RenderHtmlAsync(request.Html, new PdfRenderOptions
    {
        PageSize = PdfPageSize.A4,
        RepeatHeader = true,
        RepeatFooter = true,
        EnableTablePagination = true
    });

    return Results.File(bytes, "application/pdf", "document.pdf");
});

// CLI
// forgepdf render invoice.html invoice.pdf --page A4 --header --footer`},
{slug:'article-clean-architecture-generators',category:'Architecture',title:'Clean Architecture generators: OnionForge and SliceForge',summary:'A product education article showing how architecture generators reduce setup time for Clean Architecture, CQRS and Vertical Slice applications.',sections:[
['The repetitive work problem','Most enterprise APIs repeat the same setup: projects, folders, commands, queries, handlers, validators, endpoints, dependency injection and tests. Generators reduce this waste.'],
['OnionForge positioning','OnionForge should focus on Onion Architecture, DDD, CQRS, commands, queries, handlers, domain events and clean dependency boundaries.'],
['SliceForge positioning','SliceForge should focus on vertical slices: feature folders, Minimal API endpoints, request/response models, validators and handlers close to the feature.'],
['Why it helps teams','Generators enforce consistency, speed up onboarding, reduce architecture drift and allow senior architects to encode best practices into repeatable tooling.']
],code:`// SliceForge example
sliceforge add-crud \
  --entity Product \
  --module Products \
  --properties "Name:string,Price:decimal,CategoryId:Guid"

// OnionForge example
onionforge add-command --name CreateProduct --module Products
onionforge add-query --name GetProductById --module Products`},
{slug:'article-stability-updates',category:'ForgeORM Bible',title:'ForgeORM Stability Updates: What changed and why it matters',summary:'A practical guide to the latest ForgeORM reliability fixes: analytics execution, cancellation token safety, enum mapping, stream imports and regression testing.',sections:[
['Why stability matters','ForgeORM is moving from an experimental toolkit into a platform. That means stable behavior is more important than random rewrites. Recent work focuses on additive bug fixes, safer execution and stronger developer trust.'],
['Key fixes','The latest updates address analytics execution through ToDynamicListAsync, CancellationToken parameter binding, automatic enum mapping, stream-based CSV/JSON import overloads, numeric CSV headers and SQL identifier safety.'],
['Developer impact','Teams can now use ForgeORM in demos and enterprise prototypes with fewer surprises. The API surface remains familiar while the runtime becomes safer and more predictable.'],
['Recommended workflow','After every package update, run regression tests for query execution, dynamic results, CSV/JSON imports, enum mapping, record mapping, SplitGraph and analytics rendering.']
],code:`// Safe analytics execution should pass CancellationToken by name
public async Task<IReadOnlyList<IDictionary<string, object?>>> ToDynamicListAsync(
    CancellationToken cancellationToken = default)
{
    var render = Render();

    return await _db.QueryDynamicAsync(
        sql: render.Sql,
        parameters: render.Parameters,
        cancellationToken: cancellationToken);
}`},
{slug:'article-stream-csv-json-imports',category:'DataFrames',title:'Stream-based CSV and JSON imports in ForgeORM DataFrames',summary:'How ForgeDataFrame supports API uploads, blob streams and enterprise ETL without forcing temporary files.',sections:[
['Why streams are important','Enterprise applications rarely work only with local files. Data may come from HTTP uploads, Azure Blob Storage, AWS S3, message queues or in-memory pipelines. Stream overloads make imports flexible and cloud-ready.'],
['CSV stream import','CSV import should support path-based and stream-based APIs. This keeps backward compatibility while enabling ASP.NET file upload scenarios.'],
['JSON stream import','JSON imports follow the same model, making it easy to ingest uploaded JSON datasets and persist them as database tables.'],
['Developer experience','The user should provide a table name, upload a file and let ForgeORM infer schema, normalize dirty data and persist rows safely.']
],code:`app.MapPost("/dataframes/import/csv-to-table", async (
    IFormFile file,
    string tableName,
    ForgeDbContext db,
    CancellationToken ct) =>
{
    await using var stream = file.OpenReadStream();

    var frame = await ForgeDataFrame.FromCsvAsync(stream, ct);

    await frame.ToTableAsync(
        db,
        tableName: tableName,
        cancellationToken: ct);

    return Results.Ok(new { tableName, rows = frame.RowCount, columns = frame.Columns });
});`},
{slug:'article-dirty-data-handling',category:'DataFrames',title:'Pandas-like dirty data handling for CSV and JSON imports',summary:'ForgeORM DataFrames should treat ?, N/A, null and nan as NULL so imports do not fail on real-world data.',sections:[
['Real data is messy','CSV and JSON files from business systems often contain ?, NA, N/A, null, nan, blanks or placeholder dashes. A strong DataFrame layer must handle these values automatically.'],
['Pandas-like behavior','Instead of failing when a numeric column contains ?, ForgeORM should normalize null-like values and insert NULL into the database.'],
['Better type inference','Column type inference should ignore null-like values. A mostly numeric column with a few ? values should still become numeric, with dirty placeholders inserted as NULL.'],
['Why this matters','This improves analytics imports, reporting dashboards and enterprise ETL scenarios where source files are rarely clean.']
],code:`private static bool IsNullLike(object? value)
{
    if (value is null || value is DBNull) return true;

    var text = value.ToString()?.Trim();

    return string.IsNullOrWhiteSpace(text)
        || text == "?"
        || text == "-"
        || text == "--"
        || text.Equals("NA", StringComparison.OrdinalIgnoreCase)
        || text.Equals("N/A", StringComparison.OrdinalIgnoreCase)
        || text.Equals("null", StringComparison.OrdinalIgnoreCase)
        || text.Equals("nan", StringComparison.OrdinalIgnoreCase);
}`},
{slug:'article-safe-sql-identifiers',category:'Security',title:'Safe dynamic table names and SQL identifiers in ForgeORM',summary:'Dynamic DataFrame imports need safe table names, escaped columns and parameterized values to avoid SQL injection and invalid SQL.',sections:[
['The problem','CSV files may contain columns such as 1980 or names with spaces. SQL Server requires identifiers like these to be escaped as [1980].'],
['The safety rule','Always validate user-provided table names and always escape generated column names. Values must always be parameters, never string-concatenated SQL.'],
['Where it is used','This matters in ToTableAsync, CSV imports, JSON imports, dynamic table creation and DataFrame persistence.'],
['Enterprise recommendation','Keep identifier validation inside ForgeORM.Core or ForgeORM.DataFrame so sample applications do not need to reinvent safety logic.']
],code:`if (!ForgeSqlNameValidator.IsSafeIdentifier(tableName))
    return Results.BadRequest("Invalid table name.");

// Column names like 1980 become [1980]
var columnSql = string.Join(", ", frame.Columns.Select(ForgeSqlNameValidator.EscapeIdentifier));`},
{slug:'article-analytics-window-functions',category:'Analytics',title:'Window functions in ForgeORM: running totals, ranks and analytics queries',summary:'How ForgeORM turns advanced SQL analytics into fluent C# APIs using RowNumber, Rank, Lag, Lead, Sum and Percentile functions.',sections:[
['Why window functions matter','Reports, dashboards and financial analytics often need ranking, running totals, previous values and grouped aggregates without losing row detail.'],
['ForgeORM fluent API','Developers can express window functions using typed C# expressions while still generating SQL Server-friendly analytics queries.'],
['Execution vs preview','Use the SQL preview endpoint to show generated SQL and the execution endpoint to return calculated rows. Both are useful in a playground and documentation portal.'],
['Best use cases','Use window functions for customer order ranking, running revenue, percentiles, year-over-year calculations and operational dashboards.']
],code:`var result = await db.Analytics<Order>()
    .From("Orders")
    .Select(x => x.Id)
    .Select(x => x.OrderNo)
    .RowNumber()
        .PartitionBy(x => x.CustomerId)
        .OrderByDescending(x => x.CreatedAt)
        .As("RowNo")
    .Sum(x => x.GrandTotal)
        .PartitionBy(x => x.CustomerId)
        .OrderBy(x => x.CreatedAt)
        .RowsBetweenUnboundedPrecedingAndCurrentRow()
        .As("RunningSales")
    .ToDynamicListAsync(ct);`},
{slug:'article-forgeorm-architecture-packages',category:'Architecture',title:'ForgeORM package architecture: Core, QueryAst, Analytics, DataFrame and AspNetCore',summary:'A clean package separation strategy that keeps ForgeORM stable while allowing analytics, web integration and AI features to grow independently.',sections:[
['Core package','ForgeORM.Core should contain the stable low-level engine: ForgeDbContext, ForgeAdo, materialization, value conversion, CRUD, transactions and safe execution.'],
['QueryAst package','ForgeORM.QueryAst should contain query builders, SplitGraph, search builders, expression parsing and SQL rendering.'],
['Analytics and DataFrame packages','Analytics and DataFrame features should remain optional so the core ORM stays lightweight while advanced reporting users can add richer modules.'],
['AspNetCore integration','ForgeORM.AspNetCore should provide the easiest onboarding path for web applications, including AddForgeOrm, middleware, health checks, Swagger helpers and JSON enum configuration.']
],code:`// Recommended application setup
builder.Services.AddForgeOrm(options =>
{
    options.UseSqlServer(connectionString);
    options.EnableAnalytics();
    options.EnableDataFrames();
    options.EnableTelemetry();
});

app.UseForgeOrm();`},
{slug:'article-regression-testing-forgeorm',category:'Testing',title:'Regression testing strategy for ForgeORM releases',summary:'A release-quality test plan for preventing repeated bugs in analytics, DataFrames, enum mapping, SplitGraph and dynamic SQL.',sections:[
['Why tests are now critical','ForgeORM is published to NuGet, so every update must preserve existing behavior. Tests protect the product from accidental rewrites and breaking changes.'],
['Core tests','Test record constructor mapping, enum conversions, nullable values, dynamic query results, IN parameter expansion and CancellationToken handling.'],
['DataFrame tests','Test CSV and JSON imports, stream overloads, dirty-data normalization, numeric headers, schema inference and ToTableAsync inserts.'],
['Analytics tests','Test SQL rendering and execution for RowNumber, Rank, DenseRank, Lag, Lead, Sum, Avg and running totals.']
],code:`[Fact]
public async Task QueryDynamicAsync_Should_Not_Bind_CancellationToken_As_Parameter()
{
    var result = await db.Analytics<Order>()
        .From("Orders")
        .Select(x => x.Id)
        .RowNumber()
            .PartitionBy(x => x.CustomerId)
            .OrderByDescending(x => x.CreatedAt)
            .As("RowNo")
        .ToDynamicListAsync(CancellationToken.None);

    Assert.NotNull(result);
}`},
{slug:'article-best-practices-enterprise',category:'Best Practices',title:'Enterprise best practices for using ForgeORM',summary:'Practical guidance for choosing Search APIs, SplitGraph, TVP, DataFrames and Analytics in real systems.',sections:[
['Use Search APIs for grids','Admin grids and search screens need optional filters and pagination. ForgeORM Search APIs give a repeatable pattern for these endpoints.'],
['Use SplitGraph for large object graphs','SplitGraph avoids cartesian explosion when loading parents and children, making it better for enterprise screens and reports.'],
['Use TVP for large inserts','When inserting parent-child data or bulk rows, SQL Server TVPs provide scalable performance and clean transaction handling.'],
['Use DataFrames for imports','CSV and JSON imports should land in DataFrames first, then be validated, cleaned, transformed and persisted into database tables.']
],code:`// Decision guide
// Search API      -> optional filters and paging
// SplitGraph      -> parent/child loading
// TVP             -> large inserts
// Analytics       -> reporting and window functions
// DataFrame       -> CSV/JSON import and transformation
// Raw SQL         -> advanced hand-tuned queries`}
,
{slug:'article-queryast-splitgraph-architecture',category:'Architecture',title:'Why SplitGraph belongs in ForgeORM.QueryAst',summary:'SplitGraph is query-composition infrastructure, so it belongs in QueryAst rather than Core or sample projects.',sections:[
['Clean module boundaries','ForgeORM.Core should stay focused on ADO.NET execution, materialization, transactions and stable CRUD behavior. SplitGraph depends on query composition and relationship loading, so QueryAst is the correct home.'],
['User experience','Applications should still call db.SplitGraph<T>() through a simple extension. The complexity stays inside the library and the user only installs the integration package.'],
['Package strategy','ForgeORM.AspNetCore should reference Core and QueryAst so web projects get SplitGraph, Search APIs and query builders with one setup call.'],
['Best practice','Never push relationship-loading internals into samples. Samples should demonstrate usage, not ask users to build the ORM.']
],code:`var customers = await db.SplitGraph<Customer>()
    .IncludeOne<CustomerProfile, int>(
        ids => "SELECT * FROM CustomerProfiles WHERE CustomerId IN @Ids",
        c => c.Id,
        p => p.CustomerId,
        (c, p) => c.Profile = p)
    .ToListAsync("SELECT * FROM Customers", cancellationToken: ct);`},
{slug:'article-aspnetcore-package-onboarding',category:'ASP.NET Core',title:'ForgeORM.AspNetCore: one package for web application onboarding',summary:'Why ASP.NET applications should reference ForgeORM.AspNetCore for DI, middleware, JSON enums, health checks and Swagger helpers.',sections:[
['Why this package matters','Developers do not want to manually wire every ForgeORM service. ForgeORM.AspNetCore should provide AddForgeOrm and UseForgeOrm as the main onboarding path.'],
['What it should register','The package should register ForgeDbContext, providers, QueryAst, Search, Analytics, DataFrames, health checks, telemetry, JSON enum options and middleware.'],
['Better samples','ForgeCommerce and future demos should depend on ForgeORM.AspNetCore so users see the easiest possible setup.'],
['Enterprise polish','A clean integration package makes ForgeORM feel mature and production-ready.']
],code:`builder.Services.AddForgeOrm(options =>
{
    options.UseSqlServer(connectionString);
    options.EnableAnalytics();
    options.EnableDataFrames();
    options.EnableTelemetry();
});

app.UseForgeOrm();`},
{slug:'article-dataframe-to-sql-table-imports',category:'DataFrames',title:'Turning CSV and JSON files into SQL tables with ForgeORM DataFrames',summary:'A practical guide for uploading files, choosing table names, cleaning data and querying imported tables.',sections:[
['Import workflow','The user uploads a CSV or JSON file, provides a safe table name, ForgeORM reads the stream, normalizes dirty values and persists the frame into SQL.'],
['Safe identifiers','User-provided table names must be validated and column names must be escaped. This is essential for files with numeric headers like 1980 or names containing spaces.'],
['Null-like values','Values such as ?, N/A, null, nan and blank strings should become database NULL values instead of breaking numeric inserts.'],
['Query after import','After persistence, users can query imported tables with Frame APIs or QueryDynamicAsync for analytics and dashboards.']
],code:`app.MapPost("/dataframes/import/csv-to-table", async (
    IFormFile file,
    string tableName,
    ForgeDbContext db,
    CancellationToken ct) =>
{
    await using var stream = file.OpenReadStream();
    var frame = await ForgeDataFrame.FromCsvAsync(stream, ct);
    await frame.ToTableAsync(db, tableName, cancellationToken: ct);
    return Results.Ok(new { tableName, rows = frame.RowCount, columns = frame.Columns });
});`},
{slug:'article-forgecommerce-demo-walkthrough',category:'Demo',title:'ForgeCommerce demo walkthrough: proving ForgeORM in a real app',summary:'How the ForgeCommerce demo demonstrates search, records, enums, SplitGraph, analytics and DataFrames in one application.',sections:[
['Why ForgeCommerce exists','A polished demo is the fastest way to build trust. It shows developers what ForgeORM looks like in real Minimal APIs and enterprise architecture.'],
['Feature coverage','The demo includes products, orders, customers, analytics, DataFrame import endpoints, SQL preview, record mapping and enum mapping.'],
['What to improve next','Add dashboards, charts, file upload UI, benchmark pages and guided playground examples.'],
['Adoption value','A real demo makes the documentation believable and helps users clone, run and learn quickly.']
],code:`GET /products
GET /products/search
GET /orders/customer/{customerId}
GET /customers/split
GET /analytics/window-functions
POST /dataframes/import/csv-to-table`},
{slug:'article-forgeorm-release-stability',category:'Release Strategy',title:'ForgeORM release stability: additive features and safe bug fixes',summary:'A NuGet product must avoid changing core behavior every release. New versions should be stable, additive and well-tested.',sections:[
['Stable baseline','ForgeORM 1.x should keep public behavior stable. Patch versions should fix bugs only, while minor versions should add backward-compatible features.'],
['Avoid rewrites','Core execution logic should not be rewritten casually after NuGet publication. Refactor internally only when tests prove compatibility.'],
['Testing gate','Every release should pass regression tests for QueryAsync, dynamic mapping, DataFrames, analytics, SplitGraph, enum mapping and record mapping.'],
['Product trust','Predictable releases build developer trust faster than endless new features.']
],code:`1.3.0  Stable release
1.3.1  Bug fixes only
1.4.0  Additive features
2.0.0  Breaking changes only when unavoidable`}

];

function ArticlePage({slug}){const article=articles.find(a=>a.slug===slug)||articles[0];return <><PageHero title={article.title} desc={article.summary}/><article className="articlePage"><div className="articleMeta"><span>{article.category}</span><span>Fervidex Systems Knowledge Base</span><span>SEO Article</span></div>{article.sections.map(([h,b])=><section key={h}><h2>{h}</h2><p>{b}</p></section>)}<div className="codeHead"><span>Implementation example</span><Copy size={16}/></div><pre className="syntax"><code>{article.code}</code></pre><div className="articleLinks"><a href="#blog">Back to blog</a><a href="#wiki">Open Wiki</a><a href="#playground">Try Playground</a></div></article></>}
function Benchmarks(){const rows=[['Raw query',95],['Bulk insert',88],['Cached query',98],['PDF render',82]];return <section className="section"><h2>Benchmark Charts</h2><p className="sub">Visual benchmark section for marketing. Replace placeholder values with real BenchmarkDotNet results later.</p><div className="chart">{rows.map(([name,val])=><div className="bar" key={name}><span>{name}</span><i style={{width:`${val}%`}}/><b>{val}%</b></div>)}</div></section>}
function About(){return <><PageHero title="About Fervidex Systems" desc="A brand built around passion, dedication, love for programming, motivation and struggle."/><Section title="Mission" sub="Build practical developer tools that reduce repetitive work and turn enterprise patterns into reusable products."><div className="aboutPanel"><img src={logo}/><p>Fervidex Systems provides solutions in .NET, Python and other modern stacks, with product focus on ForgeORM, ForgePDF, OnionForge and SliceForge.</p></div></Section></>}
function Section({title,sub,children}){return <section className="section"><h2>{title}</h2>{sub&&<p className="sub">{sub}</p>}{children}</section>}
function PageHero({title,desc}){return <section className="pageHero"><span className="eyebrow"><Zap size={16}/> Fervidex Systems</span><h1>{title}</h1><p>{desc}</p></section>}
function Card({title,icon,desc}){return <motion.div whileHover={{y:-5}} className="card"><div className="icon">{icon}</div><h3>{title}</h3><p>{desc}</p></motion.div>}
function CTA({go}){return <section className="cta"><h2>Comprehensive docs make the products easier to sell.</h2><p>Use the Wiki, Playground, Blog and API pages as the base for Azure Static Web Apps deployment.</p><button onClick={()=>go('wiki')}>View Documentation</button></section>}
function Footer({go}){return <footer><div><b>Fervidex Systems</b><p>AI-ready engineering products for enterprise software teams.</p></div><div>{nav.map(([k,v])=><button onClick={()=>go(k)} key={k}>{v}</button>)}</div></footer>}
createRoot(document.getElementById('root')).render(<App/>);
