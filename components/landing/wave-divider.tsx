export function WaveDivider({ className, fill = "var(--background)" }: { className?: string; fill?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 80"
      preserveAspectRatio="none"
      className={className}
    >
      <path
        d="M0 32C240 74 480 74 720 48C960 22 1200 22 1440 48V80H0V32Z"
        fill={fill}
      />
    </svg>
  );
}
