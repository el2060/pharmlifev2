import { createPortal } from 'react-dom';
import { createContext, useContext, useEffect, useId, useRef, type KeyboardEvent, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  showCloseButton?: boolean;
}

export const ShiftRestartContext = createContext<{ requestRestart: () => void; restartOpen: boolean } | null>(null);

export function Modal({ isOpen, onClose, title, children, showCloseButton = true }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const restart = useContext(ShiftRestartContext);
  const caseFeedback = showCloseButton ? null : restart;
  const visible = isOpen && !caseFeedback?.restartOpen;

  useEffect(() => {
    if (!visible) return;
    const previouslyFocused = document.activeElement;
    dialogRef.current?.focus();

    return () => {
      if (previouslyFocused instanceof HTMLElement && previouslyFocused.isConnected) {
        previouslyFocused.focus();
      }
    };
  }, [visible]);

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape' && showCloseButton) {
      event.stopPropagation();
      onClose();
    }
    if (event.key !== 'Tab') return;

    const focusable = [...event.currentTarget.querySelectorAll<HTMLElement>(
      'button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]'
    )];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;
    if (!first || (event.shiftKey && (active === first || active === event.currentTarget))) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  return createPortal(
    <AnimatePresence>
      {visible && (
        <motion.div
          className="shift-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(event) => {
            if (showCloseButton && event.target === event.currentTarget) onClose();
          }}
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? titleId : undefined}
            aria-label={title ? undefined : 'Case feedback'}
            tabIndex={-1}
            onKeyDown={handleKeyDown}
            className="shift-modal"
            initial={{ y: 12 }}
            animate={{ y: 0 }}
          >
            {showCloseButton && (
              <button type="button" className="shift-modal-close" onClick={onClose} aria-label="Close dialog">
                <X size={19} aria-hidden="true" />
              </button>
            )}
            {title && <h2 className="shift-modal-title" id={titleId}>{title}</h2>}
            {children}
            {caseFeedback && (
              <button type="button" className="feedback-restart" onClick={caseFeedback.requestRestart}>
                Restart shift
              </button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.querySelector('.pharmacy-app') ?? document.body
  );
}
