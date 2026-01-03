import React from "react";

interface Triangle5Props {
  labels?: string[]; // length 5 (top -> bottom)
  colors?: string[]; // length 5 (top -> bottom) - any valid CSS color
  width?: number | string;
  height?: number | string;
  className?: string;
  showLabels?: boolean;
}

// Default colors (top to bottom).
const DEFAULT_COLORS = [
  "#ffb4a2",
  "#ffdac1",
  "#e2f0cb",
  "#cde7f0",
  "#bdb2ff",
];

const DEFAULT_LABELS = [
  "Section 1",
  "Section 2",
  "Section 3",
  "Section 4",
  "Section 5",
];

export default function MaslowHierarchy({
  labels = DEFAULT_LABELS,
  colors = DEFAULT_COLORS,
  width = "320",
  height = "360",
  className = "",
  showLabels = true,
}: Triangle5Props) {
  // We'll draw the triangle in an SVG with viewBox 0 0 100 100.
  // Triangle apex at (50,0), base at (0,100) -> (100,100).
  // For a given y, left x = 50 - 0.5*y, right x = 50 + 0.5*y.

  const sliceCount = 5;

  const leftX = (y: number) => 50 - 0.5 * y;
  const rightX = (y: number) => 50 + 0.5 * y;

  const slices = Array.from({ length: sliceCount }).map((_, i) => {
    const topY = (i * 100) / sliceCount;
    const bottomY = ((i + 1) * 100) / sliceCount;

    const points = [
      `${leftX(topY)},${topY}`,
      `${rightX(topY)},${topY}`,
      `${rightX(bottomY)},${bottomY}`,
      `${leftX(bottomY)},${bottomY}`,
    ].join(" ");

    const label = labels[i] ?? "";
    const color = colors[i] ?? colors[i % colors.length] ?? "#ddd";

    const centroidY = (topY + bottomY) / 2;

    return {
      id: `slice-${i}`,
      points,
      color,
      label,
      centroidY,
    };
  });

  return (
    <div className={`inline-block ${className}`} style={{ width, height }}>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Triangle with five sections"
        style={{ width: "100%", height: "100%" }}
      >
        {/* background - optional subtle outline */}
        <defs>
          <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="0.6" floodOpacity="0.06" />
          </filter>
        </defs>

        {slices.map((s, idx) => (
          <g key={s.id}>
            <polygon
              points={s.points}
              fill={s.color}
              stroke="rgba(0,0,0,0.06)"
              strokeWidth={0.3}
              style={{ transition: "transform .18s ease, opacity .18s ease" }}
              onMouseEnter={(e) => {
                (e.currentTarget as SVGPolygonElement).style.transform = "scale(1.01)";
                (e.currentTarget as SVGPolygonElement).style.opacity = "0.98";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as SVGPolygonElement).style.transform = "scale(1)";
                (e.currentTarget as SVGPolygonElement).style.opacity = "1";
              }}
            />

            {showLabels && s.label && (
              <text
                x={50}
                y={s.centroidY}
                fontSize={4.5}
                textAnchor="middle"
                dominantBaseline="middle"
                style={{ pointerEvents: "none", userSelect: "none", fontFamily: 'Inter, ui-sans-serif, system-ui' }}
              >
                {s.label}
              </text>
            )}
          </g>
        ))}

        {/* Outline of full triangle for crisp edge */}
        <polygon
          points="50,0 100,100 0,100"
          fill="none"
          stroke="rgba(0,0,0,0.06)"
          strokeWidth={0.6}
        />
      </svg>
    </div>
  );
}

// Usage (example):
// <Triangle5 labels={["Self", "Esteem", "Love", "Safety", "Physiological"]} width={240} height={360} />
