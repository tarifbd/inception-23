'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { ArrowRight, Linkedin, Twitter, Github, Mail, CheckCircle2, AlertCircle } from 'lucide-react';
import { Magnetic } from '@/components/ui/HyperEffects';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useSiteConfig } from '@/lib/hooks/useSiteConfig';

export const Footer = () => {
  const { lang } = useAppStore();
  const { categories } = useSiteConfig();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [msg, setMsg] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('submitting');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        setStatus('success');
        setEmail('');
        setMsg(lang === 'en' ? 'Thank you! You are now subscribed.' : 'ধন্যবাদ! আপনি এখন নিবন্ধিত।');
      } else {
        setStatus('error');
        setMsg(data.error || 'Failed to subscribe.');
      }
    } catch (err) {
      console.error('Newsletter error:', err);
      setStatus('error');
      setMsg('Network error. Please try again.');
    }

    setTimeout(() => {
      setStatus('idle');
      setMsg('');
    }, 4000);
  };

  const handleCategoryClick = (categoryId: string) => {
    const el = document.getElementById('services');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      window.history.pushState(null, '', `#${categoryId}`);
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    }
  };

  return (
    <footer className="relative bg-night-950 text-white overflow-hidden border-t border-white/5 pt-32 pb-8 z-40">
      
      {/* 1. Neon Drifting Background Glow Orbs */}
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-500/10 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-0 right-1/4 translate-x-1/2 w-[400px] h-[400px] bg-rose-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Massive Background Typography */}
      <div className="absolute top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none opacity-[0.015] select-none">
        <h1 className="font-serif font-black text-[20vw] leading-none whitespace-nowrap">INCEPTION 23</h1>
      </div>

      <div suppressHydrationWarning className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 mb-24 border-b border-white/10 pb-24">
          
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <span className="font-serif text-3xl font-bold tracking-tight mb-8 block text-white drop-shadow-md">
              INCEPTION<span className="text-brand-400"> 23</span>
            </span>
            <p className="text-gray-400 text-base leading-relaxed max-w-sm font-light mb-10">
              {lang === 'en' 
                ? 'Global strategic advisory, legal support, and AI-first digital transformations built strictly for corporate market dominance.' 
                : 'বাণিজ্যিক কৌশল, আইনি সহায়তা এবং প্রযুক্তির মাধ্যমে সফলতার পথনির্দেশ।'}
            </p>
            
            {/* Live Connect Newsletter */}
            <form onSubmit={handleSubscribe} className="relative max-w-sm group mb-8">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={lang === 'en' ? "Subscribe to Insights" : "ইমেইল লিখুন"} 
                className="w-full bg-white/5 border border-white/10 rounded-full py-4 pl-6 pr-14 text-sm outline-none focus:border-brand-500 focus:bg-white/10 transition-all text-white placeholder-gray-500 shadow-inner" 
                disabled={status === 'submitting'}
                required
              />
              <Magnetic>
                <button 
                  type="submit" 
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-brand-500 rounded-full flex items-center justify-center hover:bg-brand-400 transition-colors shadow-lg shadow-brand-500/20 cursor-pointer"
                  disabled={status === 'submitting'}
                >
                  <ArrowRight size={16} />
                </button>
              </Magnetic>
            </form>

            {/* Newsletter Status Message */}
            <AnimatePresence>
              {status !== 'idle' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`flex items-center gap-2 text-xs font-bold ${status === 'error' ? 'text-rose-400' : 'text-brand-400'}`}
                >
                  {status === 'error' ? <AlertCircle size={14} /> : <CheckCircle2 size={14} />}
                  <span>{status === 'submitting' ? 'Submitting...' : msg}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex gap-4 mt-8">
              <Magnetic><a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-brand-500 hover:border-transparent transition-all hover:-translate-y-1"><Linkedin size={18} /></a></Magnetic>
              <Magnetic><a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-brand-500 hover:border-transparent transition-all hover:-translate-y-1"><Twitter size={18} /></a></Magnetic>
              <Magnetic><a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-brand-500 hover:border-transparent transition-all hover:-translate-y-1"><Github size={18} /></a></Magnetic>
              <Magnetic><a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-brand-500 hover:border-transparent transition-all hover:-translate-y-1"><Mail size={18} /></a></Magnetic>
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            
            {/* Dynamic Services Pillar Links */}
            <div>
              <h4 className="font-black mb-8 uppercase tracking-[0.2em] text-xs text-brand-500">{lang === 'en' ? 'Our Capabilities' : 'আমাদের সক্ষমতা'}</h4>
              <ul className="space-y-4 text-sm font-medium text-gray-400">
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <button 
                      onClick={() => handleCategoryClick(cat.id)}
                      className="hover:text-white transition-colors relative group block text-left cursor-pointer"
                    >
                      <span className="relative z-10">{lang === 'en' ? cat.labelEn : cat.labelBn}</span>
                      <span className="absolute left-0 -bottom-1 w-0 h-[1px] bg-brand-500 transition-all duration-300 group-hover:w-full"></span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-black mb-8 uppercase tracking-[0.2em] text-xs text-brand-500">{lang === 'en' ? 'Sectors' : 'শিল্পখাত'}</h4>
              <ul className="space-y-4 text-sm font-medium text-gray-400">
                {['Financial Services', 'Healthcare', 'Energy', 'Public Sector'].map((item, i) => (
                  <li key={i}><a href="#industries" className="hover:text-white transition-colors relative group block w-fit"><span className="relative z-10">{item}</span><span className="absolute left-0 -bottom-1 w-0 h-[1px] bg-brand-500 transition-all duration-300 group-hover:w-full"></span></a></li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-black mb-8 uppercase tracking-[0.2em] text-xs text-brand-500">{lang === 'en' ? 'Firm Portal' : 'প্রতিষ্ঠান'}</h4>
              <ul className="space-y-4 text-sm font-medium text-gray-400">
                {['About Us', 'Leadership', 'Careers', 'Contact'].map((item, i) => (
                  <li key={i}>
                    <a 
                      href={item === 'Contact' ? '#services' : (item === 'Careers' ? '#careers' : (item === 'Leadership' ? '#team' : '#'))} 
                      className="hover:text-white transition-colors relative group block w-fit"
                    >
                      <span className="relative z-10">{item}</span>
                      <span className="absolute left-0 -bottom-1 w-0 h-[1px] bg-brand-500 transition-all duration-300 group-hover:w-full"></span>
                    </a>
                  </li>
                ))}
                <li>
                  <Link href="/admin" className="text-brand-400 hover:text-brand-300 transition-colors relative group block w-fit font-bold">
                    <span className="relative z-10">Admin Dashboard</span>
                    <span className="absolute left-0 -bottom-1 w-0 h-[1px] bg-brand-400 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-black mb-8 uppercase tracking-[0.2em] text-xs text-brand-500">{lang === 'en' ? 'Offices' : 'অফিস'}</h4>
              <ul className="space-y-4 text-sm font-medium text-gray-400">
                <li>New York</li>
                <li>London</li>
                <li>Dubai</li>
                <li>Dhaka</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center text-xs font-bold tracking-wider text-gray-600">
          <p>&copy; {new Date().getFullYear()} INCEPTION 23 INC. {lang === 'en' ? 'ALL RIGHTS RESERVED.' : 'সর্বস্বত্ব সংরক্ষিত।'}</p>
          <div className="flex gap-8 mt-6 md:mt-0">
            <a href="#" className="hover:text-gray-400 transition-colors">PRIVACY POLICY</a>
            <a href="#" className="hover:text-gray-400 transition-colors">TERMS OF USE</a>
            <a href="#" className="hover:text-gray-400 transition-colors">COOKIE SETTINGS</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
