"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getUserCount } from "@/actions/user-count";
import { USERS_DISCOUNT_LIMIT } from "@/lib/config";
import { Gift, LampDesk } from "lucide-react";

export function JoinCTA() {
  const [userCount, setUserCount] = useState<number>(0);
  const remainingFreeSlots = USERS_DISCOUNT_LIMIT - userCount;
  const hasRemainingSlots = remainingFreeSlots > 0;

  useEffect(() => {
    async function fetchUserCount() {
      const response = await getUserCount();
      if (response?.data?.success) {
        setUserCount(response.data.data);
      }
    }
    fetchUserCount();
  }, []);

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-2">
      {hasRemainingSlots && (
        <Link
          href="/"
          className="rounded-full bg-secondary px-4 py-1 text-xs backdrop-blur-sm flex items-center gap-1 font-semibold"
        >
          <LampDesk className="size-3.5" />
          Build your page
        </Link>
      )}
    </div>
  );
}

{
  /* 
<span className="font-medium text-green-500 flex items-center gap-1">
            <Gift className="size-3.5 animate-pulse" />
            50% OFF
          </span>{" "}
          <span className="text-xs font-bold">{remainingFreeSlots}</span> spots
          left

*/
}
