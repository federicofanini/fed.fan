"use client";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { MobileMenu } from "./mobile-menu";
import { SignIn } from "./sign-in";
import Link from "next/link";
import { GithubStars } from "./github-stars";

export function Header({ fullWidth = false }: { fullWidth?: boolean }) {
  const pathname = usePathname();

  const links = [
    {
      href: "https://gymbrah.com",
      label: "GymBrah",
      className: "text-white hover:text-primary",
    },
    {
      component: <SignIn />,
      className:
        pathname.split("/").length === 2
          ? "text-primary"
          : "text-secondary hover:text-primary",
    },
  ];

  return (
    <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div
        className={cn(
          "flex items-center justify-between mx-auto py-4",
          !fullWidth && "container"
        )}
      >
        <Link href="/" title="brand-logo" className="block">
          <span className="text-2xl font-bold font-mono">fed.fan</span>
        </Link>

        <div className="md:flex hidden items-center gap-6 text-sm text-white">
          <Link href="https://github.com/federicofanini/fed.fan">
            <Suspense fallback={<GithubStars />}>
              <GithubStars />
            </Suspense>
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm">
            {links.map((link, i) =>
              link.component ? (
                <div
                  key={i.toString()}
                  className={cn(
                    "text-secondary hover:text-primary transition-colors",
                    link.className
                  )}
                >
                  {link.component}
                </div>
              ) : (
                <Link
                  href={link.href!}
                  className={cn(
                    "text-secondary hover:text-primary transition-colors hidden md:block",
                    link.className,
                    pathname?.endsWith(link.href) && "text-primary"
                  )}
                  key={link.href}
                  prefetch
                >
                  {link.label}
                </Link>
              )
            )}
          </div>
        </div>

        <MobileMenu />
      </div>
    </div>
  );
}
