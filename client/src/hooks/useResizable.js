//creates the logic for a draggable vertical divider between two panels.

import { useState, useCallback, useRef } from "react";

/**
 * Returns [leftPercent, onMouseDown] for a horizontal drag divider.
 * @param {number} initial  – starting left-panel width as percentage (0–100)
 * @param {number} min      – minimum left percentage
 * @param {number} max      – maximum left percentage
 */
export function useResizable(initial = 40, min = 20, max = 75) {
  const [leftPct, setLeftPct] = useState(initial);
  const dragging = useRef(false);

  const onMouseDown = useCallback(
    (e) => {
      e.preventDefault();
      dragging.current = true;

      const onMove = (ev) => {
        if (!dragging.current) return;
        const pct = (ev.clientX / window.innerWidth) * 100;
        setLeftPct(Math.min(max, Math.max(min, pct)));
      };

      const onUp = () => {
        dragging.current = false;
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };

      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [min, max],
  );

  return [leftPct, onMouseDown];
}
