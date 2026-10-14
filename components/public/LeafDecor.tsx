// Decoración sutil de hojas de selva (SVG inline, sin imágenes externas).
export function HojaDecorativa({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M12 2C7 7 4 11 4 15a8 8 0 0 0 16 0c0-4-3-8-8-13Z"
        fill="currentColor"
        opacity="0.16"
      />
      <path
        d="M12 4v16M12 9l-4-2m4 5-5-1m5 5-4 1m4-9 4-2m-4 6 5-1m-5 4 4 1"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.35"
      />
    </svg>
  );
}

export function DivisorHojas() {
  return (
    <div aria-hidden="true" className="flex items-center justify-center gap-2 py-2 text-[#2E7D32]">
      <span className="h-px w-16 bg-[#2E7D32]/30" />
      <HojaDecorativa className="h-6 w-6" />
      <HojaDecorativa className="h-8 w-8 -scale-x-100" />
      <HojaDecorativa className="h-6 w-6" />
      <span className="h-px w-16 bg-[#2E7D32]/30" />
    </div>
  );
}
