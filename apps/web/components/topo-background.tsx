import type { Contour } from "@/lib/terrain"
import { MAP_HEIGHT, MAP_WIDTH } from "@/lib/terrain"

/**
 * Contours are stroked in the page background color, so they read as the
 * ground color cut into a field a shade away from it.
 */
export function TopoBackground({ contours }: { contours: Contour[] }) {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden>
      <svg
        viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
        preserveAspectRatio="xMidYMid slice"
        className="size-full"
      >
        <rect
          width={MAP_WIDTH}
          height={MAP_HEIGHT}
          fill="color-mix(in oklch, var(--background) 97%, var(--foreground))"
        />
        <g
          fill="none"
          stroke="var(--background)"
          strokeLinejoin="round"
          strokeLinecap="round"
        >
          {contours.map((c) => (
            <path key={c.level} d={c.d} strokeWidth={c.index ? 1.1 : 0.5} />
          ))}
        </g>
      </svg>
    </div>
  )
}
