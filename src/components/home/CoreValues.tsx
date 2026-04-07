'use client';
import { useAppStore } from '@/lib/store';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

export const CoreValues = () => {
    const { lang } = useAppStore();

    const titleEn = "We refuse to compromise.";
    const subEn = "Our foundation is built on absolute precision, relentless accountability, and the singular pursuit of market dominance.";
    const titleBn = "আমরা আপসহীন।";
    const subBn = "আমাদের ভিত্তি পরম নির্ভুলতা, নিরন্তর দায়বদ্ধতা এবং বাজার আধিপত্যের একক সাধনার উপর নির্মিত।";

    // 6-step Journey Data
    const journey = [
        { num: '01', title: { en: 'Absolute Precision', bn: 'পরম নির্ভুলতা' }, desc: { en: 'We operate with surgical accuracy. Every data point, every legal clause, and every strategic move is calculated down to the micro-variable.', bn: 'আমরা নিখুঁত নির্ভুলতার সাথে কাজ করি। প্রতিটি ডেটা এবং কৌশল মাইক্রো-ভেরিয়েবল স্তরে গণনা করা হয়।' } },
        { num: '02', title: { en: 'Relentless Accountability', bn: 'নিরন্তর দায়বদ্ধতা' }, desc: { en: 'Execution without excuses. We take supreme ownership of outcomes, ensuring your enterprise achieves its objectives regardless of market friction.', bn: 'অজুহাত ছাড়া বাস্তবায়ন। আমরা ফলাফলের সর্বোচ্চ দায়িত্ব নিই।' } },
        { num: '03', title: { en: 'Market Dominance', bn: 'বাজার আধিপত্য' }, desc: { en: 'We do not aim to compete; we aim to monopolize. Our strategic frameworks are designed to aggressively capture and retain market share.', bn: 'আমরা শুধু প্রতিযোগিতা করি না; আমরা আধিপত্য বিস্তার করতে চাই।' } },
        { num: '04', title: { en: 'Architectural Superiority', bn: 'স্থাপত্যগত শ্রেষ্ঠত্ব' }, desc: { en: 'Building indestructible operational and digital infrastructures that scale flawlessly from startup phase to public offering.', bn: 'অটুট অপারেশনাল এবং ডিজিটাল অবকাঠামো তৈরি করা।' } },
        { num: '05', title: { en: 'Frictionless Scaling', bn: 'ঘর্ষণহীন স্কেলিং' }, desc: { en: 'Accelerating growth velocity by removing bottlenecks and introducing high-efficiency automation across the entire corporate stack.', bn: 'পুরো কর্পোরেট স্ট্যাক জুড়ে বাধা দূর করে প্রবৃদ্ধির গতি ত্বরান্বিত করা।' } },
        { num: '06', title: { en: 'End-Game Execution', bn: 'চূড়ান্ত বাস্তবায়ন' }, desc: { en: 'Finalizing the strategy with lethal precision. From M&A closures to global launches, we ensure the endgame is absolute victory.', bn: 'অত্যন্ত নির্ভুলতার সাথে চূড়ান্ত কৌশল বাস্তবায়ন।' } }
    ];

    return (
        <section className="py-32 md:py-48 bg-white dark:bg-night-900 overflow-hidden relative border-t border-gray-100 dark:border-night-800">
            {/* Soft minimal background accent */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-500/5 dark:bg-brand-500/10 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="container mx-auto px-6 max-w-4xl relative z-10">
                {/* Bold Centered Heading Block */}
                <motion.div initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }} transition={{ duration: 0.8 }} className="text-center mb-24 md:mb-32">
                    <div className="inline-flex items-center gap-2 px-6 py-2 border border-gray-200 dark:border-white/10 rounded-full text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-brand-600 dark:text-brand-400 shadow-sm mb-8 bg-white dark:bg-night-950">
                        <Sparkles size={14} className="text-brand-500" />
                        {lang === 'en' ? 'Our Journey' : 'আমাদের যাত্রা'}
                    </div>
                    <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif font-black text-brand-950 dark:text-white leading-[1.1] tracking-tight mb-8">
                        {lang === 'en' ? titleEn : titleBn}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 text-lg md:text-2xl font-light leading-relaxed max-w-2xl mx-auto">
                        {lang === 'en' ? subEn : subBn}
                    </p>
                </motion.div>

                {/* Vertical Roadmap Timeline */}
                <div className="relative w-full flex flex-col items-center">
                    {journey.map((step, i) => {
                        const isEven = i % 2 === 0;
                        const isLast = i === journey.length - 1;

                        return (
                            <div key={i} className="relative w-full flex flex-col items-center">
                                {/* The Card Container */}
                                <div className={`w-full flex ${isEven ? 'md:justify-start' : 'md:justify-end'} justify-center relative z-10`}>
                                    <motion.div 
                                        initial={{ opacity: 0, y: 50, filter: "blur(5px)" }}
                                        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                        viewport={{ once: false, margin: "-10%" }}
                                        transition={{ duration: 0.7, delay: 0.1, type: "spring", stiffness: 80, damping: 20 }}
                                        className="w-full md:w-[45%] bg-white dark:bg-night-950/80 backdrop-blur-md rounded-2xl p-8 border border-gray-200 dark:border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.04)] hover:shadow-2xl hover:border-brand-300 dark:hover:border-brand-500/50 transition-all duration-500 relative group"
                                    >
                                        {/* Step Badge */}
                                        <div className="absolute -top-4 -right-2 md:right-auto md:left-8 bg-brand-900 dark:bg-brand-500 text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-lg group-hover:-translate-y-1 transition-transform">
                                            Step - {step.num}
                                        </div>
                                        
                                        <h4 className="text-2xl font-bold font-serif text-brand-950 dark:text-white mb-3 mt-2">{lang === 'en' ? step.title.en : step.title.bn}</h4>
                                        <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm md:text-base">{lang === 'en' ? step.desc.en : step.desc.bn}</p>
                                    </motion.div>
                                </div>

                                {/* Curvy Dashed Connector (Hidden on last item) */}
                                {!isLast && (
                                    <div className="w-full h-24 md:h-32 relative flex justify-center overflow-visible my-4 md:my-0">
                                        
                                        {/* Desktop Alternating S-Curve */}
                                        <svg className="hidden md:block absolute top-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ transform: isEven ? 'scaleX(1)' : 'scaleX(-1)' }}>
                                            <defs>
                                                <linearGradient id={`pulse-${i}`} x1="0%" y1="0%" x2="0%" y2="100%">
                                                    <stop offset="0%" stopColor="transparent" />
                                                    <stop offset="50%" stopColor="#14B8A6" />
                                                    <stop offset="100%" stopColor="transparent" />
                                                </linearGradient>
                                                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                                                    <feGaussianBlur stdDeviation="3" result="blur" />
                                                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                                </filter>
                                            </defs>
                                            
                                            {/* Base Dim Track */}
                                            <motion.path 
                                                initial={{ pathLength: 0 }}
                                                whileInView={{ pathLength: 1 }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 1.5, ease: "easeOut" }}
                                                d="M 22.5,0 L 22.5,50 L 77.5,50 L 77.5,100" 
                                                fill="none" 
                                                className="stroke-gray-200 dark:stroke-white/10" 
                                                strokeWidth="1.5" 
                                                strokeDasharray="4 4" 
                                            />
                                            
                                            {/* Infinite Flowing Energy pulse */}
                                            <motion.path 
                                                d="M 22.5,0 L 22.5,50 L 77.5,50 L 77.5,100" 
                                                fill="none" 
                                                stroke={`url(#pulse-${i})`} 
                                                strokeWidth="3.5" 
                                                strokeLinecap="round"
                                                filter="url(#glow)"
                                                initial={{ pathLength: 0.1, pathOffset: 0, opacity: 0 }}
                                                whileInView={{ opacity: 1 }}
                                                animate={{ pathOffset: 1 }}
                                                transition={{ 
                                                    opacity: { duration: 0.5 },
                                                    pathOffset: { duration: 2.5, ease: "linear", repeat: Infinity, delay: i * 0.3 } 
                                                }}
                                            />
                                        </svg>

                                        {/* Mobile Straight Dashed Line */}
                                        <svg className="md:hidden absolute top-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                                            <defs>
                                                <linearGradient id={`pulse-mob-${i}`} x1="0%" y1="0%" x2="0%" y2="100%">
                                                    <stop offset="0%" stopColor="transparent" />
                                                    <stop offset="50%" stopColor="#14B8A6" />
                                                    <stop offset="100%" stopColor="transparent" />
                                                </linearGradient>
                                                <filter id="glow-mob" x="-20%" y="-20%" width="140%" height="140%">
                                                    <feGaussianBlur stdDeviation="3" result="blur" />
                                                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                                </filter>
                                            </defs>
                                            
                                            {/* Base Dim Track */}
                                            <motion.path 
                                                initial={{ pathLength: 0 }}
                                                whileInView={{ pathLength: 1 }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 1 }}
                                                d="M 50,0 L 50,100" 
                                                fill="none" 
                                                className="stroke-gray-200 dark:stroke-white/10"
                                                strokeWidth="1.5" 
                                                strokeDasharray="4 4" 
                                            />
                                            
                                            {/* Infinite Flowing Energy pulse */}
                                            <motion.path 
                                                d="M 50,0 L 50,100" 
                                                fill="none" 
                                                stroke={`url(#pulse-mob-${i})`} 
                                                strokeWidth="4" 
                                                strokeLinecap="round"
                                                filter="url(#glow-mob)"
                                                initial={{ pathLength: 0.2, pathOffset: 0, opacity: 0 }}
                                                whileInView={{ opacity: 1 }}
                                                animate={{ pathOffset: 1 }}
                                                transition={{ 
                                                    opacity: { duration: 0.5 },
                                                    pathOffset: { duration: 2, ease: "linear", repeat: Infinity, delay: i * 0.2 } 
                                                }}
                                            />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Bottom CTAs */}
                <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: false }} transition={{ duration: 0.6, delay: 0.2 }} className="mt-24 md:mt-32 flex flex-col sm:flex-row justify-center items-center gap-6">
                    <button className="w-full sm:w-auto px-10 py-4 bg-brand-950 dark:bg-brand-600 text-white font-bold text-xs uppercase tracking-[0.2em] rounded-md shadow-xl shadow-brand-900/20 dark:shadow-brand-500/20 hover:-translate-y-1 hover:bg-brand-800 dark:hover:bg-brand-500 transition-all flex items-center justify-center gap-3">
                        {lang === 'en' ? 'Begin the Journey' : 'যাত্রা শুরু করুন'} <ArrowRight size={16} />
                    </button>
                    <button className="w-full sm:w-auto px-10 py-4 bg-transparent border border-gray-300 dark:border-gray-700 text-brand-950 dark:text-white font-bold text-xs uppercase tracking-[0.2em] rounded-md hover:border-brand-500 hover:text-brand-600 dark:hover:text-brand-400 transition-all">
                        {lang === 'en' ? 'View Executive Summary' : 'অফিসিয়াল সারসংক্ষেপ দেখুন'}
                    </button>
                </motion.div>
            </div>
        </section>
    );
};
