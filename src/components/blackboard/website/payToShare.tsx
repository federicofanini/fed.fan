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
import { PayToShareClient } from "./payToShareClient";

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
            <PayToShareClient productId={price.id} />
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
                  <PayToShareClient.CopyButton />
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
