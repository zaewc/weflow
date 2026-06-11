"use client";
/* eslint-disable @next/next/no-img-element -- vendored gallery renders remote/case images via <img> */

import { ArrowLeft, ArrowRight } from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

export interface Gallery4Item {
  id: string;
  title: string;
  description: string;
  href: string;
  image: string;
}

export interface Gallery4Props {
  title?: string;
  description?: string;
  items: Gallery4Item[];
  /** 헤더 우측(기존 화살표 자리)에 표시할 액션 — 예: 더보기 버튼 */
  headerAction?: ReactNode;
  /** 자동 넘김 간격(ms). 0이면 비활성화 */
  autoPlayInterval?: number;
}

const EDGE_FADE =
  "[mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]";

const Gallery4 = ({
  title = "Case Studies",
  description = "",
  items,
  headerAction,
  autoPlayInterval = 5000,
}: Gallery4Props) => {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!carouselApi) {
      return;
    }
    const updateSelection = () => {
      setCurrentSlide(carouselApi.selectedScrollSnap());
    };
    updateSelection();
    carouselApi.on("select", updateSelection);
    return () => {
      carouselApi.off("select", updateSelection);
    };
  }, [carouselApi]);

  // 자동 넘김 (마우스 오버 시 일시정지)
  useEffect(() => {
    if (!carouselApi || !autoPlayInterval || paused) {
      return;
    }
    const id = setInterval(() => {
      if (carouselApi.canScrollNext()) {
        carouselApi.scrollNext();
      } else {
        carouselApi.scrollTo(0);
      }
    }, autoPlayInterval);
    return () => clearInterval(id);
  }, [carouselApi, autoPlayInterval, paused]);

  return (
    <section className="py-20">
      <div className="container-w">
        <div className="mb-8 flex items-end justify-between gap-4 md:mb-12">
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {title}
            </h2>
            {description && (
              <p className="max-w-lg text-slate-500">{description}</p>
            )}
          </div>
          {headerAction && <div className="shrink-0">{headerAction}</div>}
        </div>
      </div>

      <div
        className="relative w-full"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* 양쪽 끝 그래디언트 페이드 (마스크) */}
        <div className={EDGE_FADE}>
          <Carousel
            setApi={setCarouselApi}
            opts={{
              loop: true,
              breakpoints: {
                "(max-width: 768px)": {
                  dragFree: true,
                },
              },
            }}
          >
            <CarouselContent className="ml-0 2xl:ml-[max(8rem,calc(50vw-700px))] 2xl:mr-[max(0rem,calc(50vw-700px))]">
              {items.map((item) => (
                <CarouselItem
                  key={item.id}
                  className="max-w-[320px] pl-[20px] lg:max-w-[360px]"
                >
                  <a href={item.href} className="group rounded-xl">
                    <div className="group relative h-full min-h-[27rem] max-w-full overflow-hidden rounded-xl md:aspect-[5/4] lg:aspect-[16/9]">
                      <img
                        src={item.image}
                        alt={item.title}
                        loading="lazy"
                        decoding="async"
                        className="absolute h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 h-full bg-[linear-gradient(hsl(var(--primary)/0),hsl(var(--primary)/0.4),hsl(var(--primary)/0.8)_100%)] mix-blend-multiply" />
                      <div className="absolute inset-x-0 bottom-0 flex flex-col items-start p-6 text-primary-foreground md:p-8">
                        <div className="mb-2 pt-4 text-xl font-semibold md:mb-3 md:pt-4 lg:pt-4">
                          {item.title}
                        </div>
                        <div className="mb-8 line-clamp-2 md:mb-12 lg:mb-9">
                          {item.description}
                        </div>
                        <div className="flex items-center text-sm">
                          자세히 보기{" "}
                          <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </div>
                  </a>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>

        {/* 카드 양옆 오버레이 화살표 */}
        <Button
          size="icon"
          variant="outline"
          aria-label="이전 사례"
          onClick={() => carouselApi?.scrollPrev()}
          className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 shadow-md backdrop-blur sm:left-6"
        >
          <ArrowLeft className="size-5" />
        </Button>
        <Button
          size="icon"
          variant="outline"
          aria-label="다음 사례"
          onClick={() => carouselApi?.scrollNext()}
          className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 shadow-md backdrop-blur sm:right-6"
        >
          <ArrowRight className="size-5" />
        </Button>
      </div>

      <div className="mt-8 flex justify-center gap-2">
        {items.map((item, index) => (
          <button
            key={item.id}
            className="grid h-6 w-6 place-items-center"
            onClick={() => carouselApi?.scrollTo(index)}
            aria-label={`${index + 1}번째 사례로 이동`}
          >
            <span
              className={`h-2 w-2 rounded-full transition-colors ${
                currentSlide === index ? "bg-brand-600" : "bg-brand-600/20"
              }`}
            />
          </button>
        ))}
      </div>
    </section>
  );
};

export { Gallery4 };
