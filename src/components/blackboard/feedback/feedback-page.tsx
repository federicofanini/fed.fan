import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getCachedFeedbacks } from "@/actions/feedback/cached-feedback";
import { AddFeedback } from "./add-fedback";
import { VoteButton } from "./vote-button";
import { HardUpdate } from "../refresh-button";
import { revalidateFeedbackCache } from "@/actions/feedback/feedback";

interface Feedback {
  id: string;
  message: string;
  rating: number;
  category: string;
  status: string;
  upvotes: number;
  created_at: string;
  user_id: string;
  user: {
    full_name: string;
    avatar_url: string | null;
  };
}

export const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  "in-review": "bg-blue-100 text-blue-800 hover:bg-blue-200",
  resolved: "bg-emerald-100 text-emerald-800 hover:bg-emerald-200",
};

export const categoryColors = {
  bug: "bg-red-100 text-red-800 hover:bg-red-200",
  "feature-request": "bg-violet-100 text-violet-800 hover:bg-violet-200",
  general: "bg-slate-100 text-slate-800 hover:bg-slate-200",
  question: "bg-cyan-100 text-cyan-800 hover:bg-cyan-200",
  performance: "bg-pink-100 text-pink-800 hover:bg-pink-200",
};

export default async function FeedbackPage() {
  const result = await getCachedFeedbacks();
  const feedbacks = result.success ? (result.data as Feedback[]) : [];

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Feedback</h1>
        <div className="flex items-center gap-2">
          <AddFeedback />
          <HardUpdate action={revalidateFeedbackCache} />
        </div>
      </div>

      <div className="grid gap-4 sm:gap-6">
        {feedbacks.map((feedback) => (
          <Card key={feedback.id} className="overflow-hidden">
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0 pb-2">
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg">
                  <AvatarImage
                    src={feedback.user.avatar_url || undefined}
                    alt={feedback.user.full_name}
                    className="rounded-lg"
                  />
                  <AvatarFallback className="rounded-lg bg-gradient-to-br from-green-500 via-teal-500 to-green-800">
                    <span className="text-white">
                      {feedback.user.full_name?.[0]?.toUpperCase() || "U"}
                    </span>
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-sm font-medium">
                    {feedback.user.full_name}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {new Date(feedback.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div className="hidden sm:flex flex-wrap gap-2">
                <Badge
                  className={`text-xs ${
                    categoryColors[
                      feedback.category as keyof typeof categoryColors
                    ]
                  }`}
                >
                  {feedback.category}
                </Badge>
                <Badge
                  className={`text-xs ${
                    statusColors[feedback.status as keyof typeof statusColors]
                  }`}
                >
                  {feedback.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3 sm:mb-4 break-words">
                {feedback.message}
              </p>
              <div className="flex items-center justify-between sm:justify-start gap-2 sm:gap-4">
                <VoteButton feedback={feedback} />
                <div className="flex sm:hidden items-center gap-2">
                  <Badge
                    className={`text-xs ${
                      categoryColors[
                        feedback.category as keyof typeof categoryColors
                      ]
                    }`}
                  >
                    {feedback.category}
                  </Badge>
                  <Badge
                    className={`text-xs ${
                      statusColors[feedback.status as keyof typeof statusColors]
                    }`}
                  >
                    {feedback.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
