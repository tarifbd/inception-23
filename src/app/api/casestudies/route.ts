import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { assertAdmin } from '@/lib/authGuard';
import { errorResponse } from '@/lib/apiError';
import { caseStudyPostSchema } from '@/lib/validation';

export async function GET() {
  try {
    const dbCaseStudies = await db.caseStudy.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json({ data: dbCaseStudies });
  } catch (error) {
    // Previously this fell back to static placeholder data with a 200 status on any DB
    // error, which would mask a real outage from anything monitoring response codes.
    return errorResponse('API Case Studies GET Error', error, 500, 'Failed to fetch case studies');
  }
}

export async function POST(request: Request) {
  const denied = await assertAdmin();
  if (denied) return denied;

  try {
    const body = await request.json();
    const result = caseStudyPostSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: 'Invalid case study payload.', details: result.error.flatten() }, { status: 400 });
    }
    const {
      id, titleEn, titleBn, clientEn, clientBn, categoryId,
      summaryEn, summaryBn, metricsEn, metricsBn,
      challengeEn, challengeBn, solutionEn, solutionBn, img, order, action,
    } = result.data;

    // Delete Action
    if (action === 'delete' && id) {
      await db.caseStudy.delete({
        where: { id },
      });
      return NextResponse.json({ success: true, message: 'Case study deleted successfully!' });
    }

    // Create or Update
    if (id) {
      // Update
      const updated = await db.caseStudy.update({
        where: { id },
        data: {
          titleEn,
          titleBn,
          clientEn,
          clientBn,
          categoryId,
          summaryEn,
          summaryBn,
          metricsEn,
          metricsBn,
          challengeEn,
          challengeBn,
          solutionEn,
          solutionBn,
          img,
          order: order !== undefined ? parseInt(order.toString()) : undefined,
        },
      });
      return NextResponse.json({ success: true, caseStudy: updated });
    } else {
      // Create
      const created = await db.caseStudy.create({
        data: {
          titleEn: titleEn ?? '',
          titleBn: titleBn ?? '',
          clientEn: clientEn ?? '',
          clientBn: clientBn ?? '',
          categoryId: categoryId ?? '',
          summaryEn: summaryEn ?? '',
          summaryBn: summaryBn ?? '',
          metricsEn: metricsEn ?? '',
          metricsBn: metricsBn ?? '',
          challengeEn: challengeEn ?? '',
          challengeBn: challengeBn ?? '',
          solutionEn: solutionEn ?? '',
          solutionBn: solutionBn ?? '',
          img: img ?? '',
          order: order !== undefined ? parseInt(order.toString()) : 0,
        },
      });
      return NextResponse.json({ success: true, caseStudy: created });
    }
  } catch (error) {
    return errorResponse('API Case Studies POST Error', error, 500, 'Failed to update/create case study');
  }
}
