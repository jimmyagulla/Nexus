import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge must know the design-system scales declared in styles.css,
 * otherwise `text-13` is taken for a colour and dropped next to `text-heading`.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ["10", "11", "12", "13", "14", "15", "16", "17", "18", "20", "22", "24", "26", "28", "30", "32"],
      radius: ["3", "10", "14"],
      shadow: [
        "popover-soft",
        "popover",
        "popover-md",
        "popover-strong",
        "panel",
        "active-left",
        "tab-active",
        "focus",
      ],
      tracking: ["logo"],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
