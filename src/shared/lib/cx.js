import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export function cx(...values) {
  return twMerge(clsx(values));
}
