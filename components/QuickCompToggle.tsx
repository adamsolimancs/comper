"use client";

type QuickCompToggleProps = {
  enabled: boolean;
  onChange: (value: boolean) => void;
};

export function QuickCompToggle({ enabled, onChange }: QuickCompToggleProps) {
  return (
    <label className="quick-toggle">
      <span>Quick Comp Mode</span>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        className={enabled ? "toggle-switch active" : "toggle-switch"}
        onClick={() => onChange(!enabled)}
      >
        <span className="switch-thumb" />
      </button>
    </label>
  );
}
