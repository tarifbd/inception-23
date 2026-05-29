import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { jsonError, readJson } from '@/lib/api/http';
import { requirePermission } from '@/lib/admin/rbac';
import { generateAIContent, getAiProviderStatuses, getAiSettings } from '@/lib/ai/service';
import { getProvider } from '@/lib/ai/providers';
import type { AIFeatureType } from '@/lib/ai/types';

type Params = { params: Promise<{ path?: string[] }> };

const generationMap: Record<string, AIFeatureType> = {
  'product-content': 'PRODUCT_CONTENT',
  'product-seo': 'PRODUCT_SEO',
  'category-seo': 'CATEGORY_SEO',
  'landing-page': 'LANDING_PAGE',
  blog: 'BLOG_ARTICLE',
  'ad-copy': 'AD_COPY',
  email: 'EMAIL_COPY',
  faq: 'FAQ',
  'image-alt-text': 'IMAGE_ALT_TEXT',
  custom: 'CUSTOM_PROMPT',
};

function publicSettings(settings: Awaited<ReturnType<typeof getAiSettings>>) {
  return {
    id: settings.id,
    provider: settings.provider,
    defaultModel: settings.defaultModel,
    isEnabled: settings.isEnabled,
    temperature: settings.temperature,
    maxTokens: settings.maxTokens,
    systemPrompt: settings.systemPrompt,
    safetyMode: settings.safetyMode,
    monthlyTokenLimit: settings.monthlyTokenLimit,
    createdAt: settings.createdAt,
    updatedAt: settings.updatedAt,
  };
}

async function getPath(params: Params['params']) {
  const resolved = await params;
  return resolved.path || [];
}

