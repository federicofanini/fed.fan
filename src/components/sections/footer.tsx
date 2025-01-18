import { BorderText } from "@/components/ui/border-number";
import { siteConfig } from "@/lib/config";
import Image from "next/image";
import Link from "next/link";
import { SubscribeInput } from "../ui/subscribe-input";

export function Footer() {
  return (
    <footer className="flex flex-col gap-y-5 rounded-lg px-7 py-5 container">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <Image src="/logo.svg" alt="GymBrah" width={100} height={100} />
        </div>

        <div className="flex gap-x-2">
          {siteConfig.footer.socialLinks.map((link, index) => (
            <Link
              key={index}
              href={link.url}
              className="flex text-xs items-center justify-center text-muted-foreground transition-all duration-100 ease-linear hover:text-foreground hover:underline hover:underline-offset-4"
            >
              {link.icon}
            </Link>
          ))}
        </div>
      </div>
      <div className="flex flex-col justify-between gap-y-5 md:flex-row md:items-center">
        <ul className="flex flex-col gap-x-5 gap-y-2 text-muted-foreground md:flex-row md:items-center">
          {siteConfig.footer.links.map((link, index) => (
            <li
              key={index}
              className="text-xs font-medium text-muted-foreground transition-all duration-100 ease-linear hover:text-foreground hover:underline hover:underline-offset-4"
            >
              <Link href={link.url} target="_blank">
                {link.text}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between text-xs font-medium tracking-tight text-muted-foreground">
          <p>{siteConfig.footer.bottomText}</p>
        </div>
      </div>
      <SubscribeInput />
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <span className="flex items-center gap-2">
          Made with ☕️ and 🥐 by
          <Image
            src="/ff.jpg"
            alt="Federico"
            width={24}
            height={24}
            className="rounded-full"
          />
          <Link
            href="https://x.com/FedericoFan"
            target="_blank"
            className="font-semibold"
          >
            Federico
          </Link>
        </span>
      </div>
      <BorderText
        text={siteConfig.footer.brandText}
        className="text-[clamp(3rem,15vw,10rem)] overflow-hidden font-mono tracking-tighter font-medium"
      />
    </footer>
  );
}
