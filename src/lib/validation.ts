import { z } from 'zod';

// Shared across contact/inquiries/newsletter: trims + lowercases before validating so the
// same address in different casing can't slip past a de-dupe check (newsletter's findUnique
// was previously comparing raw, un-normalized input).
export const emailSchema = z.string().trim().toLowerCase().email();

export const contactSchema = z.object({
  name: z.string().trim().min(1),
  email: emailSchema,
  company: z.string().trim().optional().nullable(),
  serviceInterest: z.string().trim().optional().nullable(),
  message: z.string().trim().min(1),
});

export const inquiryPostSchema = z.object({
  name: z.string().trim().min(1),
  email: emailSchema,
  message: z.string().trim().min(1),
});

export const newsletterPostSchema = z.object({
  email: emailSchema,
});

export const deleteIdSchema = z.object({
  id: z.string().min(1),
});

const serviceItemSchema = z.object({
  id: z.string().min(1).optional(),
  categoryId: z.string().min(1),
  titleEn: z.string().trim().min(1).optional(),
  titleBn: z.string().trim().min(1).optional(),
  descEn: z.string().trim().min(1).optional(),
  descBn: z.string().trim().min(1).optional(),
  icon: z.string().trim().min(1).optional(),
  theme: z.string().trim().min(1).optional(),
  order: z.union([z.number(), z.string()]).optional(),
});

const categorySchema = z.object({
  id: z.string().min(1),
  order: z.number().optional(),
  isActive: z.boolean().optional(),
  labelEn: z.string().trim().min(1).optional(),
  labelBn: z.string().trim().min(1).optional(),
});

export const configPostSchema = z.object({
  action: z.string().optional(),
  categories: z.array(categorySchema).optional(),
  services: z.array(serviceItemSchema).optional(),
});

export const caseStudyPostSchema = z.object({
  id: z.string().min(1).optional(),
  action: z.string().optional(),
  titleEn: z.string().trim().min(1).optional(),
  titleBn: z.string().trim().min(1).optional(),
  clientEn: z.string().trim().min(1).optional(),
  clientBn: z.string().trim().min(1).optional(),
  categoryId: z.string().trim().min(1).optional(),
  summaryEn: z.string().trim().min(1).optional(),
  summaryBn: z.string().trim().min(1).optional(),
  metricsEn: z.string().trim().min(1).optional(),
  metricsBn: z.string().trim().min(1).optional(),
  challengeEn: z.string().trim().min(1).optional(),
  challengeBn: z.string().trim().min(1).optional(),
  solutionEn: z.string().trim().min(1).optional(),
  solutionBn: z.string().trim().min(1).optional(),
  img: z.string().trim().min(1).optional(),
  order: z.union([z.number(), z.string()]).optional(),
});
