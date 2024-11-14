import React, {useEffect} from 'react';
import './toast.css';
import {MessageType} from "./toast.model";

interface ToastProps {
    toast: { message: string, type: MessageType };
    hideToast: () => void;
}

const Toast: React.FC<ToastProps> = ({toast, hideToast}) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            hideToast();
        }, 3000);

        return () => clearTimeout(timer);
    }, [hideToast]);

    const getToastClassName = () => {
        switch (toast.type) {
            case MessageType.SUCCESS:
                return 'toast success';
            case MessageType.FAILURE:
                return 'toast failure';
            case MessageType.INFO:
                return 'toast info';
            default:
                return 'toast';
        }
    }

    const getToastIcon = () => {
        switch (toast.type) {
            case MessageType.SUCCESS:
                return 'fa-regular fa-circle-check';
            case MessageType.FAILURE:
                return 'fa-solid fa-triangle-exclamation';
            case MessageType.INFO:
                return 'fa-solid fa-circle-info';
            default:
                return 'toast';
        }
    }

    return (
        <div className={getToastClassName()}>
            <div>
                <i className={getToastIcon()}/>
                <div>{`${toast.message}`}</div>
            </div>
        </div>
    );
}

export default Toast;