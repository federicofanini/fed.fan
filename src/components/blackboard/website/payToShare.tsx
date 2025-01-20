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
import { Badge } from "@/components/ui/badge";

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
    <div className="border border-b-0 grid grid-rows-1 mt-4 rounded-lg">
      <div className="grid grid-cols-1 lg:grid-cols-3">
        {siteConfig.pricing.map((tier) => (
          <div
            key={tier.name}
            className={cn(
              "outline-focus transition-transform-background relative z-10 box-border grid h-full w-full overflow-hidden text-foreground motion-reduce:transition-none lg:border-r border-t last:border-r-0",
              tier.popular ? "border-primary border-l" : "border-muted"
            )}
          >
            <div className="flex flex-col h-full">
              <CardHeader className="border-b p-4 grid grid-rows-2 h-fit">
                <CardTitle className="flex items-center justify-between">
                  <span className="text-md font-semibold">{tier.name}</span>
                  {tier.popular && (
                    <Badge
                      variant="default"
                      className="hover:bg-primary/50 font-bold"
                    >
                      Hot deal 🔥
                    </Badge>
                  )}
                </CardTitle>
                <div className="pt-2 text-3xl font-bold">
                  <span className="text-[18px] font-medium line-through text-muted-foreground mr-2">
                    {tier.price_anchor}
                  </span>
                  {tier.price.yearly}
                  <span className="text-sm font-medium text-muted-foreground">
                    / {tier.frequency.yearly}
                  </span>
                </div>
                <p className="text-[15px] font-medium text-muted-foreground">
                  {tier.description}
                </p>
              </CardHeader>

              <CardContent className="flex-grow p-4 pt-5">
                <ul className="space-y-2">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="mr-2 size-4 text-green-500" />
                      <span className="font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <Button
                size="lg"
                className={cn(
                  "w-full rounded-none shadow-none",
                  tier.popular
                    ? "bg-primary text-primary-foreground hover:bg-secondary-foreground"
                    : "bg-muted text-foreground hover:bg-muted/80"
                )}
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
                    <Sparkles className="size-4 mr-2" />
                    {tier.cta}
                  </div>
                )}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PayToShare;
