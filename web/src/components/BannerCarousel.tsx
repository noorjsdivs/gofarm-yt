"use client";
import React, { useEffect, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import Image from "next/image";
import Container from "./Container";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface Banner {
  _id: string;
  title: string;
  buttonTitle: string;
  buttonHref: string;
  imageUrl: string;
}

interface BannerCarouselProps {
  banners: Banner[];
}

const BannerCarousel = ({ banners }: BannerCarouselProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  if (!banners || banners.length === 0) {
    return null;
  }
  return (
    <div className="w-full relative">
      <Carousel
        setApi={setApi}
        className="w-full"
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 5000,
            stopOnInteraction: true,
          }),
        ]}
      >
        <CarouselContent>
          {banners?.map((banner, index) => (
            <CarouselItem key={banner?._id}>
              <div className="relative h-75 md:h-100 lg:h-125 w-full overflow-hidden">
                <Image
                  src={banner?.imageUrl}
                  alt={banner?.title}
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-r from-gofarm-black/10 via-gofarm-black/20 to-transparent" />
                {/* Content */}
                <Container className="relative h-full flex items-center">
                  <div className="max-w-xl lg:max-w-2xl space-y-6 md:space-y-8">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl max-w-lg font-bold text-gofarm-black leading-tight animate-fadeInUp">
                      {banner?.title}
                    </h2>
                    {/* CTA Button */}
                    <div className="animate-fadeInUp delay-200">
                      <Link
                        href={banner.buttonHref}
                        className="inline-flex items-center gap-3 bg-white text-black px-6 md:px-8 py-3 md:py-4 rounded-lg md:rounded-xl text-sm md:text-base lg:text-lg font-semibold border-2 border-gofarm-green/20 hover:border-gofarm-green shadow-lg hover:shadow-xl relative overflow-hidden group"
                      >
                        <span className="absolute inset-0 bg-gofarm-green -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
                        <span className="relative z-10 transition-colors duration-500 group-hover:text-white">
                          {banner.buttonTitle}
                        </span>
                        <ChevronRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-all duration-500 group-hover:text-white" />
                      </Link>
                    </div>
                  </div>
                </Container>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* Navigation Buttons */}
        {banners.length > 1 && (
          <>
            <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 md:h-12 md:w-12 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 hover:text-white transition-all" />
            <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 md:h-12 md:w-12 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 hover:text-white transition-all" />
          </>
        )}
        {/* Dots Indicator */}
        {banners.length > 1 && (
          <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => api?.scrollTo(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  current === index + 1
                    ? "w-8 bg-white"
                    : "w-2 bg-white/40 hover:bg-white/60"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </Carousel>
    </div>
  );
};

export default BannerCarousel;
