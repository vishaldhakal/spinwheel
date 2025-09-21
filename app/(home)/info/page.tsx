import { Suspense } from "react";
import InfoForm from "./InfoForm";

interface Organization {
  id: number;
  name: string;
  logo: string | null;
}

interface OrganizationData {
  id: number;
  name: string;
  organization: Organization;
  background_image: string;
}

async function getOrganizationData(): Promise<OrganizationData | null> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/offers/get-organization/?organization_id=${process.env.NEXT_PUBLIC_ORGANIZATION_ID}`,
      { next: { revalidate: 60 } } // Revalidate every 60 seconds
    );
    if (!response.ok) {
      throw new Error("Failed to fetch organization data");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching organization data:", error);
    return null;
  }
}

export default async function InfoPage() {
  const orgData = await getOrganizationData();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InfoForm initialOrgData={orgData} />
    </Suspense>
  );
}
