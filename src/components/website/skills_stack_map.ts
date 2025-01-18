export const skillsMap = {
  categories: [
    {
      id: "leadership",
      name: "Leadership",
      skills: [
        { id: "team-building", name: "Team Building" },
        { id: "vision-setting", name: "Vision Setting" },
        { id: "conflict-resolution", name: "Conflict Resolution" },
        { id: "motivating-teams", name: "Motivating Teams" },
      ],
    },
    {
      id: "business-development",
      name: "Business Development",
      skills: [
        { id: "strategic-planning", name: "Strategic Planning" },
        { id: "networking", name: "Networking" },
        { id: "pitching", name: "Pitching" },
        { id: "partnership-building", name: "Partnership Building" },
      ],
    },
    {
      id: "financial",
      name: "Financial",
      skills: [
        { id: "budget-management", name: "Budget Management" },
        { id: "investor-relations", name: "Investor Relations" },
        { id: "revenue-forecasting", name: "Revenue Forecasting" },
        { id: "financial-analysis", name: "Financial Analysis" },
      ],
    },
    {
      id: "marketing",
      name: "Marketing",
      skills: [
        { id: "brand-strategy", name: "Brand Strategy" },
        { id: "content-creation", name: "Content Creation" },
        { id: "market-research", name: "Market Research" },
        { id: "digital-marketing", name: "Digital Marketing" },
      ],
    },
    {
      id: "product-management",
      name: "Product Management",
      skills: [
        { id: "roadmap-creation", name: "Roadmap Creation" },
        { id: "user-feedback-analysis", name: "User Feedback Analysis" },
        { id: "prioritization", name: "Prioritization" },
        { id: "product-launch", name: "Product Launch" },
      ],
    },
    {
      id: "innovation",
      name: "Innovation",
      skills: [
        { id: "idea-generation", name: "Idea Generation" },
        { id: "problem-solving", name: "Problem Solving" },
        { id: "lean-startup", name: "Lean Startup Methodology" },
        { id: "disruption", name: "Disruption" },
      ],
    },
    {
      id: "market-analysis",
      name: "Market Analysis",
      skills: [
        { id: "competitor-research", name: "Competitor Research" },
        { id: "trend-analysis", name: "Trend Analysis" },
        { id: "customer-profiling", name: "Customer Profiling" },
        { id: "market-segmentation", name: "Market Segmentation" },
      ],
    },
    {
      id: "risk-management",
      name: "Risk Management",
      skills: [
        { id: "contingency-planning", name: "Contingency Planning" },
        { id: "market-entry-strategy", name: "Market Entry Strategy" },
        { id: "agility", name: "Agility" },
        { id: "crisis-management", name: "Crisis Management" },
      ],
    },
    {
      id: "fundraising",
      name: "Fundraising",
      skills: [
        { id: "grant-applications", name: "Grant Applications" },
        { id: "venture-capital-pitching", name: "Venture Capital Pitching" },
        { id: "crowdfunding", name: "Crowdfunding" },
        { id: "investor-communication", name: "Investor Communication" },
      ],
    },
    {
      id: "legal",
      name: "Legal",
      skills: [
        { id: "intellectual-property", name: "Intellectual Property" },
        { id: "business-incorporation", name: "Business Incorporation" },
        { id: "compliance", name: "Compliance" },
        { id: "contract-negotiation", name: "Contract Negotiation" },
      ],
    },
    {
      id: "programming-languages",
      name: "Programming Languages",
      skills: [
        { id: "javascript", name: "JavaScript" },
        { id: "python", name: "Python" },
        { id: "typescript", name: "TypeScript" },
        { id: "cpp", name: "C++" },
        { id: "ruby", name: "Ruby" },
        { id: "go", name: "Go" },
      ],
    },
    {
      id: "frameworks-libraries",
      name: "Frameworks & Libraries",
      skills: [
        { id: "react", name: "React" },
        { id: "nextjs", name: "Next.js" },
        { id: "tailwind", name: "Tailwind" },
        { id: "prisma", name: "Prisma" },
        { id: "express", name: "Express" },
        { id: "vuejs", name: "Vue.js" },
      ],
    },
    {
      id: "database-management",
      name: "Database Management",
      skills: [
        { id: "mysql", name: "MySQL" },
        { id: "postgresql", name: "PostgreSQL" },
        { id: "supabase", name: "Supabase" },
        { id: "mongodb", name: "MongoDB" },
        { id: "redis", name: "Redis" },
      ],
    },
    {
      id: "software-engineering",
      name: "Software Engineering",
      skills: [
        { id: "git", name: "Version Control (Git)" },
        { id: "testing", name: "Testing" },
        { id: "cicd", name: "CI/CD" },
        { id: "agile", name: "Agile Methodology" },
        { id: "devops", name: "DevOps" },
      ],
    },
    {
      id: "cloud-devops",
      name: "Cloud & DevOps",
      skills: [
        { id: "aws", name: "AWS" },
        { id: "docker", name: "Docker" },
        { id: "vercel", name: "Vercel" },
        { id: "turborepo", name: "Turborepo" },
        { id: "kubernetes", name: "Kubernetes" },
        { id: "terraform", name: "Terraform" },
      ],
    },
  ],
};

export const techStack = [
  {
    category: "frontend",
    subcategories: [
      {
        name: "languages",
        items: ["HTML", "CSS", "JavaScript", "TypeScript"],
      },
      {
        name: "frameworks",
        items: ["React", "Next.js", "Vue.js", "Svelte", "Angular"],
      },
      {
        name: "styling",
        items: ["Tailwind CSS", "SASS", "Styled Components"],
      },
    ],
  },
  {
    category: "backend",
    subcategories: [
      {
        name: "languages",
        items: ["Node.js", "Python", "Ruby", "Java", "Go"],
      },
      {
        name: "frameworks",
        items: ["Express", "Django", "Spring Boot", "NestJS"],
      },
      {
        name: "databases",
        items: [
          "MySQL",
          "PostgreSQL",
          "MongoDB",
          "Supabase",
          "SQLite",
          "Redis",
        ],
      },
    ],
  },
  {
    category: "devOps",
    subcategories: [
      {
        name: "tools",
        items: [
          "Docker",
          "Kubernetes",
          "Terraform",
          "AWS",
          "Azure",
          "Google Cloud",
        ],
      },
      {
        name: "CI_CD",
        items: ["Jenkins", "GitHub Actions", "CircleCI", "Travis CI"],
      },
    ],
  },
  {
    category: "testing",
    subcategories: [
      {
        name: "libraries",
        items: ["Jest", "Mocha", "Chai", "Cypress", "Selenium"],
      },
      {
        name: "methodologies",
        items: ["Unit Testing", "Integration Testing", "End-to-End Testing"],
      },
    ],
  },
  {
    category: "mobile",
    subcategories: [
      {
        name: "frameworks",
        items: ["React Native", "Flutter", "Swift", "Kotlin", "Ionic"],
      },
    ],
  },
  {
    category: "versionControl",
    subcategories: [
      {
        name: "tools",
        items: ["Git", "GitHub", "GitLab", "Bitbucket"],
      },
    ],
  },
];
