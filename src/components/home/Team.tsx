'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, Crown, UserCheck, Linkedin, 
  Mail, ShieldCheck, Sparkles, X, FileText, CheckCircle2 
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Magnetic, SplitText } from '@/components/ui/HyperEffects';

type TeamMember = {
  id: string;
  name: string;
  role: { en: string; bn: string };
  bio: { en: string; bn: string };
  fullBio: { en: string; bn: string };
  img: string;
  signal: string;
  metric: string;
  theme: string;
  gradient: string;
  color: string;
  textColor: string;
  glowColor: string;
  stats: { label: string; value: string }[];
};

const teamMembers: TeamMember[] = [
  {
    id: 'khadimul',
    name: 'K M KHADIMUL HASAN',
    role: { en: 'Founder & Managing Partner', bn: 'প্রতিষ্ঠাতা ও ম্যানেজিং পার্টনার' },
    bio: { en: 'Veteran Corporate Strategist. 25 years advising enterprise boards on cross-border strategy and commercial scaling.', bn: 'অভিজ্ঞ কর্পোরেট কৌশলবিদ। ২৫ বছর ধরে প্রতিষ্ঠানের বোর্ডকে বৈশ্বিক বাণিজ্য ও কৌশলগত প্রসারে পরামর্শ দিচ্ছেন।' },
    fullBio: {
      en: 'K M Khadimul Hasan is the Founder and Managing Partner of Inception 23. A veteran corporate strategist with over two decades of senior advisory experience, he has established scaling frameworks utilized by market-leading enterprises globally. His expertise spans M&A advisory, cross-border restructuring, and high-velocity corporate scaling.',
      bn: 'কে এম খাদিমুল হাসান ইনসেপশন ২৩-এর প্রতিষ্ঠাতা ও ম্যানেজিং পার্টনার। দুই দশকেরও বেশি সিনিয়র উপদেষ্টা অভিজ্ঞতা নিয়ে তিনি বৈশ্বিক বাজারের শীর্ষস্থানীয় প্রতিষ্ঠানগুলোর জন্য স্কেলিং ফ্রেমওয়ার্ক তৈরি করেছেন। তার দক্ষতার ক্ষেত্রগুলোর মধ্যে রয়েছে একত্রীকরণ ও অধিগ্রহণ (M&A) পরামর্শ, আন্তর্জাতিক পুনর্গঠন এবং উচ্চ-গতির কর্পোরেট স্কেলিং।'
    },
    img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=900&auto=format&fit=crop',
    signal: 'Board Strategy',
    metric: '25Y EXP',
    theme: 'amber',
    gradient: 'from-amber-500 via-orange-500 to-yellow-600',
    color: '#F59E0B',
    textColor: 'text-amber-600 dark:text-amber-400',
    glowColor: 'rgba(245, 158, 11, 0.15)',
    stats: [
      { label: 'Focus Area', value: 'Board Advisory' },
      { label: 'Focus Area', value: 'Cross-Border M&A' },
      { label: 'Focus Area', value: 'Global Scaling' }
    ]
  },
  {
    id: 'faisal',
    name: 'GAZI FAISAL',
    role: { en: 'Co-Founder & Partner', bn: 'সহ-প্রতিষ্ঠাতা ও পার্টনার' },
    bio: { en: 'Senior Legal & Risk Advisor. Expert in regulatory defense, risk mitigation, and high-stakes dispute resolution.', bn: 'সিনিয়র লিগ্যাল ও রিস্ক অ্যাডভাইজর। রেগুলেটরি ডিফেন্স, রিস্ক ম্যানেজমেন্ট এবং জটিল কর্পোরেট আইনি বিরোধ মীমাংসা বিশেষজ্ঞ।' },
    fullBio: {
      en: 'Gazi Faisal is the Co-Founder and Partner leading the Corporate Legal and Risk Practice at Inception 23. He brings extensive experience defending enterprises against regulatory actions and handling high-stakes corporate disputes. His practice ensures corporate entities operate with absolute compliance while building bulletproof risk-mitigation frameworks.',
      bn: 'গাজী ফয়সাল ইনসেপশন ২৩-এর সহ-প্রতিষ্ঠাতা এবং কর্পোরেট লিগ্যাল অ্যান্ড রিস্ক প্র্যাকটিস-এর প্রধান পার্টনার। রেগুলেটরি জটিলতা মোকাবিলা এবং বড় কর্পোরেট দ্বন্দ্ব নিরসনের ব্যাপক অভিজ্ঞতা তার রয়েছে। তিনি ব্যবসায়িক প্রতিষ্ঠানগুলোর পরম কমপ্লায়েন্স এবং অটুট আইনি সুরক্ষা নিশ্চিত করেন।'
    },
    img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=900&auto=format&fit=crop',
    signal: 'Risk Control',
    metric: 'RISK DEF',
    theme: 'rose',
    gradient: 'from-rose-500 via-pink-500 to-purple-600',
    color: '#F43F5E',
    textColor: 'text-rose-600 dark:text-rose-400',
    glowColor: 'rgba(244, 63, 94, 0.15)',
    stats: [
      { label: 'Focus Area', value: 'Regulatory Defense' },
      { label: 'Focus Area', value: 'Risk Mitigation' },
      { label: 'Focus Area', value: 'Dispute Resolution' }
    ]
  },
  {
    id: 'mahmudul',
    name: 'MAHMUDUL HASAN',
    role: { en: 'Management Partner, Tech', bn: 'ম্যানেজমেন্ট পার্টনার, টেকনোলজি' },
    bio: { en: 'AI & Software Systems Architect. Architect of predictive operating engines and zero-trust computational architectures.', bn: 'এআই এবং সফটওয়্যার সিস্টেম আর্কিটেক্ট। প্রেডিক্টিভ অপারেটিং ইঞ্জিন এবং জিরো-ট্রাস্ট কম্পিউটার অবকাঠামোর স্থপতি।' },
    fullBio: {
      en: 'Mahmudul Hasan drives the Artificial Intelligence and Software systems practice at Inception 23. A leading expert in deploying custom LLM voice agents, neural databases, and secure, high-capacity React/Next.js frameworks, he specializes in removing operational friction through intelligent corporate automation.',
      bn: 'মাহমুদুল হাসান ইনসেপশন ২৩-এর আর্টিফিশিয়াল ইন্টেলিজেন্স এবং সফটওয়্যার সিস্টেমস বিভাগের দায়িত্বে আছেন। এআই ভয়েস এজেন্ট, নিউরাল ডাটাবেস এবং জিরো-ট্রাস্ট সিস্টেম আর্কিটেকচার নিয়ে কাজ করা এই প্রযুক্তিবিদ কর্পোরেট অটোমেশনের মাধ্যমে কোম্পানির পরিচালনাগত জটিলতা দূর করতে পারদর্শী।'
    },
    img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=900&auto=format&fit=crop',
    signal: 'AI Systems',
    metric: 'AI SYSTEMS',
    theme: 'teal',
    gradient: 'from-teal-500 via-cyan-500 to-blue-600',
    color: '#14B8A6',
    textColor: 'text-teal-600 dark:text-teal-400',
    glowColor: 'rgba(20, 184, 166, 0.15)',
    stats: [
      { label: 'Focus Area', value: 'AI Systems Architecture' },
      { label: 'Focus Area', value: 'Software Engineering' },
      { label: 'Focus Area', value: 'Automation Design' }
    ]
  },
  {
    id: 'khairul',
    name: 'K M KHAIRUL HASAN ARIF',
    role: { en: 'Strategic Advisor', bn: 'কৌশলগত উপদেষ্টা' },
    bio: { en: 'Strategic Growth Advisor. Directing enterprise strategy, high-velocity growth, and digital execution.', bn: 'কৌশলগত প্রবৃদ্ধি উপদেষ্টা। এন্টারপ্রাইজ কৌশল, উচ্চ-গতির প্রবৃদ্ধি এবং ডিজিটাল বাস্তবায়নের দিকনির্দেশক।' },
    fullBio: {
      en: 'K M Khairul Hasan Arif is a Senior Strategic Advisor. He advises corporations on structural agility and market-share acquisition, focusing on guiding fast-growing companies and mid-market enterprises through complex digital pivots and operational expansion.',
      bn: 'কে এম খাইরুল হাসান আরিফ একজন সিনিয়র কৌশলগত উপদেষ্টা। তিনি ব্যবসা প্রতিষ্ঠানের সক্ষমতা বৃদ্ধি এবং বাজার দখল কৌশলে দিকনির্দেশনা দেন। তার মূল মনোযোগ দ্রুত বর্ধনশীল এবং মধ্যম সারির কোম্পানিগুলোর ডিজিটাল পিভটিং ও অপারেশনাল সম্প্রসারণের ওপর।'
    },
    img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=900&auto=format&fit=crop',
    signal: 'Strategy Pivot',
    metric: 'ADV CORE',
    theme: 'indigo',
    gradient: 'from-indigo-500 via-violet-500 to-purple-600',
    color: '#6366F1',
    textColor: 'text-indigo-600 dark:text-indigo-400',
    glowColor: 'rgba(99, 102, 241, 0.15)',
    stats: [
      { label: 'Focus Area', value: 'Strategic Growth' },
      { label: 'Focus Area', value: 'Digital Execution' },
      { label: 'Focus Area', value: 'Market Expansion' }
    ]
  }
];

