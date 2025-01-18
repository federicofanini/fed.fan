import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const motivationalPhrases = [
  "Every rep counts. Loading your progress...",
  "Success is built one workout at a time...",
  "Getting stronger every day...",
  "No pain, no gain. Almost there...",
  "Loading your fitness journey...",
  "The only bad workout is the one that didn't happen...",
  "Preparing to crush your goals...",
  "Excellence in motion. Loading...",
  "Your dedication is inspiring. Almost ready...",
  "Transform your body, transform your life...",
];

export default function WorkoutsLoading() {
  // Get random phrase at render time on server
  const randomPhrase =
    motivationalPhrases[Math.floor(Math.random() * motivationalPhrases.length)];

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-[200px]" />
          <Skeleton className="h-10 w-[100px]" />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-[200px] rounded-lg" />
          ))}
        </div>

        <div className="fixed inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-xl font-medium text-muted-foreground">
            {randomPhrase}
          </p>
        </div>
      </div>
    </div>
  );
}
