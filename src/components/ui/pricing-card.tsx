"use client";
import * as React from "react";
import { Check } from "lucide-react";

export interface PricingTier {
  name: string;
  price: {
    [key: string]: number;
  };
  credits: number;
  description: string;
  features: string[];
  popular?: boolean;
}

interface PricingCardProps {
  tier: PricingTier;
  paymentFrequency: string;
  onSelect?: (credits: number, price: number) => void;
}

export function PricingCard({ tier, paymentFrequency, onSelect }: PricingCardProps) {
  // Normalize frequency key
  const freqKey = paymentFrequency.toLowerCase();
  const currentPrice = tier.price[freqKey] !== undefined ? tier.price[freqKey] : (tier.price["one-time"] || 0);

  return (
    <div
      className={`bg-white rounded-3xl p-6 border flex flex-col justify-between transition-all duration-300 relative ${
        tier.popular
          ? "border-primary ring-2 ring-primary ring-opacity-20 shadow-lg scale-105 z-10"
          : "border-gray-200 shadow-sm hover:shadow-md"
      }`}
    >
      {tier.popular && (
        <span className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 bg-primary text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          Most Popular
        </span>
      )}

      <div>
        <div className="mb-5">
          <h3 className="text-lg font-bold text-gray-800 mb-1">{tier.name}</h3>
          <p className="text-xs text-gray-400 font-medium leading-relaxed">{tier.description}</p>
        </div>

        <div className="flex items-baseline text-gray-900 mb-6">
          <span className="text-3xl font-extrabold">${currentPrice}</span>
          <span className="text-xs font-semibold text-gray-400 ml-1.5 capitalize">
            / {paymentFrequency}
          </span>
        </div>

        <div className="border-t border-gray-100 pt-5 mb-6">
          <span className="text-sm font-bold text-gray-700 block mb-3">Includes:</span>
          <ul className="space-y-2.5 text-xs text-gray-500 font-medium">
            <li className="flex items-center text-primary font-bold">
              <Check size={14} className="mr-2 stroke-[3]" />
              {tier.credits} Credits
            </li>
            {tier.features.map((feature, idx) => (
              <li key={idx} className="flex items-center">
                <Check size={14} className="mr-2 text-gray-400 stroke-[2.5]" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onSelect?.(tier.credits, currentPrice)}
        className={`w-full py-3 rounded-2xl font-bold text-xs transition-colors flex items-center justify-center cursor-pointer ${
          tier.popular
            ? "bg-primary text-white hover:bg-primary/90 shadow-sm shadow-primary/20"
            : "bg-gray-50 text-gray-750 hover:bg-gray-100 border border-gray-150"
        }`}
      >
        Buy Credits
      </button>
    </div>
  );
}
