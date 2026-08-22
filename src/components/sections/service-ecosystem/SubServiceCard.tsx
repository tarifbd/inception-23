'use client';

import type { EcosystemSubService } from '@/lib/constants/service-ecosystem';
import { serviceThemes, type ServiceKey } from '@/lib/constants/theme';

type SubServiceCardProps = {
  service: EcosystemSubService;
  serviceKey: ServiceKey;
};

export function SubServiceCard({
  service,
  serviceKey,
}: SubServiceCardProps) {
  const theme = serviceThemes[serviceKey];

  return (
    <article className={`group rounded-lg border bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg dark:bg-night-800 ${theme.border} ${theme.shadow}`}>
      <div className="flex gap-3">
        <span
          aria-hidden="true"
          className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${theme.dot}`}
        />
        <div>
          <h4 className="text-sm font-semibold leading-5 text-brand-950 dark:text-white">
            {service.title}
          </h4>
          {service.description ? (
            <p className="mt-2 text-[13px] leading-5 text-slate-600 dark:text-slate-400">
              {service.description}
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
}
