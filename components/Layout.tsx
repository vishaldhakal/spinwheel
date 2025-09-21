import Image from "next/image";
import React from "react";
import Link from "next/link";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-800">
      <header className="w-full bg-[#fff0f0] shadow-md p-4 flex justify-center items-center">
        <Link href="/" className="flex flex-col items-center">
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/e/e5/Vivo_mobile_logo.png"
            alt="Vivo Logo"
            width={100}
            height={50}
            className="object-contain"
          />
        </Link>
      </header>

      <main className="flex-grow flex flex-col justify-center items-center p-8 bg-gradient-to-b from-[#fff0f0] to-white">
        {children}
      </main>

      <footer className="w-full bg-[#fff0f0] py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-[#ff9999] mb-8">
            Your Journey to Winning
          </h2>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-[#ffcccc]"></div>

            {/* Road Map Items */}
            <div className="space-y-12">
              {/* How to Participate */}
              <div className="relative">
                <div className="absolute left-1/2 transform -translate-x-1/2 -mt-3">
                  <div className="w-6 h-6 bg-[#ff9999] rounded-full border-4 border-white"></div>
                </div>
                <div className="ml-8 bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-bold text-[#ff9999] mb-2">
                    How to Participate?
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-gray-600">
                    <li>Log in with a QR code or link.</li>
                    <li>Tap on the spinning wheel.</li>
                    <li>For mobile, use the IMEI number.</li>
                    <li>
                      Get the lucky draw result immediately after spinning the
                      wheel.
                    </li>
                  </ul>
                </div>
              </div>

              {/* Redeem Conditions */}
              <div className="relative">
                <div className="absolute left-1/2 transform -translate-x-1/2 -mt-3">
                  <div className="w-6 h-6 bg-[#ff9999] rounded-full border-4 border-white"></div>
                </div>
                <div className="mr-8 ml-auto bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-bold text-[#ff9999] mb-2">
                    Redeem Conditions
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-gray-600">
                    <li>
                      Make sure your Vivo device is activated, and have both the
                      warranty card and invoice bill available.
                    </li>
                    <li>Contact your retailer to avail the scheme.</li>
                  </ul>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="relative">
                <div className="absolute left-1/2 transform -translate-x-1/2 -mt-3">
                  <div className="w-6 h-6 bg-[#ff9999] rounded-full border-4 border-white"></div>
                </div>
                <div className="ml-8 bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-bold text-[#ff9999] mb-2">
                    Terms and Conditions
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-gray-600">
                    <li>
                      All Vivo devices purchased during the campaign period are
                      eligible for the contest.
                    </li>
                    <li>
                      Winners must claim their prize within 15 working days
                      after the results are published, otherwise, the prize will
                      be forfeited.
                    </li>
                    <li>
                      Winners must provide a copy of their citizenship, driving
                      license, or passport, along with verification documents
                      such as the warranty card or IMEI number for claiming the
                      prize.
                    </li>
                    <li>
                      Vivo Nepal reserves the right to cancel this offer if any
                      suspicious activity is detected.
                    </li>
                    <li>
                      The company reserves the right to disqualify any user who
                      does not meet the criteria of this offer.
                    </li>
                    <li>
                      Prizes won through this offer cannot be transferred or
                      returned.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center mt-12 text-sm text-gray-500">
            © {new Date().getFullYear()} Vivo Lucky Draw. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
