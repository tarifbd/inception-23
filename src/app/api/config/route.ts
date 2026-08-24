import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { assertAdmin } from '@/lib/authGuard';
import { errorResponse } from '@/lib/apiError';
import { configPostSchema } from '@/lib/validation';

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
    return errorResponse('API Config GET Error', error, 500, 'Failed to fetch configurations');
  }
}

export async function POST(request: Request) {
  const denied = await assertAdmin();
  if (denied) return denied;

  try {
    const body = await request.json();
    const result = configPostSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: 'Invalid configuration payload.', details: result.error.flatten() }, { status: 400 });
    }
    const { categories, services, action } = result.data;

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
                titleEn: svc.titleEn ?? '',
                titleBn: svc.titleBn ?? '',
                descEn: svc.descEn ?? '',
                descBn: svc.descBn ?? '',
                icon: svc.icon ?? 'Sparkles',
                theme: svc.theme ?? 'cyan',
                order: svc.order !== undefined ? parseInt(svc.order.toString()) : 0,
              },
            });
          } else if (svc.id) {
            await tx.serviceItem.update({
              where: { id: svc.id },
              data: {
                categoryId: svc.categoryId !== undefined ? svc.categoryId : undefined,
                order: svc.order !== undefined ? parseInt(svc.order.toString()) : undefined,
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
    return errorResponse('API Config POST Error', error, 500, 'Failed to update configurations');
  }
}
