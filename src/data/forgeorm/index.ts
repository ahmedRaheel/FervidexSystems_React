import { coreSections } from './sections.core';
import { operationSections } from './sections.operations';
import { enterpriseSections } from './sections.enterprise';
import { integrationSections } from './sections.integration';
import { performanceSections } from './sections.performance';

export const forgeOrmDocGroups = [
  ['Start Here', ['platform-overview', 'installation', 'dbcontext', 'query-methods']],
  ['Query Systems', ['forge-sql', 'query-ast', 'execution-options', 'compiled-query-cache']],
  ['Writes and Graphs', ['crud-commands', 'graph-persistence', 'include-split-query', 'bulk-operations']],
  ['Database Features', ['stored-procedures', 'table-valued-parameters', 'temporal-tables', 'transactions-reliability']],
  ['Data Integration', ['csv-json-import-export', 'dataframe', 'analytics-olap']],
  ['Enterprise Roadmap', ['streaming-batching', 'query-monitor', 'multi-tenant-sharding', 'security-governance']],
  ['AI and Advanced Engines', ['search-vector-graph', 'ai-features', 'workflow-jobs-rules']],
  ['Performance', ['performance-engine', 'memory-optimization', 'parallel-vectorized', 'benchmarks']]
] as const;

export const forgeOrmDocSections = [
  ...coreSections,
  ...operationSections,
  ...enterpriseSections,
  ...integrationSections,
  ...performanceSections
];

export const forgeOrmStats = [
  ['30+', 'Enterprise sections'],
  ['100%', 'Examples included'],
  ['MSIL', 'Performance engine'],
  ['Dapper+', 'Benchmark target']
] as const;
