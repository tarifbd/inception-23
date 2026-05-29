import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { caseStudies as fallbackCaseStudies } from '@/lib/constants/services';

export async function GET() {
  try {
    const dbCaseStudies = await db.caseStudy.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json({ data: dbCaseStudies.length ? dbCaseStudies : fallbackCaseStudies });
  } catch (error) {
    console.error('API Case Studies GET Error:', error);
    return NextResponse.json({ data: fallbackCaseStudies });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      id, titleEn, titleBn, clientEn, clientBn, categoryId, 
      summaryEn, summaryBn, metricsEn, metricsBn, 
      challengeEn, challengeBn, solutionEn, solutionBn, img, order, action 
    } = body;

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
          order: order !== undefined ? parseInt(order.toString()) : 0,
        },
      });
      return NextResponse.json({ success: true, caseStudy: created });
    }
  } catch (error) {
    console.error('API Case Studies POST Error:', error);
    return NextResponse.json({ error: 'Failed to update/create case study' }, { status: 500 });
  }
}
