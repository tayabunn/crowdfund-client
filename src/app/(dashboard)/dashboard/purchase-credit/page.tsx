"use client";
import * as React from "react";
import { useState } from "react";
import { useAuth } from '@/context/AuthContext';
import { CreditCard, X, ShieldCheck, Landmark, MoreHorizontal } from 'lucide-react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { PricingCard, type PricingTier } from "@/components/ui/pricing-card";
import { Tab } from "@/components/ui/pricing-tab";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

function CheckoutForm({ price, credits, token, onClose, onSuccess }: {
  price: number;
  credits: number;
  token: string;
  onClose: () => void;
  onSuccess: (newCredits: number) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setError(null);

    const cardNumberElement = elements.getElement(CardNumberElement);
    if (!cardNumberElement) {
      setProcessing(false);
      return;
    }

    try {
      // 1. Create Payment Intent on the server
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/payments/create-payment-intent`,
        { amount: price },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const clientSecret = data.clientSecret;

      // 2. Confirm Card Payment with Stripe
      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardNumberElement,
        },
      });

      if (paymentResult.error) {
        throw new Error(paymentResult.error.message || 'Payment failed.');
      }

      if (paymentResult.paymentIntent?.status === 'succeeded') {
        // 3. Confirm Payment and Add Credits on the server
        const confirmRes = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/payments/confirm-payment`,
          {
            paymentIntentId: paymentResult.paymentIntent.id,
            creditsPurchased: credits,
            amountPaid: price,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        toast.success(`Successfully purchased ${credits} credits!`);
        onSuccess(confirmRes.data.credits);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'An error occurred during payment.');
    } finally {
      setProcessing(false);
    }
  };

  const elementStyles = {
    style: {
      base: {
        fontSize: '14px',
        color: '#1f2937',
        fontFamily: 'Inter, sans-serif',
        '::placeholder': {
          color: '#9ca3af',
        },
      },
      invalid: {
        color: '#ef4444',
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#f8fafc] p-5 sm:p-6 rounded-2xl border border-gray-100 space-y-5">
      {/* Payment Method Tabs */}
      <div className="flex space-x-3 mb-6">
        <div className="flex-1 flex flex-col items-center justify-center p-3.5 bg-white border-2 border-blue-600 rounded-xl cursor-pointer shadow-xs">
          <CreditCard size={18} className="text-blue-600 mb-1.5" />
          <span className="text-xs font-bold text-gray-800">Card</span>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-3.5 bg-[#f8fafc]/50 border border-gray-200 rounded-xl cursor-not-allowed opacity-60">
          <Landmark size={18} className="text-gray-400 mb-1.5" />
          <span className="text-xs font-semibold text-gray-400 text-center">ACH bank debit</span>
        </div>
        <div className="w-14 flex items-center justify-center bg-[#f8fafc]/50 border border-gray-200 rounded-xl cursor-not-allowed opacity-60">
          <MoreHorizontal size={18} className="text-gray-400" />
        </div>
      </div>

      {/* Card number input */}
      <div className="flex flex-col">
        <label htmlFor="card_number_element" className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
          Card number
        </label>
        <div className="relative bg-white px-4 py-3.5 border border-gray-200 rounded-xl shadow-xs focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
          <div id="card_number_element">
            <CardNumberElement options={{ ...elementStyles, showIcon: false }} />
          </div>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-1.5 opacity-90 select-none">
            {/* Visa */}
            <svg className="h-4 w-6 bg-white border border-gray-100 rounded px-0.5" viewBox="0 0 36 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.9 0.2L9.4 11.8H6.5L9.0 0.2H11.9ZM21.7 0.2L18.6 11.8H15.9L13.8 2.6L12.5 9.0C12.5 9.0 11.4 11.8 11.0 11.8H8.2L11.5 0.2H14.5L16.5 8.9L18.8 0.2H21.7ZM30.4 7.6C30.4 9.5 27.6 10.3 25.9 10.3C24.0 10.3 22.8 9.5 22.8 9.5L23.3 7.5C23.3 7.5 24.3 8.2 25.7 8.2C27.1 8.2 27.6 7.7 27.6 7.2C27.6 6.0 24.2 6.0 24.2 4.0C24.2 2.0 26.8 0.2 29.8 0.2C31.5 0.2 32.5 0.8 32.5 0.8L32.0 2.8C32.0 2.8 31.0 2.2 29.7 2.2C28.4 2.2 27.0 2.7 27.0 3.3C27.0 4.5 30.4 4.4 30.4 7.6ZM5.9 0.2L3.1 8.2L2.7 6.1C2.0 3.2 0.2 1.0 0.2 1.0L0 0.2H4.4L5.9 0.2Z" fill="#1434CB"/>
            </svg>
            {/* Mastercard */}
            <svg className="h-4 w-6 bg-white border border-gray-100 rounded px-0.5" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="8" cy="8" r="8" fill="#EB001B"/>
              <circle cx="16" cy="8" r="8" fill="#F79E1B" fillOpacity="0.8"/>
            </svg>
            {/* Amex */}
            <svg className="h-4 w-6" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="24" height="16" rx="2" fill="#0070D2"/>
              <text x="3" y="11" fill="white" fontSize="6" fontWeight="bold" fontFamily="sans-serif">AMEX</text>
            </svg>
            {/* Discover */}
            <svg className="h-4 w-6 bg-white border border-gray-100 rounded px-0.5" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <text x="2" y="11" fill="#f97316" fontSize="5" fontWeight="black" fontFamily="sans-serif">DISC</text>
            </svg>
          </div>
        </div>
      </div>

      {/* Expiry & CVV Row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label htmlFor="card_expiry_element" className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
            Expiration date
          </label>
          <div className="bg-white px-4 py-3.5 border border-gray-200 rounded-xl shadow-xs focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
            <div id="card_expiry_element">
              <CardExpiryElement options={{ ...elementStyles }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <label htmlFor="card_cvc_element" className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
            Security code
          </label>
          <div className="relative bg-white px-4 py-3.5 border border-gray-200 rounded-xl shadow-xs focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
            <div id="card_cvc_element">
              <CardCvcElement options={{ ...elementStyles }} />
            </div>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none opacity-50">
              <svg className="h-4.5 w-6 text-gray-500" viewBox="0 0 24 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="12" x="2" y="2" rx="2" />
                <path d="M2 6h20" />
                <circle cx="18" cy="11" r="1.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="text-red-500 text-xs font-semibold bg-red-50 p-3 rounded-xl border border-red-100">
          {error}
        </div>
      )}

      {/* Pay Button - Green Primary matching website */}
      <div className="pt-4 border-t border-gray-100 flex flex-col space-y-4">
        <button
          type="submit"
          disabled={!stripe || processing}
          className="w-full py-3.5 bg-primary hover:bg-primary/90 text-white font-extrabold rounded-xl text-sm transition-all shadow-md disabled:opacity-50 text-center cursor-pointer flex items-center justify-center"
        >
          {processing ? 'Processing...' : `Pay $${price.toFixed(2)}`}
        </button>

        <div className="flex items-center justify-between text-[11px] text-gray-400 font-semibold px-1">
          <div className="flex items-center text-green-600">
            <ShieldCheck size={14} className="mr-1" />
            <span>Secured by Stripe</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 transition-colors font-bold border-none bg-transparent cursor-pointer"
          >
            Cancel Payment
          </button>
        </div>
      </div>
    </form>
  );
}

export default function PurchaseCredit() {
  const { user, token, updateUser } = useAuth();
  const [activePackage, setActivePackage] = React.useState<{ credits: number; price: number } | null>(null);

  const title = "Credit Packages";
  const subtitle = "Select a package to purchase credits and start supporting creators today.";
  const frequencies = ["one-time", "yearly"];

  const tiers: PricingTier[] = [
    {
      name: "Starter Pack",
      price: { "one-time": 10, "yearly": 9 },
      credits: 100,
      description: "Ideal for starting out and making small contributions.",
      features: ["Basic support access", "No transaction fees", "Email receipts"]
    },
    {
      name: "Supporter Pack",
      price: { "one-time": 25, "yearly": 22 },
      credits: 300,
      popular: true,
      description: "Most popular choice for regular campaign supporters.",
      features: ["Community badge", "Prioritized updates on supported campaigns", "No transaction fees"]
    },
    {
      name: "Super Backer",
      price: { "one-time": 60, "yearly": 54 },
      credits: 800,
      description: "Perfect for active backers looking to fund major milestones.",
      features: ["Community badge", "Early-access to creator previews", "Exclusive profile highlight", "No transaction fees"]
    },
    {
      name: "Patron Level",
      price: { "one-time": 110, "yearly": 99 },
      credits: 1500,
      description: "Our premium package for serious patrons of crowd-funding.",
      features: ["All previous features", "Direct creator messaging channel", "Founder level community status", "No transaction fees"]
    }
  ];

  const [selectedFrequency, setSelectedFrequency] = React.useState(frequencies[0]);

  if (user?.role !== 'Supporter') return <div className="p-6 text-red-500">Unauthorized</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <section className="flex flex-col items-center gap-10 py-10">
        <div className="space-y-7 text-center">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold md:text-5xl text-gray-900 font-sans tracking-tight">{title}</h1>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">{subtitle}</p>
            <p className="text-xs text-primary font-bold tracking-wide uppercase mt-1">Conversion rate: 10 Credits = $1</p>
          </div>
          <div className="mx-auto flex w-fit rounded-full bg-gray-100 p-1 border border-gray-200 shadow-sm">
            {frequencies.map((freq) => (
              <Tab
                key={freq}
                text={freq}
                selected={selectedFrequency === freq}
                setSelected={setSelectedFrequency}
                discount={freq === "yearly"}
              />
            ))}
          </div>
        </div>

        <div className="grid w-full max-w-6xl gap-8 sm:grid-cols-2 xl:grid-cols-4 pt-4">
          {tiers.map((tier) => (
            <PricingCard
              key={tier.name}
              tier={tier}
              paymentFrequency={selectedFrequency}
              onSelect={(credits, price) => {
                setActivePackage({ credits, price });
              }}
            />
          ))}
        </div>
      </section>

      {/* Stripe Payment Modal */}
      {activePackage && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-100 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setActivePackage(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full border-none bg-transparent cursor-pointer"
            >
              <X size={20} />
            </button>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Complete Payment</h3>
            <p className="text-sm text-gray-500 mb-6 font-medium">
              Purchasing <span className="text-primary font-bold">{activePackage.credits} Credits</span> for <span className="text-gray-800 font-bold">${activePackage.price}</span>
            </p>
            <Elements stripe={stripePromise}>
              <CheckoutForm
                price={activePackage.price}
                credits={activePackage.credits}
                token={token || ''}
                onClose={() => setActivePackage(null)}
                onSuccess={(newCredits) => {
                  if (user) {
                    updateUser({ ...user, credits: newCredits });
                  }
                  setActivePackage(null);
                }}
              />
            </Elements>
          </div>
        </div>
      )}
    </div>
  );
}
