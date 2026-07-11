import Link from 'next/link';

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/60 z-10"></div>
          {/* Using a placeholder background gradient for now */}
          <div className="w-full h-full bg-gradient-to-r from-primary to-orange-500"></div>
        </div>
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">Fund The Next Big Thing</h1>
          <p className="text-xl md:text-2xl mb-10 text-gray-200">Join thousands of creators and supporters bringing creative projects to life.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/explore" className="bg-primary text-white hover:bg-primary-dark font-bold py-4 px-8 rounded-full text-lg transition-all transform hover:scale-105 shadow-lg">
              Explore Campaigns
            </Link>
            <Link href="/register" className="bg-transparent border-2 border-white hover:bg-white hover:text-dark font-bold py-4 px-8 rounded-full text-lg transition-all">
              Start a Campaign
            </Link>
          </div>
        </div>
      </section>

      {/* Top Funded Campaigns */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-dark mb-4">Top Funded Campaigns</h2>
            <div className="w-24 h-1 bg-primary mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Dummy Campaign Cards */}
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group">
                <div className="h-60 bg-gray-300 relative overflow-hidden">
                  <div className="absolute inset-0 bg-primary/20 group-hover:bg-transparent transition-colors z-10"></div>
                  {/* Placeholder image style */}
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-400"></div>
                </div>
                <div className="p-6">
                  <span className="text-sm font-semibold text-primary mb-2 block">Technology</span>
                  <h3 className="text-xl font-bold text-dark mb-3 line-clamp-2">Help us build a solar-powered water pump for communities</h3>
                  <p className="text-gray-600 mb-6 text-sm">By John Doe</p>
                  
                  <div className="space-y-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-bold text-dark">$75,000 raised</span>
                      <span className="text-gray-500">of $100,000</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-dark mb-4">What Our Users Say</h2>
            <div className="w-24 h-1 bg-primary mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="p-8 bg-gray-50 rounded-2xl relative">
                <div className="text-primary text-6xl absolute top-4 right-6 opacity-20">"</div>
                <p className="text-gray-700 italic mb-6 relative z-10">This platform changed my life. I was able to raise enough funds to start my dream business in just 30 days!</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-300"></div>
                  <div>
                    <h4 className="font-bold text-dark">Jane Smith</h4>
                    <p className="text-sm text-gray-500">Creator</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 bg-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-16">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mb-6">
                <span className="text-3xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Create Campaign</h3>
              <p className="text-gray-400">Share your vision, set a goal, and tell your story to the world.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mb-6">
                <span className="text-3xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Share & Fund</h3>
              <p className="text-gray-400">Spread the word and gather support from our global community.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mb-6">
                <span className="text-3xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Make It Happen</h3>
              <p className="text-gray-400">Receive funds, reward your backers, and bring your project to life.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Platform Impact in Numbers */}
      <section className="py-24 bg-primary text-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-black mb-2">10M+</div>
              <div className="text-lg font-semibold opacity-90">Total Raised</div>
            </div>
            <div>
              <div className="text-5xl font-black mb-2">5,000+</div>
              <div className="text-lg font-semibold opacity-90">Projects Funded</div>
            </div>
            <div>
              <div className="text-5xl font-black mb-2">2M+</div>
              <div className="text-lg font-semibold opacity-90">Active Backers</div>
            </div>
            <div>
              <div className="text-5xl font-black mb-2">120+</div>
              <div className="text-lg font-semibold opacity-90">Countries</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
