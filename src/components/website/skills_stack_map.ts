export const skillsMap = {
  categories: [
    {
      id: "leadership",
      name: "leadership",
      skills: [
        { id: "team-building", name: "team building" },
        { id: "vision-setting", name: "vision setting" },
        { id: "conflict-resolution", name: "conflict resolution" },
        { id: "motivating-teams", name: "motivating teams" },
      ],
    },
    {
      id: "business-development",
      name: "business development",
      skills: [
        { id: "strategic-planning", name: "strategic planning" },
        { id: "networking", name: "networking" },
        { id: "pitching", name: "pitching" },
        { id: "partnership-building", name: "partnership building" },
      ],
    },
    {
      id: "financial",
      name: "financial",
      skills: [
        { id: "budget-management", name: "budget management" },
        { id: "investor-relations", name: "investor relations" },
        { id: "revenue-forecasting", name: "revenue forecasting" },
        { id: "financial-analysis", name: "financial analysis" },
      ],
    },
    {
      id: "marketing",
      name: "marketing",
      skills: [
        { id: "brand-strategy", name: "brand strategy" },
        { id: "content-creation", name: "content creation" },
        { id: "market-research", name: "market research" },
        { id: "digital-marketing", name: "digital marketing" },
      ],
    },
    {
      id: "product-management",
      name: "product management",
      skills: [
        { id: "roadmap-creation", name: "roadmap creation" },
        { id: "user-feedback-analysis", name: "user feedback analysis" },
        { id: "prioritization", name: "prioritization" },
        { id: "product-launch", name: "product launch" },
      ],
    },
    {
      id: "innovation",
      name: "innovation",
      skills: [
        { id: "idea-generation", name: "idea generation" },
        { id: "problem-solving", name: "problem solving" },
        { id: "lean-startup", name: "lean startup methodology" },
        { id: "disruption", name: "disruption" },
      ],
    },
    {
      id: "market-analysis",
      name: "market analysis",
      skills: [
        { id: "competitor-research", name: "competitor research" },
        { id: "trend-analysis", name: "trend analysis" },
        { id: "customer-profiling", name: "customer profiling" },
        { id: "market-segmentation", name: "market segmentation" },
      ],
    },
    {
      id: "risk-management",
      name: "risk management",
      skills: [
        { id: "contingency-planning", name: "contingency planning" },
        { id: "market-entry-strategy", name: "market entry strategy" },
        { id: "agility", name: "agility" },
        { id: "crisis-management", name: "crisis management" },
      ],
    },
    {
      id: "fundraising",
      name: "fundraising",
      skills: [
        { id: "grant-applications", name: "grant applications" },
        { id: "venture-capital-pitching", name: "venture capital pitching" },
        { id: "crowdfunding", name: "crowdfunding" },
        { id: "investor-communication", name: "investor communication" },
      ],
    },
    {
      id: "legal",
      name: "legal",
      skills: [
        { id: "intellectual-property", name: "intellectual property" },
        { id: "business-incorporation", name: "business incorporation" },
        { id: "compliance", name: "compliance" },
        { id: "contract-negotiation", name: "contract negotiation" },
      ],
    },
    // {
    //   id: "programming-languages",
    //   name: "programming languages",
    //   skills: [
    //   { id: "javascript", name: "javascript" },
    //   { id: "python", name: "python" },
    //   { id: "typescript", name: "typescript" },
    //   { id: "cpp", name: "c++" },
    //   { id: "ruby", name: "ruby" },
    //   { id: "go", name: "go" },
    // ],
    // },
    // {
    //   id: "frameworks-libraries",
    //   name: "frameworks & libraries",
    //   skills: [
    //     { id: "react", name: "react" },
    //     { id: "nextjs", name: "next.js" },
    //     { id: "tailwind", name: "tailwind" },
    //     { id: "prisma", name: "prisma" },
    //     { id: "express", name: "express" },
    //     { id: "vuejs", name: "vue.js" },
    //   ],
    // },
    // {
    //   id: "database-management",
    //   name: "database management",
    //   skills: [
    //     { id: "mysql", name: "mysql" },
    //     { id: "postgresql", name: "postgresql" },
    //     { id: "supabase", name: "supabase" },
    //     { id: "mongodb", name: "mongodb" },
    //     { id: "redis", name: "redis" },
    //   ],
    // },
    // {
    //   id: "software-engineering",
    //   name: "software engineering",
    //   skills: [
    //     { id: "git", name: "version control (git)" },
    //     { id: "testing", name: "testing" },
    //     { id: "cicd", name: "ci/cd" },
    //     { id: "agile", name: "agile methodology" },
    //     { id: "devops", name: "devops" },
    //   ],
    // },
    // {
    //   id: "cloud-devops",
    //   name: "cloud & devops",
    //   skills: [
    //     { id: "aws", name: "aws" },
    //     { id: "docker", name: "docker" },
    //     { id: "vercel", name: "vercel" },
    //     { id: "turborepo", name: "turborepo" },
    //     { id: "kubernetes", name: "kubernetes" },
    //     { id: "terraform", name: "terraform" },
    //   ],
    // },
  ],
};

export const techStack = [
  {
    category: "frontend",
    subcategories: [
      {
        name: "languages",
        items: ["html", "css", "javascript", "typescript"],
      },
      {
        name: "frameworks",
        items: ["react", "next.js", "vue.js", "svelte", "angular"],
      },
      {
        name: "styling",
        items: ["tailwind css", "sass", "styled components"],
      },
    ],
  },
  {
    category: "backend",
    subcategories: [
      {
        name: "languages",
        items: ["node.js", "python", "ruby", "java", "go"],
      },
      {
        name: "frameworks",
        items: ["express", "django", "spring boot", "nestjs"],
      },
      {
        name: "databases",
        items: [
          "mysql",
          "postgresql",
          "mongodb",
          "supabase",
          "sqlite",
          "redis",
        ],
      },
    ],
  },
  {
    category: "devops",
    subcategories: [
      {
        name: "tools",
        items: [
          "docker",
          "kubernetes",
          "terraform",
          "aws",
          "azure",
          "google cloud",
        ],
      },
      {
        name: "ci_cd",
        items: ["jenkins", "github actions", "circleci", "travis ci"],
      },
    ],
  },
  {
    category: "testing",
    subcategories: [
      {
        name: "libraries",
        items: ["jest", "mocha", "chai", "cypress", "selenium"],
      },
      {
        name: "methodologies",
        items: ["unit testing", "integration testing", "end-to-end testing"],
      },
    ],
  },
  {
    category: "mobile",
    subcategories: [
      {
        name: "frameworks",
        items: ["react native", "flutter", "swift", "kotlin", "ionic"],
      },
    ],
  },
  {
    category: "versioncontrol",
    subcategories: [
      {
        name: "tools",
        items: ["git", "github", "gitlab", "bitbucket"],
      },
    ],
  },
];
