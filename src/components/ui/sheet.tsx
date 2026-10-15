"use client";

import { AnimatePresence, motion, useDragControls } from "motion/react";
import { X } from "lucide-react";
import { useEffect } from "react";
import { spring } from "@/lib/tokens";

/**
 * Responsive overlay: bottom sheet on mobile (drag down to dismiss),
 * centered dialog on ≥ md.
 */
export function Sheet({
  open,
  onClose,
  children,
  label,
  agent,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  label: string;
  agent?: string;
}) {
  const drag = useDragControls();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-overlay flex items-end justify-center md:items-center md:p-6">
          <motion.button
            aria-label="Close"
            className="absolute inset-0 bg-scrim backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={label}
            data-agent={agent}
            initial={{ y: "100%", opacity: 0.6 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={spring.soft}
            drag="y"
            dragListener={false}
            dragControls={drag}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 120 || info.velocity.y > 600) onClose();
            }}
            className="relative max-h-(--sheet-max-h) w-full overflow-hidden rounded-t-xl border border-line-strong bg-surface shadow-lg md:max-w-2xl md:rounded-xl"
          >
            <div
              onPointerDown={(e) => drag.start(e)}
              className="flex cursor-grab touch-none justify-center pt-3 pb-1 md:hidden"
            >
              <span className="h-1.5 w-12 rounded-pill bg-line-strong" />
            </div>
            <button
              onClick={onClose}
              aria-label="Close dialog"
              className="absolute top-4 right-4 z-10 grid size-9 place-items-center rounded-pill bg-surface-3 text-ink-muted transition-colors hover:text-ink"
            >
              <X className="size-4" />
            </button>
            <div className="max-h-(--sheet-body-max-h) overflow-y-auto overscroll-contain">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
