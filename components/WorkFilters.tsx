'use client';

import { useRef, type KeyboardEvent } from 'react';
import styles from './WorkFilters.module.css';

export type FilterOption<T extends string> = { value: T; label: string };

type Props<T extends string> = {
  options: readonly FilterOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Accessible name of the tab list. */
  label?: string;
  /** Prefix for the tab ids; the panel points back at them with aria-labelledby. */
  idPrefix?: string;
  /** id of the element these tabs control (a role="tabpanel"). */
  panelId?: string;
};

/** The id of the tab for `value`, for the panel's aria-labelledby. */
export const filterTabId = (idPrefix: string, value: string) => `${idPrefix}-tab-${value}`;

/**
 * Filter pill bar. A controlled tab list: one tab stop (the selected tab),
 * Left / Right / Home / End move and select, Tab leaves the bar.
 */
export default function WorkFilters<T extends string>({
  options,
  value,
  onChange,
  label = 'Filter work',
  idPrefix = 'work',
  panelId,
}: Props<T>) {
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const select = (index: number) => {
    const next = (index + options.length) % options.length;
    onChange(options[next].value);
    tabs.current[next]?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    switch (event.key) {
      case 'ArrowRight': event.preventDefault(); select(index + 1); break;
      case 'ArrowLeft': event.preventDefault(); select(index - 1); break;
      case 'Home': event.preventDefault(); select(0); break;
      case 'End': event.preventDefault(); select(options.length - 1); break;
    }
  };

  return (
    <div className={styles.filterContainer} role="tablist" aria-label={label}>
      {options.map((option, index) => {
        const isActive = option.value === value;
        return (
          <button
            key={option.value}
            ref={(el) => { tabs.current[index] = el; }}
            id={filterTabId(idPrefix, option.value)}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls={panelId}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(option.value)}
            onKeyDown={(event) => onKeyDown(event, index)}
            className={`${styles.filterPill} ${isActive ? styles.active : ''}`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
