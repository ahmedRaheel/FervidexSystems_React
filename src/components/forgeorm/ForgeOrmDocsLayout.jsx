import React, { useMemo, useState } from 'react';
import { ArrowRight, BookOpen, Braces, BrainCircuit, CheckCircle2, Copy, Database, LineChart, Search, ShieldCheck, Table2, Workflow, Zap } from 'lucide-react';
import { forgeOrmDocGroups, forgeOrmDocSections } from '../../data/forgeOrmDocs.js';

const iconMap = {
  overview: <Database />,
  dbcontext: <Braces />,
  'query-ast': <Workflow />,
  analytics: <LineChart />,
  dataframe: <Table2 />,
  ai: <BrainCircuit />,
  'vector-search': <Zap />,
  'table-valued-parameters': <Table2 />,
  'temporal-tables': <ShieldCheck />,
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

export default function ForgeOrmDocsLayout() {
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();

  const filteredSections = useMemo(() => {
    if (!q) return forgeOrmDocSections;
    return forgeOrmDocSections.filter((section) =>
      [section.title, section.eyebrow, section.summary, section.bullets.join(' '), section.code]
        .join(' ')
        .toLowerCase()
        .includes(q)
    );
  }, [q]);

  return (
    <div className="realDocsPage">
      <section className="realDocsHero">
        <div>
          <span className="realDocsKicker">ForgeORM Documentation</span>
          <h1>One comprehensive Learn + Docs page for ForgeORM.</h1>
          <p>
            A realistic product documentation page with enterprise examples for QueryAst, Db.Set&lt;&gt;,
            stored procedures, table-valued parameters, temporal tables, graph persistence, analytics,
            DataFrame workflows, AI and vector search.
          </p>
          <div className="realDocsHeroActions">
            <button type="button" onClick={() => scrollToId('dbcontext')}>Start with Db.Set&lt;&gt; <ArrowRight size={16} /></button>
            <button type="button" className="ghost" onClick={() => scrollToId('table-valued-parameters')}>TVP Example</button>
            <button type="button" className="ghost" onClick={() => scrollToId('dataframe')}>DataFrame</button>
          </div>
        </div>
        <div className="realDocsConsole">
          <div><span /> <span /> <span /></div>
          <pre>{`ForgeORM Docs
├─ Core APIs
├─ QueryAst
├─ Stored Procedures + TVPs
├─ Temporal Tables
├─ Graph Insert / Update / Delete
├─ DataFrame like pandas
└─ AI + Vector Search`}</pre>
        </div>
      </section>

      <section className="realDocsLayout">
        <aside className="realDocsSidebar">
          <label className="realDocsSearch"><Search size={16} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search docs..." /></label>
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
          <div className="realDocsNote">
            <b>Documentation direction:</b> each section includes explanation, API purpose, and a working-style C# or SQL example. The site keeps the original pages and adds this as the single ForgeORM documentation page instead of splitting LearnForgeORM and DocsForgeORM.
          </div>
          {filteredSections.map((section) => <SectionCard key={section.id} section={section} />)}
        </main>
      </section>
    </div>
  );
}
