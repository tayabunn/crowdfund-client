"use client";
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { FileText, ShieldAlert, Scale, Eye, ArrowLeft } from 'lucide-react';

type ContentType = {
  title: string;
  subtitle: string;
  icon: any;
  sections: { title: string; body: string }[];
};

const legalData: Record<string, ContentType> = {
  'terms': {
    title: 'Terms of Service',
    subtitle: 'Please read our terms of service before using our crowdfunding platform.',
    icon: FileText,
    sections: [
      { title: '1. Acceptance of Terms', body: 'By accessing or using CrowdFund, you agree to be bound by these Terms of Service, all applicable laws, and regulations.' },
      { title: '2. User Conduct', body: 'Users must represent all campaign details truthfully. Fraudulent campaigns, plagiarism, or impersonation will lead to immediate campaign deletion and account suspension.' },
      { title: '3. Credit Purchases & Fees', body: 'All credit purchases are processed securely through Stripe. The purchase of credits is non-refundable, except when associated campaigns are deleted by platform administrators, in which case backer credits are fully returned.' }
    ]
  },
  'privacy-notice': {
    title: 'Privacy Notice',
    subtitle: 'Learn how we collect, use, and safeguard your personal information.',
    icon: Eye,
    sections: [
      { title: 'Information We Collect', body: 'We collect name, email address, profile picture (photo URL), and transaction logs necessary to maintain your platform balance and user verification.' },
      { title: 'How We Protect Your Data', body: 'Passcodes and credentials are encrypted using bcrypt hashing before database storage. Payment information is securely processed using Stripe elements without storing raw card information on our servers.' },
      { title: 'Sharing Policies', body: 'We do not sell, trade, or share your personal data with third-party advertising companies. Data is shared only with partners essential to platform services (e.g. Stripe, ImgBB, Google Auth).' }
    ]
  },
  'general': {
    title: 'Legal Disclaimer',
    subtitle: 'Important legal notices and limit of liabilities regarding platform use.',
    icon: Scale,
    sections: [
      { title: 'Platform Limitation', body: 'CrowdFund acts purely as an intermediary software platform connecting creators with supporters. We do not guarantee the completion, success, or quality of campaigns funded on our site.' },
      { title: 'Responsibility of Backers', body: 'Supporters are solely responsible for verifying the authenticity and credentials of campaigns before pledging credits.' }
    ]
  },
  'accessibility': {
    title: 'Accessibility Statement',
    subtitle: 'Our commitment to ensuring access for all users.',
    icon: ShieldAlert,
    sections: [
      { title: 'Our Goal', body: 'We strive to make our user interface compliant with the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA.' },
      { title: 'Interface Accommodations', body: 'We utilize clean, high-contrast Tailwind colors, clear focus states for interactive items, semantic HTML5 elements, and compatible layouts for screen reader support.' }
    ]
  }
};

export default function LegalPage() {
  const params = useParams();
  const slug = (params?.slug as string) || '';
  const data = legalData[slug];

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 text-gray-500 font-sans p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Page Not Found</h2>
        <p className="text-sm mb-6">The requested legal document could not be found.</p>
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
