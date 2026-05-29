'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import { ArrowRight } from 'lucide-react';
import { SplitText, Magnetic } from '@/components/ui/HyperEffects';

export const Careers = () => {
    const { lang } = useAppStore();

    return (
        <section id="careers" className="py-40 bg-white dark:bg-night-950 relative overflow-hidden group border-t border-gray-100 dark:border-night-800">
            {/* Background Hover Expand Layer */}
            <div className="absolute inset-0 bg-brand-50/50 dark:bg-night-900/50 scale-y-0 group-hover:scale-y-100 origin-bottom transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]" />
            
            {/* Hyper-Modern Background Neon Orbs */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-brand-500/10 rounded-full blur-[120px] pointer-events-none group-hover:scale-125 transition-transform duration-1000" />
            <div className="absolute bottom-0 right-10 w-[300px] h-[300px] bg-rose-500/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10 max-w-4xl text-left">
                <div className="w-20 h-[2px] bg-brand-500 mb-10 group-hover:w-40 transition-all duration-700" />
                
                <h2 className="text-[clamp(2.8rem,6vw,5rem)] font-serif font-black text-brand-950 dark:text-white leading-[1.02] mb-8 uppercase tracking-tight">
                    <SplitText text={lang === 'en' ? 'Join The Elite.' : 'এলিটদের সাথে যোগ দিন।'} />
                </h2>
                
                <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 font-light mb-12 max-w-2xl leading-relaxed">
                    {lang === 'en' ? 'We do not hire employees. We recruit future partners capable of reshaping entire global markets. Are you ready?' : 'আমরা শুধু কর্মী নিয়োগ করি না। আমরা ভবিষ্যৎ অংশীদার খুঁজি।'}
                </p>
                
                <Magnetic>
                    <a href="#" className="inline-flex items-center justify-center gap-6 bg-brand-950 dark:bg-brand-600 text-white px-12 py-6 rounded-full shadow-2xl hover:shadow-[0_20px_40px_rgba(20,184,166,0.2)] transition-all duration-500 group/btn cursor-pointer">
                        <span className="font-bold uppercase tracking-[0.3em] text-xs md:text-sm">{lang === 'en' ? 'Explore Careers' : 'ক্যারিয়ার দেখুন'}</span>
                        <span className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover/btn:bg-white group-hover/btn:text-brand-950 transition-colors">
                            <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                        </span>
                    </a>
                </Magnetic>
            </div>
        </section>
    );
};
