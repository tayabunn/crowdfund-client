"use client";
import { useAuth } from '@/context/AuthContext';
import { CreditCard } from 'lucide-react';
import { useState } from 'react';

export default function PurchaseCredit() {
  const { user } = useAuth();
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);

  if (user?.role !== 'Supporter') return <div className="p-6 text-red-500">Unauthorized</div>;

  const packages = [
    { credits: 100, price: 10 },
    { credits: 300, price: 25, popular: true },
    { credits: 800, price: 60 },
    { credits: 1500, price: 110 }
  ];

  const handlePurchase = (pkg: any) => {
    setSelectedPackage(pkg.credits);
    // TODO: Integrate Stripe checkout here
    alert(`Initiating Stripe payment for $${pkg.price} (${pkg.credits} credits)`);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Purchase Credits</h2>
        <p className="text-gray-500">Buy credits to support amazing campaigns and bring ideas to life.</p>
        <p className="mt-2 text-sm font-semibold text-primary">Conversion rate: 10 Credits = $1</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {packages.map((pkg, index) => (
          <div 
            key={index} 
            className={`bg-white rounded-2xl shadow-sm border ${pkg.popular ? 'border-primary ring-2 ring-primary ring-opacity-50' : 'border-gray-200'} p-8 relative flex flex-col hover:shadow-lg transition-shadow`}
          >
            {pkg.popular && (
              <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                Most Popular
              </span>
            )}
            
            <div className="text-center mb-8">
              <h3 className="text-xl font-medium text-gray-500 mb-2">Package {index + 1}</h3>
              <div className="flex justify-center items-baseline text-4xl font-extrabold text-gray-900">
                {pkg.credits}
                <span className="text-lg font-medium text-gray-500 ml-1">Credits</span>
              </div>
            </div>

            <div className="text-center mb-8 flex-grow">
              <span className="text-5xl font-bold text-gray-900">${pkg.price}</span>
            </div>

            <button
              onClick={() => handlePurchase(pkg)}
              className={`w-full py-3 px-4 rounded-xl font-bold flex items-center justify-center transition-colors ${
                pkg.popular 
                  ? 'bg-primary text-white hover:bg-primary-dark' 
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              }`}
            >
              <CreditCard size={18} className="mr-2" />
              Pay with Stripe
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
