import React, { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import wikiMarkdown from "../docs/forgeorm-complete-wiki.md?raw";
import sidebar from "../docs/forgeorm-sidebar.json";

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/<[^>]*>/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function textFromChildren(children) {
  return React.Children.toArray(children)
    .map((child) => {
      if (typeof child === "string" || typeof child === "number") return child;
      if (child?.props?.children) return textFromChildren(child.props.children);
      return "";
    })
    .join("");
}

function Heading({ level, children }) {
  const text = textFromChildren(children);
  const id = slugify(text);
  const Tag = `h${level}`;
  return <Tag id={id}>{children}</Tag>;
}

export default function ForgeOrmWikiPage() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(sidebar[0]?.slug ?? "");

  const filteredSidebar = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sidebar;
    return sidebar.filter((item) => item.title.toLowerCase().includes(q));
  }, [query]);

  useEffect(() => {
    const onScroll = () => {
      let current = active;
      for (const item of sidebar) {
        const el = document.getElementById(item.slug);
        if (el && el.getBoundingClientRect().top <= 120) current = item.slug;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [active]);

  const scrollToSection = (slug) => {
    const el = document.getElementById(slug);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActive(slug);
    }
  };

  return (
    <div className="forgeWikiImported">
      <div className="forgeWikiImportedLayout">
        <aside className="forgeWikiImportedAside">
          <div className="forgeWikiAsideHeader">
            <span className="forgeWikiBadge">Updated Guide</span>
            <h2 className="forgeWikiTitle">ForgeORM Bible</h2>
            <p>Complete enterprise guide, latest fixes, DataFrames, analytics and Wiki navigation.</p>
          </div>

          <input
            className="forgeWikiSearch"
            placeholder="Search sections..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <nav className="forgeWikiNav">
            {filteredSidebar.map((item) => (
              <button
                key={item.slug}
                type="button"
                onClick={() => scrollToSection(item.slug)}
                className={`forgeWikiNavLink ${active === item.slug ? "active" : ""}`}
              >
                {item.title}
              </button>
            ))}
          </nav>
        </aside>

        <main className="forgeWikiImportedMain">
          <div className="forgeWikiHeroCard">
            <span>ForgeORM Documentation</span>
            <h1>Enterprise ORM + Analytics + DataFrame Platform</h1>
            <p>
              Updated with stream CSV/JSON imports, dirty-data handling, safe SQL identifiers,
              analytics execution fixes, QueryAst architecture and ForgeCommerce demo guidance.
            </p>
          </div>

          <article className="forgeWikiMarkdown">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => <Heading level={1}>{children}</Heading>,
                h2: ({ children }) => <Heading level={2}>{children}</Heading>,
                h3: ({ children }) => <Heading level={3}>{children}</Heading>,
              }}
            >
              {wikiMarkdown}
            </ReactMarkdown>
          </article>
        </main>
      </div>
    </div>
  );
}
