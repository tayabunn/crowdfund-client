"use client";
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { HelpCircle, Sparkles, BookOpen, Globe2, Award, ArrowLeft } from 'lucide-react';

type ContentType = {
  title: string;
  subtitle: string;
  icon: any;
  sections: { title: string; body: string }[];
};

const learnData: Record<string, ContentType> = {
  'how-it-works': {
    title: 'How CrowdFund Works',
    subtitle: 'Learn how to start, share, and fund projects from start to finish.',
    icon: HelpCircle,
    sections: [
      { title: '1. Create a Campaign', body: 'Creators can set up a campaign in minutes, details their project story, select funding targets, and define backer rewards.' },
      { title: '2. Pledge Credits', body: 'Supporters can purchase platform credits using a secure Stripe checkout and allocate them to support verified causes.' },
      { title: '3. Real-Time Validations', body: 'Credits are deducted immediately upon pledge, and campaign progress updates instantly on the creator and supporter home dashboards.' },
      { title: '4. Safe Withdrawals', body: 'Once a campaign raises enough credits, creators can submit withdrawal requests to convert credits directly into real payouts.' }
    ]
  },
  'why-crowdfund': {
    title: 'Why Choose CrowdFund?',
    subtitle: 'The best platform to empower your ideas and transform dreams into reality.',
    icon: Sparkles,
    sections: [
      { title: 'Safe & Transparent', body: 'Our platform uses a robust virtual credit ledger to ensure every transaction is completely traceable and fully auditable.' },
      { title: 'Community Funded', body: 'Directly connect with thousands of active supporters who want to build the future alongside passionate creators.' },
      { title: 'Lower Processing Fees', body: 'We maintain a highly competitive credit exchange rate, putting more real money back into the hands of causes that need it.' }
    ]
  },
  'faq': {
    title: 'Frequently Asked Questions',
    subtitle: 'Got questions? We have answers to help you navigate the platform.',
    icon: BookOpen,
    sections: [
      { title: 'Are contributions refundable?', body: 'Yes! If a campaign is flagged as fraudulent or deleted by an administrator, all backer credits (both pending and approved) are instantly refunded.' },
      { title: 'How does the credit conversion work?', body: 'Supporters buy credits at a rate of 10 credits per dollar. Creators can request withdrawals starting from 200 credits at a rate of 20 credits per dollar.' },
      { title: 'How are campaigns reviewed?', body: 'To ensure a safe environment, all newly submitted campaigns are placed in a pending queue until approved by a platform administrator.' }
    ]
  },
  'success-stories': {
    title: 'Success Stories',
    subtitle: 'Real-world impact created by incredible projects funded on CrowdFund.',
    icon: Award,
    sections: [
      { title: 'Emergency Medical Relief Fund', body: 'Raised over 210,000 credits to buy medical tents and emergency supplies for underserved regional clinics.' },
      { title: 'Next-Gen VR Headset', body: 'Aether Labs raised 95,000 credits to prototype and test immersive virtual reality models for distance training.' },
      { title: 'Solar Powered Water Pump', body: 'Clean drinking water village project successfully exceeded its target, raising 37,500 credits to deploy clean energy water pumps.' }
    ]
  },
  'supported-countries': {
    title: 'Supported Countries',
    subtitle: 'CrowdFund connects creators and supporters globally.',
    icon: Globe2,
    sections: [
      { title: 'Worldwide Supporter Base', body: 'Anyone with a valid credit card supported by Stripe can purchase credits to support campaigns globally.' },
      { title: 'Creator Locations', body: 'We currently support direct payouts and withdrawals to bank accounts in the United States, Canada, United Kingdom, European Union, Australia, and Singapore.' }
    ]
  }
};

export default function LearnMorePage() {
  const params = useParams();
  const slug = (params?.slug as string) || '';
  const data = learnData[slug];

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 text-gray-500 font-sans p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Page Not Found</h2>
        <p className="text-sm mb-6">The requested information guide does not exist.</p>
        <Link href="/" className="px-5 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all flex items-center">
          <ArrowLeft size={16} className="mr-2" /> Back to Home
        </Link>
      </div>
    );
  }

  const IconComponent = data.icon;

  return (
    <div className="bg-gray-50 min-h-screen py-16 font-sans">
      <div className="w-[90%] mx-auto px-2 sm:px-4">
        <Link href="/" className="inline-flex items-center text-sm font-bold text-primary hover:underline mb-8">
          <ArrowLeft size={16} className="mr-2" /> Back to Home
        </Link>
        
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-4 bg-emerald-50 text-primary rounded-2xl">
              <IconComponent size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">{data.title}</h1>
              <p className="text-gray-500 mt-1">{data.subtitle}</p>
            </div>
          </div>
          
          <div className="border-t border-gray-100 my-8"></div>
          
          <div className="space-y-8">
            {data.sections.map((section, idx) => (
              <div key={idx} className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 hover:border-primary/20 transition-colors">
                <h3 className="text-lg font-bold text-gray-800 mb-2">{section.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{section.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
