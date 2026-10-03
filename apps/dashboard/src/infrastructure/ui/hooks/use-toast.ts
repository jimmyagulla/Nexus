"use client"

import { useToastStore } from "../stores/toast.store"
import type { ToasterToast } from "../stores/toast.store"

type Toast = Omit<ToasterToast, "id">

export function toast({ ...props }: Toast) {
  return useToastStore.getState().addToast(props)
}

export function useToast() {
  const { toasts, addToast, dismissToast } = useToastStore()

  return {
    toasts,
    toast: addToast,
    dismiss: dismissToast,
    successToast: (description: string, overrides?: Partial<Toast>) => 
      addToast({
        title: "Succès",
        description,
        variant: "success",
        ...overrides,
      }),
    errorToast: (description: string, overrides?: Partial<Toast>) => 
      addToast({
        title: "Erreur",
        description,
        variant: "destructive",
        ...overrides,
      }),
  }
}
