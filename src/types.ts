/**
 * Context passed to every template function.
 */
export interface TemplateContext {
  profile: 'solo' | 'full';
  tool: 'claude' | 'gemini' | 'cursor' | 'copilot' | 'agents' | 'both' | 'all';
  repoVisibility: 'public' | 'internal' | 'private';
  /** ISO date string YYYY-MM-DD */
  date: string;
  /**
   * Path to local docs folder for ingestion. Must be set when ingestion is
   * 'local' or 'repo+local'. Included in generated files so the AI knows where to look.
   */
  ingestionPath?: string;
  /** Ingestion mode selected by the user. Drives which ingestion block renders in coach.md. */
  ingestion?: 'local' | 'mcp' | 'paste' | 'skip' | 'repo' | 'repo+local' | 'repo+mcp' | 'repo+paste';
  /** Whether to generate per-folder CLAUDE.md files (full profile only; ignored for solo) */
  federated?: boolean;
  /**
   * Auto-extracted project identity from package.json / README / git.
   * Used to pre-fill the AGENTS.md project overview and default file owner.
   */
  projectIdentity?: {
    name?: string;
    summary?: string;
    defaultOwner?: string;
  };
  /** Auto-extracted stack details from package.json */
  extractedStack?: {
    name?: string;
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
    hasTypeScript?: boolean;
    hasVitest?: boolean;
    hasJest?: boolean;
    hasEslint?: boolean;
    hasPrettier?: boolean;
  };
}

/**
 * Full options collected from the CLI prompts + derived values.
 */
export interface ScaffoldOptions extends TemplateContext {
  /** Absolute path to the directory being scaffolded into */
  targetDir: string;
  ingestion: 'local' | 'mcp' | 'paste' | 'skip' | 'repo' | 'repo+local' | 'repo+mcp' | 'repo+paste';
  /**
   * Per-file decisions for existing root instruction files detected before scaffold.
   * Key: relative path (e.g. 'CLAUDE.md', '.cursor/rules/team-foundry.mdc').
   * Missing key defaults to 'merge'.
   */
  mergeDecisions?: Record<string, 'merge' | 'replace' | 'skip'>;
}
