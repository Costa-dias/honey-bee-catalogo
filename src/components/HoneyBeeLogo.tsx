export function HoneyBeeLogo({ className = 'w-24 h-24' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Logo Honey Bee"
    >
      <circle cx="60" cy="60" r="58" fill="#1a1a1a" />
      <path
        d="M60 28C50 28 38 36 38 52C38 68 50 88 60 92C70 88 82 68 82 52C82 36 70 28 60 28Z"
        fill="#f3c13a"
      />
      <path d="M38 50H82" stroke="#1a1a1a" strokeWidth="3" />
      <path d="M40 62H80" stroke="#1a1a1a" strokeWidth="3" />
      <path d="M44 74H76" stroke="#1a1a1a" strokeWidth="3" />
      <ellipse cx="50" cy="40" rx="10" ry="6" fill="#fff" opacity="0.85" transform="rotate(-25 50 40)" />
      <circle cx="58" cy="32" r="2" fill="#1a1a1a" />
      <path
        d="M72 28C76 22 84 22 88 26C84 30 78 32 72 28Z"
        fill="#f7f4ed"
      />
      <path
        d="M48 28C44 22 36 22 32 26C36 30 42 32 48 28Z"
        fill="#f7f4ed"
      />
    </svg>
  );
}

