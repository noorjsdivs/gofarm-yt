import React from "react";
import BannerCarousel from "./BannerCarousel";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";

interface Banner {
  _id: string;
  title: string;
  buttonTitle: string;
  buttonHref: string;
  image: {
    asset: {
      _ref: string;
    };
  };
}

async function getBanners(): Promise<Banner[]> {
  try {
    const banners = await client.fetch(
      `*[_type == "banner"] | order(_createdAt desc)`,
      {},
      {
        cache: "no-store",
      }
    );
    return banners;
  } catch (error) {
    console.error("Error fetching banners:", error);
    return [];
  }
}

const HomeBanner = async () => {
  const banners = await getBanners();

  if (!banners || banners.length === 0) {
    return null;
  }

  const bannersWithUrls = banners.map((banner) => ({
    ...banner,
    imageUrl: urlFor(banner.image).width(1920).height(800).url(),
  }));

  return <BannerCarousel banners={bannersWithUrls} />;
};

export default HomeBanner;
