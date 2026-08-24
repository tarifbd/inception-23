export interface ServiceItem {
  id?: string;
  categoryId: string;
  titleEn: string;
  titleBn: string;
  descEn: string;
  descBn: string;
  icon: string;
  theme: string;
  order: number;
}

export interface Category {
  id: string;
  labelEn: string;
  labelBn: string;
  order: number;
  isActive: boolean;
  services: ServiceItem[];
}

export interface CaseStudy {
  id?: string;
  titleEn: string;
  titleBn: string;
  clientEn: string;
  clientBn: string;
  categoryId: string;
  summaryEn: string;
  summaryBn: string;
  metricsEn: string;
  metricsBn: string;
  challengeEn: string;
  challengeBn: string;
  solutionEn: string;
  solutionBn: string;
  img: string;
  order: number;
}
