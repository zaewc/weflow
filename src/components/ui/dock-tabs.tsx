"use client";

import { useRef, useState, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { cn } from "@/lib/utils";

export interface DockItem {
  id: string;
  name: string;
  icon: ReactNode;
  color: string;
  href: string;
  external?: boolean;
}

interface DockIconProps {
  item: DockItem;
  mouseX: MotionValue<number>;
  onItemClick?: (itemId: string) => void;
}

function DockIcon({ item, mouseX, onItemClick }: DockIconProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const distance = useTransform(mouseX, (value) => {
    const bounds = ref.current?.getBoundingClientRect();
    if (!bounds) return Infinity;
    return value - bounds.left - bounds.width / 2;
  });
  const sizeTarget = useTransform(distance, [-150, 0, 150], [52, 78, 52]);
  const size = useSpring(sizeTarget, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  return (
    <motion.a
      ref={ref}
      href={item.href}
      target={item.external ? "_blank" : undefined}
      rel={item.external ? "noopener noreferrer" : undefined}
      aria-label={item.name}
      className="group relative flex aspect-square h-[3.25rem] w-[3.25rem] shrink-0 origin-bottom items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white/70 sm:h-auto sm:w-auto"
      style={{ width: size, height: size }}
      whileTap={{ scale: 0.95 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      onPointerDown={() => setIsPressed(true)}
      onPointerUp={() => setIsPressed(false)}
      onClick={() => onItemClick?.(item.id)}
    >
      <motion.span
        className={cn(
          "relative flex h-full w-full items-center justify-center overflow-hidden rounded-2xl text-white",
          "border border-white/25 shadow-[0_8px_18px_-8px_rgba(15,23,42,0.55),inset_0_1px_0_rgba(255,255,255,0.3)]",
          item.color,
        )}
        animate={{ y: isPressed ? 2 : isHovered ? -8 : 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <motion.span
          className="[&>svg]:h-5 [&>svg]:w-5 sm:[&>svg]:h-6 sm:[&>svg]:w-6"
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          {item.icon}
        </motion.span>
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/45 via-white/5 to-transparent"
          animate={{ opacity: isHovered ? 0.45 : 0.18 }}
          transition={{ duration: 0.2 }}
        />
      </motion.span>

      <span className="pointer-events-none absolute inset-x-1/2 -top-11 flex w-max -translate-x-1/2 justify-center">
        <motion.span
          className="whitespace-nowrap rounded-md bg-slate-800/90 px-2 py-1 text-xs font-bold text-white shadow-lg backdrop-blur-sm"
          initial={false}
          animate={{
            opacity: isHovered ? 1 : 0,
            y: isHovered ? 0 : 8,
            scale: isHovered ? 1 : 0.88,
          }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          {item.name}
        </motion.span>
      </span>

      <motion.span
        aria-hidden="true"
        className="absolute -bottom-2 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-slate-700/60"
        animate={{
          scale: isPressed ? 1.5 : 1,
          opacity: isPressed ? 1 : 0.65,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </motion.a>
  );
}

interface DockTabsProps {
  items: readonly DockItem[];
  className?: string;
  onItemClick?: (itemId: string) => void;
}

export function DockTabs({
  items,
  className,
  onItemClick,
}: DockTabsProps) {
  const mouseX = useMotionValue(Infinity);

  return (
    <motion.nav
      aria-label="빠른 메뉴"
      className={cn(
        "flex h-[4.7rem] items-end gap-2 rounded-3xl border border-white/55",
        "bg-slate-100/65 px-3 pb-3 shadow-[0_18px_45px_-18px_rgba(15,23,42,0.45),inset_0_1px_0_rgba(255,255,255,0.9)]",
        "backdrop-blur-xl sm:h-20 sm:gap-3 sm:px-4 sm:pb-3.5",
        className,
      )}
      initial={{ y: 70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
      onMouseMove={(event) => mouseX.set(event.clientX)}
      onMouseLeave={() => mouseX.set(Infinity)}
    >
      {items.map((item) => (
        <DockIcon
          key={item.id}
          item={item}
          mouseX={mouseX}
          onItemClick={onItemClick}
        />
      ))}
    </motion.nav>
  );
}
