"use client";

import { Section } from "@/components/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { siteConfig, USERS_DISCOUNT_LIMIT } from "@/lib/config";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Check, Gift, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import OutlinedButton from "../ui/outlined-button";
import Link from "next/link";
import { getUserCount } from "@/actions/user-count";

interface TabsProps {
  activeTab: string;
  setActiveTab: (tab: "yearly" | "monthly") => void;
  className?: string;
  children: (activeTab: string) => React.ReactNode;
}

interface TabsListProps {
  children: React.ReactNode;
}

interface TabsTriggerProps {
  value: string;
  onClick: () => void;
  children: React.ReactNode;
  isActive: boolean;
}

const Tabs = ({ activeTab, setActiveTab, className, children }: TabsProps) => {
  return (
    <div
      className={cn(
        "mx-auto flex w-full items-center justify-center",
        className
      )}
    >
      {children(activeTab)}
    </div>
  );
};

const TabsList = ({ children }: TabsListProps) => {
  return (
    <div className="relative flex w-fit items-center rounded-full border p-1.5">
      {children}
    </div>
  );
};

const TabsTrigger = ({
  value,
  onClick,
  children,
  isActive,
}: TabsTriggerProps) => {
  return (
    <button
      onClick={onClick}
      className={cn("relative z-[1] px-4 py-2", { "z-0": isActive })}
    >
      {isActive && (
        <motion.div
          layoutId="active-tab"
          className="absolute inset-0 rounded-full bg-accent"
          transition={{
            duration: 0.2,
            type: "spring",
            stiffness: 300,
            damping: 25,
            velocity: 2,
          }}
        />
      )}
      <span
        className={cn(
          "relative block text-sm font-medium duration-200",
          isActive ? "delay-100 text-primary" : ""
        )}
      >
        {children}
      </span>
    </button>
  );
};

function PricingTier({
  tier,
  billingCycle,
}: {
  tier: (typeof siteConfig.pricing)[0];
  billingCycle: "monthly" | "yearly";
}) {
  return (
    <div
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
            <motion.div
              key={tier.price[billingCycle]}
              initial={{
                opacity: 0,
                x: billingCycle === "yearly" ? -10 : 10,
                filter: "blur(5px)",
              }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              transition={{
                duration: 0.25,
                ease: [0.4, 0, 0.2, 1],
              }}
            >
              <span className="text-[18px] font-medium line-through text-muted-foreground mr-2">
                {tier.price_anchor}
              </span>
              {tier.price[billingCycle]}
              <span className="text-sm font-medium text-muted-foreground">
                / {tier.frequency[billingCycle]}
              </span>
            </motion.div>
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
        >
          <Link href="/login">
            {tier.popular ? (
              <div className="flex items-center justify-center">
                <Sparkles className="size-4 mr-2" />
                Get it now
              </div>
            ) : (
              tier.cta
            )}
          </Link>
        </Button>
      </div>
    </div>
  );
}

export function Pricing() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "yearly"
  );
  const [count, setCount] = useState<number>(0);

  const handleTabChange = (tab: "yearly" | "monthly") => {
    setBillingCycle(tab);
  };

  useEffect(() => {
    async function fetchCount() {
      const response = await getUserCount();
      if (response?.data?.data) {
        setCount(response.data.data);
      }
    }
    fetchCount();
  }, []);

  return (
    <Section id="pricing" title="Pricing">
      <div className="border border-b-0 grid grid-rows-1">
        <div className="grid grid-rows-1 gap-y-10 p-10">
          <div className="text-center">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-balance">
              Simple pricing for everyone.
            </h2>
            <p className="text-lg text-muted-foreground mt-4">
              Build your brand and connect with your network.
            </p>

            {/*<div className="mt-4 text-md sm:text-lg text-muted-foreground text-center font-mono">
              <p className="mt-8 text-xs text-muted-foreground text-center font-mono flex items-center justify-center gap-2">
                <span className="font-bold flex items-center justify-center text-green-500 border p-2 rounded-lg border-green-500/50">
                  <Gift className="w-4 h-4 mr-1 animate-pulse" />
                  50% OFF{" "}
                </span>{" "}
                for the first{" "}
                <span className="font-semibold text-primary">
                  {USERS_DISCOUNT_LIMIT}
                </span>{" "}
                founders{" "}
                <span className="font-semibold text-primary">
                  ({USERS_DISCOUNT_LIMIT - count} left)
                </span>{" "}
                .
              </p>
              <br />
              Get{" "}
              <span className="font-semibold text-primary space-y-8">
                lifetime access for{" "}
                <span className="text-sm font-medium line-through text-muted-foreground mr-2">
                  $59
                </span>
                <Badge className="bg-primary text-lg text-primary-foreground">
                  $29
                </Badge>
              </span>
              <br />
              <br />
            </div> */}
          </div>
          {/* <div className="flex items-center justify-center">
            <Link href="/login">
              <OutlinedButton>Launch your website</OutlinedButton>
            </Link>
          </div> */}
          {/* <Tabs
            activeTab={billingCycle}
            setActiveTab={handleTabChange}
            className="mx-auto w-full max-w-md"
          >
            {(activeTab) => (
              <TabsList>
                {["yearly", "monthly"].map((tab) => (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    onClick={() => handleTabChange(tab as "yearly" | "monthly")}
                    isActive={activeTab === tab}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    {tab === "yearly" && (
                      <span className="ml-2 text-xs font-semibold text-green-500">
                        Save 25%
                      </span>
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>
            )}
          </Tabs> */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3">
          {siteConfig.pricing.map((tier, index) => (
            <PricingTier key={index} tier={tier} billingCycle={billingCycle} />
          ))}
        </div>
      </div>
    </Section>
  );
}
