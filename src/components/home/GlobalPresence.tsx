'use client';

import React, { useRef, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { SplitText, Magnetic } from '@/components/ui/HyperEffects';

export const GlobalPresence = () => {
    const { lang } = useAppStore();
    const containerRef = useRef<HTMLDivElement>(null);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    // Mouse coordinates for follow images
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    
    // Smooth physics for the mouse follow
    const springX = useSpring(mouseX, { stiffness: 180, damping: 18, mass: 0.4 });
    const springY = useSpring(mouseY, { stiffness: 180, damping: 18, mass: 0.4 });

    function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
    }

    const locations = [
        { city: "New York", hq: "Americas HQ", img: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=800&auto=format&fit=crop" },
        { city: "London", hq: "EMEA HQ", img: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=800&auto=format&fit=crop" },
        { city: "Dubai", hq: "MENA Hub", img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800&auto=format&fit=crop" },
        { city: "Singapore", hq: "APAC HQ", img: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=800&auto=format&fit=crop" },
        { city: "Dhaka", hq: "South Asia Hub", img: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=800&auto=format&fit=crop" }
    ];

    return (
        <section id="global" className="py-20 md:py-40 bg-white dark:bg-night-950 border-t border-gray-100 dark:border-night-800 relative z-40">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="mb-16 md:mb-20">
                    <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="text-sm font-bold uppercase tracking-[0.25em] text-brand-600 dark:text-brand-400 mb-6"
                    >
                        {lang === 'en' ? 'Global Reach' : 'বিশ্বব্যাপী পৌঁছানো'}
                    </motion.div>
                    
                    <h3 className="text-4xl md:text-5xl lg:text-7xl font-serif font-black text-brand-950 dark:text-white leading-[1.1] max-w-2xl">
                        <SplitText text={lang === 'en' ? 'Operating Without Borders.' : 'সীমানাবিহীন কার্যক্রম।'} />
                    </h3>
                </div>

                {/* Interactive List Container */}
                <div 
                    ref={containerRef} 
                    onMouseMove={handleMouseMove} 
                    onMouseLeave={() => setHoveredIndex(null)}
                    className="relative border-t border-gray-200 dark:border-night-700"
                >
                    {/* Floating Images mapped to hovered index */}
                    {locations.map((loc, i) => (
                        <motion.div
                          key={`img-${i}`}
                          style={{ x: springX, y: springY }}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ 
                              opacity: hoveredIndex === i ? 1 : 0, 
                              scale: hoveredIndex === i ? 1 : 0.8,
                              zIndex: hoveredIndex === i ? 20 : 0
                          }}
                          transition={{ type: "spring", damping: 20 }}
                          className="absolute pointer-events-none w-48 h-64 md:w-80 md:h-[450px] rounded-2xl overflow-hidden shadow-2xl origin-center -translate-x-1/2 -translate-y-1/2 z-20"
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={loc.img} alt={loc.city} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-brand-950/20 mix-blend-multiply" />
                            <div className="absolute bottom-6 left-6 text-white z-10">
                                <h4 className="font-serif font-black text-2xl tracking-tight">{loc.city}</h4>
                                <p className="text-xs uppercase tracking-widest text-brand-400 font-bold mt-1">{loc.hq}</p>
                            </div>
                        </motion.div>
                    ))}

                    {/* List Items */}
                    {locations.map((loc, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, type: "spring", damping: 20 }}
                            onMouseEnter={() => setHoveredIndex(i)}
                            className="group flex flex-col md:flex-row justify-between items-start md:items-center py-10 md:py-14 border-b border-gray-200 dark:border-night-700 cursor-pointer relative z-10 hover:bg-gray-50/50 dark:hover:bg-night-900/50 transition-colors px-6 -mx-6 rounded-lg"
                        >
                            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-16">
                                <span className="font-serif font-bold text-5xl md:text-7xl text-gray-300 dark:text-night-800 group-hover:text-brand-950 dark:group-hover:text-white transition-colors duration-500">
                                    {loc.city}
                                </span>
                            </div>
                            
                            <div className="mt-6 md:mt-0 flex items-center gap-8 opacity-0 group-hover:opacity-100 -translate-x-10 group-hover:translate-x-0 transition-all duration-500">
                                <span className="font-bold text-sm tracking-widest uppercase text-brand-600 dark:text-brand-400">{loc.hq}</span>
                                <Magnetic>
                                    <div className="w-14 h-14 rounded-full border border-gray-300 dark:border-night-600 flex items-center justify-center bg-white dark:bg-night-900 text-brand-950 dark:text-white group-hover:bg-brand-500 group-hover:text-white group-hover:border-transparent transition-all duration-300 shadow-sm cursor-pointer">
                                        <ArrowUpRight size={24} className="group-hover:rotate-45 transition-transform duration-300" />
                                    </div>
                                </Magnetic>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
