'use client';

import React, { useEffect, useRef, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Stars, Sparkles, MeshTransmissionMaterial, Environment, OrbitControls } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { useAppStore } from '@/lib/store';
import { ArrowRight, Lightbulb } from 'lucide-react';

const homeContent = {
    slides: [
        {
            id: 'strategy',
            title: {
                en: "Business & Strategy Advisory",
                bn: "ব্যবসা এবং কৌশলগত পরামর্শ"
            },
            sub: {
                en: "Strategic consulting, company registration, and scaling frameworks to guide business growth.",
                bn: "ব্যবসায়িক বৃদ্ধি নিশ্চিত করতে কৌশলগত পরামর্শ এবং কোম্পানি নিবন্ধন।"
            }
        },
        {
            id: 'legal',
            title: {
                en: "Corporate Legal Support",
                bn: "কর্পোরেট আইনি সহায়তা"
            },
            sub: {
                en: "Comprehensive legal assistance, compliance management, and corporate protection.",
                bn: "সমন্বিত আইনি সহায়তা, কমপ্লায়েন্স ব্যবস্থাপনা এবং কর্পোরেট সুরক্ষা।"
            }
        },
        {
            id: 'tech',
            title: {
                en: "Software & IT Solutions",
                bn: "সফটওয়্যার এবং আইটি সলিউশন"
            },
            sub: {
                en: "Dynamic websites, ERPs, apps, and digital platforms built strictly for scale.",
                bn: "স্কেলিংয়ের জন্য ডিজাইন করা ডাইনামিক ওয়েবসাইট, ইআরপি এবং অ্যাপস।"
            }
        }
    ]
};

// -------------------------------------------------------------
// HYPER-REALISTIC GEOMETRIES
// -------------------------------------------------------------

