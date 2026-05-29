export function GradientBackground() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(13,1,33,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(13,1,33,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_16%,rgba(34,211,238,0.12),transparent_30%),radial-gradient(circle_at_84%_20%,rgba(16,185,129,0.1),transparent_28%),radial-gradient(circle_at_74%_86%,rgba(244,63,94,0.09),transparent_30%)]" />
    </>
  );
}
