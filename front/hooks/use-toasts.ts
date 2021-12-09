import { useEffect, useRef, useState } from "react"
import { Toast } from "../components/toast"

export default function useToast ()  {
  const toastsRef = useRef<Toast[]>([])
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    toastsRef.current = toasts
  }, [toasts])
  
  const addToast = (item: Toast) => {
    const id = Date.now().toString()
    console.log('addtoast', toasts);
  
    setToasts([
        ...toastsRef.current,
        {
            ...item,
            id: id
        }]
    )
  }

  const removeToast = (id: string) => {
    console.log('removetoast', toasts, id);
    const value = [...toastsRef.current].filter(toast => toast.id !== id)
    console.log('will put this:', value);
    
    setToasts(value)
  }

  return { toasts, addToast, removeToast }
}
