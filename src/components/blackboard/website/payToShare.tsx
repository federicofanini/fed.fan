"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Loader } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";

const prices = [
  {
    id:
      process.env.NODE_ENV === "development"
        ? "prod_3Ig5H7S7MJsXE6nTYlzcAu"
        : "prod_3Ig5H7S7MJsXE6nTYlzcAu",
    name: "Professional Profile",
    description: "Share your professional profile with the world",
    features: [
      { text: "Custom profile URL", type: "personal" },
      { text: "Professional portfolio page", type: "personal" },
      { text: "Share with recruiters", type: "personal" },
      { text: "Analytics dashboard", type: "business" },
      { text: "SEO optimization", type: "business" },
    ],
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
      console.error("Error creating checkout session:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {prices.map((price) => (
        <Card
          key={price.id}
          className={cn(
            "relative border-2",
            price.isMostPopular && "border-[var(--color-one)]"
          )}
        >
          <CardHeader>
            <CardTitle>{price.name}</CardTitle>
            <CardDescription>{price.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-row gap-1 items-center"
            >
              <span className="text-xl font-semibold line-through text-gray-500">
                ${(price.anchorPrice / 100).toFixed(0)}
              </span>
              <span className="text-4xl font-bold">
                ${(price.yearlyPrice / 100).toFixed(0)}
                <span className="text-xs"> / {price.interval}</span>
              </span>
            </motion.div>

            <Button
              className={cn(
                "w-full gap-2",
                "transform-gpu transition-all duration-300",
                "hover:ring-2 hover:ring-primary hover:ring-offset-2"
              )}
              disabled={isLoading}
              onClick={() => onSubscribeClick(price.id)}
            >
              {isLoading ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Upgrade Now"
              )}
            </Button>

            <ul className="space-y-2">
              {price.features.map((feature, idx) => (
                <li key={idx} className="flex items-center text-sm">
                  <Badge type={feature.type as "personal" | "business"} />
                  {feature.text}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default PayToShare;
