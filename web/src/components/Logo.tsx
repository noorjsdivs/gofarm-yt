import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

const Logo = ({ className }: { className?: string }) => {
  return (
    <Link href={"/"}>
      <Image
        src={"/logo.svg"}
        alt="logo"
        width={150}
        height={150}
        className={cn("w-auto h-8", className)}
      />
    </Link>
  );
};

export default Logo;
