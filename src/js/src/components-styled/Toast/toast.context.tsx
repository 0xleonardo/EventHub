import React from 'react';
import {MessageType} from './toast.model';

type ToastFunctionType = (toast: { message: string, type: MessageType }) => void;

const ToastContext = React.createContext<ToastFunctionType>(() => {
});

export default ToastContext;