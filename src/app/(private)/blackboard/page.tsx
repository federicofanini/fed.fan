"use client";

import {
  TrendingUp,
  Wallet,
  AudioLines,
  User,
  Book,
  Puzzle,
  Palette,
  ArrowUpRight,
  Timer,
} from "lucide-react";
import { fetchUsernameAction } from "@/actions/username/fetch";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";
import { useState, useEffect, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useMediaQuery } from "@/hooks/use-media-query";

const chartData = [
  { month: "Mon", views: 1234, uniques: 800 },
  { month: "Tue", views: 2463, uniques: 1200 },
  { month: "Wed", views: 1456, uniques: 900 },
  { month: "Thu", views: 1893, uniques: 1100 },
  { month: "Fri", views: 2408, uniques: 1500 },
  { month: "Sat", views: 3547, uniques: 2000 },
  { month: "Sun", views: 3612, uniques: 2100 },
];

const chartConfig = {
  views: {
    label: "Views",
    color: "hsl(var(--chart-1))",
  },
  uniques: {
    label: "Uniques",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export default function Blackboard() {
  const [username, setUsername] = useState("");
  const isMobile = useMediaQuery("(max-width: 768px)");

  const getFilteredChartData = useCallback(() => {
    if (isMobile) {
      // Show last 3 days on mobile
      return chartData.slice(-3);
    }
    return chartData;
  }, [isMobile]);

  useEffect(() => {
    async function fetchUsername() {
      const result = await fetchUsernameAction({});
      if (result?.data?.success && result?.data?.data) {
        setUsername(result.data.data.username || "");
      }
    }
    fetchUsername();
  }, []);

  return (
    <div className="container max-w-[1050px] py-12">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center w-full">
              <div className="flex items-center justify-between w-full sm:w-auto">
                Website analytics{" "}
                <Badge
                  variant="outline"
                  className="flex items-center gap-2 sm:ml-2"
                >
                  <Timer className="h-4 w-4" />
                  coming soon
                </Badge>
              </div>
              <Badge
                variant="outline"
                className="font-bold text-base sm:text-lg border-none"
              >
                <Link
                  href={`https://fed.fan/${username}`}
                  target="_blank"
                  className="flex items-center gap-1"
                >
                  <span className="text-muted-foreground">fed.fan/</span>
                  {username}
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardDescription className="text-center sm:text-left sm:mx-6">
          Monday - Sunday, 2025
        </CardDescription>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={getFilteredChartData()}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dashed" />}
              />
              <Bar dataKey="views" fill="var(--color-views)" radius={4} />
              <Bar dataKey="uniques" fill="var(--color-uniques)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
        {/* <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none">
            Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">
            Showing total visitors for the last 7 months
          </div>
        </CardFooter> */}
      </Card>

      {/* <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <div className="p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <Wallet className="h-6 w-6 text-primary" />
            <h3 className="text-xl font-semibold">Save money</h3>
          </div>
          <p className="text-muted-foreground mb-4">
            No need to pay for multiple subscriptions. Get everything you need
            in one place.
          </p>
        </div>

        <div className="p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <AudioLines className="h-6 w-6 text-primary" />
            <h3 className="text-xl font-semibold">Sync data</h3>
          </div>
          <p className="text-muted-foreground mb-4">
            Automatically sync data across tools for better insights and
            analytics.
          </p>
        </div>

        <div className="p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <User className="h-6 w-6 text-primary" />
            <h3 className="text-xl font-semibold">One account</h3>
          </div>
          <p className="text-muted-foreground mb-4">
            Access all of your creator tools from one place with a single login.
          </p>
        </div>

        <div className="p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <Book className="h-6 w-6 text-primary" />
            <h3 className="text-xl font-semibold">Easy to learn</h3>
          </div>
          <p className="text-muted-foreground mb-4">
            Tools that are easy to use on their own and work seamlessly
            together.
          </p>
        </div>

        <div className="p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <Puzzle className="h-6 w-6 text-primary" />
            <h3 className="text-xl font-semibold">Simple integration</h3>
          </div>
          <p className="text-muted-foreground mb-4">
            No more wasted time trying to string together lots of different
            tools.
          </p>
        </div>

        <div className="p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <Palette className="h-6 w-6 text-primary" />
            <h3 className="text-xl font-semibold">Cohesive brand</h3>
          </div>
          <p className="text-muted-foreground mb-4">
            Find tools, resources, and community for creators all in one place.
          </p>
        </div>
      </div> */}

      <div className="mt-12 text-center">
        <p className="text-muted-foreground">
          Everything you need to build your brand and connect with your
          audience.
        </p>
      </div>
    </div>
  );
}
