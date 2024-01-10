import React, { useEffect } from "react";

export const useOutsideClickHandler = (ref: any, toggle: () => void) => {
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (ref && ref.current && !ref.current.contains(event.target)) {
        toggle();
      }
    }

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, toggle]);
};
