'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import { FinTechIllustration, PublicSectorIllustration, ManufacturingIllustration, TechIllustration, EnergyIllustration, HealthIllustration } from '@/components/ui/Illustrations';
import { motion } from 'framer-motion';
import { SplitText, TiltCard } from '@/components/ui/HyperEffects';
import { MARQUEE_CARD_WIDTH_PX, MARQUEE_SCROLL_DISTANCE_PX } from '@/lib/constants/layout';

export const IndustriesMarquee = () => {
    const { lang } = useAppStore();
    
    const industries = [
        { name: 'Financial Services', icon: FinTechIllustration },
        { name: 'Public Sector', icon: PublicSectorIllustration },
        { name: 'Manufacturing', icon: ManufacturingIllustration },
        { name: 'Technology', icon: TechIllustration },
        { name: 'Energy', icon: EnergyIllustration },
        { name: 'Healthcare', icon: HealthIllustration },
        { name: 'Financial Services', icon: FinTechIllustration },
        { name: 'Public Sector', icon: PublicSectorIllustration },
        { name: 'Manufacturing', icon: ManufacturingIllustration },
        { name: 'Technology', icon: TechIllustration },
        { name: 'Energy', icon: EnergyIllustration },
        { name: 'Healthcare', icon: HealthIllustration }
    ];

    return (
        <section id="industries" className="py-16 md:py-32 bg-gray-50 dark:bg-night-950 overflow-hidden relative border-t border-b border-gray-200 dark:border-white/5">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(20,184,166,0.015)_0%,transparent_100%)] pointer-events-none" />
            
            <div className="container mx-auto px-6 mb-16 relative z-10 flex flex-col items-start">
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    className="text-xs font-bold uppercase tracking-[0.3em] text-brand-600 dark:text-brand-500 mb-6"
                >
                    {lang === 'en' ? 'Sectors of Operation' : 'কার্যকরী খাতসমূহ'}
                </motion.div>
                <h3 className="max-w-3xl text-[clamp(2.4rem,4.5vw,4.25rem)] font-serif font-black text-brand-950 dark:text-white tracking-tight leading-[1.05]">
                    <SplitText text={lang === 'en' ? 'Global Industry Expertise' : 'বৈশ্বিক শিল্প দক্ষতা'} />
                </h3>
            </div>
            
            <div className="relative w-full flex overflow-hidden py-10">
                <div className="absolute top-0 left-0 w-48 h-full bg-gradient-to-r from-gray-50 dark:from-night-950 to-transparent z-10 pointer-events-none" />
                <div className="absolute top-0 right-0 w-48 h-full bg-gradient-to-l from-gray-50 dark:from-night-950 to-transparent z-10 pointer-events-none" />
                
                <style dangerouslySetInnerHTML={{__html: `
                    @keyframes infinite-scroll {
                        0% { transform: translateX(0); }
                        100% { transform: translateX(-${MARQUEE_SCROLL_DISTANCE_PX}px); }
                    }
                    .animate-marquee {
                        animation: infinite-scroll 30s linear infinite;
                    }
                    .animate-marquee:hover {
                        animation-play-state: paused;
                    }
                `}} />

                <motion.div 
                    initial={{ opacity: 0, x: 100 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ type: "spring", damping: 20 }}
                    className="flex gap-6 w-max animate-marquee relative z-0"
                >
                    {industries.map((ind, i) => (
                        <div key={i} style={{ width: MARQUEE_CARD_WIDTH_PX }} className="h-64 shrink-0">
                            <TiltCard className="h-full w-full">
                                <div className="h-full w-full bg-white dark:bg-white/5 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-2xl p-10 flex flex-col justify-between hover:bg-brand-50/50 dark:hover:bg-brand-900/40 hover:border-brand-500/50 shadow-sm hover:shadow-xl transition-all duration-500 group cursor-pointer relative overflow-hidden">
                                    <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-brand-500/10 dark:bg-brand-500/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                                    <div className="w-16 h-16 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center group-hover:bg-brand-500/10 dark:group-hover:bg-brand-500/20 group-hover:border-brand-500/50 shadow-sm group-hover:shadow-xl transition-all duration-500 group-hover:-translate-y-2 relative overflow-hidden">
                                        <ind.icon className="w-10 h-10 drop-shadow-md group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                    <div>
                                        <h3 className="font-serif font-black text-2xl text-brand-950 dark:text-white tracking-wide mb-2">{ind.name}</h3>
                                        <div className="h-[2px] w-8 bg-brand-600 transition-all duration-500 group-hover:w-full"></div>
                                    </div>
                                </div>
                            </TiltCard>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};
