import { useRef, useEffect } from "react";

function useClickOutside(ref, handleClickOutside) {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handleClickOutside();
    };

    document.addEventListener("mousedown", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
    };
  }, [ref, handleClickOutside]);
}

export default useClickOutside;
