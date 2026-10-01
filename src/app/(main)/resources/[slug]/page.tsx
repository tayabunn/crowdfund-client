"use client";
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { HelpCircle, Newspaper, BookOpen, MessageSquare, Briefcase, ArrowLeft } from 'lucide-react';

type ContentType = {
  title: string;
  subtitle: string;
  icon: any;
  sections: { title: string; body: string }[];
};

const resourceData: Record<string, ContentType> = {
  'help-center': {
    title: 'Help Center & Support',
    subtitle: 'Find guides, tips, and direct contact options to help you use CrowdFund.',
    icon: HelpCircle,
    sections: [
      { title: 'Campaign Guidelines', body: 'Learn what constitutes a valid campaign, how to present your goals, and what reward structures are permitted.' },
      { title: 'Troubleshooting Payments', body: 'Having issues with credit purchases or withdrawals? Check our Stripe payment guides or reach out to billing.' },
      { title: 'Contact Support', body: 'Can\'t find what you need? Open a support ticket by emailing support@crowdfund.com. Our typical response time is under 24 hours.' }
    ]
  },
  'blog': {
    title: 'CrowdFund Blog',
    subtitle: 'Stay up to date with the latest features, creator tips, and platform news.',
    icon: Newspaper,
    sections: [
      { title: 'Platform Launching: TypeScript Server Migration', body: 'Today we migrated our entire backend system to TypeScript to guarantee reliable type safety and performance.' },
      { title: 'Top 5 Tips for Successful Campaigns', body: 'Discover how top-funded projects structure their rewards, build clear campaign stories, and promote their causes.' },
      { title: 'Introducing Recharts Visual Analytics', body: 'We have updated our platform dashboard with rich visual charts, giving admins instant insights into platform activity.' }
    ]
  },
  'gofundme-stories': {
    title: 'Featured Stories & Spotlights',
    subtitle: 'In-depth interviews and write-ups of campaigns that changed communities.',
    icon: BookOpen,
    sections: [
      { title: 'Providing Water to Villages: Behind the Scenes', body: 'Read our exclusive interview with the organizers of the solar water pump campaign and see the impact on the ground.' },
      { title: 'Aether Labs VR Education Prototype', body: 'How Aether Labs is building lightweight virtual reality headsets for remote classroom training in underserved districts.' }
    ]
  },
  'press-center': {
    title: 'Press & Media Center',
    subtitle: 'Official press releases, brand assets, and contact details for journalists.',
    icon: MessageSquare,
    sections: [
      { title: 'Media Inquiries', body: 'For press releases, media kits, or interview requests, please contact press@crowdfund.com.' },
      { title: 'Platform Overview & Assets', body: 'Download official CrowdFund logos, brand guidelines, and screenshot mockups for publication.' }
    ]
  },
  'careers': {
    title: 'Careers at CrowdFund',
    subtitle: 'Join us in building the most transparent and trusted crowdfunding platform.',
    icon: Briefcase,
    sections: [
      { title: 'Full-Stack Software Engineer (TypeScript)', body: 'Help us scale our React/Next.js client and Node/Express server. Passion for clean architecture and type safety required.' },
      { title: 'Product Designer (UX/UI)', body: 'Create premium, visual user experiences that delight supporters and make it easy for creators to raise funds.' },
      { title: 'Customer Support Specialist', body: 'Assist our community of backers and creators with setup, verification, and credit economy questions.' }
    ]
  }
};

export default function ResourcesPage() {
  const params = useParams();
  const slug = (params?.slug as string) || '';
  const data = resourceData[slug];

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 text-gray-500 font-sans p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Page Not Found</h2>
        <p className="text-sm mb-6">The requested resource could not be found.</p>
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
