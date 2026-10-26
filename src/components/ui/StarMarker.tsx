/** The poster's four-point concave star, used as a numbered step marker. */
export function StarMarker({ n }: { n: number }) {
  return (
    <span className="relative grid size-14 shrink-0 place-items-center">
      <svg viewBox="0 0 24 24" aria-hidden="true" className="absolute inset-0 size-full fill-crimson">
        <path d="M12 0 C13 8 16 11 24 12 C16 13 13 16 12 24 C11 16 8 13 0 12 C8 11 11 8 12 0Z" />
      </svg>
      <span className="relative font-display text-base text-white">{n}</span>
    </span>
  );
}
