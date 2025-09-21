"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import DOMPurify from "dompurify";

// Types
interface Organization {
  id: number;
  name: string;
  logo: string | null;
  address: string;
}

interface OrganizationData {
  id: number;
  name: string;
  description: string;
  background_image: string;
  hero_image: string;
  hero_title: string;
  hero_subtitle: string;
  how_to_participate: string;
  redeem_condition: string;
  terms_and_conditions: string;
  organization: Organization;
  main_offer_stamp_image: string | null;
  qr: string | null;
}

// Utility function to sanitize HTML
const sanitizeHtml = (html: string) => ({
  __html: DOMPurify.sanitize(html, {
    ADD_TAGS: ["iframe"],
    ADD_ATTR: ["allow", "allowfullscreen", "frameborder", "scrolling"],
  }),
});

// Loading state component
const LoadingState = () => (
  <div className="min-h-screen flex items-center justify-center bg-organization-secondary">
    <div className="text-organization-primary font-bold text-xl">
      Loading...
    </div>
  </div>
);

// Function to fetch organization data
async function getOrganizationData(): Promise<OrganizationData | null> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/offers/get-organization/?organization_id=${process.env.NEXT_PUBLIC_ORGANIZATION_ID}`,
      { next: { revalidate: 60 } }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    return await response.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}

// Custom CSS for ensuring list styles are applied and adding modern styling
const customStyles = `
  .content-area ul {
    list-style-type: disc !important;
    padding-left: 2em !important;
  }
  .content-area ol {
    list-style-type: decimal !important;
    padding-left: 2em !important;
  }
  .content-area ul ul, .content-area ol ul {
    list-style-type: circle !important;
  }
  .content-area ul ol, .content-area ol ol {
    list-style-type: lower-alpha !important;
  }
  .content-area li {
    margin-bottom: 0.5em !important;
  }
  .hero-gradient {
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.4));
  }
  .content-card {
    transition: all 0.3s ease;
  }
  .content-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  }
`;

export const revalidate = 10;

export default function Home() {
  const [data, setData] = useState<OrganizationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getOrganizationData().then((result) => {
      setData(result);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return <LoadingState />;
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-organization-secondary">
        <div className="text-organization-primary font-bold text-xl">
          No data available
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-organization-secondary">
      <style>{customStyles}</style>
      {/* Header */}
      <header className="w-full shadow-lg p-2 flex justify-center sticky top-0 z-10 items-center bg-organization-secondary backdrop-blur-sm bg-opacity-95 transition-all duration-300">
        <Link
          href="/"
          className="flex items-center transform hover:scale-105 transition-transform duration-300"
        >
          {data.organization.logo && (
            <Image
              src={data.organization.logo}
              alt={`${data.organization.name} Logo`}
              width={100}
              height={40}
              className="object-contain w-auto h-[60px]"
            />
          )}
        </Link>
      </header>

      {/* Hero Section with Background Image */}
      <div
        className="relative flex-grow flex flex-col justify-center items-center min-h-[90vh] bg-cover bg-center bg-fixed bg-no-repeat"
        style={{
          backgroundImage: data.background_image
            ? `url(${data.background_image})`
            : "none",
        }}
      >
        <div className="absolute inset-0 hero-gradient"></div>
        <div className="relative w-full max-w-6xl mx-auto px-4 py-8 md:py-16">
          {/* Main Offer Stamp Image */}
          {data.main_offer_stamp_image && (
            <div className="flex justify-center mb-8 md:mb-12 animate-float">
              <Image
                src={data.main_offer_stamp_image}
                alt="Main Offer Stamp"
                width={150}
                height={150}
                className="object-contain drop-shadow-2xl w-[120px] h-[120px] md:w-[150px] md:h-[150px]"
              />
            </div>
          )}

          <div className="text-center relative mb-8 md:mb-16 space-y-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight text-white drop-shadow-lg max-w-4xl mx-auto">
              {data.hero_title || data.name}
            </h1>

            <div className="flex justify-center space-x-6 mt-4">
              <Link
                href="/info"
                className="inline-flex items-center px-6 md:px-8 py-3 md:py-4 border-2 border-green-600 text-lg md:text-xl font-medium rounded-full text-white bg-green-600 hover:bg-green-700 hover:border-green-700 transition duration-300 ease-in-out transform hover:scale-105 shadow-xl"
              >
                Participate Now
              </Link>
            </div>
          </div>

          {data.hero_image && (
            <div className="relative w-full max-w-lg mx-auto mt-8">
              <div className="aspect-w-9 aspect-h-9">
                <img
                  src={data.hero_image}
                  alt="Lucky Draw Illustration"
                  className="rounded-2xl w-full h-full object-cover transform hover:scale-[1.02] transition-transform duration-500"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow flex flex-col justify-center items-center py-12 md:py-20 px-4 bg-organization-secondary">
        <div className="w-full max-w-6xl mx-auto">
          {/* QR Code */}
          {data.qr && (
            <div className="flex justify-center mb-12 md:mb-16">
              <div className="p-4 md:p-6 bg-white rounded-2xl shadow-xl">
                <Image
                  src={data.qr}
                  alt="QR Code"
                  width={150}
                  height={150}
                  className="object-contain w-[120px] h-[120px] md:w-[150px] md:h-[150px]"
                />
              </div>
            </div>
          )}

          {/* Content Sections */}
          <div className="grid gap-12">
            {/* How to Participate */}
            <div className="content-card bg-white rounded-2xl p-8 shadow-xl">
              <h2 className="text-4xl font-bold mb-6 text-organization-primary border-b-2 border-organization-primary pb-4">
                How to Participate
              </h2>
              <div
                className="text-organization-primary-700 prose max-w-none content-area text-lg leading-relaxed"
                dangerouslySetInnerHTML={sanitizeHtml(
                  data.how_to_participate || "Details coming soon..."
                )}
              />
            </div>

            {/* Redeem Conditions */}
            <div className="content-card bg-white rounded-2xl p-8 shadow-xl">
              <h2 className="text-4xl font-bold mb-6 text-organization-primary border-b-2 border-organization-primary pb-4">
                Redeem Conditions
              </h2>
              <div
                className="text-organization-primary-700 prose max-w-none content-area text-lg leading-relaxed"
                dangerouslySetInnerHTML={sanitizeHtml(
                  data.redeem_condition || "Details coming soon..."
                )}
              />
            </div>

            {/* Terms and Conditions */}
            <div className="content-card bg-white rounded-2xl p-8 shadow-xl">
              <h2 className="text-4xl font-bold mb-6 text-organization-primary border-b-2 border-organization-primary pb-4">
                Terms and Conditions
              </h2>
              <div
                className="text-organization-primary-700 prose max-w-none content-area text-lg leading-relaxed"
                dangerouslySetInnerHTML={sanitizeHtml(
                  data.terms_and_conditions || "Details coming soon..."
                )}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 px-4 bg-organization-primary">
        <div className="max-w-6xl mx-auto text-center text-organization-secondary">
          <p className="text-lg">
            © {new Date().getFullYear()} {data.organization.name}. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
