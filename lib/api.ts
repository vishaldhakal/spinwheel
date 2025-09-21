// lib/api.ts

import { ApiResponse } from "@/app/types/luckyDraw";

export async function fetchLuckyDraws(): Promise<ApiResponse> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/offers/lucky-draw-systems/`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch lucky draws");
  }

  return await response.json();
}
