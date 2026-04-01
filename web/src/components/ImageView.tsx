"use client";
import { useState } from "react";
import {
  internalGroqTypeReferenceTo,
  SanityImageCrop,
  SanityImageHotspot,
} from "../../sanity.types";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { cn } from "@/lib/utils";

interface Props {
  images?: Array<{
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
    };
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    _type: "image";
    _key: string;
  }>;
  isStock?: number;
}

const ImageView = ({ images = [], isStock }: Props) => {
  const [active, setActive] = useState(images[0]);

  return (
    <div className="w-full space-y-2 md:space-y-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={active?._key}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-h-137.5 min-h-112.5 border border-gofarm-black/10 rounded-md group overflow-hidden"
        >
          <Image
            src={urlFor(active).url()}
            alt="productImage"
            width={700}
            height={700}
            priority
            className={cn(
              "w-full h-96 max-h-137 min-h-125 object-contain group-hover:scale-110 hoverEffect rounded-md",
              isStock === 0 && "grayscale opacity-50",
            )}
          />
        </motion.div>
      </AnimatePresence>
      {images?.length > 1 && (
        <div className="grid grid-cols-6 gap-2 h-20 md:h-24">
          {images?.map((image) => (
            <button
              key={image?._key}
              className={cn(
                "border border-border rounded-md overflow-hidden",
                active?._key === image?._key ? "ring-1 ring-dark-color" : "",
              )}
              onClick={() => setActive(image)}
            >
              <Image
                src={urlFor(image).url()}
                width={100}
                height={100}
                alt={`Thumbnail of ${image?._key}`}
                className="w-full h-auto object-contain"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageView;
