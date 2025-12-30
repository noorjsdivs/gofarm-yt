import Link from "next/link";

const TopHeaderBadge = () => {
  return (
    <div className="bg-linear-to-r from-gofarm-green to-emerald-600 text-white text-center py-1 px-4">
      <div className="flex items-center justify-center gap-2 text-sm">
        <span className="font-medium">🎉 Get your Best Deals</span>
        <Link
          href={"/shop"}
          className="underline font-semibold hover:text-yellow-200 transition-colors"
        >
          Buy Now →
        </Link>
      </div>
    </div>
  );
};

export default TopHeaderBadge;
