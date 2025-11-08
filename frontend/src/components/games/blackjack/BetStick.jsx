import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styles from './BlackjackExperience.module.css';

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const BetStick = ({
  min = 100,
  max = 100000,
  step = 100,
  value,
  onChange,
  disabled = false,
  label = 'Bet'
}) => {
  const trackRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const normalized = useMemo(() => {
    if (max === min) return 0;
    return clamp((value - min) / (max - min), 0, 1);
  }, [value, min, max]);

  const angle = useMemo(() => normalized * 270 - 225, [normalized]);

  const handleValueChange = useCallback(
    (nextRatio) => {
      if (!onChange) return;
      const raw = min + nextRatio * (max - min);
      const adjusted = Math.round(raw / step) * step;
      const clamped = clamp(adjusted, min, max);
      if (clamped !== value) {
        onChange(clamped);
      }
    },
    [min, max, step, value, onChange]
  );

  const updateFromPoint = useCallback(
    (clientX, clientY) => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = clientX - centerX;
      const dy = clientY - centerY;
      const rawAngle = Math.atan2(dy, dx); // -PI to PI
      let degrees = (rawAngle * 180) / Math.PI;
      degrees = (degrees + 450) % 360; // rotate so 0° is bottom
      if (degrees > 270) degrees = 270;
      const ratio = degrees / 270;
      handleValueChange(ratio);
    },
    [handleValueChange]
  );

  const handlePointerMove = useCallback(
    (event) => {
      if (!dragging) return;
      if (event.touches && event.touches[0]) {
        updateFromPoint(event.touches[0].clientX, event.touches[0].clientY);
      } else {
        updateFromPoint(event.clientX, event.clientY);
      }
    },
    [dragging, updateFromPoint]
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
        updateFromPoint(event.touches[0].clientX, event.touches[0].clientY);
      } else {
        updateFromPoint(event.clientX, event.clientY);
      }
      event.preventDefault();
    },
    [disabled, updateFromPoint]
  );

  const formattedValue = useMemo(() => value.toLocaleString(), [value]);

  return (
    <div className={`${styles.betStickWrapper} ${disabled ? styles.betStickDisabled : ''}`}>
      <div ref={trackRef} className={styles.betStickTrack}>
        <div className={styles.betStickInner} />
        <button
          type="button"
          className={styles.betStickHandle}
          style={{ transform: `rotate(${angle}deg)` }}
          onMouseDown={startDrag}
          onTouchStart={startDrag}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-label={`${label}: ${formattedValue} CMX`}
          disabled={disabled}
        >
          <span />
        </button>
        <div className={styles.betStickValue}>
          <span className={styles.betStickLabel}>{label}</span>
          <strong>{formattedValue} CMX</strong>
        </div>
      </div>
    </div>
  );
};

export default BetStick;

