"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getUserCount } from "@/actions/user-count";
import { Copy, Loader } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

const prices = [
  {
    id:
      process.env.NODE_ENV === "development"
        ? "prod_3Ig5H7S7MJsXE6nTYlzcAu"
        : "prod_1yBt3p2qkG3Z9sREp6PsH8", // prod id Personal website
    name: "Publish your profile",
    description:
      "Share your profile and reserve your profile URL - fed.fan/username",
    yearlyPrice: 2900,
    anchorPrice: 5900,
    isMostPopular: true,
    interval: "lifetime" as const,
  },
];

const Badge = ({ type }: { type: "personal" | "business" }) => (
  <span
    className={cn(
      "text-xs font-semibold mr-2 px-2.5 py-0.5 rounded",
      type === "personal"
        ? "bg-blue-100 text-blue-800"
        : "bg-green-100 text-green-800"
    )}
  >
    {type === "personal" ? "Personal" : "Business"}
  </span>
);

function PaymentButton({ productId }: { productId: string }) {
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

function CopyButton() {
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
}

export async function PayToShare() {
  const response = await getUserCount();
  const userCount = response?.data?.data || 0;

  return (
    <div className="mt-4 space-y-3">
      {prices.map((price) => (
        <Card
          key={price.id}
          className={cn(
            "relative border shadow-sm hover:shadow-md transition-shadow",
            price.isMostPopular && "border-primary ring-1 ring-primary"
          )}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  {price.name}
                </CardTitle>
                <CardDescription className="text-sm mt-0.5">
                  {price.description}
                </CardDescription>
              </div>
              <div className="text-right">
                <span className="text-sm font-medium line-through text-muted-foreground">
                  ${(price.anchorPrice / 100).toFixed(0)}
                </span>
                <div className="text-2xl font-semibold">
                  ${(price.yearlyPrice / 100).toFixed(0)}
                  <span className="text-xs text-muted-foreground ml-1">
                    /{price.interval}
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <PaymentButton productId={price.id} />
          </CardContent>
          <CardFooter>
            <div className="w-full p-4 rounded-lg border-2 border-dashed border-primary/60 bg-primary/5">
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-foreground">
                    <span className="font-semibold text-primary">
                      Limited time offer:
                    </span>{" "}
                    First{" "}
                    <span className="font-semibold text-green-500">25</span>{" "}
                    users get access completely{" "}
                    <span className="font-semibold">FREE</span>!
                  </p>
                  <p className="text-sm font-medium text-primary text-center mt-4">
                    Only{" "}
                    <span className="font-semibold text-red-500 animate-pulse">
                      {25 - userCount}
                    </span>{" "}
                    spots remaining
                  </p>
                </div>

                <div className="relative">
                  <CopyButton />
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

export default PayToShare;
