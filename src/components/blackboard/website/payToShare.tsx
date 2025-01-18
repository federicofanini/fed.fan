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
import { Copy, Loader } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { getUserCount } from "@/actions/user-count";

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

export function PayToShare() {
  const [isLoading, setIsLoading] = useState(false);
  const [userCount, setUserCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    async function fetchUserCount() {
      const response = await getUserCount();
      if (response?.data?.success) {
        setUserCount(response.data.data);
      }
    }
    fetchUserCount();
  }, []);

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
      console.error("Error creating checkout session:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
            <Button
              className="w-full font-medium"
              disabled={isLoading}
              onClick={() => onSubscribeClick(price.id)}
            >
              {isLoading ? (
                <>
                  <Loader className="mr-2 h-3.5 w-3.5 animate-spin" />
                  Processing...
                </>
              ) : (
                "Get your username"
              )}
            </Button>
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
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-sm font-medium bg-background hover:bg-primary/10 border-primary/30 hover:border-primary transition-colors flex items-center justify-center gap-2"
                    onClick={() => {
                      navigator.clipboard.writeText("FREE");
                      toast.success(
                        "Copied discount code - use 'FREE' at checkout for 100% off!"
                      );
                    }}
                  >
                    <span>Click to copy discount code:</span>
                    <code className="font-mono font-bold text-primary">
                      FREE
                    </code>
                    <Copy className="h-4 w-4 text-primary/70" />
                  </Button>
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