export async function GET(request: NextRequest, { params }: Params) {
  const path = await getPath(params);
  const forbidden = requirePermission(request, path[0] === 'logs' ? 'ai.view_logs' : 'ai.view');
  if (forbidden) return forbidden;

  try {
    if (path[0] === 'settings') return Response.json(await getAiSettings().then(publicSettings));
    if (path[0] === 'providers' && path[1] === 'status') return Response.json(await getAiProviderStatuses());
    if (path[0] === 'logs') {
      const logs = await db.aiGenerationLog.findMany({ orderBy: { createdAt: 'desc' }, take: 100 });
      return Response.json(logs);
    }
    if (path[0] === 'generated-contents') {
      if (path[1]) return Response.json(await db.aiGeneratedContent.findUnique({ where: { id: path[1] } }));
      return Response.json(await db.aiGeneratedContent.findMany({ orderBy: { createdAt: 'desc' }, take: 100 }));
    }
    if (path[0] === 'agents') {
      if (path[1]) return Response.json(await db.aiAgentIntegration.findUnique({ where: { id: path[1] }, include: { tasks: { orderBy: { createdAt: 'desc' }, take: 20 } } }));
      return Response.json(await db.aiAgentIntegration.findMany({ orderBy: { createdAt: 'desc' } }));
    }
    if (path[0] === 'agent-tasks') {
      return Response.json(await db.aiAgentTask.findMany({ orderBy: { createdAt: 'desc' }, take: 100 }));
    }
    return jsonError('AI endpoint not found', 404);
  } catch (error) {
    console.error('AI GET error:', error);
    return jsonError('AI request failed', 500);
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const path = await getPath(params);
  const forbidden = requirePermission(request, path[0] === 'agents' ? 'ai.manage_agents' : 'ai.manage_settings');
  if (forbidden) return forbidden;

  try {
    const body = await readJson<Record<string, unknown>>(request);
    if (path[0] === 'settings') {
      const settings = await db.aiSetting.upsert({
        where: { id: 'default' },
        create: {
          id: 'default',
          provider: typeof body.provider === 'string' ? body.provider : process.env.AI_PROVIDER || 'disabled',
          defaultModel: typeof body.defaultModel === 'string' ? body.defaultModel : null,
          isEnabled: Boolean(body.isEnabled),
        },
        update: {
          provider: typeof body.provider === 'string' ? body.provider : undefined,
          defaultModel: typeof body.defaultModel === 'string' ? body.defaultModel : undefined,
          isEnabled: typeof body.isEnabled === 'boolean' ? body.isEnabled : undefined,
          temperature: typeof body.temperature === 'number' ? body.temperature : undefined,
          maxTokens: typeof body.maxTokens === 'number' ? body.maxTokens : undefined,
          systemPrompt: typeof body.systemPrompt === 'string' ? body.systemPrompt.slice(0, 5000) : undefined,
          safetyMode: typeof body.safetyMode === 'string' ? body.safetyMode : undefined,
          monthlyTokenLimit: typeof body.monthlyTokenLimit === 'number' ? body.monthlyTokenLimit : undefined,
        },
      });
      return Response.json(publicSettings(settings));
    }
    if (path[0] === 'agents' && path[1]) {
      return Response.json(await db.aiAgentIntegration.update({
        where: { id: path[1] },
        data: {
          name: typeof body.name === 'string' ? body.name : undefined,
          provider: typeof body.provider === 'string' ? body.provider : undefined,
          agentType: typeof body.agentType === 'string' ? body.agentType : undefined,
          description: typeof body.description === 'string' ? body.description : undefined,
          endpointUrl: typeof body.endpointUrl === 'string' ? body.endpointUrl : undefined,
          apiKeyEnvName: typeof body.apiKeyEnvName === 'string' ? body.apiKeyEnvName : undefined,
          isEnabled: typeof body.isEnabled === 'boolean' ? body.isEnabled : undefined,
          configJson: body.configJson ? JSON.stringify(body.configJson) : undefined,
        },
      }));
    }
    return jsonError('AI PATCH endpoint not found', 404);
  } catch (error) {
    console.error('AI PATCH error:', error);
    return jsonError(error instanceof Error ? error.message : 'AI update failed', 400);
  }
}

export async function POST(request: NextRequest, { params }: Params) {
  const path = await getPath(params);
  const forbidden = requirePermission(request, path[0] === 'agents' ? 'ai.manage_agents' : 'ai.generate');
  if (forbidden) return forbidden;

  try {
    const body = await readJson<Record<string, unknown>>(request);
    if (path[0] === 'providers' && path[1] === 'test') {
      const settings = await getAiSettings();
      const provider = getProvider(settings.provider);
      if (!settings.isEnabled) return jsonError('AI is disabled', 400);
      if (!provider.isConfigured()) return jsonError(`${provider.label} is missing its server-side API key`, 400);
      const text = await provider.generateText('Reply with JSON only: {"ok":true,"message":"connected"}', {
        model: settings.defaultModel,
        temperature: 0,
        maxTokens: 80,
        systemPrompt: settings.systemPrompt,
      });
      return Response.json({ ok: true, provider: provider.name, model: settings.defaultModel, sample: text });
    }

    if (path[0] === 'generate' && path[1] && generationMap[path[1]]) {
      const result = await generateAIContent(generationMap[path[1]], body);
      return Response.json(result);
    }

    if (path[0] === 'agents' && !path[1]) {
      return Response.json(await db.aiAgentIntegration.create({
        data: {
          name: String(body.name || 'Untitled agent'),
          provider: String(body.provider || 'custom'),
          agentType: String(body.agentType || 'CUSTOM_AGENT'),
          description: String(body.description || ''),
          endpointUrl: typeof body.endpointUrl === 'string' ? body.endpointUrl : null,
          apiKeyEnvName: typeof body.apiKeyEnvName === 'string' ? body.apiKeyEnvName : null,
          isEnabled: Boolean(body.isEnabled),
          configJson: body.configJson ? JSON.stringify(body.configJson) : null,
        },
      }), { status: 201 });
    }
    if (path[0] === 'agents' && path[1] && path[2] === 'test') {
      const agent = await db.aiAgentIntegration.findUnique({ where: { id: path[1] } });
      return Response.json({ ok: Boolean(agent), agent, configured: Boolean(agent?.endpointUrl || agent?.apiKeyEnvName) });
    }
    if (path[0] === 'agents' && path[1] && path[2] === 'run-task') {
      return Response.json(await db.aiAgentTask.create({
        data: {
          agentIntegrationId: path[1],
          taskType: String(body.taskType || 'CUSTOM_AGENT_TASK'),
          status: 'PENDING',
          inputJson: JSON.stringify(body.input || body),
        },
      }), { status: 201 });
    }
    if (path[0] === 'generated-contents' && path[1] && path[2]) {
      const statusMap: Record<string, string> = { approve: 'APPROVED', apply: 'APPLIED', archive: 'ARCHIVED' };
      const status = statusMap[path[2]];
      if (!status) return jsonError('Invalid generated content action', 400);
      return Response.json(await db.aiGeneratedContent.update({
        where: { id: path[1] },
        data: { status, appliedAt: status === 'APPLIED' ? new Date() : undefined },
      }));
    }
    return jsonError('AI POST endpoint not found', 404);
  } catch (error) {
    console.error('AI POST error:', error);
    return jsonError(error instanceof Error ? error.message : 'AI request failed', 400);
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const path = await getPath(params);
  const forbidden = requirePermission(request, 'ai.manage_agents');
  if (forbidden) return forbidden;

  try {
    if (path[0] === 'agents' && path[1]) {
      await db.aiAgentIntegration.delete({ where: { id: path[1] } });
      return Response.json({ ok: true });
    }
    return jsonError('AI DELETE endpoint not found', 404);
  } catch (error) {
    console.error('AI DELETE error:', error);
    return jsonError('AI delete failed', 400);
  }
}
