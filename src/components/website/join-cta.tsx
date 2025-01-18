import Link from "next/link";
import { Button } from "../ui/button";

export function JoinCTA() {
  return (
    <>
      <Button
        variant="outline"
        className="flex items-center gap-2 bg-gradient-to-r from-primary-500 to-primary-600 font-semibold text-muted-foreground shadow-lg transition-all hover:scale-105 hover:shadow-xl fixed bottom-8 right-8 z-50 border p-4"
      >
        <Link href="/">
          <span className="flex items-center gap-2 text-xs">
            Create your profile
          </span>
        </Link>
      </Button>
    </>
  );
}
