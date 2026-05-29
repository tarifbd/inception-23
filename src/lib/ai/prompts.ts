import type { AIFeatureType } from './types';

export const outputSchemas: Record<AIFeatureType, string> = {
  PRODUCT_CONTENT: 'Return JSON with title_suggestions, short_description, long_description, bullet_points, features, benefits, faq, call_to_action, seo_title, seo_description, seo_keywords.',
  PRODUCT_SEO: 'Return JSON with seo_title, meta_description, slug_suggestions, h1, h2_sections, keyword_list, faq_schema, product_schema_suggestion, image_alt_texts, internal_link_suggestions.',
  CATEGORY_SEO: 'Return JSON with seo_title, meta_description, slug, intro_copy, keyword_list, faq_schema, internal_link_suggestions.',
  LANDING_PAGE: 'Return JSON with hero_headline, hero_subheadline, cta, benefits, features, social_proof, faq, final_cta, seo_metadata, suggested_page_structure.',
  BLOG_ARTICLE: 'Return JSON with title, slug, excerpt, outline, article_body, faq, seo_title, meta_description, keywords.',
  AD_COPY: 'Return JSON with headlines, primary_texts, descriptions, ctas, audience_notes.',
  EMAIL_COPY: 'Return JSON with subject_lines, preview_text, email_body, cta, segmentation_notes.',
  FAQ: 'Return JSON with faqs array containing question and answer.',
  IMAGE_ALT_TEXT: 'Return JSON with alt_texts array containing image_url and alt_text.',
  META_DESCRIPTION: 'Return JSON with meta_description and variants.',
  SCHEMA_MARKUP: 'Return JSON with schema_json_ld.',
  AGENT_TASK: 'Return JSON with task_summary, recommended_steps, expected_output.',
  CUSTOM_PROMPT: 'Return JSON with title, content, notes.',
};

export function buildGenerationPrompt(featureType: AIFeatureType, input: Record<string, unknown>) {
  return [
    `Feature type: ${featureType}`,
    'You are helping a single-vendor ecommerce admin create production-ready content and SEO assets.',
    'Use clear, conversion-focused, SEO-aware language. Avoid unsupported claims.',
    `Input JSON: ${JSON.stringify(input, null, 2)}`,
    outputSchemas[featureType],
    'Return valid JSON only. Do not include markdown fences.',
  ].join('\n\n');
}

export function summarizeInput(input: unknown) {
  const text = JSON.stringify(input);
  return text.length > 900 ? `${text.slice(0, 900)}...` : text;
}

export function summarizeOutput(output: unknown) {
  const text = typeof output === 'string' ? output : JSON.stringify(output);
  return text.length > 900 ? `${text.slice(0, 900)}...` : text;
}
