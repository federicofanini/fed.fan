import { Badge } from "@/components/ui/badge";
import {
  SquareTerminal,
  BookOpen,
  Settings2,
  LifeBuoy,
  Send,
  Frame,
  PieChart,
  Map,
  Bot,
  Dumbbell,
  Apple,
  BicepsFlexed,
  Feather,
  Github,
  User,
  Crosshair,
  Trophy,
  HeaterIcon,
  HeartPulse,
  Code,
  Dot,
} from "lucide-react";

export const sidebarItems = {
  navMain: [
    {
      title: "Blackboard",
      url: "/blackboard",
      icon: BicepsFlexed,
      isActive: true,
      items: [
        {
          title: "Workouts",
          url: "/blackboard/workouts",
        },
        {
          title: "Achievements",
          url: "/blackboard/achievements",
        },
      ],
    },
    {
      title: "Health Profile",
      url: "/blackboard/health-profile",
      icon: User,
      isActive: true,
      items: [
        {
          title: "Profile",
          url: "/blackboard/profile",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Leaderboard",
      url: "/blackboard/leaderboard",
      icon: Trophy,
      badge: (
        <Badge className="ml-auto flex items-center gap-2" variant="outline">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          new
        </Badge>
      ),
    },
    {
      title: "Feedback",
      url: "/blackboard/feedback",
      icon: Feather,
    },
  ],
  fitness: [
    {
      name: "Blackboard",
      url: "/blackboard",
      icon: Frame,
    },
    {
      name: "Workouts",
      url: "/blackboard/workouts",
      icon: Dumbbell,
    },
    {
      name: "Achievements",
      url: "/blackboard/achievements",
      icon: Trophy,
    },
    {
      name: "Health Profile",
      url: "/blackboard/health-profile",
      icon: HeartPulse,
    },
  ],
  coding: [
    {
      name: "Coding",
      url: "/coding",
      icon: Code,
    },
  ],
  startup: [
    {
      name: "Startup",
      url: "/startup",
      icon: Frame,
    },
  ],
};
