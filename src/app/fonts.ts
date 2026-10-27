import { Belleza, Jost, Marcellus } from "next/font/google";

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

// The poster wordmark (YUANFEN under the logo) is a flared, Optima-style sans. Belleza is the closest match.
// Loaded for the full site only, so the Coming Soon page keeps loading exactly what it did before.
export const belleza = Belleza({
  variable: "--font-belleza",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const fontVariables = `${marcellus.variable} ${jost.variable}`;
export const fullSiteFontVariables = `${fontVariables} ${belleza.variable}`;
