"use client";

import {
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";

type MethodItem = readonly [title: string, description: string];

type MethodRailProps = {
  label: string;
  items: readonly MethodItem[];
};

export function MethodRail({ label, items }: MethodRailProps) {
  const [activeStep, setActiveStep] = useState(0);
  const buttonsRef = useRef<Array<HTMLButtonElement | null>>([]);

  const selectAndFocus = (index: number) => {
    setActiveStep(index);
    buttonsRef.current[index]?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex: number | null = null;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (index + 1) % items.length;
    }
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = (index - 1 + items.length) % items.length;
    }
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = items.length - 1;
    if (nextIndex === null) return;

    event.preventDefault();
    selectAndFocus(nextIndex);
  };

  return (
    <div
      className="method-rail"
      data-method-rail
      data-active-step={activeStep + 1}
      style={{ "--method-active": activeStep } as CSSProperties}
    >
      <span className="method-waterline" aria-hidden="true" />
      <ol role="tablist" aria-label={label}>
        {items.map(([title], index) => (
          <li key={title} role="presentation">
            <button
              ref={(button) => {
                buttonsRef.current[index] = button;
              }}
              id={`method-tab-${index + 1}`}
              type="button"
              role="tab"
              aria-selected={activeStep === index}
              aria-controls={`method-panel-${index + 1}`}
              tabIndex={activeStep === index ? 0 : -1}
              data-active={activeStep === index}
              onPointerEnter={() => setActiveStep(index)}
              onFocus={() => setActiveStep(index)}
              onClick={() => setActiveStep(index)}
              onKeyDown={(event) => handleKeyDown(event, index)}
            >
              <span aria-hidden="true">0{index + 1}</span>
              <strong>{title}</strong>
            </button>
          </li>
        ))}
      </ol>
      <div className="method-detail-stack">
        {items.map(([title, description], index) => (
          <article
            id={`method-panel-${index + 1}`}
            key={title}
            role="tabpanel"
            aria-labelledby={`method-tab-${index + 1}`}
            aria-hidden={activeStep !== index}
            data-method-panel
            data-active={activeStep === index}
          >
            <p className="method-detail-meta">
              <span>0{index + 1}</span>
              <strong>{title}</strong>
            </p>
            <p className="method-detail-copy">{description}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
