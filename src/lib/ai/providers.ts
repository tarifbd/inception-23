import type { AIProvider, AIProviderName, AITextOptions } from './types';

const defaultTimeoutMs = 30_000;

function timeoutSignal(timeoutMs = defaultTimeoutMs) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  return { signal: controller.signal, clear: () => clearTimeout(timeout) };
}

function parseJsonResponse<T>(raw: string): T {
  const cleaned = raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();
  return JSON.parse(cleaned) as T;
}

abstract class BaseProvider implements AIProvider {
  abstract name: AIProviderName;
  abstract label: string;
  abstract envKey: string;
  abstract defaultModel: string;
  abstract generateText(prompt: string, options?: AITextOptions): Promise<string>;

  isConfigured() {
    return Boolean(process.env[this.envKey]);
  }

  async generateStructuredJSON<T>(prompt: string, schemaDescription: string, options?: AITextOptions): Promise<T> {
    const raw = await this.generateText(`${prompt}\n\nSchema requirement:\n${schemaDescription}`, options);
    return parseJsonResponse<T>(raw);
  }
}

export class OpenAIProvider extends BaseProvider {
  name = 'openai' as const;
  label = 'OpenAI';
  envKey = 'OPENAI_API_KEY';
  defaultModel = 'gpt-4o-mini';

  async generateText(prompt: string, options: AITextOptions = {}) {
    const apiKey = process.env[this.envKey];
    if (!apiKey) throw new Error('OPENAI_API_KEY is not configured');
    const timeout = timeoutSignal(options.timeoutMs);
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        signal: timeout.signal,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: options.model || this.defaultModel,
          temperature: options.temperature ?? 0.7,
          max_tokens: options.maxTokens ?? 1200,
          messages: [
            { role: 'system', content: options.systemPrompt || 'You are a helpful ecommerce AI assistant.' },
            { role: 'user', content: prompt },
          ],
        }),
      });
      if (!response.ok) throw new Error(`OpenAI request failed: ${response.status}`);
      const data = await response.json();
      return String(data.choices?.[0]?.message?.content || '');
    } finally {
      timeout.clear();
    }
  }
}

export class GeminiProvider extends BaseProvider {
  name = 'gemini' as const;
  label = 'Google Gemini';
  envKey = 'GEMINI_API_KEY';
  defaultModel = 'gemini-1.5-flash';

  async generateText(prompt: string, options: AITextOptions = {}) {
    const apiKey = process.env[this.envKey];
    if (!apiKey) throw new Error('GEMINI_API_KEY is not configured');
    const model = options.model || this.defaultModel;
    const timeout = timeoutSignal(options.timeoutMs);
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
        method: 'POST',
        signal: timeout.signal,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          generationConfig: {
            temperature: options.temperature ?? 0.7,
            maxOutputTokens: options.maxTokens ?? 1200,
          },
          contents: [{ role: 'user', parts: [{ text: `${options.systemPrompt || ''}\n\n${prompt}` }] }],
        }),
      });
      if (!response.ok) throw new Error(`Gemini request failed: ${response.status}`);
      const data = await response.json();
      return String(data.candidates?.[0]?.content?.parts?.[0]?.text || '');
    } finally {
      timeout.clear();
    }
  }
}

export class AnthropicClaudeProvider extends BaseProvider {
  name = 'anthropic' as const;
  label = 'Anthropic Claude';
  envKey = 'ANTHROPIC_API_KEY';
  defaultModel = 'claude-3-5-sonnet-latest';

  async generateText(prompt: string, options: AITextOptions = {}) {
    const apiKey = process.env[this.envKey];
    if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not configured');
    const timeout = timeoutSignal(options.timeoutMs);
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        signal: timeout.signal,
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: options.model || this.defaultModel,
          max_tokens: options.maxTokens ?? 1200,
          temperature: options.temperature ?? 0.7,
          system: options.systemPrompt || 'You are a helpful ecommerce AI assistant.',
          messages: [{ role: 'user', content: prompt }],
        }),
      });
      if (!response.ok) throw new Error(`Anthropic request failed: ${response.status}`);
      const data = await response.json();
      return String(data.content?.[0]?.text || '');
    } finally {
      timeout.clear();
    }
  }
}

export class OpenRouterProvider extends BaseProvider {
  name = 'openrouter' as const;
  label = 'OpenRouter';
  envKey = 'OPENROUTER_API_KEY';
  defaultModel = 'openai/gpt-4o-mini';

  async generateText(prompt: string, options: AITextOptions = {}) {
    const apiKey = process.env[this.envKey];
    if (!apiKey) throw new Error('OPENROUTER_API_KEY is not configured');
    const timeout = timeoutSignal(options.timeoutMs);
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        signal: timeout.signal,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: options.model || this.defaultModel,
          temperature: options.temperature ?? 0.7,
          max_tokens: options.maxTokens ?? 1200,
          messages: [
            { role: 'system', content: options.systemPrompt || 'You are a helpful ecommerce AI assistant.' },
            { role: 'user', content: prompt },
          ],
        }),
      });
      if (!response.ok) throw new Error(`OpenRouter request failed: ${response.status}`);
      const data = await response.json();
      return String(data.choices?.[0]?.message?.content || '');
    } finally {
      timeout.clear();
    }
  }
}

export class LocalModelProvider extends BaseProvider {
  name = 'local' as const;
  label = 'Local Model';
  envKey = 'LOCAL_AI_ENDPOINT';
  defaultModel = 'local-default';

  async generateText(prompt: string, options: AITextOptions = {}) {
    const endpoint = process.env.LOCAL_AI_ENDPOINT;
    if (!endpoint) throw new Error('LOCAL_AI_ENDPOINT is not configured');
    const timeout = timeoutSignal(options.timeoutMs);
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        signal: timeout.signal,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, model: options.model || this.defaultModel, options }),
      });
      if (!response.ok) throw new Error(`Local model request failed: ${response.status}`);
      const data = await response.json();
      return String(data.text || data.content || data.output || '');
    } finally {
      timeout.clear();
    }
  }
}

export const providers = {
  openai: new OpenAIProvider(),
  gemini: new GeminiProvider(),
  anthropic: new AnthropicClaudeProvider(),
  openrouter: new OpenRouterProvider(),
  local: new LocalModelProvider(),
};

export function getProvider(name: string | null | undefined) {
  const key = (name || process.env.AI_PROVIDER || 'openai') as keyof typeof providers;
  return providers[key] || providers.openai;
}

export function providerStatuses(activeProvider: string | null | undefined, enabled: boolean) {
  const active = (activeProvider || process.env.AI_PROVIDER || 'disabled') as AIProviderName;
  return Object.values(providers).map((provider) => ({
    provider: provider.name,
    label: provider.label,
    configured: provider.isConfigured(),
    enabled,
    active: active === provider.name,
    model: process.env.AI_MODEL || provider.defaultModel,
    missingEnv: provider.isConfigured() ? undefined : provider.envKey,
  }));
}
