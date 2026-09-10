import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { JsonLd } from '@/components/seo/JsonLd';
import { services, type ServiceDefinition } from '@/lib/constants/services';
import { faqSchema } from '@/lib/seo/schema';
import { localServiceQuestions } from '@/lib/seo/service-questions';

export function ServiceQuestions({ service }: { service: ServiceDefinition }) {
  const faqs = [
    ...(localServiceQuestions[service.slug] || []),
    { question: `What does ${service.title} cover?`, answer: service.description },
    { question: 'What deliverables can we discuss?', answer: `Depending on the agreed scope, deliverables can include: ${service.deliverables.join('; ')}.` },
    { question: 'How do I discuss a project with Inception 23?', answer: 'Use the contact form to share your company, the service you need, your goals and your timeline. Include your budget range if available so the team can understand the scope of your enquiry.' },
  ];
  return (
    <section aria-labelledby="service-questions" className="border-t border-slate-200 px-4 py-12 dark:border-white/10 sm:px-6 lg:px-8">
      <JsonLd data={faqSchema(faqs)} />
      <div className="mx-auto max-w-5xl">
        <h2 id="service-questions" className="font-serif text-2xl font-bold text-brand-950 dark:text-white">Questions about {service.title}</h2>
        <div className="mt-6 divide-y divide-slate-200 dark:divide-white/10">
          {faqs.map((faq) => (
            <details key={faq.question} className="py-4">
              <summary className="cursor-pointer py-2 font-semibold text-brand-950 dark:text-white">{faq.question}</summary>
              <p className="mt-3 max-w-3xl text-base leading-7 text-slate-700 dark:text-slate-300">{faq.answer}</p>
            </details>
          ))}
        </div>
        <Link href="/contact" className={`mt-4 inline-flex min-h-11 items-center gap-2 font-semibold ${service.theme.text}`}>Discuss your project <ArrowRight size={16} aria-hidden="true" /></Link>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-700 dark:text-slate-300">
          <Link href="/#team" className="inline-flex min-h-11 items-center underline underline-offset-4">Meet the team</Link>
          <Link href="/case-studies" className="inline-flex min-h-11 items-center underline underline-offset-4">Review work examples</Link>
        </div>
        <nav aria-label="Related services" className="mt-8 border-t border-slate-200 pt-6 dark:border-white/10">
          <h3 className="text-lg font-semibold text-brand-950 dark:text-white">Related services</h3>
          <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
            {services.filter((item) => item.slug !== service.slug).map((item) => (
              <li key={item.slug}><Link href={`/services/${item.slug}`} className="inline-flex min-h-11 items-center text-sm font-semibold text-slate-700 underline underline-offset-4 dark:text-slate-300">{item.title}</Link></li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
