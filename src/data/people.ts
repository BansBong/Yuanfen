/**
 * Guides and testimonials. Both home-page sections stay hidden (see
 * src/data/flags.ts) until REAL entries exist here. Never add invented people
 * or quotes.
 */
import type { Localized } from "./types";

export type Guide = { name: string; city: string; languages: string[]; bio: Localized; photo?: string };
export type Testimonial = { name: string; origin: string; quote: Localized };

export const GUIDES: Guide[] = [];
export const TESTIMONIALS: Testimonial[] = [];
