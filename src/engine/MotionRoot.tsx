"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { initEngine } from "./index";

export function MotionRoot() {
  const pathname = usePathname();

  useEffect(() => initEngine(), [pathname]);

  return null;
}
