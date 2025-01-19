"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { getUserCount } from "@/actions/user-count";
import { Dot, Sparkles } from "lucide-react";
import { ShinyButton } from "../ui/shiny-button";

export function JoinCTA() {
  const [userCount, setUserCount] = useState<number>(0);
  const remainingFreeSlots = 25 - userCount;
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
          className="rounded-full bg-secondary px-4 py-1 text-xs text-muted-foreground backdrop-blur-sm flex items-center gap-1"
        >
          <span className="font-medium text-green-500 flex items-center gap-1">
            <div className="w-2 h-2 rounded-full animate-pulse bg-green-500" />
            {remainingFreeSlots}
          </span>{" "}
          <span className="text-xs font-bold">FREE</span> spots remaining!
        </Link>
      )}
    </div>
  );
}
