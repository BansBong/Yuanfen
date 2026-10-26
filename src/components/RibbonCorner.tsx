import Image from "next/image";

/**
 * A satin ribbon sweeping in from a page corner.
 * It windows into the poster's ribbon artwork (transparent PNG), so the real
 * satin folds and highlights are kept without copying the poster's layout.
 * The two inner edges fade softly into the paper.
 *
 * The window is 60% of the artwork's width and 46% of its height, anchored to
 * the matching corner, so the image is drawn at 1/0.6 = 166.7% of the box width.
 * The right-hand and bottom-left corners are mirrored copies of the other two.
 */
export type Corner = "top-left" | "top-right" | "bottom-left" | "bottom-right";

const FADE_TOP =
  "linear-gradient(to right, #000 72%, transparent), linear-gradient(to bottom, #000 72%, transparent)";
const FADE_BOTTOM =
  "linear-gradient(to left, #000 72%, transparent), linear-gradient(to top, #000 72%, transparent)";

const PLACEMENT: Record<Corner, string> = {
  "top-left": "left-0 top-0",
  "top-right": "right-0 top-0 -scale-x-100",
  "bottom-left": "bottom-0 left-0 -scale-x-100",
  "bottom-right": "bottom-0 right-0",
};

export function RibbonCorner({
  corner,
  className = "",
  priority = false,
}: {
  corner: Corner;
  className?: string;
  priority?: boolean;
}) {
  const top = corner.startsWith("top");
  const mask = top ? FADE_TOP : FADE_BOTTOM;
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute overflow-hidden ${PLACEMENT[corner]} ${className}`}
      style={{
        aspectRatio: "972 / 931",
        maskImage: mask,
        WebkitMaskImage: mask,
        maskComposite: "intersect",
        WebkitMaskComposite: "source-in",
      }}
    >
      <div className="anim-drift absolute inset-0">
        <Image
          src="/brand/ribbons.png"
          alt=""
          width={1620}
          height={2025}
          sizes="(min-width: 1024px) 55vw, 150vw"
          priority={priority}
          className={`absolute h-auto w-[166.7%] max-w-none select-none ${
            top ? "left-0 top-0" : "bottom-0 right-0"
          }`}
          draggable={false}
        />
      </div>
    </div>
  );
}
