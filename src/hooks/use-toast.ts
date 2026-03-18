import { useState } from 'react'

export interface Toast {
  id: string
  title?: string
  description?: string
  action?: any
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = (props: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts((prev) => [...prev, { ...props, id }])
  }

  return {
    toast,
    toasts,
    dismiss: (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id))
  }
}
