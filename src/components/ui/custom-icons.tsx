
import React from "react";

export const WaveIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M2 12h2a6 6 0 0 1 6-6 6 6 0 0 1 6 6 6 6 0 0 0 6 6h2" />
  </svg>
);

export const GaugeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
    <path d="M19.42 5.57a9 9 0 1 0 0 12.86" />
    <path d="M11.43 2a9 9 0 0 1 9.2 9.57" />
  </svg>
);

export const HalfCircleGauge = ({
  value = 0,
  max = 100,
  color = "#7C6BD9",
  size = 200,
  thickness = 10,
  label = "",
}: {
  value: number;
  max?: number;
  color?: string;
  size?: number;
  thickness?: number;
  label?: string;
}) => {
  const normalizedValue = Math.min(100, Math.max(0, value)) / max;
  const radius = (size - thickness) / 2;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference * (1 - normalizedValue);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size / 2 + 20 }}>
        <svg
          width={size}
          height={size / 2 + thickness}
          viewBox={`0 0 ${size} ${size / 2 + thickness}`}
          style={{ overflow: "visible" }}
        >
          {/* Background arc */}
          <path
            d={`M ${thickness / 2}, ${size / 2} 
                A ${radius}, ${radius} 0 0, 1 ${size - thickness / 2}, ${size / 2}`}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth={thickness}
            strokeLinecap="round"
          />
          
          {/* Foreground arc */}
          <path
            d={`M ${thickness / 2}, ${size / 2} 
                A ${radius}, ${radius} 0 0, 1 ${size - thickness / 2}, ${size / 2}`}
            fill="none"
            stroke={color}
            strokeWidth={thickness}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform={`rotate(180 ${size / 2} ${size / 2})`}
          />
          
          {/* Value text */}
          <text
            x={size / 2}
            y={size / 2 + 10}
            textAnchor="middle"
            fontSize={size / 8}
            fontWeight="bold"
            fill="currentColor"
          >
            {value}%
          </text>
          
          {/* Ticks */}
          {[0, 25, 50, 75, 100].map((tick) => {
            const angle = Math.PI - (Math.PI * tick) / 100;
            const tickX = size / 2 + Math.cos(angle) * (radius + thickness / 2);
            const tickY = size / 2 + Math.sin(angle) * (radius + thickness / 2);
            const labelX = size / 2 + Math.cos(angle) * (radius + thickness * 2);
            const labelY = size / 2 + Math.sin(angle) * (radius + thickness * 2);
            
            return (
              <g key={tick}>
                <line
                  x1={tickX}
                  y1={tickY}
                  x2={size / 2 + Math.cos(angle) * (radius - thickness / 2)}
                  y2={size / 2 + Math.sin(angle) * (radius - thickness / 2)}
                  stroke="currentColor"
                  strokeWidth={2}
                />
                <text
                  x={labelX}
                  y={labelY}
                  textAnchor="middle"
                  fontSize={size / 20}
                  fill="currentColor"
                >
                  {tick}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      
      {label && (
        <div className="mt-2 text-center text-sm text-muted-foreground">
          {label}
        </div>
      )}
    </div>
  );
};
