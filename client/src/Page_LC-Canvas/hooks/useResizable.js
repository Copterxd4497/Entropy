import { useState, useRef, useCallback } from "react";

export function useResizableH(initial = 41, min = 20, max = 72) {
  const [pct, setPct] = useState(initial);
  const dragging = useRef(false);

  const onMouseDown = useCallback((e) => {
    e.preventDefault();
    dragging.current = true;
    const onMove = (ev) => {
      if (!dragging.current) return;
      setPct(Math.min(max, Math.max(min, (ev.clientX / window.innerWidth) * 100)));
    };
    const onUp = () => {
      dragging.current = false;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, [min, max]);

  return [pct, onMouseDown];
}

export function useResizableV(initial = 62, min = 30, max = 88) {
  const [pct, setPct] = useState(initial);
  const dragging = useRef(false);

  const onMouseDown = useCallback((e) => {
    e.preventDefault();
    dragging.current = true;
    const container = e.currentTarget.closest(".right-panel");
    const onMove = (ev) => {
      if (!dragging.current || !container) return;
      const rect = container.getBoundingClientRect();
      setPct(Math.min(max, Math.max(min, ((ev.clientY - rect.top) / rect.height) * 100)));
    };
    const onUp = () => {
      dragging.current = false;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, [min, max]);

  return [pct, onMouseDown];
}