const StrategyCore = React.memo(function StrategyCore() {
    const group = useRef<THREE.Group>(null);
    const knight = useRef<THREE.Group>(null);
    const graph = useRef<THREE.Group>(null);
    
    useFrame((state) => {
        if(group.current) {
            // Elegant showcase rotation
            group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.5 - 0.2;
        }
        if(knight.current) {
            // Gentle hovering for the chess piece
            knight.current.position.y = 0.5 + Math.sin(state.clock.elapsedTime * 1.5) * 0.1;
        }
    });

    return (
        <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.5}>
            <group ref={group} scale={[0.85, 0.85, 0.85]} position={[0, -0.2, 0]}>
                
                {/* --- 1. THE EXECUTIVE BRIEFCASE --- */}
                <group position={[-1.2, -0.8, 0]} rotation={[0.1, -0.4, 0]}>
                    {/* Main Leather Body */}
                    <mesh>
                        <boxGeometry args={[2.5, 1.8, 0.7]} />
                        <meshStandardMaterial color="#0f172a" roughness={0.7} />
                    </mesh>
                    {/* Aluminum Trims */}
                    <mesh position={[0, 0, 0]}>
                        <boxGeometry args={[2.55, 1.85, 0.6]} />
                        <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.1} />
                    </mesh>
                    <mesh position={[0, 0, 0]}>
                        <boxGeometry args={[2.6, 1.7, 0.65]} />
                        <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.1} />
                    </mesh>
                    {/* Handle */}
                    <mesh position={[0, 1.05, 0]}>
                        <torusGeometry args={[0.35, 0.08, 16, 32, Math.PI]} />
                        <meshStandardMaterial color="#0f172a" roughness={0.5} />
                    </mesh>
                    {/* Golden Clasps */}
                    <mesh position={[-0.8, 0.95, 0.36]}>
                        <boxGeometry args={[0.2, 0.15, 0.05]} />
                        <meshStandardMaterial color="#FFD700" metalness={1} roughness={0.1} />
                    </mesh>
                    <mesh position={[0.8, 0.95, 0.36]}>
                        <boxGeometry args={[0.2, 0.15, 0.05]} />
                        <meshStandardMaterial color="#FFD700" metalness={1} roughness={0.1} />
                    </mesh>
                </group>

                {/* --- 2. THE STRATEGY CHESS KING --- */}
                <group ref={knight} position={[1.4, 0.5, 1.2]} rotation={[0.1, 0, 0]}>
                    <mesh position={[0, -1, 0]}>
                        <cylinderGeometry args={[0.7, 0.8, 0.2, 64]} />
                        <MeshTransmissionMaterial samples={16} thickness={2} roughness={0.1} chromaticAberration={0.05} color="#e0f2fe" />
                    </mesh>
                    <mesh position={[0, -0.8, 0]}>
                        <cylinderGeometry args={[0.5, 0.7, 0.3, 64]} />
                        <MeshTransmissionMaterial samples={16} thickness={2} roughness={0.1} chromaticAberration={0.05} color="#bae6fd" />
                    </mesh>
                    <mesh position={[0, 0.2, 0]}>
                        <cylinderGeometry args={[0.2, 0.4, 2.0, 64]} />
                        <MeshTransmissionMaterial samples={16} thickness={2.5} roughness={0.05} chromaticAberration={0.08} color="#38bdf8" />
                    </mesh>
                    <mesh position={[0, 1.4, 0]}>
                        <cylinderGeometry args={[0.5, 0.2, 0.4, 64]} />
                        <MeshTransmissionMaterial samples={16} thickness={2} roughness={0.1} chromaticAberration={0.05} color="#0ea5e9" />
                    </mesh>
                    {/* Crown Cross (Solid Gold) */}
                    <mesh position={[0, 1.8, 0]}>
                        <boxGeometry args={[0.5, 0.1, 0.1]} />
                        <meshStandardMaterial color="#FFD700" emissive="#ca8a04" emissiveIntensity={1} metalness={1} roughness={0.1} />
                    </mesh>
                    <mesh position={[0, 1.9, 0]}>
                        <boxGeometry args={[0.1, 0.5, 0.1]} />
                        <meshStandardMaterial color="#FFD700" emissive="#ca8a04" emissiveIntensity={1} metalness={1} roughness={0.1} />
                    </mesh>
                    {/* Internal Core Light */}
                    <pointLight position={[0, 0.5, 0]} intensity={15} color="#0ea5e9" distance={5} />
                </group>

                {/* --- 3. ASCENDING DATA GRAPH --- */}
                <group ref={graph} position={[0, 0.5, -1.5]} rotation={[0.1, -0.2, 0]}>
                    <mesh position={[-1.2, -0.4, 0]}>
                        <cylinderGeometry args={[0.2, 0.2, 0.8, 32]} />
                        <meshStandardMaterial color="#e0f2fe" metalness={0.2} roughness={0.1} />
                    </mesh>
                    <mesh position={[-0.4, 0.1, 0]}>
                        <cylinderGeometry args={[0.2, 0.2, 1.8, 32]} />
                        <meshStandardMaterial color="#bae6fd" metalness={0.2} roughness={0.1} />
                    </mesh>
                    <mesh position={[0.4, 0.8, 0]}>
                        <cylinderGeometry args={[0.2, 0.2, 3.2, 32]} />
                        <meshStandardMaterial color="#38bdf8" metalness={0.3} roughness={0.1} emissive="#0ea5e9" emissiveIntensity={0.5} />
                    </mesh>
                    <mesh position={[1.2, 1.8, 0]}>
                        <cylinderGeometry args={[0.2, 0.2, 5.2, 32]} />
                        <meshStandardMaterial color="#0ea5e9" metalness={0.4} roughness={0.1} emissive="#0284c7" emissiveIntensity={1} />
                    </mesh>
                </group>

                {/* Ambient Particles */}
                <Sparkles count={150} scale={8} size={3} speed={0.4} opacity={0.5} color="#38bdf8" />
                <Sparkles count={50} scale={6} size={5} speed={0.8} opacity={0.8} color="#FFD700" />
            </group>
        </Float>
    );
});

