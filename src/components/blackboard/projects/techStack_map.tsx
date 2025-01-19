import {
  SiReact,
  SiNodedotjs,
  SiPostgresql,
  SiDocker,
  SiAmazonaws,
  SiMongodb,
  SiPython,
  SiJavascript,
  SiTypescript,
  SiGo,
  SiRust,
  SiKubernetes,
  SiTerraform,
  SiGithubactions,
  SiJenkins,
  SiGrafana,
  SiPrometheus,
  SiElasticsearch,
  SiRedis,
  SiNginx,
  SiSupabase,
  SiGithub,
} from "react-icons/si";

export const techStackIcons = {
  // Frontend
  React: SiReact,
  JavaScript: SiJavascript,
  TypeScript: SiTypescript,

  // Backend
  NodeJs: SiNodedotjs,
  Python: SiPython,
  Go: SiGo,
  Rust: SiRust,

  // Databases
  PostgreSQL: SiPostgresql,
  MongoDB: SiMongodb,
  Redis: SiRedis,
  Elasticsearch: SiElasticsearch,
  Supabase: SiSupabase,

  // DevOps & Cloud
  Docker: SiDocker,
  Kubernetes: SiKubernetes,
  AWS: SiAmazonaws,
  Terraform: SiTerraform,
  GitHubActions: SiGithub,
  Jenkins: SiJenkins,
  Nginx: SiNginx,

  // Monitoring
  Grafana: SiGrafana,
  Prometheus: SiPrometheus,
};

export const techStackCategories = {
  Frontend: ["React", "JavaScript", "TypeScript"],
  Backend: ["NodeJs", "Python", "Go", "Rust"],
  Database: ["PostgreSQL", "MongoDB", "Redis", "Elasticsearch"],
  DevOps: [
    "Docker",
    "Kubernetes",
    "AWS",
    "Terraform",
    "GitHub Actions",
    "Jenkins",
    "Nginx",
  ],
  Monitoring: ["Grafana", "Prometheus"],
};
