import styles from './toast.module.scss'

export type Toast = {
    id?: string;
    message: string;
    type: 'error' | 'success';
}

type Props = {
    toasts: Toast[];
}

export default function ToastContainer({ toasts }: Props) {
    return (
        <div className={styles.container}>
            {toasts.map((toast) => (
                <div key={toast.id} className={`${styles.toast} ${toast.type === 'error' ? styles.error : styles.success}`}>
                    {toast.message}
                </div>
            ))}
        </div>
    )
}
