import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

import animationData from "@/assets/lottie-json"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}


// import { clsx } from "clsx";

// import { twMerge } from "tailwind-merge";

// export function cn(inputs) {

//   return twMerge(clsx(inputs));

// }

export const colors = [

  "bg-[#712c4a57] text-[#ff006e] border-[1px] border-[#ff006faa]",
  "bg-[#ffd68a2a] text-[#ffd68a] border-[1px] border-[#ffd60abb]",
  "bg-[#B6d6a82a] text-[#06d6a8] border-[1px] border-[#06d6a0bb]",
  "bg-[#4cc9f82a] text-[#4cc9f0] border-[1px] border-[#4cc9f0bb]",
]

export const getColor = (color) => {
  
  if (color >= 0 && color < colors.length) {
    return colors[color];
  }

  return colors[0];
}

export const animationDefaultOptions = {
  loop: true,
  autoplay: true,
  animationData
}