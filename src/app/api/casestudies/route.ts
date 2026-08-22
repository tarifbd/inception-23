import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { caseStudies as fallbackCaseStudies } from '@/lib/constants/services';
import { requirePermission } from '@/lib/admin/rbac';
import { assertString, readJson } from '@/lib/api/http';

type CaseStudyPayload = {
  id?: string;
  titleEn?: string;
  titleBn?: string;
  clientEn?: string;
  clientBn?: string;
  categoryId?: string;
  summaryEn?: string;
  summaryBn?: string;
  metricsEn?: string;
  metricsBn?: string;
  challengeEn?: string;
  challengeBn?: string;
  solutionEn?: string;
  solutionBn?: string;
  img?: string;
  order?: number | string;
  action?: string;
};

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

export async function POST(request: NextRequest) {
  const forbidden = requirePermission(request, 'cms.manage');
  if (forbidden) return forbidden;

  try {
    const body = await readJson<CaseStudyPayload>(request, 256 * 1024);
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
      const requiredData = {
        titleEn: assertString(titleEn, 'English title', 250),
        titleBn: assertString(titleBn, 'Bangla title', 250),
        clientEn: assertString(clientEn, 'English client', 250),
        clientBn: assertString(clientBn, 'Bangla client', 250),
        categoryId: assertString(categoryId, 'Category', 100),
        summaryEn: assertString(summaryEn, 'English summary', 5000),
        summaryBn: assertString(summaryBn, 'Bangla summary', 5000),
        metricsEn: assertString(metricsEn, 'English metrics', 2000),
        metricsBn: assertString(metricsBn, 'Bangla metrics', 2000),
        challengeEn: assertString(challengeEn, 'English challenge', 10000),
        challengeBn: assertString(challengeBn, 'Bangla challenge', 10000),
        solutionEn: assertString(solutionEn, 'English solution', 10000),
        solutionBn: assertString(solutionBn, 'Bangla solution', 10000),
        img: assertString(img, 'Image', 2048),
      };
      const created = await db.caseStudy.create({
        data: {
          ...requiredData,
          order: order !== undefined ? parseInt(order.toString()) : 0,
        },
      });
      return NextResponse.json({ success: true, caseStudy: created });
    }
  } catch (error) {
    console.error('API Case Studies POST Error:', error);
    const message = error instanceof Error ? error.message : '';
    const clientError = message === 'Request body is too large' || message === 'Invalid JSON body'
      || message.endsWith('is required') || message.endsWith('is too long');
    return NextResponse.json(
      { error: clientError ? message : 'Failed to update/create case study' },
      { status: message === 'Request body is too large' ? 413 : clientError ? 400 : 500 },
    );
  }
}
