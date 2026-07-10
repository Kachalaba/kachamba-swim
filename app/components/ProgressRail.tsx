export function ProgressRail({ label, items }: { label: string; items: readonly string[] }) {
  return (
    <div className="progress-rail" data-progress-rail aria-label={label}>
      <span className="progress-rail-line" aria-hidden="true" />
      <ol>
        {items.map((item, index) => (
          <li key={item}>
            <span>0{index + 1}</span>
            <strong>{item}</strong>
          </li>
        ))}
      </ol>
    </div>
  );
}
