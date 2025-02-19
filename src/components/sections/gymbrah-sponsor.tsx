import Link from "next/link";

export function GymbrahSponsor() {
  return (
    <div>
      <Link href="https://gymbrah.com?utm_source=fed.fan" target="_blank">
        <img
          src="/logo-gymbrah/gymbrah-sponsor.svg"
          alt="GymBrah - Run your fitness business without chaos"
          width={250}
          height={54}
          className="mt-4"
        />
      </Link>
    </div>
  );
}
