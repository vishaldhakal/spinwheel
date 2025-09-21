"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import Header from "./Header";
import FormFields from "./FormFields";
import SubmissionResult from "./SubmissionResult";
import Swal from "sweetalert2";
import { FormData, SubmissionResponse, GiftItem, ErrorResponse } from "./types";
import { citiesOptions } from "./citiesOptions";

interface Organization {
  id: number;
  name: string;
  logo: string | null;
}

interface OrganizationData {
  id: number;
  name: string;
  background_image: string;
  organization: Organization;
}

const formSchema = z.object({
  customer_name: z.string().min(1, "Customer name is required"),
  phone_number: z.string().min(10, "Contact number must be at least 10 digits"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  shop_name: z.string().min(1, "Shop name is required"),
  sold_area: z.string().min(1, "Sold area is required"),
  imei: z.string().min(15, "IMEI must be at least 15 characters"),
  how_know_about_campaign: z.string().min(1, "This field is required"),
  region: z.string().optional(),
  other_campaign_source: z.string().optional(),
  profession: z.string().min(1, "Profession is required"),
  other_profession: z.string().optional(),
});

export default function InfoForm({
  initialOrgData,
}: {
  initialOrgData: OrganizationData | null;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResponse, setSubmissionResponse] =
    useState<SubmissionResponse | null>(null);
  const [giftList, setGiftList] = useState<GiftItem[]>([]);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/offers/customers/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...data,
            how_know_about_campaign:
              data.how_know_about_campaign === "Other"
                ? data.other_campaign_source
                : data.how_know_about_campaign,
            profession:
              data.profession === "Other"
                ? data.other_profession
                : data.profession,
            region: citiesOptions.find((city) => city.value === data.sold_area)
              ?.region,
            lucky_draw_system: initialOrgData?.id || 1,
          }),
        }
      );

      if (!response.ok) {
        const responseData: ErrorResponse = await response.json();
        Swal.fire({
          title: "Error!",
          text: responseData.error || "An unknown error occurred",
          icon: "error",
          confirmButtonText: "Ok",
        });
        throw new Error(responseData.error || "An unknown error occurred");
      }

      toast({
        title: "Form Submitted Successfully",
        description: "Your form has been submitted.",
      });

      const result: SubmissionResponse = await response.json();
      setSubmissionResponse(result);

      toast({
        title: "Form Submitted",
        description: "Your information has been successfully submitted.",
      });

      const giftListResponse = await fetch(
        `${
          process.env.NEXT_PUBLIC_BACKEND_URL
        }/api/offers/get-gift-list/?lucky_draw_system_id=${
          initialOrgData?.id || 3
        }`
      );

      if (!giftListResponse.ok) {
        throw new Error("Failed to fetch gift list");
      }

      const giftListData: GiftItem[] = await giftListResponse.json();

      // Add "Better Luck" gift item at the beginning of the list
      const betterLuckGift: GiftItem = {
        id: -1, // Use negative ID to distinguish from real gifts
        name: "Better Luck",
        image: "/betterlucknexttime.png",
        lucky_draw_system: initialOrgData?.id || 3,
      };

      // Add Better Luck as the first item (will be at the top of the wheel)
      setGiftList([betterLuckGift, ...giftListData]);
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col text-organization-primary bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${initialOrgData?.background_image})` }}
    >
      <Header initialOrgData={initialOrgData} />
      <main className="flex-grow flex flex-col justify-center items-center py-8 px-3">
        {!submissionResponse ? (
          <div className="bg-white rounded-lg max-w-md w-full shadow-lg p-8">
            <h2 className="text-xl md:text-3xl font-black mb-6 text-center text-organization-primary">
              Enter Your Details
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <FormFields
                register={register}
                errors={errors}
                control={control}
                watch={watch}
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-4 rounded-full font-bold text-lg uppercase tracking-wide bg-organization-primary text-organization-secondary hover:bg-organization-primary-700 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg mt-6"
              >
                {isSubmitting ? "Submitting..." : "Submit & Continue"}
              </button>
            </form>
          </div>
        ) : (
          <SubmissionResult
            submissionResponse={submissionResponse}
            giftList={giftList}
          />
        )}
      </main>
    </div>
  );
}
