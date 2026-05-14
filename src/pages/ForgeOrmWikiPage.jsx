import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import wikiMarkdown from "../docs/forgeorm-complete-wiki.md?raw";
import sidebar from "../docs/forgeorm-sidebar.json";

export default function ForgeOrmWikiPage() {
  return (
    <div className="forgeWikiImported">
      <div className="forgeWikiImportedLayout">
        <aside className="forgeWikiImportedAside">
          <h2 className="forgeWikiTitle">ForgeORM Wiki</h2>
          <nav className="forgeWikiNav">
            {sidebar.map((item) => (
              <a
                key={item.slug}
                href={`#${item.slug}`}
                className="forgeWikiNavLink"
              >
                {item.title}
              </a>
            ))}
          </nav>
        </aside>

        <main className="forgeWikiImportedMain">
          <article className="forgeWikiMarkdown">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {wikiMarkdown}
            </ReactMarkdown>
          </article>
        </main>
      </div>
    </div>
  );
}