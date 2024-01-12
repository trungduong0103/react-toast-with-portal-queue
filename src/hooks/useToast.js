import React, { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";

import { MAX_TOASTS } from "./constants";
import { toastCss, toastIcon } from "../helpers";

const portal = document.getElementById("toast-portal");

const ToastNotify = ({ message, style, Icon }) => {
  return (
    <div className="a-single-toast" style={style}>
      <Icon className="icon" />
      {message}
    </div>
  );
};

const useToast = () => {
  // toasts to display maximum 4 toasts on window
  const [toasts, setToasts] = useState([]);
  // queuedToasts to handle the rest of the toasts
  const toastsQueue = useRef([]);

  const showToast = (message, type) => {
    const toast = {
      message,
      type,
    };

    if (toasts.length < MAX_TOASTS) {
      setToasts((prev) => [toast, ...prev]);
    } else {
      toastsQueue.current = [toast, ...toastsQueue.current];
    }
  };

  useEffect(() => {
    if (!toasts.length) return;

    const interval = setInterval(() => {
      if (toasts.length === MAX_TOASTS && toastsQueue.current.length) {
        setToasts((prev) => [
          toastsQueue.current[toastsQueue.current.length - 1],
          ...prev.slice(0, prev.length - 1),
        ]);
        toastsQueue.current = toastsQueue.current.slice(
          0,
          toastsQueue.current.length - 1
        );
      } else {
        setToasts((prev) => prev.slice(0, prev.length - 1));
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [toasts]);

  const Toasts = () => {
    return createPortal(
      toasts.map((toast, index) => {
        const { message, type } = toast;
        return (
          <ToastNotify
            key={index}
            message={message}
            style={toastCss(type, index)}
            Icon={toastIcon(type)}
          />
        );
      }),
      portal
    );
  };

  return {
    Toasts,
    showToast,
  };
};

export default useToast;
