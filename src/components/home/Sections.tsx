'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, BarChart, ShieldCheck, Target, Lightbulb, Rocket, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { RichIcon } from '@/components/ui/RichIcon';
import { 
  FinTechIllustration, PublicSectorIllustration, ManufacturingIllustration, 
  TechIllustration, EnergyIllustration, HealthIllustration 
} from '@/components/ui/Illustrations';
import { TiltCard, SplitText, CountingNumber, Magnetic } from '@/components/ui/HyperEffects';

export const Industries = () => {
    const { lang } = useAppStore();
    const industries = [
        { name: 'Financial Services', bn: 'আর্থিক সেবাসমূহ', icon: FinTechIllustration },
        { name: 'Public Sector', bn: 'পাবলিক সেক্টর', icon: PublicSectorIllustration },
        { name: 'Manufacturing', bn: 'উৎপাদন', icon: ManufacturingIllustration },
        { name: 'Technology', bn: 'প্রযুক্তি', icon: TechIllustration },
        { name: 'Energy', bn: 'শক্তি', icon: EnergyIllustration },
        { name: 'Healthcare', bn: 'স্বাস্থ্যসেবা', icon: HealthIllustration }
    ];
    return (
        <section id="industries" className="py-24 bg-white dark:bg-night-900 overflow-hidden">
            <motion.div initial={{ opacity: 0, y: -30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8, type: "spring" }} suppressHydrationWarning className="container mx-auto px-6">
                <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-center text-gray-400 mb-16">{lang === 'en' ? 'Industry Focus' : 'শিল্প ফোকাস'}</h2>
                <div suppressHydrationWarning className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 border-t border-l border-gray-100 dark:border-night-800">
                    {industries.map((ind, i) => (
                        <div suppressHydrationWarning key={i} className="px-4 py-8 md:py-10 border-b border-r border-gray-100 dark:border-night-800 hover:bg-brand-50/50 dark:hover:bg-night-800/50 transition-all duration-500 cursor-pointer text-center group flex flex-col items-center justify-center min-h-[220px]">
                            <div className="w-20 h-20 md:w-24 md:h-24 mb-6 group-hover:-translate-y-2 group-hover:scale-105 transition-transform duration-500">
                                <ind.icon className="w-full h-full drop-shadow-sm" />
                            </div>
                            <span className="font-serif font-bold text-sm md:text-base text-gray-700 dark:text-gray-300 group-hover:text-brand-700 dark:group-hover:text-brand-300 transition-colors uppercase tracking-[0.05em]">{lang === 'en' ? ind.name : ind.bn}</span>
                        </div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
};

// ==========================================
// 1. STATS PROOF SECTION WITH COUNTING NUMBERS
// ==========================================
export const Proof = () => {
    const { lang } = useAppStore();
    return (
        <section id="proof" className="py-20 md:py-32 bg-white dark:bg-night-950 relative overflow-hidden border-t border-gray-100 dark:border-night-800">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(20,184,166,0.015)_0%,transparent_100%)] pointer-events-none"></div>
            
            <motion.div 
              initial={{ opacity: 0 }} 
              whileInView={{ opacity: 1 }} 
              viewport={{ once: true, margin: "-10%" }} 
              transition={{ duration: 0.8 }} 
              suppressHydrationWarning 
              className="container mx-auto px-6 relative z-10"
            >
                <div suppressHydrationWarning className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-gray-200 dark:divide-white/10">
                    {[
                        { val: "$50B+", label: { en: "Assets Advised", bn: "উপদেষ্টা সম্পদ" }, icon: TrendingUp, theme: 'emerald' },
                        { val: "30%", label: { en: "Avg. Efficiency Gain", bn: "গড় দক্ষতা বৃদ্ধি" }, icon: BarChart, theme: 'blue' },
                        { val: "100%", label: { en: "Regulatory Compliance", bn: "নিয়ন্ত্রক সম্মতি" }, icon: ShieldCheck, theme: 'purple' }
                    ].map((stat, i) => (
                        <motion.div 
                          initial={{ scale: 0.8, opacity: 0 }} 
                          whileInView={{ scale: 1, opacity: 1 }} 
                          viewport={{ once: true, margin: "-10%" }} 
                          transition={{ delay: i * 0.1, type: "spring", stiffness: 100, damping: 15 }} 
                          suppressHydrationWarning 
                          key={i} 
                          className="pt-8 md:pt-0 px-4 md:px-8 flex flex-col items-center"
                        >
                            <div suppressHydrationWarning className="flex flex-col items-center justify-center gap-4 md:gap-6 mb-4">
                                <RichIcon icon={stat.icon} theme={stat.theme} />
                                <div suppressHydrationWarning className="text-4xl md:text-5xl lg:text-7xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-b from-brand-700 to-brand-500 dark:from-white dark:to-brand-300">
                                  {/* Dynamic count-up numbers */}
                                  <CountingNumber value={stat.val} />
                                </div>
                            </div>
                            <div suppressHydrationWarning className="text-xs font-black uppercase tracking-widest text-brand-600 dark:text-brand-400">
                              {lang === 'en' ? stat.label.en : stat.label.bn}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
};

// ==========================================
// 2. LEAD INQUIRY FORM CONNECTED TO SQLITE
// ==========================================
export const InquiryForm = () => {
    const { lang } = useAppStore();
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setStatus('submitting');
      try {
        const res = await fetch('/api/inquiries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        const data = await res.json();
        if (res.ok) {
          setStatus('success');
          setFormData({ name: '', email: '', message: '' });
        } else {
          setStatus('error');
          setErrorMsg(data.error || 'Failed to submit.');
        }
      } catch (err) {
        console.error('Inquiry Form error:', err);
        setStatus('error');
        setErrorMsg('Network error. Please try again.');
      }
    };

    return (
        <section id="inquiry" className="py-32 bg-white dark:bg-night-900 overflow-hidden relative">
            {/* Glowing decorative blobs */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/5 rounded-full blur-[140px] pointer-events-none" />

            <div suppressHydrationWarning className="container mx-auto px-6 max-w-4xl relative z-10">
                <div className="mb-12 max-w-2xl text-left">
                    <h2 className="text-[clamp(2.4rem,4.5vw,4rem)] font-serif font-black mb-4 text-brand-950 dark:text-white leading-[1.05]">
                        <SplitText text={lang === 'en' ? 'Confidential Inquiry' : 'গোপনীয় অনুসন্ধান'} />
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 font-light text-base md:text-lg leading-relaxed">
                      {lang === 'en' ? 'Reach our senior partners securely.' : 'সরাসরি যোগাযোগ করুন।'}
                    </p>
                </div>
                
                <div className="bg-gray-50 dark:bg-night-800/80 p-8 md:p-16 border border-gray-200/50 dark:border-white/5 shadow-2xl dark:shadow-none space-y-8 rounded-[2rem] relative overflow-hidden backdrop-blur-md">
                  
                  <AnimatePresence>
                    {status === 'success' ? (
                      <motion.div 
                        key="success-form"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="py-12 text-center flex flex-col items-center justify-center space-y-6"
                      >
                        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.15)] animate-bounce">
                          <CheckCircle2 size={36} />
                        </div>
                        <h3 className="text-2xl font-serif font-black text-brand-950 dark:text-white">
                          {lang === 'en' ? 'Transmission Successful' : 'নিরাপদে জমা হয়েছে'}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md leading-relaxed font-light">
                          {lang === 'en' 
                            ? 'Your secure inquiry has been logged in our SQLite database. A senior partner will contact you directly within 24 business hours.'
                            : 'আপনার বার্তাটি আমাদের ডাটাবেজে সফলভাবে সংরক্ষিত হয়েছে।'}
                        </p>
                        <button 
                          onClick={() => setStatus('idle')}
                          className="px-6 py-2.5 rounded-full border border-white/10 text-xs font-bold uppercase tracking-wider hover:bg-white/5 transition-all cursor-pointer"
                        >
                          Submit New Inquiry
                        </button>
                      </motion.div>
                    ) : (
                      <motion.form 
                        key="active-form"
                        onSubmit={handleSubmit}
                        className="space-y-6"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="flex flex-col gap-2">
                            <input 
                              type="text" 
                              value={formData.name}
                              onChange={(e) => setFormData({...formData, name: e.target.value})}
                              className="w-full p-4 bg-white dark:bg-night-900 border border-gray-200 dark:border-white/5 focus:border-brand-500 dark:focus:border-brand-500 outline-none transition-all dark:text-white rounded-xl shadow-inner focus:ring-2 focus:ring-brand-500/10" 
                              placeholder={lang === 'en' ? "Your Name" : "নাম"} 
                              required 
                              disabled={status === 'submitting'}
                            />
                          </div>
                          <div className="flex flex-col gap-2">
                            <input 
                              type="email" 
                              value={formData.email}
                              onChange={(e) => setFormData({...formData, email: e.target.value})}
                              className="w-full p-4 bg-white dark:bg-night-900 border border-gray-200 dark:border-white/5 focus:border-brand-500 dark:focus:border-brand-500 outline-none transition-all dark:text-white rounded-xl shadow-inner focus:ring-2 focus:ring-brand-500/10" 
                              placeholder={lang === 'en' ? "Work Email" : "ইমেইল"} 
                              required 
                              disabled={status === 'submitting'}
                            />
                          </div>
                        </div>
                        
                        <textarea 
                          value={formData.message}
                          onChange={(e) => setFormData({...formData, message: e.target.value})}
                          className="w-full p-4 bg-white dark:bg-night-900 border border-gray-200 dark:border-white/5 focus:border-brand-500 dark:focus:border-brand-500 outline-none transition-all dark:text-white h-40 resize-none rounded-xl shadow-inner focus:ring-2 focus:ring-brand-500/10" 
                          placeholder={lang === 'en' ? "Confidential Message..." : "বার্তা..."} 
                          required
                          disabled={status === 'submitting'}
                        />

                        {status === 'error' && (
                          <div className="flex items-center gap-2 text-xs font-bold text-rose-400">
                            <AlertCircle size={14} />
                            <span>{errorMsg}</span>
                          </div>
                        )}

                        <Magnetic>
                          <button 
                            type="submit" 
                            disabled={status === 'submitting'}
                            className="w-full bg-brand-700 hover:bg-brand-600 text-white font-black py-5 rounded-xl shadow-xl transition-all uppercase tracking-[0.2em] text-xs hover:-translate-y-1 flex items-center justify-center gap-3 cursor-pointer disabled:bg-gray-600 disabled:cursor-not-allowed"
                          >
                            <Lock size={14} />
                            {status === 'submitting' ? 'Transmitting...' : (lang === 'en' ? 'Submit Securely' : 'নিরাপদে জমা দিন')}
                          </button>
                        </Magnetic>
                      </motion.form>
                    )}
                  </AnimatePresence>

                </div>
            </div>
        </section>
    );
};

// ==========================================
// 3. METHODOLOGY ROADMAP WITH 3D PERSPECTIVE
// ==========================================
export const Methodology = () => {
    const { lang } = useAppStore();
    const steps = [
        { num: '01', icon: Target, theme: 'rose', title: { en: 'Strategic Assessment', bn: 'কৌশলগত মূল্যায়ন' }, desc: { en: 'Deep-dive analysis of market position, operational bottlenecks, and untapped digital vectors.', bn: 'বাজারের অবস্থান, অপারেশনাল বাধা এবং অব্যবহৃত ডিজিটাল ভেক্টরের গভীর বিশ্লেষণ।' } },
        { num: '02', icon: Lightbulb, theme: 'amber', title: { en: 'Architecting Solutions', bn: 'সমাধান নির্মাণ' }, desc: { en: 'Developing custom frameworks leveraging legal compliance and cutting-edge tech deployment.', bn: 'আইনি সম্মতি এবং অত্যাধুনিক প্রযুক্তির সাহায্যে কাস্টম ফ্রেমওয়ার্ক তৈরি।' } },
        { num: '03', icon: Rocket, theme: 'cyan', title: { en: 'Execution & Scale', bn: 'বাস্তবায়ন এবং স্কেল' }, desc: { en: 'Frictionless rollout with continuous optimization to secure maximum ROI and market share.', bn: 'সর্বোচ্চ আয় এবং বাজারের অংশীদারিত্ব নিশ্চিত করতে ধারাবাহিক অপ্টিমাইজেশন।' } }
    ];

    return (
        <section id="methodology" className="py-24 md:py-32 bg-gray-50 dark:bg-night-950 relative overflow-hidden border-t border-gray-100 dark:border-night-800">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.025)_0%,transparent_100%)] pointer-events-none"></div>
            
            <div className="container mx-auto px-6 relative z-10">
                
                {/* Section Header */}
                <div className="max-w-3xl mb-16 md:mb-24 text-left">
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-10%" }}
                      className="inline-flex px-4 py-1.5 border border-brand-500/20 bg-brand-500/5 text-brand-600 dark:text-brand-400 text-xs font-black uppercase tracking-[0.25em] rounded-full mb-4"
                    >
                      {lang === 'en' ? 'OUR METHODOLOGY' : 'আমাদের পদ্ধতি'}
                    </motion.div>
                    
                    <h3 className="text-[clamp(2.6rem,5vw,4.75rem)] font-serif font-black leading-[1.03] text-brand-950 dark:text-white mb-6 tracking-tight">
                        <SplitText text={lang === 'en' ? 'Engineered for Scale.' : 'স্কেলের জন্য ইঞ্জিনিয়ারিং।'} />
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-400 text-base md:text-lg font-light leading-relaxed max-w-2xl">
                        {lang === 'en' 
                          ? 'We do not just offer advice; we build the indestructible infrastructure for your ultimate success. Our dynamic workflow merges commercial velocity with technical dominance.' 
                          : 'আমরা শুধু পরামর্শ দিই না; আমরা আপনার সাফল্যের অবকাঠামো তৈরি করি।'}
                    </p>
                </div>

                {/* Dynamic Timeline Roadmap */}
                <div className="relative max-w-5xl mx-auto">
                    {/* Central vertical line tracker */}
                    <div className="absolute left-[24px] md:left-1/2 top-4 bottom-4 w-[2px] bg-gradient-to-b from-transparent via-brand-200 dark:via-brand-800/40 to-transparent md:-translate-x-1/2 rounded-full"></div>

                    <div className="space-y-16 md:space-y-24 relative pb-10">
                        {steps.map((step, i) => {
                            const isEven = i % 2 === 0;
                            return (
                                <div key={i} className={`flex flex-col md:flex-row items-center justify-between w-full group ${!isEven ? 'md:flex-row-reverse' : ''}`}>
                                    
                                    {/* Offset */}
                                    <div className="hidden md:block w-[45%]"></div>

                                    {/* Connection Indicator Node */}
                                    <div className="absolute left-[24px] md:left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-white dark:bg-night-950 border-[5px] border-brand-500 z-10 shadow-[0_0_15px_rgba(20,184,166,0.6)] group-hover:scale-125 transition-transform duration-500"></div>

                                    {/* Card with 3D Tilt Card wrapper */}
                                    <motion.div 
                                        initial={{ opacity: 0, x: isEven ? -80 : 80, scale: 0.95 }} 
                                        whileInView={{ opacity: 1, x: 0, scale: 1 }} 
                                        viewport={{ once: true, margin: "-10%" }} 
                                        transition={{ duration: 0.7, type: "spring", stiffness: 90, damping: 15 }}
                                        className={`w-full md:w-[45%] pl-16 md:pl-0 ${isEven ? 'md:pr-12' : 'md:pl-12'} text-left relative`}
                                    >
                                        <TiltCard>
                                          <div className={`p-8 md:p-10 rounded-[2rem] bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 shadow-md hover:shadow-2xl hover:border-brand-500/30 transition-all duration-500 relative group overflow-hidden w-full ${isEven ? 'md:rounded-tr-none' : 'md:rounded-tl-none'} rounded-tl-none md:rounded-tl-[2rem]`}>
                                              
                                              {/* Interactive lighting overlay */}
                                              <div className="absolute -inset-4 bg-gradient-to-br from-brand-500/5 to-transparent opacity-0 group-hover:opacity-100 blur-xl transition-all duration-700 pointer-events-none" />

                                              <div className="flex w-full justify-start mb-5">
                                                  <RichIcon icon={step.icon} theme={step.theme} />
                                              </div>

                                              <h4 className="relative z-10 text-2xl md:text-3xl font-serif font-black mb-4 text-brand-950 dark:text-white transition-colors group-hover:text-brand-500">
                                                  {lang === 'en' ? step.title.en : step.title.bn}
                                              </h4>
                                              
                                              <p className="relative z-10 text-gray-500 dark:text-gray-400 text-sm md:text-base leading-relaxed font-light">
                                                  {lang === 'en' ? step.desc.en : step.desc.bn}
                                              </p>
                                          </div>
                                        </TiltCard>
                                    </motion.div>

                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>
        </section>
    );
};
