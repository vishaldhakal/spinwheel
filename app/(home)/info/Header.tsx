"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { OrganizationData } from "./types";

interface HeaderProps {
  initialOrgData: OrganizationData | null;
}

const Header: React.FC<HeaderProps> = ({ initialOrgData }) => {
  return (
    <header className="w-full p-4 flex justify-center items-center bg-white sticky top-0">
      <Link href="/" className="flex flex-col items-center">
        {initialOrgData?.organization.logo ? (
          <Image
            src={initialOrgData.organization.logo}
            alt={`${initialOrgData.organization.name} Logo`}
            width={100}
            height={50}
            className="object-contain"
          />
        ) : (
          <div className="w-[100px] h-[50px] bg-gray-200 flex items-center justify-center text-gray-500">
            Logo
          </div>
        )}
      </Link>
    </header>
  );
};

export default Header;
