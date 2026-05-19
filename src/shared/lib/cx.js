import clsx from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges conditional class values and resolves Tailwind utility conflicts.
 *
 * @param {import("clsx").ClassValue[]} values
 * @returns {string}
 */
export function cx(...values) {
  return twMerge(clsx(values));
}
