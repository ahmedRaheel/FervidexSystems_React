import React, { useMemo, useState } from 'react';
import {
  Activity,
  ArrowRight,
  BookOpen,
  Boxes,
  Braces,
  BrainCircuit,
  CheckCircle2,
  Copy,
  Database,
  FileJson,
  GitBranch,
  History,
  Layers3,
  LineChart,
  Network,
  Search,
  ShieldCheck,
  Table2,
  TerminalSquare,
  Workflow,
  Zap
} from 'lucide-react';
import { forgeOrmDocGroups, forgeOrmDocSections, forgeOrmStats } from '../../data/forgeorm/index.ts';

const iconMap = {
  'platform-overview': <Database />,
  installation: <Boxes />,
  dbcontext: <Braces />,
  'query-methods': <TerminalSquare />,
  'forge-sql': <Database />,
  'query-ast': <Workflow />,
  'crud-commands': <Zap />,
  'graph-persistence': <GitBranch />,
  'include-split-query': <Network />,
  'bulk-operations': <Layers3 />,
  'stored-procedures': <Database />,
  'table-valued-parameters': <Table2 />,
  'temporal-tables': <History />,
  'execution-options': <ShieldCheck />,
  'csv-json-import-export': <FileJson />,
  dataframe: <Table2 />,
  'analytics-olap': <LineChart />,
  'search-vector-graph': <Zap />,
  'ai-features': <BrainCircuit />,
  'workflow-jobs-rules': <Workflow />,
  'performance-engine': <Activity />,
  benchmarks: <LineChart />
};

function byId(id) {
  return forgeOrmDocSections.find((x) => x.id === id);
}

function scrollToId(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className="docsCopy"
      onClick={async () => {
        await navigator.clipboard?.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      }}
    >
      <Copy size={15} /> {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

function SectionCard({ section }) {
  return (
    <article id={section.id} className="realDocSection">
      <div className="realDocSectionTop">
        <div className="realDocIcon">{iconMap[section.id] ?? <BookOpen />}</div>
        <div>
          <span>{section.eyebrow}</span>
          <h2>{section.title}</h2>
        </div>
        <em className="realDocStatus">{section.status}</em>
      </div>
      <p className="realDocSummary">{section.summary}</p>
      <div className="realDocBullets">
        {section.bullets.map((item) => (
          <span key={item}><CheckCircle2 size={15} /> {item}</span>
        ))}
      </div>
      <div className="realCodeShell">
        <div className="realCodeHead"><b>{section.title}</b><CopyButton value={section.code} /></div>
        <pre><code>{section.code}</code></pre>
      </div>
    </article>
  );
}

function HeroStats() {
  return (
    <div className="realDocsStats">
      {forgeOrmStats.map(([value, label]) => (
        <div key={label}>
          <strong>{value}</strong>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}

export default function ForgeOrmDocsLayout() {
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();

  const filteredSections = useMemo(() => {
    if (!q) return forgeOrmDocSections;
    return forgeOrmDocSections.filter((section) =>
      [section.title, section.eyebrow, section.status, section.summary, section.bullets.join(' '), section.code]
        .join(' ')
        .toLowerCase()
        .includes(q)
    );
  }, [q]);

  return (
    <div className="realDocsPage corporateDocsPage">
      <section className="realDocsHero corporateDocsHero">
        <div>
          <span className="realDocsKicker">ForgeORM Corporate Documentation</span>
          <h1>A complete documentation experience for ForgeORM.</h1>
          <p>
            covering implemented APIs, enterprise roadmap,
            graph persistence, temporal tables, CSV/JSON imports, QueryAst, ForgeSQL, DataFrames, AI, vector search,
            workflow engines, performance, security and operational features.
          </p>
          <div className="realDocsHeroActions">
            <button type="button" onClick={() => scrollToId('query-methods')}>Core query APIs <ArrowRight size={16} /></button>
            <button type="button" className="ghost" onClick={() => scrollToId('graph-persistence')}>Graph persistence</button>
            <button type="button" className="ghost" onClick={() => scrollToId('csv-json-import-export')}>CSV / JSON import</button>
            <button type="button" className="ghost" onClick={() => scrollToId('temporal-tables')}>Temporal tables</button>
          </div>
          <HeroStats />
        </div>
        <div className="realDocsConsole corporateDocsConsole">
          <div><span /> <span /> <span /></div>
          <pre>{`ForgeORM Enterprise Docs
├─ Query APIs + MSIL Materialization
├─ ForgeSQL + QueryAst
├─ Graph Insert / Update / Delete
├─ Temporal Tables + Audit History
├─ CSV / JSON Import + Export
├─ DataFrame + OLAP + Search
├─ AI + Vector + Workflow Roadmap
└─ Observability + Security + Benchmarks`}</pre>
        </div>
      </section>

      <section className="realDocsLayout corporateDocsLayout">
        <aside className="realDocsSidebar corporateDocsSidebar">
          <label className="realDocsSearch"><Search size={16} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search features, APIs, examples..." /></label>
          {forgeOrmDocGroups.map(([group, ids]) => (
            <div className="realDocsNavGroup" key={group}>
              <h3>{group}</h3>
              {ids.map((id) => {
                const item = byId(id);
                if (!item) return null;
                return <button type="button" key={id} onClick={() => scrollToId(id)}>{item.title}</button>;
              })}
            </div>
          ))}
        </aside>

        <main className="realDocsContent">
          <div className="realDocsNote corporateDocsNote">
            <b>Documentation policy:</b> implemented features, active work and enterprise roadmap are kept in one place.
             features that are not production-ready are labeled clearly
            and shown with practical API examples for future implementation.
          </div>
          {filteredSections.map((section) => <SectionCard key={section.id} section={section} />)}
        </main>
      </section>
    </div>
  );
}
