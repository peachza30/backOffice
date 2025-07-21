"use client";
import React from "react";
import { cn } from "@/lib/utils"; // if you already have the `cn` helper

/**
 * SkeletonSidebar – shimmering placeholder while menusConfig is loading
 */
const SkeletonSidebar = ({ className }: { className?: string }) => {
  // Adjust how many rows & groups you want to mimic
  const rows = Array.from({ length: 8 });

  return (
    <aside className={cn("fixed top-0 left-0 z-[9998] h-full w-[248px] bg-card border-r", className)}>
      {/* Logo placeholder */}
      <div className="h-[80px] flex items-center justify-center border-b">
        <div className="h-8 w-24 rounded bg-muted animate-pulse" />
      </div>

      {/* Menu placeholders */}
      <div className="px-4 py-6 space-y-2 overflow-y-auto">
        {rows.map((_, i) => (
          <div key={i} className="flex items-center space-x-3">
            {/* icon circle */}
            <span className="h-6 w-6 rounded-full bg-muted animate-pulse" />
            {/* label bar */}
            <span className="flex-1 h-4 rounded bg-muted animate-pulse" />
          </div>
        ))}
      </div>
    </aside>
  );
};

export default SkeletonSidebar;
