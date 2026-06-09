import type { ChangeEventHandler } from "react";

type CounterPanelProps = {
  count: number;
  step: number;
  onCountChange: (nextCount: number) => void;
  onStepChange: (nextStep: number) => void;
};

type NumberInputProps = {
  id: string;
  label: string;
  value: number;
  min?: number;
  onValueChange: (nextValue: number) => void;
};

const NumberInput = ({
  id,
  label,
  value,
  min,
  onValueChange,
}: NumberInputProps) => {
  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    onValueChange(Number(event.target.value));
  };

  return (
    <label className="field" htmlFor={id}>
      <span>{label}</span>
      <input
        id={id}
        type="number"
        min={min}
        value={value}
        onChange={handleChange}
      />
    </label>
  );
};

const CounterPanel = ({
  count,
  step,
  onCountChange,
  onStepChange,
}: CounterPanelProps) => {
  return (
    <section className="example-card">
      <header>
        <p className="eyebrow">State hoisting + controlled input</p>
        <h2>Counter settings</h2>
      </header>

      <div className="metric">
        <span>Current value</span>
        <strong>{count}</strong>
      </div>

      <div className="toolbar">
        <button type="button" onClick={() => onCountChange(count - step)}>
          Decrease
        </button>
        <button type="button" onClick={() => onCountChange(count + step)}>
          Increase
        </button>
      </div>

      <NumberInput
        id="counter-step"
        label="Step"
        min={1}
        value={step}
        onValueChange={onStepChange}
      />
    </section>
  );
};

export default CounterPanel;
