"use client";
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function ExploreCampaigns() {
  const campaigns = [
    {
      id: "1",
      title: "Help us build a solar-powered water pump",
      creator_name: "Tech for Good",
      deadline: "2026-12-31",
      funding_goal: 50000,
      amount_raised: 37500,
      image_url: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800&q=80",
      category: "Technology"
    },
    {
      id: "2",
      title: "Community Art Center Renovation",
      creator_name: "Local Artists United",
      deadline: "2026-10-15",
      funding_goal: 15000,
      amount_raised: 12000,
      image_url: "https://images.unsplash.com/photo-1460518451285-84b6daf5b51c?w=800&q=80",
      category: "Art"
    },
    {
      id: "3",
      title: "Provide Clean Drinking Water to Remote Villages",
      creator_name: "Water for All",
      deadline: "2026-11-20",
      funding_goal: 100000,
      amount_raised: 45000,
      image_url: "https://images.unsplash.com/photo-1544256718-3bcf237f3974?w=800&q=80",
      category: "Community"
    },
    {
      id: "4",
      title: "Emergency Medical Relief Fund",
      creator_name: "Global Medics",
      deadline: "2026-08-30",
      funding_goal: 250000,
      amount_raised: 210000,
      image_url: "https://images.unsplash.com/photo-1584036561584-b03c19ce876c?w=800&q=80",
      category: "Health"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">Explore Campaigns</h1>
          <p className="text-xl text-gray-500">Discover and support projects that matter to you.</p>
        </motion.div>

        {/* Filter/Search Bar */}
        <motion.div 
          className="mb-10 flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <input 
            type="text" 
            placeholder="Search campaigns..." 
            className="w-full md:w-1/3 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-colors"
          />
          <select className="w-full md:w-1/4 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-colors">
            <option>All Categories</option>
            <option>Technology</option>
            <option>Art</option>
            <option>Community</option>
            <option>Health</option>
          </select>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {campaigns.map((campaign) => (
            <motion.div 
              key={campaign.id} 
              className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden hover:shadow-2xl transition-all group flex flex-col"
              variants={itemVariants}
              whileHover={{ y: -8 }}
            >
              <div className="h-56 relative overflow-hidden bg-gray-100">
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-10"></div>
                <img src={campaign.image_url} alt={campaign.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                <span className="absolute top-3 right-3 bg-white px-3 py-1 text-xs font-bold text-primary rounded-full shadow-sm z-20">
                  {campaign.category}
                </span>
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{campaign.title}</h3>
                <p className="text-gray-500 text-sm mb-6 flex-grow">By {campaign.creator_name}</p>
                
                <div className="mt-auto">
                  <div className="w-full bg-gray-100 rounded-full h-2.5 mb-3 overflow-hidden">
                    <motion.div 
                      className="bg-primary h-full rounded-full" 
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(campaign.amount_raised / campaign.funding_goal) * 100}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                      viewport={{ once: true }}
                    ></motion.div>
                  </div>
                  <div className="flex justify-between items-center text-sm mb-4">
                    <span className="font-bold text-primary text-base">${campaign.amount_raised.toLocaleString()} <span className="text-gray-500 font-normal text-sm">raised</span></span>
                    <span className="text-gray-500 font-medium">{Math.round((campaign.amount_raised / campaign.funding_goal) * 100)}%</span>
                  </div>
                  <div className="flex justify-between items-center text-sm mb-6">
                    <span className="text-gray-500">Goal: ${campaign.funding_goal.toLocaleString()}</span>
                  </div>
                  <Link href={`/explore/${campaign.id}`} className="block w-full text-center bg-gray-50 text-primary border border-primary/20 py-3 rounded-xl font-bold hover:bg-primary hover:text-white transition-colors">
                    View Campaign
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
