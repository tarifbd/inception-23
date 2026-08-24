'use client';

import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import { useAppStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Moon, Sun, Settings, Search, FileText, Cpu, Compass, ChevronDown, Palette } from 'lucide-react';
import { ScrollProgressBar, Magnetic } from '@/components/ui/HyperEffects';
import Link from 'next/link';
import { useSiteConfig } from '@/lib/hooks/useSiteConfig';
import { useCaseStudies } from '@/lib/hooks/useCaseStudies';
import { HEADER_SCROLL_OFFSET_PX } from '@/lib/constants/layout';

export const Header = () => {
  const { lang, theme, toggleLang, toggleTheme } = useAppStore();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  // Dynamic navigation & Search lists
  const { categories } = useSiteConfig();
  const { caseStudies } = useCaseStudies();

  // Spotlight Search State
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Dropdown states for Services menu
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

  const openSearch = useCallback(() => {
    setSearchQuery('');
    setSearchOpen(true);
  }, []);

  // Keyboard shortcut listener (Ctrl+K / Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => {
          const next = !prev;
          if (next) setSearchQuery('');
          return next;
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [searchOpen]);

  useEffect(() => {
    let ticking = false;

    const updateScrollState = () => {
      ticking = false;
      setScrolled(window.scrollY > 20);

      const otherSections = ['industries', 'insights', 'team', 'cases', 'inquiry'];
      const dynamicSections = categories.map(c => c.id);
      const allSections = [...dynamicSections, ...otherSections];

      let current = "";
      for (const section of allSections) {
        const el = document.getElementById(section === 'services' ? 'services' : (section === 'cases' ? 'cases' : section));
        if (el && window.scrollY >= el.offsetTop - HEADER_SCROLL_OFFSET_PX) {
          current = section;
        }
      }
      setActiveSection(current);
    };

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(updateScrollState);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [categories]);

  // Theme Sync on Mount
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const handleCategoryClick = (categoryId: string) => {
    const el = document.getElementById('services');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      window.history.pushState(null, '', `#${categoryId}`);
      window.dispatchEvent(new HashChangeEvent('hashchange'));
      setMobileMenu(false);
    }
  };

  // Filter Spotlight Results
  const searchResults = useMemo(() => {
    if (!searchQuery) return [];
    const q = searchQuery.toLowerCase();

    const results: Array<{ id: string; type: 'pillar' | 'service' | 'case'; title: string; categoryId: string; payload?: string }> = [];

    // Search pillars
    categories.forEach(cat => {
      if (cat.labelEn.toLowerCase().includes(q) || cat.labelBn.toLowerCase().includes(q)) {
        results.push({
          id: cat.id,
          type: 'pillar',
          title: lang === 'en' ? cat.labelEn : cat.labelBn,
          categoryId: cat.id
        });
      }

      // Search services
      cat.services.forEach(svc => {
        if (svc.titleEn.toLowerCase().includes(q) || svc.titleBn.toLowerCase().includes(q)) {
          results.push({
            id: svc.id ?? `${cat.id}-${svc.titleEn}`,
            type: 'service',
            title: lang === 'en' ? svc.titleEn : svc.titleBn,
            categoryId: cat.id
          });
        }
      });
    });

    // Search Case Studies
    caseStudies.forEach(cs => {
      if (cs.titleEn.toLowerCase().includes(q) || cs.titleBn.toLowerCase().includes(q)) {
        results.push({
          id: cs.id ?? cs.titleEn,
          type: 'case',
          title: lang === 'en' ? cs.titleEn : cs.titleBn,
          categoryId: cs.categoryId
        });
      }
    });

    return results.slice(0, 8); // limit results
  }, [searchQuery, categories, caseStudies, lang]);

  const handleSearchResultClick = (item: { id: string; type: 'pillar' | 'service' | 'case'; categoryId: string }) => {
    setSearchOpen(false);
    if (item.type === 'pillar' || item.type === 'service') {
      const el = document.getElementById('services');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
          window.history.pushState(null, '', `#${item.categoryId}`);
          window.dispatchEvent(new HashChangeEvent('hashchange'));
        }, 300);
      }
    } else if (item.type === 'case') {
      const el = document.getElementById('cases');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <ScrollProgressBar />

      {/* FLOATING PILL HEADER */}
      <motion.div
        initial={{ y: -100, width: "100%" }}
        animate={{
          y: 0,
          height: scrolled ? 70 : 90,
          marginTop: scrolled ? 16 : 0,
          borderRadius: scrolled ? 999 : 0,
          width: scrolled ? 'calc(100% - 32px)' : '100%',
          maxWidth: scrolled ? 1200 : '100vw'
        }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
        onMouseLeave={() => { setDropdownOpen(false); setHoveredSection(null); }}
        className={`fixed top-0 inset-x-0 mx-auto z-50 flex items-center transition-colors duration-500 ${
          scrolled ? 'bg-night-950/80 backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/10'
                   : 'bg-gradient-to-b from-black/60 via-black/20 to-transparent border-none'
        }`}
      >
        <div suppressHydrationWarning className={`container mx-auto flex items-center justify-between w-full h-full ${scrolled ? 'px-6 lg:px-8' : 'px-6'}`}>
          
          {/* Logo */}
          <Magnetic>
            <Link href="/" className="flex items-center gap-3 group/logo cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-700 rounded-full flex items-center justify-center text-white font-serif font-bold text-xl shadow-brand-500/30 shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 w-full h-full bg-gradient-to-tr from-transparent via-white/40 to-transparent -translate-x-[150%] group-hover/logo:translate-x-[150%] transition-transform duration-700" />
                I
              </div>
              <span className="font-serif text-xl font-bold tracking-tight text-white drop-shadow-md">
                INCEPTION<span className="text-brand-400"> 23</span>
              </span>
            </Link>
          </Magnetic>

          {/* Desktop Nav */}
          <div 
            suppressHydrationWarning 
            className="hidden xl:flex items-center gap-1 bg-black/25 dark:bg-white/5 rounded-full px-2 py-1.5 border border-white/10 backdrop-blur-md max-w-[70vw] overflow-x-auto no-scrollbar" 
            onMouseLeave={() => setHoveredSection(null)}
          >
            {/* Services Dropdown Trigger */}
            <div
              onMouseEnter={() => { setHoveredSection('services'); setDropdownOpen(true); }}
              className="relative"
            >
              <button
                onClick={() => {
                  const el = document.getElementById('services');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`relative px-4 py-2 text-[11px] font-black uppercase tracking-wider transition-colors duration-300 z-10 rounded-full flex items-center gap-1.5 cursor-pointer ${
                  activeSection === 'services' || hoveredSection === 'services' || dropdownOpen ? 'text-white' : 'text-white/60'
                }`}
              >
                <span className="relative z-10 flex items-center gap-1">
                  {lang === 'en' ? 'Services' : 'সার্ভিসসমূহ'}
                  <ChevronDown size={11} className={`transition-transform duration-300 ${dropdownOpen ? 'rotate-180 text-brand-400' : 'text-white/50'}`} />
                </span>
                {hoveredSection === 'services' && (
                  <motion.div
                    layoutId="navHover"
                    className="absolute inset-0 bg-white/10 rounded-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
                {activeSection === 'services' && hoveredSection !== 'services' && !dropdownOpen && (
                  <motion.div
                    layoutId="navActive"
                    className="absolute inset-0 bg-brand-500/40 rounded-full border border-brand-500/20"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
              </button>
            </div>

            {/* General Navigation Links */}
            {['Industries', 'Insights', 'Cases', 'Team'].map((sectionName) => {
              const sectionId = sectionName.toLowerCase();
              const isActive = activeSection === sectionId;
              const isHovered = hoveredSection === sectionId;
              const label = lang === 'en' ? (sectionName === 'Cases' ? 'Case Studies' : sectionName) : (
                sectionId === 'industries' ? 'শিল্পখাত' :
                sectionId === 'insights' ? 'অন্তর্দৃষ্টি' :
                sectionId === 'cases' ? 'কেস স্টাডিজ' : 'টিম'
              );

              return (
                <a
                  key={sectionId}
                  href={`#${sectionId}`}
                  onMouseEnter={() => setHoveredSection(sectionId)}
                  className={`relative px-4 py-2 text-[11px] font-black uppercase tracking-wider transition-colors duration-300 z-10 rounded-full ${
                    isActive || isHovered ? 'text-white' : 'text-white/60'
                  }`}
                >
                  <span className="relative z-10">{label}</span>
                  {isHovered && (
                    <motion.div
                      layoutId="navHover"
                      className="absolute inset-0 bg-white/10 rounded-full"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                  {isActive && !isHovered && (
                    <motion.div
                      layoutId="navActive"
                      className="absolute inset-0 bg-brand-500/40 rounded-full border border-brand-500/20"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                </a>
              );
            })}
          </div>

          {/* Actions Column */}
          <div className="hidden xl:flex items-center gap-3">
            {/* Spotlight Search Icon */}
            <Magnetic>
              <button
                onClick={openSearch}
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:bg-white/15 transition-all text-white flex items-center justify-center cursor-pointer"
                title="Search (Ctrl+K)"
                aria-label="Search (Ctrl+K)"
              >
                <Search size={16} />
              </button>
            </Magnetic>

            {/* Admin trigger */}
            <Magnetic>
              <Link
                href="/admin"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:bg-brand-500/20 transition-all text-white flex items-center justify-center hover:rotate-45"
                title="Admin Console"
                aria-label="Admin Console"
              >
                <Settings size={16} />
              </Link>
            </Magnetic>

            <Magnetic>
              <button onClick={toggleLang} className="text-[10px] font-black w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:bg-white/15 transition-all text-white flex items-center justify-center cursor-pointer">
                {lang === 'en' ? 'BN' : 'EN'}
              </button>
            </Magnetic>

            <Magnetic>
              <button onClick={toggleTheme} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:bg-white/15 transition-all text-white flex items-center justify-center hover:text-brand-400 hover:rotate-12 cursor-pointer">
                {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
              </button>
            </Magnetic>

            <Magnetic>
              <button 
                onClick={() => {
                  const el = document.getElementById('inquiry');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }} 
                className="relative group bg-white text-brand-950 px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:scale-105 overflow-hidden cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-brand-100 to-brand-200 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative z-10 block">{lang === 'en' ? 'Inquire' : 'অনুসন্ধান'}</span>
              </button>
            </Magnetic>
          </div>

          {/* Mobile Actions */}
          <div className="flex xl:hidden items-center gap-2">
            <button onClick={openSearch} className="p-2 text-white/80 hover:text-white">
              <Search size={18} />
            </button>
            <Link href="/admin" className="p-2 text-white/80 hover:text-white" title="Admin Panel">
              <Settings size={18} />
            </Link>
            <button onClick={toggleTheme} className="p-2 text-white/80 hover:text-white cursor-pointer">
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <button className="text-white p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/15 transition-colors z-[60] cursor-pointer" onClick={() => setMobileMenu(!mobileMenu)}>
              {mobileMenu ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Dynamic Services Mega Menu Dropdown */}
        <AnimatePresence>
          {dropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 350, damping: 26 }}
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
              className="fixed top-[104px] left-1/2 -translate-x-1/2 w-[calc(100vw-32px)] max-w-[1280px] max-h-[calc(100vh-128px)] overflow-y-auto bg-night-950/95 dark:bg-night-900/95 border border-white/10 backdrop-blur-3xl shadow-2xl rounded-3xl p-6 z-[70] pointer-events-auto"
            >
              {/* Glowing background stripes */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-500 via-emerald-500 to-fuchsia-500" />
              <div className="absolute -top-40 -left-40 w-96 h-96 bg-brand-500/10 rounded-full blur-[100px] pointer-events-none" />

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 relative z-10">
                {categories.map((cat) => {
                  const Icon = cat.id === 'it' ? Cpu : cat.id === 'consultancy' ? Compass : cat.id === 'legal' ? FileText : Palette;
                  
                  // Theme configurations for hovering columns
                  const catThemes: Record<string, { hoverText: string; iconBg: string; line: string }> = {
                    it: {
                      hoverText: 'hover:text-cyan-400',
                      iconBg: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400',
                      line: 'border-cyan-500/25'
                    },
                    consultancy: {
                      hoverText: 'hover:text-amber-400',
                      iconBg: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
                      line: 'border-amber-500/25'
                    },
                    legal: {
                      hoverText: 'hover:text-emerald-400',
                      iconBg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
                      line: 'border-emerald-500/25'
                    },
                    creative: {
                      hoverText: 'hover:text-fuchsia-400',
                      iconBg: 'bg-fuchsia-500/10 border-fuchsia-500/20 text-fuchsia-400',
                      line: 'border-fuchsia-500/25'
                    }
                  };
                  const theme = catThemes[cat.id] || catThemes.it;

                  return (
                    <div key={cat.id} className="space-y-4 group/col min-w-0">
                      {/* Category Title Header */}
                      <div 
                        onClick={() => handleCategoryClick(cat.id)}
                        className="flex items-center gap-3 cursor-pointer group/title select-none"
                      >
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all duration-300 ${theme.iconBg} group-hover/col:scale-110 shadow-lg`}>
                          <Icon size={16} />
                        </div>
                        <span className="font-serif text-sm font-bold text-white group-hover/col:text-white/90 group-hover/title:text-brand-400 transition-colors uppercase tracking-wider leading-tight">
                          {lang === 'en' ? cat.labelEn : cat.labelBn}
                        </span>
                      </div>

                      {/* Category Sub-Services List */}
                      <ul className={`space-y-2 border-l pl-4 ${theme.line} transition-colors duration-300`}>
                        {cat.services.map((svc) => (
                          <li key={svc.id ?? svc.titleEn}>
                            <a
                              href="#services"
                              onClick={(e) => {
                                e.preventDefault();
                                handleCategoryClick(cat.id);
                                setDropdownOpen(false);
                              }}
                              className={`block text-[10px] text-gray-400 ${theme.hoverText} transition-all duration-300 font-light hover:translate-x-1 uppercase tracking-[0.18em] leading-relaxed`}
                            >
                              {lang === 'en' ? svc.titleEn : svc.titleBn}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* MOBILE OVERLAY */}
      <AnimatePresence>
        {mobileMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="fixed inset-0 z-[55] bg-night-950/98 backdrop-blur-3xl pt-28 px-6 flex flex-col xl:hidden"
          >
            <div className="flex flex-col gap-5 h-full pb-12 overflow-y-auto no-scrollbar">
              {/* Collapsible Services Section */}
              <div className="border-b border-white/5 pb-4">
                <button
                  onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                  className="w-full flex justify-between items-center text-left text-2xl font-serif font-bold text-white hover:text-brand-400 transition-all cursor-pointer"
                >
                  <span>{lang === 'en' ? 'Services' : 'সার্ভিসসমূহ'}</span>
                  <ChevronDown size={20} className={`transition-transform duration-300 ${mobileServicesOpen ? 'rotate-180 text-brand-400' : 'text-white/50'}`} />
                </button>
                
                <AnimatePresence initial={false}>
                  {mobileServicesOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden mt-3 pl-4 space-y-3 flex flex-col"
                    >
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => handleCategoryClick(cat.id)}
                          className="text-left text-lg text-white/70 hover:text-white transition-colors cursor-pointer py-1"
                        >
                          {lang === 'en' ? cat.labelEn : cat.labelBn}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Other Mobile Nav Links */}
              {['Industries', 'Insights', 'Cases', 'Team'].map((section, i) => (
                <motion.a
                  key={section}
                  href={`#${section.toLowerCase()}`}
                  onClick={() => setMobileMenu(false)}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + (i * 0.04), type: "spring" }}
                  className="text-2xl font-serif font-bold text-white border-b border-white/5 pb-4 hover:pl-2 hover:text-brand-400 transition-all"
                >
                  {lang === 'en' ? (section === 'Cases' ? 'Case Studies' : section) : (
                    section === 'Industries' ? 'শিল্পখাত' :
                    section === 'Insights' ? 'অন্তর্দৃষ্টি' :
                    section === 'Cases' ? 'কেস স্টাডিজ' : 'টিম'
                  )}
                </motion.a>
              ))}

              <div className="mt-auto space-y-4">
                <button 
                  onClick={() => { toggleLang(); setMobileMenu(false); }} 
                  className="w-full py-4 border border-white/10 rounded-full font-bold text-white text-xs uppercase tracking-[0.2em] bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                >
                  {lang === 'en' ? 'Switch to Bangla' : 'Switch to English'}
                </button>
                <button 
                  className="w-full bg-brand-600 text-white py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-brand-500 transition-colors shadow-xl shadow-brand-500/20 cursor-pointer" 
                  onClick={() => {
                    setMobileMenu(false);
                    const el = document.getElementById('inquiry');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  {lang === 'en' ? 'Start Inquiry' : 'অনুসন্ধান'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SPOTLIGHT SEARCH DIALOG */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-night-950/70 backdrop-blur-md flex items-start justify-center pt-24 px-4"
          >
            <motion.div
              initial={{ scale: 0.96, y: -20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: -20 }}
              className="bg-white dark:bg-night-900 border border-gray-200 dark:border-white/10 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden"
            >
              {/* Search input field */}
              <div className="p-5 border-b border-gray-200 dark:border-white/5 flex items-center gap-4">
                <Search className="text-gray-400" size={20} />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-brand-950 dark:text-white placeholder-gray-500 text-base font-light"
                  placeholder={lang === 'en' ? "Search pillars, services, case studies... (Esc)" : "অনুসন্ধান করুন..."}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') setSearchOpen(false);
                  }}
                />
                <button 
                  onClick={() => setSearchOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider cursor-pointer"
                >
                  Esc
                </button>
              </div>

              {/* Filtering results */}
              <div className="max-h-[350px] overflow-y-auto p-4 no-scrollbar">
                {searchQuery ? (
                  searchResults.length === 0 ? (
                    <div className="p-8 text-center text-gray-500 dark:text-gray-400 font-light text-sm">
                      No results matched &quot;{searchQuery}&quot;
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      {searchResults.map((item) => (
                        <div
                          key={item.id}
                          role="button"
                          tabIndex={0}
                          onClick={() => handleSearchResultClick(item)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              handleSearchResultClick(item);
                            }
                          }}
                          className="w-full flex justify-between items-center p-4 hover:bg-gray-100 dark:hover:bg-white/5 rounded-2xl cursor-pointer transition-all group"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-500 flex items-center justify-center shrink-0">
                              {item.type === 'pillar' && <Compass size={18} />}
                              {item.type === 'service' && <Cpu size={18} />}
                              {item.type === 'case' && <FileText size={18} />}
                            </div>
                            <span className="text-sm font-bold text-brand-950 dark:text-gray-200 group-hover:text-brand-500 transition-colors">
                              {item.title}
                            </span>
                          </div>

                          <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-400 dark:text-gray-400">
                            {item.type}
                          </span>
                        </div>
                      ))}
                    </div>
                  )
                ) : (
                  <div className="p-6 text-center text-gray-400 dark:text-gray-500 text-xs font-bold uppercase tracking-widest">
                    Type a query to search the dynamic CMS database...
                  </div>
                )}
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
