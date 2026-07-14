import React from 'react';
import Link from 'next/link';
import { Cpu, BookOpen, Heart, Palette, Users, ShieldAlert } from 'lucide-react';

const categories = [
  {
    name: "Technology",
    icon: Cpu,
    description: "Innovations, gadgets, and software products.",
    count: "4 Campaigns"
  },
  {
    name: "Education",
    icon: BookOpen,
    description: "School supplies, courses, and educational tools.",
    count: "3 Campaigns"
  },
  {
    name: "Health",
    icon: Heart,
    description: "Treatments, medical devices, and health systems.",
    count: "3 Campaigns"
  },
  {
    name: "Art",
    icon: Palette,
    description: "Digital design workshops, paintings, and indie films.",
    count: "4 Campaigns"
  },
  {
    name: "Community",
    icon: Users,
    description: "Urban gardens, community kitchens, and events.",
    count: "3 Campaigns"
  },
  {
    name: "Disaster Relief",
    icon: ShieldAlert,
    description: "Emergency support and rebuilding initiatives.",
    count: "1 Campaign"
  }
];

export default function ExploreByCategory() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Explore by Category</h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full mb-4"></div>
          <p className="text-gray-500 text-base max-w-lg mx-auto">
            Discover and support creative campaigns across your favorite interest areas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <Link 
                href={`/explore?category=${cat.name}`}
                key={idx}
                className="group p-6 bg-gray-50/50 rounded-2xl border border-gray-100 hover:border-primary/20 hover:bg-white shadow-sm hover:shadow-lg transition-all text-center flex flex-col items-center hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon size={24} />
                </div>
                <h3 className="text-base font-bold text-gray-900 group-hover:text-primary transition-colors mb-2">{cat.name}</h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-4 flex-grow">{cat.description}</p>
                <span className="text-xs font-semibold text-primary/80 bg-primary/5 px-2.5 py-1 rounded-full group-hover:bg-primary group-hover:text-white transition-colors">
                  {cat.count}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
