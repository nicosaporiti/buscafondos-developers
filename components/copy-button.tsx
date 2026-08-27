"use client";

import { useEffect, useRef, useState } from "react";
import { CheckIcon, CopyIcon } from "./icons";

type CopyStatus = "idle" | "success" | "error";

function feedbackFor(status: CopyStatus, label: string): string {
  switch (status) {
    case "success":
      return "Copiado";
    case "error":
      return "No se pudo copiar. Intenta de nuevo.";
    case "idle":
      return label;
  }
}

export function CopyButton({ value, label = "Copiar" }: { readonly value: string; readonly label?: string }) {
  const [status, setStatus] = useState<CopyStatus>("idle");
  const resetTimerRef = useRef<number | undefined>(undefined);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (resetTimerRef.current !== undefined) window.clearTimeout(resetTimerRef.current);
    };
  }, []);

  function showSuccess(): void {
    if (!isMountedRef.current) return;
    if (resetTimerRef.current !== undefined) window.clearTimeout(resetTimerRef.current);
    setStatus("success");
    resetTimerRef.current = window.setTimeout(() => {
      if (isMountedRef.current) setStatus("idle");
    }, 1600);
  }

  function showError(): void {
    if (!isMountedRef.current) return;
    if (resetTimerRef.current !== undefined) window.clearTimeout(resetTimerRef.current);
    setStatus("error");
  }

  async function copy(): Promise<void> {
    if (!navigator.clipboard?.writeText) {
      showError();
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      showSuccess();
    } catch {
      showError();
    }
  }

  const feedback = feedbackFor(status, label);

  return <button className="copy-button" type="button" onClick={() => void copy()} aria-label={`${label}: ${feedback}`}>
    {status === "success" ? <CheckIcon /> : <CopyIcon />} <span role="status" aria-live="polite" aria-atomic="true">{feedback}</span>
  </button>;
}
