import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

export default function GlassSelect({
  value,
  onChange,
  options,
  ariaLabel,
  className = "",
  icon: Icon,
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const selected = options.find((option) => option.value === value) || options[0];

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleOutsideClick);
    const handleEscape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div className={`glass-select ${open ? "open" : ""} ${className}`} ref={rootRef}>
      <button
        type="button"
        className="glass-select-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setOpen((isOpen) => !isOpen);
          }
        }}
        onClick={() => setOpen((isOpen) => !isOpen)}
      >
        {Icon && <Icon size={16} className="glass-select-icon" />}
        <span className="glass-select-label">{selected?.label || "Select an option"}</span>
        <ChevronDown size={17} className="glass-select-chevron" />
      </button>
      {open && (
        <div className="glass-select-menu" role="listbox" aria-label={ariaLabel}>
          {options.map((option) => (
            <button
              type="button"
              role="option"
              aria-selected={option.value === value}
              className={`glass-select-option ${option.value === value ? "selected" : ""}`}
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
            >
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