const RealisticScales = React.memo(function RealisticScales() {
    const group = useRef<THREE.Group>(null);
    const beam = useRef<THREE.Group>(null);
    const leftPan = useRef<THREE.Group>(null);
    const rightPan = useRef<THREE.Group>(null);
    
    useFrame((state) => {
        if(group.current) {
            group.current.rotation.y = state.clock.elapsedTime * 0.4; // Continuous realistic rotation
        }
        if(beam.current && leftPan.current && rightPan.current) {
            const rock = Math.sin(state.clock.elapsedTime * 2.5) * 0.2;
            beam.current.rotation.z = rock;
            // Antirotate pans to keep them perfectly plumb/level relative to gravity
            leftPan.current.rotation.z = -rock;
            rightPan.current.rotation.z = -rock;
        }
    });

    return (
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
            <group ref={group} position={[0, -0.5, 0]} scale={[0.6, 0.6, 0.6]}>
                {/* Elegant Realistic Pillar */}
                <mesh position={[0, 0, 0]}>
                    <cylinderGeometry args={[0.1, 0.3, 4, 64]} />
                    <meshStandardMaterial color="#FFD700" metalness={1} roughness={0.15} />
                </mesh>
                <mesh position={[0, -2, 0]}>
                    <cylinderGeometry args={[1, 1.2, 0.4, 64]} />
                    <meshStandardMaterial color="#FFD700" metalness={1} roughness={0.2} />
                </mesh>
                <mesh position={[0, 2, 0]}>
                    <sphereGeometry args={[0.3, 64, 64]} />
                    <meshStandardMaterial color="#FFD700" metalness={1} roughness={0.05} />
                </mesh>

                {/* Balance Beam */}
                <group ref={beam} position={[0, 1.6, 0]}>
                    <mesh rotation={[0, 0, Math.PI / 2]}>
                        <cylinderGeometry args={[0.08, 0.08, 5, 64]} />
                        <meshStandardMaterial color="#FFD700" metalness={1} roughness={0.1} />
                    </mesh>

                    {/* Left Pan Assembly */}
                    <group ref={leftPan} position={[-2.4, 0, 0]}>
                        {/* Wires/Chains approximation */}
                        <mesh position={[0, -1, 0]}><cylinderGeometry args={[0.02, 0.02, 2, 8]} /><meshStandardMaterial color="#FFD700" metalness={1} roughness={0.1} /></mesh>
                        <mesh position={[-0.4, -1, 0]} rotation={[0, 0, -0.2]}><cylinderGeometry args={[0.01, 0.01, 2, 8]} /><meshStandardMaterial color="#FFD700" metalness={1} roughness={0.1} /></mesh>
                        <mesh position={[0.4, -1, 0]} rotation={[0, 0, 0.2]}><cylinderGeometry args={[0.01, 0.01, 2, 8]} /><meshStandardMaterial color="#FFD700" metalness={1} roughness={0.1} /></mesh>
                        {/* Pan Basket */}
                        <mesh position={[0, -2, 0]}>
                            <sphereGeometry args={[0.9, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
                            <meshStandardMaterial color="#FFD700" metalness={1} roughness={0.1} side={THREE.DoubleSide} />
                        </mesh>
                    </group>

                    {/* Right Pan Assembly */}
                    <group ref={rightPan} position={[2.4, 0, 0]}>
                        <mesh position={[0, -1, 0]}><cylinderGeometry args={[0.02, 0.02, 2, 8]} /><meshStandardMaterial color="#FFD700" metalness={1} roughness={0.1} /></mesh>
                        <mesh position={[-0.4, -1, 0]} rotation={[0, 0, -0.2]}><cylinderGeometry args={[0.01, 0.01, 2, 8]} /><meshStandardMaterial color="#FFD700" metalness={1} roughness={0.1} /></mesh>
                        <mesh position={[0.4, -1, 0]} rotation={[0, 0, 0.2]}><cylinderGeometry args={[0.01, 0.01, 2, 8]} /><meshStandardMaterial color="#FFD700" metalness={1} roughness={0.1} /></mesh>
                        {/* Pan Basket */}
                        <mesh position={[0, -2, 0]}>
                            <sphereGeometry args={[0.9, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
                            <meshStandardMaterial color="#FFD700" metalness={1} roughness={0.1} side={THREE.DoubleSide} />
                        </mesh>
                    </group>
                </group>
            </group>
        </Float>
    )
});

const neuralParticlesData = [...Array(24)].map(() => {
    const radius = 2.5 + Math.random() * 1.5;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);
    const scale = 0.05 + Math.random() * 0.15;
    const rotX = Math.random() * Math.PI;
    const rotY = Math.random() * Math.PI;
    return { x, y, z, scale, rotX, rotY };
});

const NeuralMatrix = React.memo(function NeuralMatrix() {
    const group = useRef<THREE.Group>(null);
    const particles = useRef<THREE.Group>(null);
    
    useFrame((state) => {
        if(group.current) {
            group.current.rotation.x = state.clock.elapsedTime * 0.2;
            group.current.rotation.y = state.clock.elapsedTime * 0.4;
        }
        if (particles.current) {
            particles.current.rotation.y = -state.clock.elapsedTime * 0.2;
            particles.current.rotation.x = state.clock.elapsedTime * 0.1;
        }
    });

    return (
        <Float speed={2} rotationIntensity={0.4} floatIntensity={1}>
            {/* Core Neural Sphere */}
            <group ref={group}>
                <mesh>
                    <icosahedronGeometry args={[1.2, 2]} />
                    <MeshTransmissionMaterial samples={6} thickness={1.5} roughness={0} color="#0ea5e9" anisotropy={1} chromaticAberration={0.3} distortion={0.4} distortionScale={0.8} />
                </mesh>
                <mesh>
                    <icosahedronGeometry args={[0.9, 1]} />
                    <meshStandardMaterial color="#020617" wireframe={true} emissive="#38bdf8" emissiveIntensity={3} />
                </mesh>
                <pointLight intensity={40} color="#38bdf8" distance={8} />
            </group>
            
            {/* Orbiting Data Crystals */}
            <group ref={particles}>
                {neuralParticlesData.map((p, i) => (
                    <mesh key={i} position={[p.x, p.y, p.z]} rotation={[p.rotX, p.rotY, 0]}>
                        <boxGeometry args={[p.scale, p.scale*3, p.scale]} />
                        <meshStandardMaterial color="#e0f2fe" metalness={0.9} roughness={0.1} emissive="#0284c7" emissiveIntensity={1.5} />
                    </mesh>
                ))}
            </group>
            <Sparkles count={400} scale={8} size={2} speed={1.5} opacity={0.8} color="#7dd3fc" />
        </Float>
    )
});

// -------------------------------------------------------------
// TRIANGLE CAROUSEL WRAPPER
// -------------------------------------------------------------

function SlideWrapper({ index, activeIndex, children }: { index: number, activeIndex: number, children: React.ReactNode }) {
    const group = useRef<THREE.Group>(null);
    const { viewport } = useThree();
    
    // Calculate triangular offset: 0 is Active, 1 is Next, 2 is Prev
    const offset = (index - activeIndex + 3) % 3;
    
    useFrame((state, delta) => {
        if (!group.current) return;
        
        const isMobile = viewport.width < 5;
        
        // Beautiful Sweep Triangle Configuration
        let targetX = 0; let targetY = 0; let targetZ = 0; let targetScale = 1;

        if (offset === 0) {
            // Active: Front Right
            targetX = isMobile ? 0 : 2.5;
            targetY = isMobile ? 0 : -0.5;
            targetZ = 2.5; 
            targetScale = isMobile ? 0.7 : 1;
        } else if (offset === 1) {
            // Next: Back Right (Pushed extremely far out and up to avoid blocking)
            targetX = isMobile ? 2 : 7.0;
            targetY = isMobile ? 2 : 1.5;
            targetZ = -4; 
            targetScale = 0.5;
        } else if (offset === 2) {
            // Prev: Back Left (Pushed far left behind the text)
            targetX = isMobile ? -2 : -3.0;
            targetY = isMobile ? 2 : 1.5;
            targetZ = -4;
            targetScale = 0.5;
        }

        // Swoop interpolation with enhanced speed for hyper-animation
        group.current.position.lerp(new THREE.Vector3(targetX, targetY, targetZ), delta * 6);
        group.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 6);
        
        // Ensure they remain visible but pushed back
        group.current.visible = true;
    });

    return <group ref={group}>{children}</group>;
}

export default function Hero3D() {
    const { activeSlide, setSlide, lang, theme } = useAppStore();
    
    useEffect(() => {
        const interval = setInterval(() => { setSlide((activeSlide + 1) % 3); }, 8000);
        return () => clearInterval(interval);
    }, [activeSlide, setSlide]);

    const current = homeContent.slides[activeSlide];

    return (
        <section className="relative h-[100svh] w-full overflow-hidden flex flex-col justify-center bg-gray-50 dark:bg-night-950">
            <div className="absolute inset-0 z-0 bg-gray-50 dark:bg-night-950">
                <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 10], fov: 45 }}>
                    <Suspense fallback={null}>
                        {/* Interactive tracking */}
                        <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 1.5} minPolarAngle={Math.PI / 3} />

                        {/* Network-dependent HDRI in its own strict boundary so it doesn't suppress the geometry */}
                        <Suspense fallback={null}>
                            <Environment preset="city" />
                        </Suspense>

                        {/* Extremely strong baseline lighting so models never look flat/dark before HDRI completes */}
                        <ambientLight intensity={3} color="#ffffff" />
                        <spotLight position={[10, 15, 10]} angle={0.4} penumbra={1} intensity={8} color="#ffffff" castShadow />
                        <pointLight position={[-10, 0, 5]} intensity={10} color="#8b5cf6" />
                        <directionalLight position={[0, 5, 5]} intensity={5} color="#ffffff" />

                        <group>
                            <SlideWrapper index={0} activeIndex={activeSlide}><StrategyCore /></SlideWrapper>
                            <SlideWrapper index={1} activeIndex={activeSlide}><RealisticScales /></SlideWrapper>
                            <SlideWrapper index={2} activeIndex={activeSlide}><NeuralMatrix /></SlideWrapper>
                        </group>
                        
                        {/* Ambient particles */}
                        {theme === 'dark' && <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />}
                    </Suspense>
                </Canvas>
                
                <div className="absolute inset-0 bg-gradient-to-r from-gray-50/90 via-gray-50/50 to-transparent dark:from-night-950/90 dark:via-night-950/40 dark:to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-transparent to-transparent dark:from-night-950 dark:via-transparent dark:to-transparent pointer-events-none h-40 bottom-0" />
            </div>

            <div className="container mx-auto px-6 relative z-10 pointer-events-none grid grid-cols-1 md:grid-cols-2">
                <div className="pointer-events-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeSlide}
                            initial={false}
                            animate="visible"
                            exit="exit"
                            variants={{
                                hidden: { opacity: 0 },
                                visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
                                exit: { opacity: 0, transition: { staggerChildren: 0.05, staggerDirection: -1 } }
                            }}
                        >
                            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { ease: "easeOut", duration: 0.8 } }, exit: { opacity: 0, y: -20 } }} className="flex items-center gap-4 mb-4 md:mb-8 mt-12 md:mt-20">
                                <div className="h-0.5 w-16 bg-brand-700 shadow-[0_0_15px_rgba(20,184,166,0.6)]"></div>
                                <span className="text-xs font-bold tracking-[0.25em] uppercase text-brand-700 dark:text-brand-400">
                                    {lang === 'en' ? 'Core Expertise' : 'মূল দক্ষতা'}
                                </span>
                            </motion.div>
                            
                            <motion.h1 
                                variants={{ hidden: { opacity: 0, y: 30, filter: "blur(4px)" }, visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { ease: "easeOut", duration: 0.8 } }, exit: { opacity: 0, y: -30, filter: "blur(4px)" } }}
                                className="text-4xl md:text-5xl lg:text-8xl font-serif font-bold leading-[1.1] mb-6 md:mb-8 tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-brand-950 via-gray-800 to-gray-500 dark:from-white dark:via-gray-200 dark:to-gray-500 pb-2 drop-shadow-sm"
                            >
                                {lang === 'en' ? current.title.en : current.title.bn}
                            </motion.h1>
                            
                            <motion.p 
                                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { ease: "easeOut", duration: 0.8 } }, exit: { opacity: 0, y: -20 } }}
                                className="text-base md:text-xl text-gray-700 dark:text-gray-300 max-w-lg font-light leading-relaxed mb-8 md:mb-12 border-l-2 border-brand-500 dark:border-brand-700 pl-4 md:pl-6 shadow-[inset_2px_0_0_0_rgba(20,184,166,0.1)]"
                            >
                                {lang === 'en' ? current.sub.en : current.sub.bn}
                            </motion.p>
                            
                            <motion.div 
                                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { ease: "easeOut", duration: 0.8 } }, exit: { opacity: 0, y: -20 } }}
                                className="flex flex-col sm:flex-row gap-4"
                            >
                                <button className="relative group bg-brand-700 hover:bg-brand-600 text-white px-8 md:px-10 py-3 md:py-4 rounded-sm font-bold transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs overflow-hidden shadow-lg shadow-brand-700/30 w-full sm:w-auto">
                                    <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                                    <span className="relative z-10 flex items-center gap-3">
                                        {lang === 'en' ? 'Explore' : 'দেখুন'}
                                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </span>
                                </button>
                                <button className="relative group px-8 md:px-10 py-3 md:py-4 rounded-sm font-bold border border-gray-400 dark:border-gray-700 text-brand-950 dark:text-white transition-all uppercase tracking-widest text-xs overflow-hidden hover:border-transparent w-full sm:w-auto">
                                    <div className="absolute inset-0 bg-brand-50 dark:bg-night-800 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                                    <span className="relative z-10 flex items-center gap-3 group-hover:-translate-y-0.5 transition-transform duration-300">
                                        <Lightbulb size={16} className="text-brand-500" />
                                        {lang === 'en' ? 'Insights' : 'অন্তর্দৃষ্টি'}
                                    </span>
                                </button>
                            </motion.div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}
