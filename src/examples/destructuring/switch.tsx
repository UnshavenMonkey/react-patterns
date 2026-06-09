import { forwardRef, type ComponentPropsWithoutRef } from "react";

type SwitchVariant = "default" | "border-bottom" | "empty" | "switch";

type ToggleSwitchProps = {
  label: string;
  variant?: SwitchVariant;
} & Omit<ComponentPropsWithoutRef<"input">, "type">;

const ToggleSwitch = forwardRef<HTMLInputElement, ToggleSwitchProps>(
  function ToggleSwitch(
    { label, variant = "default", className = "", id, ...inputProps },
    ref,
  ) {
    const inputId = id ?? `switch-${label.toLowerCase().replace(/\s+/g, "-")}`;
    const mergedClassName = ["toggle", `toggle-${variant}`, className]
      .filter(Boolean)
      .join(" ");

    return (
      <label className={mergedClassName} htmlFor={inputId}>
        <input {...inputProps} id={inputId} ref={ref} type="checkbox" />
        <span className="toggle-track" aria-hidden="true">
          <span className="toggle-thumb" />
        </span>
        <span>{label}</span>
      </label>
    );
  },
);

export default ToggleSwitch;
