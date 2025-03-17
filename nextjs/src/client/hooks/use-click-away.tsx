import { useEffect } from "react";

export const useClickAway = ({
  ref,
  optionalRef,
  handler,
}: {
  ref: React.RefObject<HTMLElement>;
  optionalRef?: React.RefObject<HTMLElement>;
  handler: (event: MouseEvent) => void;
}) => {
  useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (ref.current?.contains(event.target as Node)) {
        return;
      }
      if (optionalRef?.current?.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };

    document.addEventListener("mousedown", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
    };
  }, [ref, optionalRef, handler]);
};
