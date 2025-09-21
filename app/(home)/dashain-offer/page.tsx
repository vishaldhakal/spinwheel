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

// Utility functions
const sanitizeHtml = (html: string) => ({
  __html: DOMPurify.sanitize(html, {
    ADD_TAGS: ["iframe"],
    ADD_ATTR: ["allow", "allowfullscreen", "frameborder", "scrolling"],
  }),
});

const getOrganizationData = async (): Promise<OrganizationData | null> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/offers/get-organization/?organization_id=${process.env.NEXT_PUBLIC_ORGANIZATION_ID}`,
      { next: { revalidate: 60 } }
    );
    if (!response.ok) throw new Error("Failed to fetch data");
    return await response.json();
  } catch (err) {
    console.error(err);
    return null;
  }
};

// Components
const LoadingState = () => (
  <div className="min-h-screen flex items-center justify-center bg-organization-secondary">
    <div className="text-organization-primary font-bold text-xl">
      Loading...
    </div>
  </div>
);

const Header = ({ logo, name }: { logo: string | null; name: string }) => (
  <header className="w-full shadow-md p-4 flex justify-center sticky top-0 z-10 items-center bg-organization-secondary">
    <Link href="/" className="flex items-center">
      {logo && (
        <Image
          src={logo}
          alt={`${name} Logo`}
          width={180}
          height={90}
          className="object-contain"
        />
      )}
    </Link>
  </header>
);

const HeroSection = ({ data }: { data: OrganizationData }) => (
  <div
    className="flex-grow flex flex-col justify-center items-center md:p-8 bg-cover bg-center bg-no-repeat"
    style={{
      backgroundImage: data.background_image
        ? `url(${data.background_image})`
        : "none",
    }}
  >
    <div className="w-full max-w-6xl mx-auto rounded-lg bg-opacity-90 px-4 pt-8 pb-0">
      {data.main_offer_stamp_image && (
        <div className="flex justify-center mb-8">
          <Image
            src={data.main_offer_stamp_image}
            alt="Main Offer Stamp"
            width={400}
            height={400}
            className="object-contain"
          />
        </div>
      )}

      <div className="text-center relative mb-12">
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-4 text-white">
          {data.hero_title || data.name}
        </h1>
        <div className="text-[12px] mb-8 text-white prose prose-invert max-w-none content-area">
          {data.description ? (
            <div dangerouslySetInnerHTML={sanitizeHtml(data.description)} />
          ) : (
            "Details coming soon..."
          )}
        </div>
      </div>

      <div className="mb-20 md:mb-40">
        <img
          src="phones.jpg"
          alt="Lucky Draw Illustration"
          className="rounded-lg w-full min-w-[100%] mx-auto mb-10"
        />
        <h1
          className="text-2xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-4 text-white text-center"
          style={{
            textShadow: "0 3px 20px rgba(255,255,255,1)",
          }}
        >
          Available in Stores Near You
        </h1>
      </div>

      {data.hero_image && (
        <div className="relative w-full mx-auto">
          <img
            src={data.hero_image}
            alt="Lucky Draw Illustration"
            className="rounded-lg w-full min-w-[100%] mx-auto"
          />
        </div>
      )}
    </div>
  </div>
);

const MainContent = ({ data }: { data: OrganizationData }) => (
  <main className="flex-grow flex flex-col justify-center items-center p-8 bg-organization-secondary mt-10">
    <div className="w-full max-w-6xl mx-auto rounded-lg">
      {data.qr && (
        <div className="flex justify-center mb-8">
          <Image
            src={data.qr}
            alt="QR Code"
            width={200}
            height={200}
            className="object-contain"
          />
        </div>
      )}

      <div className="mb-12">
        <h2 className="text-3xl font-bold mb-4 text-organization-primary">
          How to Participate
        </h2>
        <div
          className="text-organization-primary-700 prose max-w-none content-area"
          dangerouslySetInnerHTML={sanitizeHtml(
            data.how_to_participate || "Details coming soon..."
          )}
        />
      </div>

      <div className="mb-12">
        <h2 className="text-3xl font-bold mb-4 text-organization-primary">
          Redeem Conditions
        </h2>
        <div
          className="text-organization-primary-700 prose max-w-none content-area"
          dangerouslySetInnerHTML={sanitizeHtml(
            data.redeem_condition || "Details coming soon..."
          )}
        />
      </div>

      <div>
        <h2 className="text-3xl font-bold mb-4 text-organization-primary">
          Terms and Conditions
        </h2>
        <div
          className="text-organization-primary-700 prose max-w-none content-area"
          dangerouslySetInnerHTML={sanitizeHtml(
            data.terms_and_conditions || "Details coming soon..."
          )}
        />
      </div>
    </div>
  </main>
);

const Footer = ({ name }: { name: string }) => (
  <footer className="w-full py-8 px-4 bg-organization-primary">
    <div className="max-w-6xl mx-auto text-center text-organization-secondary">
      <p>
        © {new Date().getFullYear()} {name}. All rights reserved.
      </p>
    </div>
  </footer>
);

// Custom CSS
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
`;

export default function Home() {
  const [data, setData] = useState<OrganizationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getOrganizationData().then((result) => {
      setData(result);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) return <LoadingState />;
  if (!data)
    return (
      <div className="min-h-screen flex items-center justify-center bg-organization-secondary">
        <div className="text-organization-primary font-bold text-xl">
          No data available
        </div>
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col bg-organization-secondary">
      <style>{customStyles}</style>
      <Header logo={data.organization.logo} name={data.organization.name} />
      <HeroSection data={data} />
      <MainContent data={data} />
      <Footer name={data.organization.name} />
    </div>
  );
}
