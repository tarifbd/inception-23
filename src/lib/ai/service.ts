import { db } from '@/lib/db';
import { buildGenerationPrompt, outputSchemas, summarizeInput, summarizeOutput } from './prompts';
import { getProvider, providerStatuses } from './providers';
import type { AIFeatureType } from './types';

export async function getAiSettings() {
  return db.aiSetting.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      provider: process.env.AI_PROVIDER || 'disabled',
      defaultModel: process.env.AI_MODEL || null,
      isEnabled: Boolean(process.env.AI_PROVIDER && process.env.AI_PROVIDER !== 'disabled'),
    },
  });
}

export async function getAiProviderStatuses() {
  const settings = await getAiSettings();
  return providerStatuses(settings.provider, settings.isEnabled);
}

export async function generateAIContent(featureType: AIFeatureType, input: Record<string, unknown>, userId?: string | null) {
  const settings = await getAiSettings();
  const provider = getProvider(settings.provider);
  const model = settings.defaultModel || process.env.AI_MODEL || undefined;

  if (!settings.isEnabled) {
    throw new Error('AI is disabled. Enable AI settings first.');
  }
  if (!provider.isConfigured()) {
    throw new Error(`${provider.label} is missing its server-side API key.`);
  }

  const prompt = buildGenerationPrompt(featureType, input);

  try {
    const output = await provider.generateStructuredJSON<Record<string, unknown>>(prompt, outputSchemas[featureType], {
      model,
      temperature: settings.temperature,
      maxTokens: settings.maxTokens,
      systemPrompt: settings.systemPrompt,
      timeoutMs: 30_000,
    });

    await db.aiGenerationLog.create({
      data: {
        userId,
        provider: provider.name,
        model,
        featureType,
        inputSummary: summarizeInput(input),
        outputSummary: summarizeOutput(output),
        status: 'SUCCESS',
      },
    });

    const content = await db.aiGeneratedContent.create({
      data: {
        featureType,
        relatedEntityType: typeof input.related_entity_type === 'string' ? input.related_entity_type : null,
        relatedEntityId: typeof input.related_entity_id === 'string' ? input.related_entity_id : null,
        title: `${featureType.replaceAll('_', ' ')} generation`,
        contentJson: JSON.stringify(output),
        contentText: summarizeOutput(output),
        status: 'DRAFT',
        generatedBy: userId,
      },
    });

    return { output, contentId: content.id };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'AI generation failed';
    await db.aiGenerationLog.create({
      data: {
        userId,
        provider: provider.name,
        model,
        featureType,
        inputSummary: summarizeInput(input),
        outputSummary: null,
        status: 'FAILED',
        errorMessage: message.slice(0, 1000),
      },
    });
    throw new Error(message);
  }
}
