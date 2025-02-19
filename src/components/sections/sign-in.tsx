import { siteConfig } from "@/lib/config";
import Link from "next/link";
import OutlinedButton from "../ui/outlined-button";

export function SignIn() {
  return (
    <Link href="/login" className="text-xs text-secondary underline">
      <OutlinedButton className="text-xs h-6">{siteConfig.cta}</OutlinedButton>
    </Link>
  );
}
