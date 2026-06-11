"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

export interface DockApp {
  id: string;
  name: string;
  icon: ReactNode;
  href: string;
  external?: boolean;
}

interface MacOSDockProps {
  apps: readonly DockApp[];
  openApps?: readonly string[];
  className?: string;
  onAppClick?: (appId: string) => void;
}

export default function MacOSDock({
  apps,
  openApps = [],
  className,
  onAppClick,
}: MacOSDockProps) {
  const dockRef = useRef<HTMLDivElement>(null);
  const iconRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [pointerX, setPointerX] = useState<number | null>(null);
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;

    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const updateCanHover = () => setCanHover(mediaQuery.matches);

    updateCanHover();
    mediaQuery.addEventListener("change", updateCanHover);
    return () => mediaQuery.removeEventListener("change", updateCanHover);
  }, []);

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!canHover || !dockRef.current) return;
      setPointerX(event.clientX);
    },
    [canHover],
  );

  const getIconStyle = useCallback(
    (index: number): CSSProperties => {
      const element = iconRefs.current[index];
      if (pointerX === null || !element || !canHover) {
        return { transform: "translateY(0) scale(1)" };
      }

      const rect = element.getBoundingClientRect();
      const distance = Math.abs(pointerX - (rect.left + rect.width / 2));
      const influence = Math.max(0, 1 - distance / 140);
      const scale = 1 + (1 - Math.cos(influence * Math.PI)) * 0.2;
      const lift = (scale - 1) * 28;

      return {
        transform: `translateY(-${lift}px) scale(${scale})`,
        zIndex: Math.round(scale * 10),
      };
    },
    [canHover, pointerX],
  );

  const handleClick = (appId: string, index: number) => {
    const element = iconRefs.current[index];
    if (typeof element?.animate === "function") {
      element.animate(
        [
          { transform: `${getIconStyle(index).transform} translateY(0)` },
          { transform: `${getIconStyle(index).transform} translateY(-8px)` },
          { transform: `${getIconStyle(index).transform} translateY(0)` },
        ],
        { duration: 320, easing: "ease-out" },
      );
    }
    onAppClick?.(appId);
  };

  return (
    <div
      ref={dockRef}
      aria-label="빠른 메뉴"
      className={cn(
        "flex items-end gap-1 rounded-[1.4rem] border border-white/30",
        "bg-slate-900/80 p-2 shadow-[0_16px_45px_rgba(15,23,42,0.35)]",
        "backdrop-blur-xl sm:gap-2 sm:p-2.5",
        className,
      )}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => setPointerX(null)}
      role="navigation"
    >
      {apps.map((app, index) => (
        <a
          key={app.id}
          ref={(element) => {
            iconRefs.current[index] = element;
          }}
          href={app.href}
          target={app.external ? "_blank" : undefined}
          rel={app.external ? "noopener noreferrer" : undefined}
          aria-label={app.name}
          className="group relative flex h-[3.8rem] w-[3.8rem] origin-bottom flex-col items-center justify-center gap-0.5 rounded-2xl text-white outline-none transition-transform duration-75 focus-visible:ring-2 focus-visible:ring-white sm:h-[4.5rem] sm:w-[4.5rem]"
          style={getIconStyle(index)}
          onClick={() => handleClick(app.id, index)}
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-[0.9rem] bg-gradient-to-br from-white/25 to-white/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_5px_12px_rgba(0,0,0,0.2)] transition-colors group-hover:from-white/35 sm:h-12 sm:w-12">
            {app.icon}
          </span>
          <span className="max-w-full truncate text-[9px] font-semibold leading-none text-white/85 sm:text-[10px]">
            {app.name}
          </span>
          <span
            className={cn(
              "absolute -bottom-1.5 h-1 w-1 rounded-full bg-white/85",
              openApps.includes(app.id) ? "opacity-100" : "opacity-0",
            )}
          />
        </a>
      ))}
    </div>
  );
}
