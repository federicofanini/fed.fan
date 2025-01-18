import { Section } from "@/components/section";
import { HeartPulse, TrendingUp, CheckCircle, Clock } from "lucide-react";

export function Benefits() {
  return (
    <Section id="benefits" title="Why founders choose us?">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 border-x border-t">
        <div className="flex flex-col p-4 border-b md:border-r bg-muted/10 hover:bg-muted/40 transition-colors">
          <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
            <HeartPulse className="size-6 text-primary" />
            Growth
          </h3>
          <p className="text-sm text-muted-foreground">
            Focus on{" "}
            <span className="font-semibold text-primary">
              personal branding progress
            </span>
            , not just fitness.
          </p>
        </div>

        <div className="flex flex-col p-4 border-b md:border-r border-l bg-muted/10 hover:bg-muted/40 transition-colors">
          <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
            <TrendingUp className="size-6 text-primary" />
            Networking
          </h3>
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-primary">
              Build a community
            </span>{" "}
            and connecting with others.
          </p>
        </div>

        <div className="flex flex-col p-4 border-b md:border-r border-l bg-muted/10 hover:bg-muted/40 transition-colors">
          <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
            <CheckCircle className="size-6 text-primary" />
            Let&apos;s connect
          </h3>
          <p className="text-sm text-muted-foreground">
            Connect with{" "}
            <span className="font-semibold text-primary">
              like-minded founders
            </span>
            .
          </p>
        </div>

        <div className="flex flex-col p-4 border-b md:border-r border-l bg-muted/10 hover:bg-muted/40 transition-colors">
          <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
            <Clock className="size-6 text-primary" />
            Save Time
          </h3>
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-primary">Automate</span>{" "}
            branding tasks, more room for work.
          </p>
        </div>
      </div>
    </Section>
  );
}
