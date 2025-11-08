import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styles from './BlackjackExperience.module.css';

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const BetFader = ({
  min = 100,
  max = 100000,
  step = 100,
  value,
  onChange,
  disabled = false
}) => {
  const trackRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const ratio = useMemo(() => {
    if (max <= min) return 0;
    return clamp((value - min) / (max - min), 0, 1);
  }, [value, min, max]);

  const handleToValue = useCallback(
    (nextRatio) => {
      if (!onChange) return;
      const raw = min + nextRatio * (max - min);
      const snapped = Math.round(raw / step) * step;
      const clampedValue = clamp(snapped, min, max);
      if (clampedValue !== value) {
        onChange(clampedValue);
      }
    },
    [min, max, step, value, onChange]
  );

  const updateFromPointer = useCallback(
    (clientX) => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const ratio = clamp((clientX - rect.left) / rect.width, 0, 1);
      handleToValue(ratio);
    },
    [handleToValue]
  );

  const handlePointerMove = useCallback(
    (event) => {
      if (!dragging) return;
      if (event.touches && event.touches[0]) {
        updateFromPointer(event.touches[0].clientX);
      } else {
        updateFromPointer(event.clientX);
      }
    },
    [dragging, updateFromPointer]
  );

  const stopDragging = useCallback(() => setDragging(false), []);

  useEffect(() => {
    if (!dragging) return undefined;
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('touchmove', handlePointerMove, { passive: false });
    window.addEventListener('mouseup', stopDragging);
    window.addEventListener('touchend', stopDragging);
    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('mouseup', stopDragging);
      window.removeEventListener('touchend', stopDragging);
    };
  }, [dragging, handlePointerMove, stopDragging]);

  const startDrag = useCallback(
    (event) => {
      if (disabled) return;
      setDragging(true);
      if (event.touches && event.touches[0]) {
        updateFromPointer(event.touches[0].clientX);
      } else {
        updateFromPointer(event.clientX);
      }
      event.preventDefault();
    },
    [disabled, updateFromPointer]
  );

  const leftPercent = `${ratio * 100}%`;

  return (
    <div className={`${styles.faderWrapper} ${disabled ? styles.faderDisabled : ''}`}>
      <div ref={trackRef} className={styles.faderTrack}>
        <div className={styles.faderRail} />
        <div className={styles.faderFill} style={{ width: leftPercent }} />
        <button
          type="button"
          className={styles.faderThumb}
          style={{ left: leftPercent }}
          onMouseDown={startDrag}
          onTouchStart={startDrag}
          disabled={disabled}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-label={`Bet ${value.toLocaleString()} CMX`}
        >
          <span />
        </button>
      </div>
      <div className={styles.faderValue}>Bet {value.toLocaleString()} CMX</div>
    </div>
  );
};

export default BetFader;
