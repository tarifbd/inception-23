export type AIProviderName = 'disabled' | 'openai' | 'gemini' | 'anthropic' | 'openrouter' | 'local' | 'agent';

export type AIFeatureType =
  | 'PRODUCT_CONTENT'
  | 'PRODUCT_SEO'
  | 'CATEGORY_SEO'
  | 'LANDING_PAGE'
  | 'BLOG_ARTICLE'
  | 'AD_COPY'
  | 'EMAIL_COPY'
  | 'FAQ'
  | 'IMAGE_ALT_TEXT'
  | 'META_DESCRIPTION'
  | 'SCHEMA_MARKUP'
  | 'AGENT_TASK'
  | 'CUSTOM_PROMPT';

export type AITextOptions = {
  model?: string | null;
  temperature?: number;
  maxTokens?: number;
  timeoutMs?: number;
  systemPrompt?: string;
};

export type AIProviderStatus = {
  provider: AIProviderName;
  label: string;
  configured: boolean;
  enabled: boolean;
  active: boolean;
  model?: string | null;
  missingEnv?: string;
  error?: string;
};

export type AIProvider = {
  name: AIProviderName;
  label: string;
  isConfigured(): boolean;
  generateText(prompt: string, options?: AITextOptions): Promise<string>;
  generateStructuredJSON<T>(prompt: string, schemaDescription: string, options?: AITextOptions): Promise<T>;
  getModelList?(): Promise<string[]>;
};

export type ProductContentInput = Record<string, unknown>;
