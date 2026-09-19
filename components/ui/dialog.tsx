"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const TRANSITION_MS = 180;

export function Dialog({
  open,
  onClose,
  title,
  children,
  className,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [visible, setVisible] = useState(false);
  const [maxHeight, setMaxHeight] = useState<number | null>(null);

  useEffect(() => {
    const updateMaxHeight = () => {
      const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
      const ratio = window.innerWidth >= 640 ? 0.9 : 0.95;
      setMaxHeight(Math.round(viewportHeight * ratio));
    };
    updateMaxHeight();
    window.addEventListener("resize", updateMaxHeight);
    window.visualViewport?.addEventListener("resize", updateMaxHeight);
    return () => {
      window.removeEventListener("resize", updateMaxHeight);
      window.visualViewport?.removeEventListener("resize", updateMaxHeight);
    };
  }, []);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;

    if (open) {
      if (!dialog.open) dialog.showModal();
      let raf2 = 0;
      const raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => setVisible(true));
      });
      return () => {
        cancelAnimationFrame(raf1);
        cancelAnimationFrame(raf2);
      };
    }

    setVisible(false);
    const timeout = setTimeout(() => {
      if (dialog.open) dialog.close();
    }, TRANSITION_MS);
    return () => clearTimeout(timeout);
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      style={maxHeight ? { maxHeight } : undefined}
      className={cn(
        "fixed top-1/2 left-1/2 m-0 flex max-h-[90vh] w-[calc(100vw-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-xl border border-border bg-background p-0 text-foreground shadow-xl transition-all duration-200 ease-out backdrop:transition-colors backdrop:duration-200",
        visible
          ? "pointer-events-auto scale-100 opacity-100 backdrop:bg-black/50"
          : "pointer-events-none scale-95 opacity-0 backdrop:bg-black/0",
        className
      )}
    >
      <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3">
        <h2 className="text-sm font-semibold">{title}</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup"
          className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          ✕
        </button>
      </div>
      <div className="min-h-0 flex-auto overflow-y-auto p-4">{children}</div>
    </dialog>
  );
}