export const Team = () => {
  const { lang } = useAppStore();
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [mousePos, setMousePos] = useState<Record<string, { x: number; y: number }>>({});

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, id: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos((prev) => ({
      ...prev,
      [id]: {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      }
    }));
  };

  const handleInquiryRedirect = () => {
    const el = document.getElementById('inquiry');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      const textarea = el.querySelector('textarea');
      if (textarea) {
        textarea.value = "Hello Inception 23, I am interested in exploring open practice seats (Management / Advisory / Executive) and would like to schedule a credential review...";
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
        textarea.focus();
      }
    }
  };

  return (
    <section id="team" className="relative overflow-hidden border-t border-gray-200 bg-gray-50 dark:bg-night-950 py-24 md:py-36 dark:border-white/5 transition-colors duration-500">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(20,184,166,0.015)_0%,transparent_100%)] pointer-events-none" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(13,1,33,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(13,1,33,0.012)_1px,transparent_1px)] bg-[size:40px_40px] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.012)_1px,transparent_1px)] opacity-40" />

      <div className="container relative z-10 mx-auto max-w-7xl px-6">
        
        {/* Section Heading Block */}
        <div className="mb-20 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/5 px-4 py-2 text-[10px] font-black uppercase tracking-[0.28em] text-brand-700 dark:text-brand-400"
            >
              <Sparkles size={12} className="animate-pulse text-brand-500" />
              {lang === 'en' ? 'TEAM ARCHITECTURE' : 'টিম আর্কিটেকচার'}
            </motion.div>
            <h2 className="max-w-4xl font-serif text-[clamp(2.5rem,4.5vw,4.5rem)] font-black leading-[1.05] tracking-tight text-brand-950 dark:text-white">
              <SplitText text={lang === 'en' ? 'Elite advisory board.' : 'অভিজ্ঞ উপদেষ্টা মণ্ডলী।'} />
            </h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-gray-200/50 bg-white/80 p-6 shadow-sm dark:border-white/5 dark:bg-night-900/60 backdrop-blur-md max-w-sm"
          >
            <div className="flex items-start gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 dark:bg-white/10 dark:text-brand-300">
                <ShieldCheck size={18} />
              </span>
              <div>
                <div className="text-sm font-black text-brand-950 dark:text-white">Structured Advisory Mapping</div>
                <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-light">
                  Direct boardroom governance, deep software technology architectures, and complex federal legal defense.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Premium Bento Grid Team Showcase */}
        {/* Row 1: Founder (2x col) + Faisal (1x col) */}
        {/* Row 2: Mahmudul (1x col) + Khairul (1x col) + Careers (1x col) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          
          {teamMembers.map((member, i) => {
            const isFounder = member.id === 'khadimul';
            const mPos = mousePos[member.id] || { x: 0, y: 0 };

            return (
              <motion.div
                key={member.id}
                role="button"
                tabIndex={0}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.08, type: 'spring', stiffness: 70 }}
                onClick={() => setSelectedMember(member)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedMember(member);
                  }
                }}
                className={`cursor-pointer ${isFounder ? 'md:col-span-2 lg:col-span-2' : 'col-span-1'} group`}
              >
                <div
                  onMouseMove={(e) => handleMouseMove(e, member.id)}
                  className="relative p-[1px] rounded-[2rem] overflow-hidden transition-all duration-500 h-full shadow-sm hover:shadow-xl border border-gray-200/50 dark:border-white/5 bg-white dark:bg-night-900"
                >
                  {/* Neon border highlight sweep on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${member.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-[0.5px]`} />
                  
                  {/* Inner Content Block */}
                  <div className="relative bg-white dark:bg-night-900 rounded-[31px] overflow-hidden h-full flex flex-col justify-between p-6 md:p-8">
                    
                    {/* Spotlight mouse cursor tracker overlay */}
                    <div
                      className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"
                      style={{
                        background: `radial-gradient(350px circle at ${mPos.x}px ${mPos.y}px, ${member.glowColor}, transparent 80%)`
                      }}
                    />

                    {/* Top Row Indicators */}
                    <div className="flex justify-between items-start mb-6 relative z-10">
                      <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] bg-gradient-to-r ${member.gradient} text-white shadow-md`}>
                        {isFounder ? <Crown size={10} /> : <UserCheck size={10} />}
                        {member.signal}
                      </span>
                      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-100 bg-gray-50 text-[10px] font-black dark:border-white/10 dark:bg-white/5 font-mono">
                        {member.metric}
                      </span>
                    </div>

                    {/* Middle Row: Photo and Bio Details */}
                    <div className={`flex flex-col ${isFounder ? 'sm:flex-row' : ''} gap-6 items-center flex-grow mb-6 relative z-10 text-left`}>
                      {/* Grayscale avatar with color hover zoom */}
                      <div className={`relative w-28 h-28 ${isFounder ? 'sm:w-36 sm:h-36' : 'w-32 h-32'} rounded-2xl overflow-hidden shrink-0 border border-gray-100 dark:border-white/10 bg-night-950 shadow-sm`}>
                        <Image 
                          src={member.img} 
                          alt={member.name} 
                          fill 
                          className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[0.8s] ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      
                      <div>
                        <h3 className="font-serif font-black text-2xl text-brand-950 dark:text-white leading-tight mb-2 group-hover:text-brand-700 dark:group-hover:text-brand-400 transition-colors duration-300">
                          {member.name}
                        </h3>
                        <p className={`text-[10px] font-black uppercase tracking-wider mb-3 ${member.textColor}`}>
                          {lang === 'en' ? member.role.en : member.role.bn}
                        </p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-light leading-relaxed line-clamp-3">
                          {lang === 'en' ? member.bio.en : member.bio.bn}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Link CTA */}
                    <div className="border-t border-gray-100 dark:border-white/5 pt-4 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-brand-950 dark:text-white relative z-10 group-hover:text-brand-700 dark:group-hover:text-brand-400 transition-all">
                      <span>{lang === 'en' ? 'Review Credentials' : 'পূর্ণ জীবনবৃত্তান্ত দেখুন'}</span>
                      <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform duration-350" />
                    </div>

                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* Careers & Open Position Bento Block (Redesigned to fit perfectly in 1 column of Row 2) */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.32, type: 'spring', stiffness: 70 }}
            className="col-span-1 bg-gradient-to-br from-brand-950 via-night-900 to-night-950 border border-brand-500/20 rounded-[2rem] p-6 md:p-8 flex flex-col justify-between text-white relative overflow-hidden group shadow-lg min-h-[300px]"
          >
            {/* Glowing neon background highlight */}
            <div className="absolute -inset-10 bg-brand-500/10 rounded-full blur-[60px] opacity-70 pointer-events-none group-hover:bg-brand-500/15 transition-all duration-700" />
            
            <div className="space-y-4 relative z-10 text-left">
              <div className="inline-flex px-3 py-1 bg-brand-500/15 border border-brand-500/30 text-brand-400 text-[9px] font-black uppercase tracking-widest rounded-md">
                CAREERS
              </div>
              
              <h3 className="text-2xl font-serif font-black text-white leading-tight">
                {lang === 'en' ? 'Join the Elite.' : 'বোর্ডে যোগ দিন।'}
              </h3>
              
              <p className="text-gray-400 text-xs leading-relaxed font-light">
                {lang === 'en' 
                  ? "We actively recruit partners capable of reshaping markets. Submit credentials for open seats."
                  : "আমাদের শূন্য অ্যাডভাইজরি এবং ম্যানেজমেন্ট স্লটগুলোর জন্য সরাসরি আবেদন করুন।"}
              </p>
            </div>

            {/* Quick stats inline list */}
            <div className="grid grid-cols-3 gap-2 border-t border-white/10 pt-4 pb-4 relative z-10 text-left">
              <div>
                <div className="text-[8px] text-gray-500 font-bold uppercase tracking-wider">Mgmt</div>
                <div className="text-sm font-serif font-black text-brand-400">3 Seats</div>
              </div>
              <div>
                <div className="text-[8px] text-gray-500 font-bold uppercase tracking-wider">Advisors</div>
                <div className="text-sm font-serif font-black text-brand-400">9 Seats</div>
              </div>
              <div>
                <div className="text-[8px] text-gray-500 font-bold uppercase tracking-wider">Execs</div>
                <div className="text-sm font-serif font-black text-brand-400">10 Seats</div>
              </div>
            </div>

            {/* Redirect submit button */}
            <div className="relative z-10 w-full">
              <Magnetic>
                <button
                  onClick={handleInquiryRedirect}
                  className="w-full px-5 py-3.5 bg-white text-brand-950 font-black text-[10px] uppercase tracking-widest rounded-xl flex items-center justify-center gap-2.5 shadow-md hover:bg-brand-500 hover:text-white transition-all cursor-pointer"
                >
                  <span>Submit CV</span>
                  <FileText size={12} />
                </button>
              </Magnetic>
            </div>

          </motion.div>

        </div>

      </div>

      {/* Slide-in Profile Detail Drawer Modal */}
      <AnimatePresence>
        {selectedMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-end bg-night-950/80 backdrop-blur-sm"
            onClick={() => setSelectedMember(null)}
          >
            {/* Drawer Body Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              className="bg-white dark:bg-night-900 border-l border-gray-200 dark:border-white/10 w-full max-w-lg h-full shadow-2xl relative flex flex-col justify-between overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-gray-50/50 dark:bg-night-900/50">
                <span className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-400">Dossier Credential review</span>
                <Magnetic>
                  <button 
                    onClick={() => setSelectedMember(null)}
                    className="w-8 h-8 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer transition-colors"
                  >
                    <X size={14} />
                  </button>
                </Magnetic>
              </div>

              {/* Scrollable details */}
              <div className="overflow-y-auto no-scrollbar p-6 flex-grow space-y-6">
                {/* Profile Portrait */}
                <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-night-950 shadow-sm border border-gray-200/50 dark:border-white/5">
                  <Image 
                    src={selectedMember.img} 
                    alt={selectedMember.name} 
                    fill 
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-night-900 via-transparent to-transparent opacity-90" />
                  
                  <div className="absolute bottom-4 left-6 z-10 text-left">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.2em] bg-gradient-to-r ${selectedMember.gradient} text-white shadow-sm mb-2`}>
                      {selectedMember.signal}
                    </span>
                    <h3 className="text-2xl font-serif font-black text-brand-950 dark:text-white leading-none">
                      {selectedMember.name}
                    </h3>
                  </div>
                </div>

                {/* Role Details */}
                <div className="text-left">
                  <h4 className={`text-xs font-black uppercase tracking-wider mb-2.5 ${selectedMember.textColor}`}>
                    {lang === 'en' ? selectedMember.role.en : selectedMember.role.bn}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-light leading-relaxed">
                    {lang === 'en' ? selectedMember.bio.en : selectedMember.bio.bn}
                  </p>
                </div>

                {/* Metric grid */}
                <div className="grid grid-cols-3 gap-3 border-y border-gray-100 dark:border-white/5 py-4 text-left">
                  {selectedMember.stats.map((stat, idx) => (
                    <div key={idx}>
                      <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider leading-none mb-1">{stat.label}</div>
                      <div className="text-base font-serif font-black text-brand-950 dark:text-white">{stat.value}</div>
                    </div>
                  ))}
                </div>

                {/* Full biography card */}
                <div className="p-5 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 space-y-3 text-left">
                  <div className="text-[9px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                    <FileText size={12} /> Full Biography & Engagements
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-xs leading-relaxed font-light">
                    {lang === 'en' ? selectedMember.fullBio.en : selectedMember.fullBio.bn}
                  </p>
                </div>

                {/* Validation checklist */}
                <div className="space-y-3 text-left">
                  <div className="text-[9px] font-black uppercase tracking-widest text-gray-400">Pillar Engagements</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {['Strategic Restructuring', 'Operational Optimization', 'Regulatory Alignment', 'Digital Architecture'].map((item, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                        <CheckCircle2 size={12} className={selectedMember.textColor} />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom CTAs */}
              <div className="p-6 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-night-900/50 flex gap-4">
                <Magnetic>
                  <a 
                    href={`mailto:partner@inception23.com?subject=Dossier Inquiry: ${selectedMember.name}`}
                    className="flex-1 px-5 py-3.5 bg-brand-950 dark:bg-brand-700 hover:bg-brand-900 dark:hover:bg-brand-600 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
                  >
                    <Mail size={14} /> Contact Partner
                  </a>
                </Magnetic>
                <Magnetic>
                  <a 
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-3.5 border border-gray-300 dark:border-white/10 text-brand-950 dark:text-white rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-gray-100 dark:hover:bg-white/5 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Linkedin size={14} /> LinkedIn
                  </a>
                </Magnetic>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-brand-500/20 to-transparent" />
    </section>
  );
};
