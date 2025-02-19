"use client";

import { SignIn } from "@/components/sections/sign-in";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MdClose, MdMenu } from "react-icons/md";
import { GithubStars } from "./github-stars";
import { Suspense } from "react";
import Image from "next/image";
import { Icons } from "../icons";

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    {
      href: "https://gymbrah.com",
      label: (
        <div className="flex items-center gap-2">
          <Image
            src="/logo-gymbrah/logo_white.svg"
            alt="GymBrah Logo"
            width={20}
            height={20}
          />
          GymBrah
        </div>
      ),
    },
    {
      href: "https://github.com/federicofanini/fed.fan",
      label: (
        <div className="flex items-center gap-2">
          <Icons.github className="size-4" />
          GitHub
        </div>
      ),
    },
  ];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      <div className="flex md:hidden">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="text-white"
        >
          {isOpen ? (
            <MdClose className="size-6" />
          ) : (
            <MdMenu className="size-6" />
          )}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="fixed inset-0 z-50 bg-background bg-noise w-full bottom-0 h-screen left-0 right-0 top-[50px]"
          >
            <div className="flex flex-col h-full px-6">
              {links.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: links.length * 0.02 + index * 0.02,
                    duration: 0.1,
                  }}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      "block py-5 text-white",
                      pathname?.endsWith(link.href) && "text-primary"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                className="py-5 border-t border-border text-white"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: links.length * 0.02 + 0.05,
                  duration: 0.1,
                }}
              >
                <SignIn />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
