export function LandingIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background warm gradient */}
      <defs>
        <linearGradient id="gradCoral" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E07A5F" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#F2CC8F" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="gradIndigo" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3D405B" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#5A5E7A" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id="gradSage" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#81B29A" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#99C8AE" stopOpacity="0.5" />
        </linearGradient>
        <radialGradient id="glowSand" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F2CC8F" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#F2CC8F" stopOpacity="0" />
        </radialGradient>
        <filter id="blur1">
          <feGaussianBlur stdDeviation="20" />
        </filter>
        <filter id="blur2">
          <feGaussianBlur stdDeviation="40" />
        </filter>
      </defs>

      {/* Soft background glow */}
      <ellipse cx="200" cy="220" rx="180" ry="160" fill="url(#glowSand)" filter="url(#blur2)" />

      {/* Large coral circle — sunset */}
      <circle cx="200" cy="180" r="100" fill="url(#gradCoral)" opacity="0.85">
        <animate attributeName="cy" values="180;175;180" dur="6s" repeatCount="indefinite" />
      </circle>

      {/* Inner circle — horizon line effect */}
      <clipPath id="horizonClip">
        <rect x="0" y="220" width="400" height="300" />
      </clipPath>
      <circle cx="200" cy="180" r="100" fill="#1A1B2E" opacity="0.15" clipPath="url(#horizonClip)" />

      {/* Indigo geometric shape — conversation bubble 1 */}
      <rect x="60" y="300" width="120" height="80" rx="12" fill="url(#gradIndigo)" opacity="0.75">
        <animate attributeName="y" values="300;296;300" dur="5s" repeatCount="indefinite" />
      </rect>

      {/* Sage geometric shape — conversation bubble 2 */}
      <rect x="220" y="340" width="130" height="70" rx="12" fill="url(#gradSage)" opacity="0.65">
        <animate attributeName="y" values="340;336;340" dur="7s" repeatCount="indefinite" />
      </rect>

      {/* Small floating coral dot */}
      <circle cx="320" cy="120" r="16" fill="#E07A5F" opacity="0.6">
        <animate attributeName="cy" values="120;114;120" dur="4s" repeatCount="indefinite" />
      </circle>

      {/* Small floating sage dot */}
      <circle cx="80" cy="160" r="12" fill="#81B29A" opacity="0.5">
        <animate attributeName="cy" values="160;155;160" dur="5s" repeatCount="indefinite" />
      </circle>

      {/* Sand accent dot */}
      <circle cx="340" cy="280" r="8" fill="#F2CC8F" opacity="0.7" />

      {/* Thin indigo line — horizon */}
      <line x1="60" y1="230" x2="340" y2="230" stroke="#3D405B" strokeWidth="1.5" opacity="0.3" />

      {/* Small text lines inside indigo box */}
      <rect x="76" y="320" width="60" height="4" rx="2" fill="white" opacity="0.4" />
      <rect x="76" y="332" width="80" height="4" rx="2" fill="white" opacity="0.3" />
      <rect x="76" y="344" width="40" height="4" rx="2" fill="white" opacity="0.25" />

      {/* Small text lines inside sage box */}
      <rect x="236" y="360" width="70" height="4" rx="2" fill="white" opacity="0.35" />
      <rect x="236" y="372" width="90" height="4" rx="2" fill="white" opacity="0.25" />
      <rect x="236" y="384" width="50" height="4" rx="2" fill="white" opacity="0.2" />

      {/* Decorative triangles */}
      <polygon points="350,60 370,90 330,90" fill="#F2CC8F" opacity="0.3" />
      <polygon points="50,380 70,410 30,410" fill="#E07A5F" opacity="0.2" />
    </svg>
  )
}
