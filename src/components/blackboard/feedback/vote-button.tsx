"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowBigUp, ArrowBigDown } from "lucide-react";
import { voteFeedback } from "@/actions/feedback/votes";
import { toast } from "sonner";
import { type ActionResponse } from "@/actions/types/action-response";

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

export function VoteButton({ feedback }: { feedback: Feedback }) {
  const [userVote, setUserVote] = useState<"upvote" | "downvote" | null>(null);
  const [voteCount, setVoteCount] = useState(feedback.upvotes);
  const [isVoting, setIsVoting] = useState(false);

  const handleVote = async (type: "upvote" | "downvote") => {
    if (isVoting) return;

    setIsVoting(true);
    try {
      const result = await voteFeedback({
        feedbackId: feedback.id,
        voteType: type,
      });

      if (!result) {
        throw new Error("No response from server");
      }

      if (result.data) {
        const response = result.data as ActionResponse;
        if (response.success) {
          if (userVote === type) {
            setUserVote(null);
            setVoteCount(feedback.upvotes);
          } else {
            setUserVote(type);
            setVoteCount(type === "upvote" ? voteCount + 1 : voteCount - 1);
          }
        } else {
          toast.error(response.error || "Failed to vote");
          // Reset vote state on error
          setUserVote(null);
          setVoteCount(feedback.upvotes);
        }
      }
    } catch (error) {
      console.error("Vote error:", error);
      toast.error("An unexpected error occurred");
      // Reset vote state on error
      setUserVote(null);
      setVoteCount(feedback.upvotes);
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div className="flex gap-1">
      <Button
        variant="ghost"
        size="sm"
        className="space-x-1 px-2 sm:px-3"
        onClick={() => handleVote("upvote")}
        disabled={isVoting}
      >
        <ArrowBigUp
          className={`h-4 w-4 sm:h-5 sm:w-5 ${
            userVote === "upvote" ? "fill-current" : ""
          }`}
        />
        <span className="text-sm">{voteCount}</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="space-x-1 px-2 sm:px-3"
        onClick={() => handleVote("downvote")}
        disabled={isVoting}
      >
        <ArrowBigDown
          className={`h-4 w-4 sm:h-5 sm:w-5 ${
            userVote === "downvote" ? "fill-current" : ""
          }`}
        />
      </Button>
    </div>
  );
}
