"use client";

import type { CSSProperties, ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";

type DismissibleNoticeProps = {
  storageKey?: string;
  children: ReactNode;
  style?: CSSProperties;
  persist?: boolean;
};

const closeButtonStyle: CSSProperties = {
  position: "absolute",
  top: "8px",
  right: "8px",
  width: "24px",
  height: "24px",
  borderRadius: "999px",
  border: "1px solid var(--border)",
  background: "transparent",
  color: "var(--muted)",
  cursor: "pointer",
  fontSize: "14px",
  lineHeight: 1,
};

export function DismissibleNotice({
  storageKey,
  children,
  style,
  persist = true,
}: DismissibleNoticeProps) {
  const [mounted, setMounted] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const resolvedStorageKey = useMemo(() => {
    if (!storageKey) return null;
    return `portal-notice:${storageKey}`;
  }, [storageKey]);

  useEffect(() => {
    setMounted(true);

    if (!persist || !resolvedStorageKey) {
      return;
    }

    try {
      const isDismissed = window.localStorage.getItem(resolvedStorageKey) === "1";
      setDismissed(isDismissed);
    } catch {
      setDismissed(false);
    }
  }, [persist, resolvedStorageKey]);

  if (!mounted || dismissed) {
    return null;
  }

  return (
    <div
      style={{
        position: "relative",
        paddingRight: "38px",
        ...style,
      }}
    >
      {children}
      <button
        type="button"
        aria-label="Dismiss notification"
        onClick={() => {
          setDismissed(true);
          if (!persist || !resolvedStorageKey) return;
          try {
            window.localStorage.setItem(resolvedStorageKey, "1");
          } catch {
            // no-op when storage is unavailable
          }
        }}
        style={closeButtonStyle}
      >
        x
      </button>
    </div>
  );
}
