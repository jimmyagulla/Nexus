import { create } from 'zustand';
import * as React from 'react';
import type { ToastActionElement, ToastProps } from '../shared/toast';

const TOAST_LIMIT = 5;
const TOAST_REMOVE_DELAY = 1000000;

export type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

interface ToastState {
  toasts: ToasterToast[];
  addToast: (toast: Omit<ToasterToast, 'id'>) => { id: string; dismiss: () => void; update: (props: ToasterToast) => void };
  updateToast: (toast: Partial<ToasterToast> & { id: string }) => void;
  dismissToast: (toastId?: string) => void;
  removeToast: (toastId?: string) => void;
}

let count = 0;
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],

  addToast: (toast) => {
    const id = genId();

    const dismiss = () => get().dismissToast(id);
    const update = (props: ToasterToast) => get().updateToast({ ...props, id });

    set((state) => ({
      toasts: [
        {
          ...toast,
          id,
          open: true,
          onOpenChange: (open: boolean) => {
            if (!open) dismiss();
          },
        },
        ...state.toasts,
      ].slice(0, TOAST_LIMIT),
    }));

    return { id, dismiss, update };
  },

  updateToast: (toast) => {
    set((state) => ({
      toasts: state.toasts.map((t) => (t.id === toast.id ? { ...t, ...toast } : t)),
    }));
  },

  dismissToast: (toastId) => {
    const addToRemoveQueue = (id: string) => {
      if (toastTimeouts.has(id)) return;

      const timeout = setTimeout(() => {
        toastTimeouts.delete(id);
        get().removeToast(id);
      }, TOAST_REMOVE_DELAY);

      toastTimeouts.set(id, timeout);
    };

    if (toastId) {
      addToRemoveQueue(toastId);
    } else {
      get().toasts.forEach((toast) => addToRemoveQueue(toast.id));
    }

    set((state) => ({
      toasts: state.toasts.map((t) =>
        t.id === toastId || toastId === undefined ? { ...t, open: false } : t
      ),
    }));
  },

  removeToast: (toastId) => {
    set((state) => ({
      toasts:
        toastId === undefined
          ? []
          : state.toasts.filter((t) => t.id !== toastId),
    }));
  },
}));
