import { CheckCircle2 } from 'lucide-react';
import { caAdvisoryFocus } from '@/lib/constants/solutions';
import { serviceThemes } from '@/lib/constants/theme';
import { AnimatedSection } from './AnimatedSection';

export function CaAdvisorySection() {
  const theme = serviceThemes.consultancy;

  return (
    <AnimatedSection id="ca-advisory" className="bg-gradient-to-b from-white to-emerald-50/50">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:items-center">
        <div className="rounded-[2rem] border border-emerald-200 bg-white/86 p-6 shadow-xl shadow-emerald-950/5 backdrop-blur-xl md:p-8">
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-emerald-700">CA, tax, VAT, customs & business advisory</p>
          <h3 className="mt-4 font-serif text-[clamp(2rem,4vw,4.1rem)] font-black leading-[1.03] text-brand-950">
            Serious finance control for serious business decisions.
          </h3>
          <p className="mt-5 text-base leading-8 text-slate-600">
            This pillar is designed for businesses that need accounting discipline, statutory readiness, internal control, performance reporting, and practical advisory support without losing momentum.
          </p>
          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            {['Compliance', 'Reporting', 'Growth control'].map((item) => (
              <div key={item} className="rounded-2xl bg-emerald-50 p-4 text-sm font-black text-emerald-800">{item}</div>
            ))}
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {caAdvisoryFocus.map((item) => (
            <div key={item} className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-white/84 px-4 py-3 shadow-sm backdrop-blur-xl">
              <CheckCircle2 size={18} className={theme.textSoft} />
              <span className="text-sm font-bold text-slate-700">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
