import { Jost, Marcellus } from "next/font/google";

// Poster lettering: display headings are a refined serif; body + labels a light sans.
export const marcellus = Marcellus({
  variable: "--font-marcellus",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const fontVariables = `${marcellus.variable} ${jost.variable}`;
