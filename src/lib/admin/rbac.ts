import type { NextRequest } from 'next/server';

export type AdminPermission =
  | 'ai.view'
  | 'ai.generate'
  | 'ai.apply_content'
  | 'ai.manage_settings'
  | 'ai.manage_templates'
  | 'ai.view_logs'
  | 'ai.manage_agents'
  | 'ai.run_agent_task'
  | 'seo.view'
  | 'seo.update'
  | 'seo.audit'
  | 'seo.manage_redirects'
  | 'seo.manage_sitemap'
  | 'seo.manage_robots'
  | 'seo.manage_settings'
  | 'seo.use_ai'
  | 'seo.apply_ai_suggestions';

export const aiPermissions: AdminPermission[] = [
  'ai.view',
  'ai.generate',
  'ai.apply_content',
  'ai.manage_settings',
  'ai.manage_templates',
  'ai.view_logs',
  'ai.manage_agents',
  'ai.run_agent_task',
];

export const seoPermissions: AdminPermission[] = [
  'seo.view',
  'seo.update',
  'seo.audit',
  'seo.manage_redirects',
  'seo.manage_sitemap',
  'seo.manage_robots',
  'seo.manage_settings',
  'seo.use_ai',
  'seo.apply_ai_suggestions',
];

export const rolePermissions: Record<string, AdminPermission[]> = {
  'super-admin': [...aiPermissions, ...seoPermissions],
  admin: [...aiPermissions, ...seoPermissions],
  'seo-manager': [...seoPermissions, 'ai.generate'],
  'content-manager': ['ai.view', 'ai.generate', 'ai.apply_content', 'seo.view', 'seo.update', 'seo.use_ai'],
  'marketing-manager': ['ai.view', 'ai.generate', 'ai.apply_content', 'seo.view', 'seo.update', 'seo.use_ai'],
  support: [],
};

export function getRequestRole(request: NextRequest) {
  return request.headers.get('x-admin-role') || 'admin';
}

export function hasPermission(request: NextRequest, permission: AdminPermission) {
  const role = getRequestRole(request);
  return rolePermissions[role]?.includes(permission) ?? false;
}

export function requirePermission(request: NextRequest, permission: AdminPermission) {
  if (!hasPermission(request, permission)) {
    return Response.json({ error: 'Forbidden', permission }, { status: 403 });
  }
  return null;
}
