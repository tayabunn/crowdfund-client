"use client";
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div>
      {/* Hero Section - Split Layout */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 bg-green-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            
            <motion.div 
              className="lg:w-1/2 text-center lg:text-left"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-6 leading-tight">
                Fund The Next <span className="text-primary">Big Thing</span>
              </h1>
              <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto lg:mx-0">
                Join thousands of creators and supporters bringing creative projects to life. Discover, support, and transform dreams into reality.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/explore" className="bg-primary text-white hover:bg-primary-dark font-bold py-4 px-8 rounded-full text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
                  Explore Campaigns
                </Link>
                <Link href="/register" className="bg-white text-primary border-2 border-primary hover:bg-primary-50 font-bold py-4 px-8 rounded-full text-lg transition-all">
                  Start a Campaign
                </Link>
              </div>
            </motion.div>

            <motion.div 
              className="lg:w-1/2 w-full"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
                <img 
                  src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1200&q=80" 
                  alt="Community gathering" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Top Funded Campaigns */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={itemVariants}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Top Funded Campaigns</h2>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {/* Dummy Campaign Cards */}
            {[
              { id: 1, cat: 'Technology', title: 'Solar-powered water pump for communities', img: '1531206715517-5c0ba140b2b8' },
              { id: 2, cat: 'Education', title: 'Providing laptops to underprivileged students', img: '1509062522246-3755977927d7' },
              { id: 3, cat: 'Health', title: 'Medical supplies for remote villages', img: '1584036561584-b03c19ce876c' }
            ].map((item) => (
              <motion.div 
                key={item.id} 
                className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden hover:shadow-2xl transition-all group flex flex-col"
                variants={itemVariants}
                whileHover={{ y: -8 }}
              >
                <div className="h-56 relative overflow-hidden bg-gray-100">
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-10"></div>
                  <img src={`https://images.unsplash.com/photo-${item.img}?w=800&q=80`} alt="Campaign" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <span className="text-xs font-bold text-primary tracking-wider uppercase mb-2 block">{item.cat}</span>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">{item.title}</h3>
                  <p className="text-gray-500 mb-6 text-sm flex-grow">By Dedicated Creator</p>
                  
                  <div className="space-y-3 mt-auto">
                    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                      <motion.div 
                        className="bg-primary h-full rounded-full" 
                        initial={{ width: 0 }}
                        whileInView={{ width: '75%' }}
                        transition={{ duration: 1, delay: 0.5 }}
                        viewport={{ once: true }}
                      ></motion.div>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-bold text-primary text-base">$75,000 <span className="text-gray-500 text-sm font-normal">raised</span></span>
                      <span className="text-gray-500 font-medium">75%</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-24 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full mb-16"></div>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-12"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={itemVariants} className="flex flex-col items-center group">
              <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary transition-colors duration-300 shadow-xl">
                <span className="text-3xl font-bold text-primary group-hover:text-white transition-colors duration-300">1</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Create Campaign</h3>
              <p className="text-gray-400 max-w-xs">Share your vision, set a goal, and tell your unique story to the world.</p>
            </motion.div>
            <motion.div variants={itemVariants} className="flex flex-col items-center group">
              <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary transition-colors duration-300 shadow-xl">
                <span className="text-3xl font-bold text-primary group-hover:text-white transition-colors duration-300">2</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Share & Fund</h3>
              <p className="text-gray-400 max-w-xs">Spread the word and gather crucial support from our global community.</p>
            </motion.div>
            <motion.div variants={itemVariants} className="flex flex-col items-center group">
              <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary transition-colors duration-300 shadow-xl">
                <span className="text-3xl font-bold text-primary group-hover:text-white transition-colors duration-300">3</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Make It Happen</h3>
              <p className="text-gray-400 max-w-xs">Receive your funds, reward your backers, and bring your project to life.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Platform Impact in Numbers */}
      <section className="py-20 bg-primary text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={itemVariants}>
              <div className="text-5xl font-black mb-2">$10M+</div>
              <div className="text-lg font-medium opacity-90">Total Raised</div>
            </motion.div>
            <motion.div variants={itemVariants}>
              <div className="text-5xl font-black mb-2">5,000+</div>
              <div className="text-lg font-medium opacity-90">Projects Funded</div>
            </motion.div>
            <motion.div variants={itemVariants}>
              <div className="text-5xl font-black mb-2">2M+</div>
              <div className="text-lg font-medium opacity-90">Active Backers</div>
            </motion.div>
            <motion.div variants={itemVariants}>
              <div className="text-5xl font-black mb-2">120+</div>
              <div className="text-lg font-medium opacity-90">Countries</div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
