import { DiscordLogoIcon, TwitterLogoIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import HyperText from "./magicui/hyper-text";

const footerNavs = [
  {
    label: "Ideas",
    items: [
      {
        href: "#",
        name: "B2C SaaS",
      },
      {
        href: "#",
        name: "B2B SaaS",
      },
      {
        href: "#",
        name: "E-commerce",
      },
    ],
  },

  {
    label: "Community",
    items: [
      {
        href: "/discord",
        name: "Discord",
      },
      {
        href: "/twitter",
        name: "Twitter",
      },
      {
        href: "mailto:f@fanini.eu",
        name: "Email me",
      },
    ],
  },
  {
    label: "Legal",
    items: [
      {
        href: "/terms",
        name: "Terms",
      },

      {
        href: "/privacy",
        name: "Privacy",
      },
    ],
  },
];

const footerSocials = [
  {
    href: "/discord",
    name: "Discord",
    icon: <DiscordLogoIcon className="h-4 w-4" />,
  },
  {
    href: "/twitter",
    name: "Twitter",
    icon: <TwitterLogoIcon className="h-4 w-4" />,
  },
];

export function SiteFooter() {
  return (
    <footer>
      <div className="mx-auto w-full max-w-screen-xl xl:pb-2">
        <div className="md:flex md:justify-between px-8 p-4 py-16 sm:pb-16 gap-4">
          <div className="mb-12 flex-col flex gap-4">
            <Link className="text-xl flex items-center font-extrabold" href="/">
              <HyperText
                className="text-4xl font-bold text-black/80 dark:text-white"
                text="Do What Excite"
              />
            </Link>
            <p className="max-w-xs text-muted-foreground text-sm">Full directory of stunning SaaS ideas to kickstart your next million-dollar startup venture</p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:gap-10 sm:grid-cols-3">
            {footerNavs.map((nav) => (
              <div key={nav.label}>
                <h2 className="mb-6 text-sm tracking-tighter font-medium text-gray-900 uppercase dark:text-white">
                  {nav.label}
                </h2>
                <ul className="gap-2 grid">
                  {nav.items.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="cursor-pointer text-gray-400 hover:text-gray-200 duration-200 font-[450] text-sm"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div> 
        </div>

        <div className="flex flex-col sm:flex-row sm:flex sm:items-center sm:justify-between rounded-md border-neutral-700/20 py-4 px-8 gap-2">
          <div className="flex space-x-5 sm:justify-center sm:mt-0">
            {footerSocials.map((social) => (
              <Link
                key={social.name}
                href={social.href}
                className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-600 fill-gray-500 hover:fill-gray-900 dark:hover:fill-gray-600"
              >
                {social.icon}
                <span className="sr-only">{social.name}</span>
              </Link>
            ))}
          </div>
          <span className="text-xs text-gray-500 sm:text-center dark:text-gray-400">
            Copyright © {new Date().getFullYear()}{" "}
            <Link href="/" className="cursor-pointer underline underline-offset-2">
              Do What Excite
            </Link>
            . All Rights Reserved.
          </span>
        </div>
      </div>
      {/*   <SiteBanner /> */}
    </footer>
  );
}
