# AI Studio

AI Studio is the admin control center for provider-agnostic AI generation, generated content review, logs, and future agent integrations.

## Architecture

- Server-only providers live in `src/lib/ai/providers.ts`.
- Prompt and output schema helpers live in `src/lib/ai/prompts.ts`.
- Generation orchestration and logging live in `src/lib/ai/service.ts`.
- Admin APIs are handled by `src/app/api/v1/admin/ai/[[...path]]/route.ts`.
- Admin UI routes live under `/admin/ai-studio`.

API keys are never sent to the browser. The frontend only receives connection status.

## Environment Variables

```bash
AI_PROVIDER=openai
AI_MODEL=gpt-4o-mini
OPENAI_API_KEY=
GEMINI_API_KEY=
ANTHROPIC_API_KEY=
OPENROUTER_API_KEY=
LOCAL_AI_ENDPOINT=
AI_ENCRYPTION_KEY=
```

`AI_ENCRYPTION_KEY` is reserved for future encrypted database key storage. The current implementation prefers environment variables.

## Providers

Supported provider classes:

- `OpenAIProvider`
- `GeminiProvider`
- `AnthropicClaudeProvider`
- `OpenRouterProvider`
- `LocalModelProvider`
- agent integration placeholder through `ai_agent_integrations`

To add a provider:

1. Add a class implementing `AIProvider`.
2. Add it to `providers`.
3. Add the env key to docs and provider status UI.

## Endpoints

Base path: `/api/v1/admin/ai`

- `GET /settings`
- `PATCH /settings`
- `GET /providers/status`
- `POST /providers/test`
- `POST /generate/product-content`
- `POST /generate/product-seo`
- `POST /generate/category-seo`
- `POST /generate/landing-page`
- `POST /generate/blog`
- `POST /generate/ad-copy`
- `POST /generate/email`
- `POST /generate/faq`
- `POST /generate/image-alt-text`
- `POST /generate/custom`
- `GET /agents`
- `POST /agents`
- `GET /agents/:id`
- `PATCH /agents/:id`
- `DELETE /agents/:id`
- `POST /agents/:id/test`
- `POST /agents/:id/run-task`
- `GET /agent-tasks`
- `GET /logs`
- `GET /generated-contents`
- `GET /generated-contents/:id`
- `POST /generated-contents/:id/approve`
- `POST /generated-contents/:id/apply`
- `POST /generated-contents/:id/archive`

## Prompt Templates

The database includes `AiTemplate` for future reusable prompt templates. Current generation uses built-in prompt builders and output schema descriptions in `src/lib/ai/prompts.ts`.

## Generated Content Library

Every successful generation creates:

- an `AiGenerationLog`
- an `AiGeneratedContent` draft

Admin can approve, apply, or archive generated content through API actions.

## Agent Integration

`AiAgentIntegration` and `AiAgentTask` support future systems such as Hermes, SEO agents, content agents, product agents, support agents, inventory agents, marketing agents, or custom endpoints.

Agent API keys should be referenced by environment variable name only, not stored raw in the browser.

## Manual Testing

1. Set `AI_PROVIDER` and provider API key in `.env`.
2. Open `/admin/ai-studio`.
3. Enable AI and select provider/model.
4. Click test connection.
5. Run Product SEO or Product Content generation.
6. Check `/admin/ai-studio/logs`.
7. Check `/admin/ai-studio/library`.

If no key is configured, provider status should show the missing environment variable and generation should fail safely.
