import { Section } from "@/components/section";
import {
  AlertOctagon,
  Clock,
  Lock,
  CheckCircle,
  TrendingUp,
} from "lucide-react";

export function OldNew() {
  return (
    <Section id="comparison" title="Old Way vs New Way">
      <div className="grid grid-cols-1 md:grid-cols-2 border-x border-t">
        {/* Old Way */}
        <div className="p-8 border-b md:border-r bg-red-500/10 hover:bg-red-500/40 transition-colors">
          <div className="flex items-center gap-3 mb-6">
            <h3 className="text-2xl font-bold font-mono">The old way</h3>
          </div>
          <ul className="space-y-6 text-muted-foreground">
            <li className="flex items-start gap-3">
              <AlertOctagon className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
              <span className="leading-relaxed">
                <span className="font-semibold text-primary">
                  Traditional resumes and profiles
                </span>{" "}
                fail to capture the essence of who you are.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
              <span className="leading-relaxed">
                <span className="font-semibold text-primary">
                  Networking platforms
                </span>{" "}
                are siloed, making it hard to build genuine relationships.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
              <span className="leading-relaxed">
                <span className="font-semibold text-primary">
                  Real-time feedback
                </span>{" "}
                and connection, leading to missed opportunities and stalled
                growth.
              </span>
            </li>
          </ul>
        </div>

        {/* New Way */}
        <div className="p-8 border-b bg-green-500/10 hover:bg-green-500/40 transition-colors">
          <div className="flex items-center gap-3 mb-6">
            <h3 className="text-2xl font-bold font-mono">The new way</h3>
          </div>
          <ul className="space-y-6 text-muted-foreground">
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="leading-relaxed">
                <span className="font-semibold text-primary">
                  Showcase your journey
                </span>{" "}
                and achievements in a way that truly reflects who you are.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="leading-relaxed">
                <span className="font-semibold text-primary">
                  Engage directly
                </span>{" "}
                with fellow creators, founders, and like-minded individuals.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="leading-relaxed">
                <span className="font-semibold text-primary">
                  Stay on track
                </span>{" "}
                with instant feedback and insights, ensuring you’re always
                moving forward.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </Section>
  );
}
