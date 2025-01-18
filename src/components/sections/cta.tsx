import { Section } from "@/components/section";
import OutlinedButton from "../ui/outlined-button";
import Link from "next/link";

export function CTA() {
  return (
    <Section id="cta">
      <div className="border overflow-hidden relative text-center py-16 mx-auto">
        <p className="max-w-3xl text-foreground mb-6 text-balance mx-auto font-mono text-3xl">
          Who&apos;s next? Maybe you.
        </p>

        <div className="flex justify-center">
          <Link href="/login">
            <OutlinedButton className="flex items-center gap-2">
              Join now
            </OutlinedButton>
          </Link>
        </div>
      </div>
    </Section>
  );
}
