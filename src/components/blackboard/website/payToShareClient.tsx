"use client";

import { Button } from "@/components/ui/button";
import { Copy, Loader } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

interface PayToShareClientProps {
  productId: string;
}

export function PayToShareClient({ productId }: PayToShareClientProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        window.location.href = "/login";
        return;
      }

      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId: productId,
          userId: user.id,
        }),
      });

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Failed to initiate payment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handlePayment} className="w-full" disabled={isLoading}>
      {isLoading ? (
        <>
          <Loader className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        "Get Started"
      )}
    </Button>
  );
}

PayToShareClient.CopyButton = function CopyButton() {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText("FREE");
      setIsCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy code");
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="w-full font-mono"
      onClick={copyToClipboard}
    >
      Copy discount code: FREE
      <Copy className="ml-2 h-4 w-4" />
    </Button>
  );
};
