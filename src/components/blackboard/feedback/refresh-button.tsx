"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Loader2 } from "lucide-react";

interface RefreshButtonProps {
  action: () => Promise<any>;
}

export function RefreshButton({ action }: RefreshButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = async () => {
    setIsLoading(true);
    await action();
    setIsLoading(false);
  };

  return (
    <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
      {isLoading ? (
        <Loader2 className="size-3 animate-spin" />
      ) : (
        <RefreshCw className="size-3" />
      )}
      {isLoading ? "Loading..." : "Refresh"}
    </Button>
  );
}
