/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { useSmoothScroll } from "@/hooks/use-smooth-scroll";

export const FloatingNav = ({
  navItems,
  className,
}: {
  navItems: {
    name: string;
    link: string;
    icon?: React.ReactNode;
  }[];
  className?: string;
}) => {
  const { scrollYProgress } = useScroll();
  const { handleSmoothClick } = useSmoothScroll();

  const [visible, setVisible] = useState(false);

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    // Check if current is not undefined and is a number
    if (typeof current === "number") {
      const direction = current! - scrollYProgress.getPrevious()!;

      if (scrollYProgress.get() < 0.05) {
        setVisible(false);
      } else {
        if (direction < 0) {
          setVisible(true);
        } else {
          setVisible(false);
        }
      }
    }
  });

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          opacity: 1,
          y: -100,
        }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          duration: 0.2,
        }}
        className={cn(
          "flex max-w-fit fixed top-10 inset-x-0 mx-auto border border-zinc-800 rounded-full bg-zinc-900/80 backdrop-blur-md shadow-2xl shadow-blue-500/10 z-[5000] px-6 py-3 items-center justify-center space-x-6",
          className
        )}
      >
        {navItems.map((navItem: any, idx: number) => (
          <a
            key={`link=${idx}`}
            href={navItem.link}
            onClick={(e) => handleSmoothClick(e, navItem.link)}
            className={cn(
              "relative text-zinc-300 items-center flex space-x-2 hover:text-blue-400 transition-colors duration-300 group"
            )}
          >
            <span className="block sm:hidden group-hover:scale-110 transition-transform duration-200">{navItem.icon}</span>
            <span className="hidden sm:block text-sm font-medium group-hover:scale-105 transition-transform duration-200">{navItem.name}</span>
            <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent h-px scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
          </a>
        ))}
      </motion.div>
    </AnimatePresence>
  );
};