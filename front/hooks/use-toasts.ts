import { useState } from "react"
import { Toast } from "../components/toast"

export default function (closeAfterSeconds: number = 7) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (item: Toast) => {
    const id = Date.now().toString()
    setToasts([
        ...toasts,
        {
            ...item,
            id: id
        }]
    )

    setTimeout(() => {
        removeToast(id)
    }, closeAfterSeconds * 1000);
  }

  const removeToast = (id: string) => {
    setToasts(toasts.filter(toast => toast.id !== id))
  }

  return { toasts, addToast }
}
