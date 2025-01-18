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
  Globe,
  ToyBrick,
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
  profile: [
    {
      name: "profile",
      url: "/blackboard/profile",
      icon: User,
    },
    {
      name: "projects",
      url: "/blackboard/projects",
      icon: ToyBrick,
    },

    {
      name: "skills",
      url: "/blackboard/skills",
      icon: Dumbbell,
    },
    {
      name: "education",
      url: "/blackboard/education",
      icon: BookOpen,
    },
    {
      name: "stack",
      url: "/blackboard/stack",
      icon: Code,
    },
    {
      name: "website",
      url: "/blackboard/website",
      icon: Globe,
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
