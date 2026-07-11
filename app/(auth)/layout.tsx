import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="absolute top-4 left-4">
        <Link href="/" className="flex items-center text-gray-500 hover:text-primary transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" /> Back to Home
        </Link>
      </div>
      {children}
    </div>
  );
}
