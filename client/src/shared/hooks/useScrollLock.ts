import { useEffect } from "react";

export const useScrollLock = (isLocked: boolean) => {
  useEffect(() => {
    document.body.style.overflow = isLocked ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isLocked]);
};
