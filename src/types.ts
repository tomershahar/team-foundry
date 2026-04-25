/**
 * Context passed to every template function.
 */
export interface TemplateContext {
  profile: 'solo' | 'full';
  tool: 'claude' | 'gemini' | 'cursor' | 'both';
  repoVisibility: 'public' | 'internal' | 'private';
  /** ISO date string YYYY-MM-DD */
  date: string;
  /**
   * Path to local docs folder for ingestion, if the user selected 'local'.
   * Included in generated files so the AI knows where to look.
   */
  ingestionPath?: string;
  /** Ingestion mode selected by the user. Drives which ingestion block renders in coach.md. */
  ingestion?: 'local' | 'mcp' | 'paste' | 'skip';
  /** Whether to generate per-folder CLAUDE.md files (full profile only; ignored for solo) */
  federated?: boolean;
}

/**
 * Full options collected from the CLI prompts + derived values.
 */
export interface ScaffoldOptions extends TemplateContext {
  /** Absolute path to the directory being scaffolded into */
  targetDir: string;
  ingestion: 'local' | 'mcp' | 'paste' | 'skip';
}
