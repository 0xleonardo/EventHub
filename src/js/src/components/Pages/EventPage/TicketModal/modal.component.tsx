import React, {ReactNode} from 'react';
import './modal.css';

interface ModalProps {
    show: boolean;
    onClose: () => void;
    children?: ReactNode;
}

const Modal: React.FC<ModalProps> = ({show, onClose, children}) => {
    const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) onClose();
    };

    return (
        <div className={`modal-container ${show ? 'show' : ''}`} onClick={handleContainerClick}>
            <div className="modal-content">
                {children}
            </div>
        </div>
    );
};

export default Modal;
