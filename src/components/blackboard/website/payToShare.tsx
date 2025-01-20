"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Check, Loader, Sparkles } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { siteConfig } from "@/lib/config";

export function PayToShare() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onSubscribeClick = async (productId: string) => {
    setIsLoading(true);
    try {
      const { data } = await axios.post(
        "/api/creem/checkout",
        { productId },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (data.success) {
        router.push(data.checkout.checkout_url);
      } else {
        toast.error("Failed to create checkout session");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          toast.error("Please sign in to continue");
          router.push("/login");
        } else {
          toast.error(
            error.response?.data?.message || "Error creating checkout session"
          );
        }
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-4 grid gap-4">
      {siteConfig.pricing.map((tier) => (
        <Card
          key={tier.name}
          className={cn(
            "relative border shadow-sm",
            tier.popular && "border-primary"
          )}
        >
          <CardHeader className="space-y-2">
            <CardTitle className="flex items-center justify-between">
              <span className="text-lg font-semibold">{tier.name}</span>
              <div className="text-right">
                <span className="text-sm font-medium line-through text-muted-foreground mr-2">
                  {tier.price_anchor}
                </span>
                <span className="text-2xl font-bold">
                  {tier.price.yearly}
                  <span className="text-sm text-muted-foreground">
                    /{tier.frequency.yearly}
                  </span>
                </span>
              </div>
            </CardTitle>
            <p className="text-sm text-muted-foreground">{tier.description}</p>
          </CardHeader>

          <CardContent className="space-y-4">
            <ul className="space-y-2">
              {tier.features.map((feature, i) => (
                <li key={i} className="flex items-center text-sm">
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  {feature}
                </li>
              ))}
            </ul>

            <Button
              className="w-full font-medium"
              disabled={isLoading}
              onClick={() => onSubscribeClick(tier.id)}
            >
              {isLoading ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <div className="flex items-center justify-center">
                  <Sparkles className="mr-2 h-4 w-4" />
                  {tier.cta}
                </div>
              )}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default PayToShare;
