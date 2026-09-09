import { useEffect, useMemo, useRef, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function formatDate(value) {
  if (!value) return "Choose a date";
  return new Date(`${value}T00:00:00`).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function toInputDate(date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

export default function GlassDatePicker({ value, onChange, min, ariaLabel }) {
  const today = new Date();
  const minimumDate = min ? new Date(`${min}T00:00:00`) : today;
  const initialDate = value ? new Date(`${value}T00:00:00`) : minimumDate;
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(new Date(initialDate.getFullYear(), initialDate.getMonth(), 1));
  const rootRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const days = useMemo(() => {
    const firstDay = new Date(month.getFullYear(), month.getMonth(), 1).getDay();
    const totalDays = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    return [...Array(firstDay).fill(null), ...Array.from({ length: totalDays }, (_, index) => index + 1)];
  }, [month]);

  const monthLabel = month.toLocaleDateString(undefined, { month: "long", year: "numeric" });
  const canGoPrevious = new Date(month.getFullYear(), month.getMonth(), 1) >
    new Date(minimumDate.getFullYear(), minimumDate.getMonth(), 1);

  return (
    <div className="glass-date-picker" ref={rootRef}>
      <button
        type="button"
        className="glass-date-trigger"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => setOpen((isOpen) => !isOpen)}
      >
        <CalendarDays size={17} />
        <span className={value ? "" : "placeholder"}>{formatDate(value)}</span>
        <ChevronRight size={17} className={`glass-date-chevron ${open ? "open" : ""}`} />
      </button>
      {open && (
        <div className="glass-calendar" role="dialog" aria-label="Choose a date">
          <div className="glass-calendar-header">
            <button type="button" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))} disabled={!canGoPrevious} aria-label="Previous month">
              <ChevronLeft size={17} />
            </button>
            <strong>{monthLabel}</strong>
            <button type="button" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))} aria-label="Next month">
              <ChevronRight size={17} />
            </button>
          </div>
          <div className="glass-calendar-grid">
            {weekDays.map((day) => <span className="glass-calendar-weekday" key={day}>{day}</span>)}
            {days.map((day, index) => {
              const candidate = day
                ? toInputDate(new Date(month.getFullYear(), month.getMonth(), day))
                : null;
              const disabled = !candidate || candidate < min;
              return (
                <button
                  type="button"
                  className={`glass-calendar-day ${candidate === value ? "selected" : ""}`}
                  key={`${candidate || "empty"}-${index}`}
                  disabled={disabled}
                  onClick={() => {
                    onChange(candidate);
                    setOpen(false);
                  }}
                >
                  {day || ""}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
