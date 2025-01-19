export const projectCategories = [
  "web",
  "mobile",
  "desktop",
  "api",
  "database",
  "devOps",
  "testing",
  "security",
  "design",
  "marketing",
  "product",
  "other",
] as const;

export type ProjectCategory = (typeof projectCategories)[number];
