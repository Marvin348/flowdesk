import { useEffect, type RefObject } from "react";

export const useOnClickOutside = <T extends HTMLElement>(
  ref: RefObject<T | null>,
  onOutsideClick: () => void,
) => {
  useEffect(() => {
    const listener = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current?.contains(e.target as Node)) {
        onOutsideClick();
      }
    };

    document.addEventListener("mousedown", listener);
    return () => document.removeEventListener("mousedown", listener);
  }, [ref, onOutsideClick]);
};
