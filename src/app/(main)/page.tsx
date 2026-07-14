"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import axios from 'axios';
import TestimonialsSection from '@/components/TestimonialsSection';
import ExploreByCategory from '@/components/ExploreByCategory';
import CreatorSpotlight from '@/components/CreatorSpotlight';
import FaqSection from '@/components/FaqSection';

// Import Swiper React components and modules
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

export default function Home() {
  const [topCampaigns, setTopCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopCampaigns = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/campaigns/top-funded`);
        setTopCampaigns(res.data);
      } catch (err) {
        console.error('Error fetching top campaigns:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTopCampaigns();
  }, []);

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

  const slides = [
    {
      heading: "Empower Tech & Innovation",
      description: "Discover cutting-edge gadgets, renewable energy initiatives, and futuristic software projects shaping tomorrow.",
      img: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1600&q=80",
      ctaText: "Explore Tech",
      ctaLink: "/explore?category=Technology"
    },
    {
      heading: "Bring Creative Art to Life",
      description: "Support indie filmmakers, comic artists, community theaters, and musical geniuses launching original works.",
      img: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=1600&q=80",
      ctaText: "Discover Art",
      ctaLink: "/explore?category=Art"
    },
    {
      heading: "Support Local Communities",
      description: "Help build water wells, smart greenhouses, medical clinics, and clean energy systems in underserved regions.",
      img: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=1600&q=80",
      ctaText: "Join Campaigns",
      ctaLink: "/explore?category=Community"
    }
  ];

  return (
    <div>
      {/* Hero Slider Section */}
      <section className="relative w-full overflow-hidden bg-gray-900 z-0">
        <Swiper
          style={{
            // @ts-ignore
            '--swiper-navigation-color': '#fff',
            '--swiper-pagination-color': '#02a95c',
            '--swiper-pagination-bullet-inactive-color': '#fff',
            '--swiper-pagination-bullet-inactive-opacity': '0.4',
            '--swiper-pagination-bullet-size': '12px',
          }}
          spaceBetween={0}
          effect={'fade'}
          autoplay={{
            delay: 6000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          navigation={true}
          modules={[Autoplay, Pagination, Navigation, EffectFade]}
          className="h-[600px] sm:h-[650px] lg:h-[750px] w-full"
        >
          {slides.map((slide, idx) => (
            <SwiperSlide key={idx} className="relative w-full h-full">
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[6000ms] ease-out scale-105"
                style={{ backgroundImage: `url(${slide.img})` }}
              />
              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/35 z-10" />

              {/* Slide Content */}
              <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center z-20">
                <div className="max-w-3xl text-left text-white">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    <span className="bg-primary/20 text-primary border border-primary/30 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 inline-block">
                      Featured Project Category
                    </span>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight text-white drop-shadow-sm">
                      {slide.heading}
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl text-gray-200 mb-10 leading-relaxed max-w-2xl">
                      {slide.description}
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <Link 
                        href={slide.ctaLink} 
                        className="bg-primary text-white hover:bg-primary-dark font-extrabold py-3.5 px-8 rounded-2xl text-base transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                      >
                        {slide.ctaText}
                      </Link>
                      <Link 
                        href="/register" 
                        className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold py-3.5 px-8 rounded-2xl text-base transition-all backdrop-blur-sm"
                      >
                        Start a Campaign
                      </Link>
                    </div>
                  </motion.div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
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

          {loading ? (
            <div className="text-center py-12 text-gray-500 font-medium">Loading top campaigns...</div>
          ) : topCampaigns.length === 0 ? (
            <div className="text-center py-12 text-gray-500 font-medium">No campaigns found.</div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
            >
              {topCampaigns.map((campaign) => {
                const percent = Math.min(((campaign.amount_raised || 0) / campaign.funding_goal) * 100, 100);
                const percentLabel = Math.round(((campaign.amount_raised || 0) / campaign.funding_goal) * 100);
                
                return (
                  <motion.div 
                    key={campaign._id} 
                    className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden hover:shadow-2xl transition-all group flex flex-col"
                    variants={itemVariants}
                    whileHover={{ y: -8 }}
                  >
                    <div className="h-56 relative overflow-hidden bg-gray-100">
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-10"></div>
                      <img 
                        src={campaign.image_url || "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800&q=80"} 
                        onError={(e) => {
                          e.currentTarget.src = "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800&q=80";
                        }}
                        alt={campaign.title} 
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" 
                      />
                      <span className="absolute top-3 right-3 bg-white px-3 py-1 text-xs font-bold text-primary rounded-full shadow-sm z-20">
                        {campaign.category}
                      </span>
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <span className="text-xs font-bold text-primary tracking-wider uppercase mb-2 block">{campaign.category}</span>
                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">{campaign.title}</h3>
                      <p className="text-gray-500 mb-6 text-sm flex-grow">By {campaign.creator_name}</p>
                      
                      <div className="space-y-3 mt-auto">
                        <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                          <motion.div 
                            className="bg-primary h-full rounded-full" 
                            initial={{ width: 0 }}
                            whileInView={{ width: `${percent}%` }}
                            transition={{ duration: 1, delay: 0.2 }}
                            viewport={{ once: true }}
                          ></motion.div>
                        </div>
                        <div className="flex justify-between items-center text-sm mb-4">
                          <span className="font-bold text-primary text-base">
                            {(campaign.amount_raised || 0).toLocaleString()} <span className="text-gray-500 text-sm font-normal">Credits raised</span>
                          </span>
                          <span className="text-gray-500 font-medium">{percentLabel}%</span>
                        </div>
                        <div className="flex justify-between items-center text-sm mb-6">
                          <span className="text-gray-500">Goal: {campaign.funding_goal.toLocaleString()} Credits</span>
                        </div>
                        <Link href={`/explore/${campaign._id}`} className="block w-full text-center bg-gray-50 text-primary border border-primary/20 py-3 rounded-xl font-bold hover:bg-primary hover:text-white transition-colors">
                          View Campaign
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection
        data={{
          title: "Loved by Creators & Supporters",
          subtitle: "See how our community is making a global impact together.",
          rows: [
            {
              id: 1,
              speed: "35s",
              direction: "left" as const,
              testimonials: [
                {
                  id: 1,
                  quote: "This platform helped us fund our community art center in just two weeks! Incredible experience.",
                  authorName: "Sarah Jenkins",
                  authorTitle: "GreenUrban Founder",
                  avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&q=80"
                },
                {
                  id: 2,
                  quote: "As a creator, the contribution process was seamless. The community support was overwhelming.",
                  authorName: "David Chen",
                  authorTitle: "Indie Game Developer",
                  avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&q=80"
                },
                {
                  id: 3,
                  quote: "Contributing to clean energy projects in remote villages makes me feel like I am truly making a difference.",
                  authorName: "Elena Rostova",
                  authorTitle: "Active Supporter",
                  avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop&q=80"
                }
              ]
            },
            {
              id: 2,
              speed: "40s",
              direction: "right" as const,
              testimonials: [
                {
                  id: 4,
                  quote: "The transparency and reward structure are top-notch. I love seeing project updates.",
                  authorName: "Marcus Brody",
                  authorTitle: "Tech Enthusiast",
                  avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&q=80"
                },
                {
                  id: 5,
                  quote: "We raised 120% of our funding goal for our youth soccer academy. Absolutely game-changing platform!",
                  authorName: "Coach Mike",
                  authorTitle: "Rising Stars FC",
                  avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&q=80"
                },
                {
                  id: 6,
                  quote: "Funding our digital art workshop was a breeze. The interface is clean, premium, and beautiful.",
                  authorName: "Aria Thorne",
                  authorTitle: "Digital Artist",
                  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&q=80"
                }
              ]
            }
          ]
        }}
      />

      {/* 3 Extra Sections */}
      <ExploreByCategory />
      <CreatorSpotlight />
      <FaqSection />

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
