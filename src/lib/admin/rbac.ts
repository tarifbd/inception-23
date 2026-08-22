import type { NextRequest } from 'next/server';
import {
  adminUnauthorizedResponse,
  authenticateAdminRequest,
  getConfiguredAdminRole,
  isSameOriginMutation,
} from './auth';

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
  | 'seo.apply_ai_suggestions'
  | 'resources.view'
  | 'resources.manage'
  | 'tracking.view'
  | 'tracking.manage'
  | 'leads.view'
  | 'leads.manage'
  | 'cms.view'
  | 'cms.manage';

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
  'super-admin': [...aiPermissions, ...seoPermissions, 'resources.view', 'resources.manage', 'tracking.view', 'tracking.manage', 'leads.view', 'leads.manage', 'cms.view', 'cms.manage'],
  admin: [...aiPermissions, ...seoPermissions, 'resources.view', 'resources.manage', 'tracking.view', 'tracking.manage', 'leads.view', 'leads.manage', 'cms.view', 'cms.manage'],
  'seo-manager': [...seoPermissions, 'ai.generate'],
  'content-manager': ['ai.view', 'ai.generate', 'ai.apply_content', 'seo.view', 'seo.update', 'seo.use_ai', 'resources.view', 'resources.manage', 'leads.view', 'cms.view', 'cms.manage'],
  'marketing-manager': ['ai.view', 'ai.generate', 'ai.apply_content', 'seo.view', 'seo.update', 'seo.use_ai', 'resources.view', 'tracking.view', 'tracking.manage', 'leads.view', 'cms.view'],
  support: [],
};

export function getRequestRole() {
  return getConfiguredAdminRole();
}

export function hasPermission(permission: AdminPermission) {
  const role = getRequestRole();
  return rolePermissions[role]?.includes(permission) ?? false;
}

export function requirePermission(request: NextRequest, permission: AdminPermission) {
  if (!authenticateAdminRequest(request)) return adminUnauthorizedResponse(true);
  if (!isSameOriginMutation(request)) {
    return Response.json({ error: 'Cross-origin admin mutation blocked' }, { status: 403 });
  }
  if (!hasPermission(permission)) {
    return Response.json({ error: 'Forbidden', permission }, { status: 403 });
  }
  return null;
}
