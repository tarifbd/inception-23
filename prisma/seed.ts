import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing
  await prisma.caseStudy.deleteMany();
  await prisma.serviceItem.deleteMany();
  await prisma.serviceCategory.deleteMany();

  console.log('Seeding categories...');

  // Categories
  await prisma.serviceCategory.create({
    data: {
      id: 'it',
      labelEn: 'IT & AI Solutions',
      labelBn: 'আইটি এবং এআই সমাধান',
      order: 0,
    },
  });

  await prisma.serviceCategory.create({
    data: {
      id: 'consultancy',
      labelEn: 'Business Advisory & Compliances',
      labelBn: 'ব্যবসায়িক পরামর্শ ও কমপ্লায়েন্স',
      order: 1,
    },
  });

  await prisma.serviceCategory.create({
    data: {
      id: 'legal',
      labelEn: 'Legal Support',
      labelBn: 'আইনি সহায়তা',
      order: 2,
    },
  });

  await prisma.serviceCategory.create({
    data: {
      id: 'creative',
      labelEn: 'Creative & Other Consultancy',
      labelBn: 'ক্রিয়েটিভ এবং অন্যান্য পরামর্শ',
      order: 3,
    },
  });

  console.log('Seeding service items...');

  // IT Services
  await prisma.serviceItem.createMany({
    data: [
      {
        categoryId: 'it',
        titleEn: 'Enterprise AI Integration',
        titleBn: 'এন্টারপ্রাইজ এআই ইন্টিগ্রেশন',
        descEn: 'Deploy custom LLM pipelines, automated agents, and intelligent workflow connectors at any level.',
        descBn: 'যেকোনো স্তরে কাস্টম এলএলএম পাইপলাইন, স্বয়ংক্রিয় এজেন্ট এবং ইন্টেলিজেন্ট ওয়ার্কফ্লো স্থাপন করুন।',
        icon: 'Cpu',
        theme: 'rose',
        order: 0,
      },
      {
        categoryId: 'it',
        titleEn: 'Website Development',
        titleBn: 'ওয়েবসাইট ডেভেলপমেন্ট',
        descEn: 'Stunning responsive web applications built with next-gen frameworks (Next.js, Three.js, Prisma, Tailwind) - like this website!',
        descBn: 'নেক্সট-জেন ফ্রেমওয়ার্ক (Next.js, Three.js, Prisma, Tailwind) দিয়ে তৈরি চমৎকার রেসপন্সিভ ওয়েব অ্যাপ্লিকেশন - যেমন এই ওয়েবসাইটটি!',
        icon: 'Zap',
        theme: 'cyan',
        order: 1,
      },
      {
        categoryId: 'it',
        titleEn: 'Advanced Data & AI Analytics',
        titleBn: 'উন্নত ডেটা এবং এআই অ্যানালিটিক্স',
        descEn: 'Unlock predictive intelligence and actionable insights with customized machine learning pipelines.',
        descBn: 'কাস্টমাইজড মেশিন লার্নিং পাইপলাইনের সাথে প্রেক্টিভ ইন্টেলিজেন্স এবং অ্যাকশনেবল ইনসাইট আনলক করুন।',
        icon: 'Database',
        theme: 'purple',
        order: 2,
      },
      {
        categoryId: 'it',
        titleEn: 'Cloud & Zero-Trust Infrastructure',
        titleBn: 'ক্লাউড এবং জিরো-ট্রাস্ট ইনফ্রাস্ট্রাকচার',
        descEn: 'Deploy scale-proof, secure hybrid cloud systems under elite zero-trust compliance standards.',
        descBn: 'এলিট জিরো-ট্রাস্ট কমপ্লায়েন্স স্ট্যান্ডার্ডের অধীনে স্কেল-প্রুফ, নিরাপদ হাইব্রিড ক্লাউড সিস্টেম স্থাপন করুন।',
        icon: 'Cloud',
        theme: 'emerald',
        order: 3,
      },
    ],
  });

  // Business Advisory & Compliances Services
  await prisma.serviceItem.createMany({
    data: [
      {
        categoryId: 'consultancy',
        titleEn: 'Corporate Strategy',
        titleBn: 'কর্পোরেট কৌশল',
        descEn: 'Formulate growth paths and competitive tactics to capture and defend top market share.',
        descBn: 'শীর্ষ বাজার শেয়ার দখল এবং রক্ষা করার জন্য প্রবৃদ্ধির পথ এবং প্রতিযোগিতামূলক কৌশল তৈরি করুন।',
        icon: 'Target',
        theme: 'rose',
        order: 0,
      },
      {
        categoryId: 'consultancy',
        titleEn: 'Operational Scaling',
        titleBn: 'অপারেশনাল স্কেলিং',
        descEn: 'Integrate high-efficiency automated workflows to eliminate execution friction and bottlenecks.',
        descBn: 'বাস্তবায়নের ঘর্ষণ এবং বাধা দূর করতে উচ্চ-দক্ষতা সম্পন্ন স্বয়ংক্রিয় ওয়ার্কফ্লো সংহত করুন।',
        icon: 'Activity',
        theme: 'amber',
        order: 1,
      },
      {
        categoryId: 'consultancy',
        titleEn: 'M&A Advisory',
        titleBn: 'এমএন্ডএ অ্যাডভাইজরি',
        descEn: 'Provide end-to-end deal structure, evaluation, and transition advisory for high-stakes valuations.',
        descBn: 'উচ্চ-ঝুঁকির মূল্যায়নের জন্য এন্ড-টু-এন্ড চুক্তি কাঠামো, মূল্যায়ন এবং রূপান্তর পরামর্শ প্রদান করুন।',
        icon: 'Briefcase',
        theme: 'emerald',
        order: 2,
      },
    ],
  });

  // Legal Services
  await prisma.serviceItem.createMany({
    data: [
      {
        categoryId: 'legal',
        titleEn: 'Regulatory Compliance',
        titleBn: 'নিয়ন্ত্রক সম্মতি',
        descEn: 'Provide ironclad frameworks to comfortably navigate complex international and local laws.',
        descBn: 'জটিল আন্তর্জাতিক এবং স্থানীয় আইন সহজে নেভিগেট করার জন্য সুদৃঢ় ফ্রেমওয়ার্ক প্রদান করুন।',
        icon: 'ShieldCheck',
        theme: 'blue',
        order: 0,
      },
      {
        categoryId: 'legal',
        titleEn: 'Corporate Law & Governance',
        titleBn: 'কর্পোরেট আইন ও শাসন',
        descEn: 'Complete legal entity setup, compliance monitoring, and corporate board governance.',
        descBn: 'সম্পূর্ণ আইনি সত্তা সেটআপ, কমপ্লায়েন্স মনিটরিং এবং কর্পোরেট বোর্ড গভর্নেন্স।',
        icon: 'Building2',
        theme: 'cyan',
        order: 1,
      },
      {
        categoryId: 'legal',
        titleEn: 'Dispute Resolution',
        titleBn: 'বিরোধ নিষ্পত্তি',
        descEn: 'Provide elite support for high-stakes litigations, contract breach arguments, and arbitrations.',
        descBn: 'উচ্চ-ঝুঁকির মামলা, চুক্তি ভঙ্গের যুক্তি এবং সালিসের জন্য অভিজাত সমর্থন প্রদান করুন।',
        icon: 'Gavel',
        theme: 'rose',
        order: 2,
      },
    ],
  });

  // Creative Services
  await prisma.serviceItem.createMany({
    data: [
      {
        categoryId: 'creative',
        titleEn: 'Brand Strategy & Design',
        titleBn: 'ব্র্যান্ড কৌশল এবং ডিজাইন',
        descEn: 'Architect memorable visual identities, robust brand systems, and core marketing strategies.',
        descBn: 'স্মরণীয় চাক্ষুষ পরিচয়, শক্তিশালী ব্র্যান্ড সিস্টেম এবং মূল বিপণন কৌশল তৈরি করুন।',
        icon: 'Compass',
        theme: 'purple',
        order: 0,
      },
      {
        categoryId: 'creative',
        titleEn: 'Immersive Digital Experiences',
        titleBn: 'ইমারসিভ ডিজিটাল অভিজ্ঞতা',
        descEn: 'Create interactive visual campaigns, virtual reality setups, and custom 3D web showcases.',
        descBn: 'ইন্টারেক্টিভ ভিজ্যুয়াল ক্যাম্পেইন, ভার্চুয়াল রিয়েলিটি সেটআপ এবং কাস্টম 3D ওয়েব শোকেস তৈরি করুন।',
        icon: 'Glasses',
        theme: 'cyan',
        order: 1,
      },
      {
        categoryId: 'creative',
        titleEn: 'Specialized Consulting',
        titleBn: 'বিশেষ পরামর্শ',
        descEn: 'Provide dedicated custom audits, executive leadership coaching, and high-impact digital initiatives.',
        descBn: 'ডেডিকেটেড কাস্টম অডিট, এক্সিকিউティブ লিডারশিপ কোচিং এবং হাই-ইমপ্যাক্ট ডিজিটাল উদ্যোগ প্রদান করুন।',
        icon: 'PieChart',
        theme: 'blue',
        order: 2,
      },
    ],
  });

  console.log('Seeding case studies...');

  // Seeding initial Case Studies
  await prisma.caseStudy.create({
    data: {
      titleEn: 'NexaGlobal Group - Enterprise AI Transformation',
      titleBn: 'নেক্সাগ্লোবাল গ্রুপ - এন্টারপ্রাইজ এআই রূপান্তর',
      clientEn: 'NexaGlobal Group',
      clientBn: 'নেক্সাগ্লোবাল গ্রুপ',
      categoryId: 'it',
      summaryEn: 'Full deployment of automated decision models and custom LLM agents to streamline globally dispersed logistics networks.',
      summaryBn: 'বিশ্বব্যাপী লজিস্টিক নেটওয়ার্ক সহজ করতে স্বয়ংক্রিয় সিদ্ধান্ত মডেল এবং কাস্টম এলএলএম এজেন্টের সম্পূর্ণ স্থাপন।',
      metricsEn: '$200M Unlocked',
      metricsBn: '২০০ মিলিয়ন ডলার সাশ্রয়',
      challengeEn: 'NexaGlobal was operating with highly fragmented analog data structures, causing significant pipeline latency and workflow backlogs.',
      challengeBn: 'নেক্সাগ্লোবাল অত্যন্ত খণ্ডিত অ্যানালগ ডেটা কাঠামোর মাধ্যমে কাজ করছিল, যার ফলে গুরুতর কর্মপ্রবাহ ব্যাকলগ তৈরি হচ্ছিল।',
      solutionEn: 'We built a zero-trust local cloud pipeline using Next.js microservices and custom LLM agents to automate compliance auditing, real-time routing analysis, and shipping valuations.',
      solutionBn: 'আমরা কমপ্লায়েন্স অডিটিং, রিয়েল-টাইম রাউটিং বিশ্লেষণ এবং শিপিং মূল্যায়ন স্বয়ংক্রিয় করতে Next.js মাইক্রোসার্ভিস এবং কাস্টম এলএলএম এজেন্টের সমন্বয়ে একটি ক্লাউড পাইপলাইন তৈরি করেছি।',
      img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
      order: 0,
    },
  });

  await prisma.caseStudy.create({
    data: {
      titleEn: 'Titan Energy - Operational Process Re-Engineering',
      titleBn: 'টাইটান এনার্জি - অপারেশনাল প্রসেস রি-ইঞ্জিনিয়ারিং',
      clientEn: 'Titan Energy Corp',
      clientBn: 'টাইটান এনার্জি কর্পোরেশন',
      categoryId: 'consultancy',
      summaryEn: 'Complete strategic re-alignment of operational workflow structures to eliminate execution friction.',
      summaryBn: 'বাস্তবায়নের ঘর্ষণ এবং বাধা দূর করার জন্য অপারেশনাল ওয়ার্কফ্লো কাঠামোর সম্পূর্ণ কৌশলগত পুনর্বিন্যাস।',
      metricsEn: '+30% Avg. Efficiency Gain',
      metricsBn: '৩০% গড় দক্ষতা বৃদ্ধি',
      challengeEn: 'Friction between global refining nodes caused supply delivery bottlenecks and millions of dollars in lost opportunities.',
      challengeBn: 'বৈশ্বিক রিফাইনিং নোডগুলির মধ্যে ঘর্ষণের কারণে সরবরাহ সরবরাহে বাধা সৃষ্টি হচ্ছিল এবং মিলিয়ন মিলিয়ন ডলারের সুযোগ নষ্ট হচ্ছিল।',
      solutionEn: 'Implemented high-velocity automation framework across the entire corporate logistics stack, re-aligned operational hierarchies, and optimized vendor dependencies.',
      solutionBn: 'সম্পূর্ণ কর্পোরেট লজিস্টিক স্ট্যাক জুড়ে উচ্চ-গতির অটোমেশন ফ্রেমওয়ার্ক বাস্তবায়ন করা হয়েছে এবং ভেন্ডর নির্ভরতা অপ্টিমাইজ করা হয়েছে।',
      img: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=800&auto=format&fit=crop',
      order: 0,
    },
  });

  await prisma.caseStudy.create({
    data: {
      titleEn: 'FinVault Banking - Global Compliance Restructuring',
      titleBn: 'ফিনভল্ট ব্যাংকিং - গ্লোবাল কমপ্লায়েন্স পুনর্গঠন',
      clientEn: 'FinVault Banking',
      clientBn: 'ফিনভল্ট ব্যাংকিং',
      categoryId: 'legal',
      summaryEn: 'Ironclad compliance auditing and corporate restructuring defense during global asset realignment.',
      summaryBn: 'বৈশ্বিক সম্পদ পুনর্বিন্যাসের সময় সুদৃঢ় কমপ্লায়েন্স অডিটিং এবং কর্পোরেট পুনর্গঠন প্রতিরক্ষা।',
      metricsEn: '100% Secure Audits',
      metricsBn: '১০০% নিরাপদ অডিট',
      challengeEn: 'Cross-border regulations and multi-jurisdictional audits threatened banking licenses across 5 sovereign states.',
      challengeBn: 'সীমান্তবর্তী নিয়মাবলী এবং বহু-অধিক্ষেত্রের অডিট ৫টি সার্বভৌম দেশে ব্যাংকিং লাইসেন্সকে হুমকির মুখে ফেলেছিল।',
      solutionEn: 'Designed preemptive legal assessments, structured internal corporate governance guidelines, and navigated regulatory defense parameters successfully.',
      solutionBn: 'আগাম আইনি মূল্যায়ন ডিজাইন করা হয়েছে, অভ্যন্তরীণ কর্পোরেট গভর্ন্যান্স নির্দেশিকা গঠন করা হয়েছে এবং সফলভাবে আইনি প্রতিরক্ষা পরামিতি নেভিগেট করা হয়েছে।',
      img: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=800&auto=format&fit=crop',
      order: 0,
    },
  });

  await prisma.caseStudy.create({
    data: {
      titleEn: 'Apex Brands - Immersive 3D Visual Rollout',
      titleBn: 'এপেক্স ব্র্যান্ডস - ইমারসিভ 3D ভিজ্যুয়াল রোলআউট',
      clientEn: 'Apex Retail',
      clientBn: 'এপেক্স রিটেল',
      categoryId: 'creative',
      summaryEn: 'Redefining brand strategy with interactive WebGL campaigns, virtual reality setups, and custom 3D web interfaces.',
      summaryBn: 'WebGL ক্যাম্পেইন, ভার্চুয়াল রিয়েলিটি সেটআপ এবং কাস্টম 3D ওয়েব ইন্টারফেসের সাহায্যে ব্র্যান্ড কৌশলের পুনর্বিন্যাস।',
      metricsEn: '+240% User Engagement',
      metricsBn: '২৪০% ব্যবহারকারী ব্যস্ততা বৃদ্ধি',
      challengeEn: 'Legacy digital storefronts were yielding high bounce rates and low brand recall among Gen-Z cohorts.',
      challengeBn: 'অ্যানালগ ডিজিটাল স্টোরফ্রন্টগুলি উচ্চ বাউন্স রেট এবং কম ব্র্যান্ড রিকল দিচ্ছিল।',
      solutionEn: 'Built interactive 3D WebGL showcase platforms, created modern visual identity systems, and unified digital asset campaigns.',
      solutionBn: 'ইন্টারেক্টিভ 3D WebGL শোকেস প্ল্যাটফর্ম তৈরি করা হয়েছে এবং আধুনিক ভিজ্যুয়াল আইডেন্টিটি সিস্টেম রোলআউট করা হয়েছে।',
      img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop',
      order: 0,
    },
  });

  console.log('Database seeded successfully with case studies!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
