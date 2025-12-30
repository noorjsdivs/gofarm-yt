"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { headerData } from "../../constants";

const HeaderMenu = () => {
  const pathname = usePathname();

  return (
    <div className="hidden md:inline-flex w-full items-center justify-center gap-7 text-sm capitalize font-semibold text-gofarm-gray">
      {headerData?.map((item) => (
        <Link
          key={item?.title}
          href={item?.href}
          className={`hover:text-gofarm-light-green hoverEffect relative group ${
            pathname === item?.href && "text-gofarm-light-green"
          }`}
        >
          {item?.title}
          <span
            className={`absolute -bottom-0.5 left-1/2 w-0 h-0.5 bg-gofarm-light-green transition-all duration-300 group-hover:w-1/2 group-hover:left-0 ${
              pathname === item?.href && "w-1/2"
            }`}
          />
          <span
            className={`absolute -bottom-0.5 right-1/2 w-0 h-0.5 bg-gofarm-light-green transition-all duration-300 group-hover:w-1/2 group-hover:right-0 ${
              pathname === item?.href && "w-1/2"
            }`}
          />
        </Link>
      ))}
    </div>
  );
};

export default HeaderMenu;
