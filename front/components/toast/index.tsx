import { useEffect } from 'react'
import styles from './toast.module.scss'

export type Toast = {
    id?: string;
    message: string;
    type: 'error' | 'success';
}

type ToastContainerProps = {
    toasts: Toast[];
    onExpire(id?: string): void;
}

export default function ToastContainer({ toasts, onExpire }: ToastContainerProps) {
    return (
        <div className={styles.container}>
            {toasts.map((toast) => (
                <Toast key={toast.id} toast={toast} onExpire={onExpire} />
            ))}
        </div>
    )
}

type ToastProps = {
    toast: Toast;
    onExpire(id?: string): void;
}

function Toast({ toast, onExpire }: ToastProps) {
    useEffect(() => {
        setTimeout(() => {
            console.log('call delete');
            onExpire(toast.id)
        }, 4000);
    }, [])


    return <div className={`${styles.toast} ${toast.type === 'error' ? styles.error : styles.success}`}>
        {toast.message}
    </div>
}
