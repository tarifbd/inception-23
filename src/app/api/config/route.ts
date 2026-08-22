import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requirePermission } from '@/lib/admin/rbac';
import { readJson } from '@/lib/api/http';

export async function GET() {
  try {
    const categories = await db.serviceCategory.findMany({
      orderBy: { order: 'asc' },
      include: {
        services: {
          orderBy: { order: 'asc' },
        },
      },
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error('API Config GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch configurations' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const forbidden = requirePermission(request, 'cms.manage');
  if (forbidden) return forbidden;

  try {
    const body = await readJson<Record<string, unknown>>(request, 256 * 1024);
    const { categories, services, action } = body;

    // Run updates in a Prisma Transaction
    await db.$transaction(async (tx) => {
      // 1. Update Category configurations (ordering & active status)
      if (categories && Array.isArray(categories)) {
        for (const cat of categories) {
          await tx.serviceCategory.update({
            where: { id: cat.id },
            data: {
              order: cat.order !== undefined ? cat.order : undefined,
              isActive: cat.isActive !== undefined ? cat.isActive : undefined,
              labelEn: cat.labelEn !== undefined ? cat.labelEn : undefined,
              labelBn: cat.labelBn !== undefined ? cat.labelBn : undefined,
            },
          });
        }
      }

      // 2. Update Service Item configurations (ordering & text content)
      if (services && Array.isArray(services)) {
        for (const svc of services) {
          if (action === 'delete-service' && svc.id) {
            await tx.serviceItem.delete({
              where: { id: svc.id },
            });
          } else if (action === 'create-service') {
            await tx.serviceItem.create({
              data: {
                categoryId: svc.categoryId,
                titleEn: svc.titleEn,
                titleBn: svc.titleBn,
                descEn: svc.descEn,
                descBn: svc.descBn,
                icon: svc.icon,
                theme: svc.theme,
                order: svc.order !== undefined ? parseInt(svc.order.toString()) : 0,
              },
            });
          } else if (svc.id) {
            await tx.serviceItem.update({
              where: { id: svc.id },
              data: {
                categoryId: svc.categoryId !== undefined ? svc.categoryId : undefined,
                order: svc.order !== undefined ? svc.order : undefined,
                titleEn: svc.titleEn !== undefined ? svc.titleEn : undefined,
                titleBn: svc.titleBn !== undefined ? svc.titleBn : undefined,
                descEn: svc.descEn !== undefined ? svc.descEn : undefined,
                descBn: svc.descBn !== undefined ? svc.descBn : undefined,
                theme: svc.theme !== undefined ? svc.theme : undefined,
                icon: svc.icon !== undefined ? svc.icon : undefined,
              },
            });
          }
        }
      }
    });

    return NextResponse.json({ success: true, message: 'Configuration saved successfully!' });
  } catch (error) {
    console.error('API Config POST Error:', error);
    const message = error instanceof Error ? error.message : '';
    const clientError = message === 'Request body is too large' || message === 'Invalid JSON body';
    return NextResponse.json(
      { error: clientError ? message : 'Failed to update configurations' },
      { status: message === 'Request body is too large' ? 413 : clientError ? 400 : 500 },
    );
  }
}
