"use client";
import Link from "next/link";

interface ProductVariant {
  _id: string;
  title: string;
  slug: { current: string };
  isActive: boolean;
  weight: number;
}

interface Props {
  selectedTab: string;
  onTabSelect: (tab: string) => void;
  variants?: ProductVariant[];
}

const HomeTabbar = ({ selectedTab, onTabSelect, variants = [] }: Props) => {
  return (
    <div className="flex items-center flex-wrap gap-5 justify-between">
      <div className="flex items-center gap-1.5 text-sm font-semibold">
        <div className="flex items-center gap-1.5 md:gap-3 flex-wrap">
          {variants?.map((item) => (
            <button
              onClick={() => onTabSelect(item?._id)}
              key={item?._id}
              className={`border border-gofarm-light-green/30 px-4 py-1.5 md:px-6 md:py-2 rounded-full hover:bg-gofarm-light-green hover:border-gofarm-light-green hover:text-gofarm-white hoverEffect ${
                selectedTab === item?._id
                  ? "bg-gofarm-light-green text-gofarm-white border-gofarm-light-green"
                  : "bg-gofarm-light-orange/30 text-gofarm-gray"
              }`}
            >
              {item?.title}
            </button>
          ))}
        </div>
      </div>
      <Link
        href={"/shop"}
        className="border border-gofarm-green px-4 py-1 rounded-full hover:bg-gofarm-light-green hover:text-gofarm-white hover:border-gofarm-light-green hoverEffect text-gofarm-green font-medium"
      >
        See all
      </Link>
    </div>
  );
};

export default HomeTabbar;
