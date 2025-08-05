
// css
import type React from 'react';
import styleModal from './Modal.module.css';

// interface
interface IModal{
    title: string; 
    msg: string; 
    btt1: boolean | string; 
    btt2: boolean | string; 
    display: boolean; 
    onClose: () => void; 
    modalEvent?: (event: React.MouseEvent<HTMLButtonElement>) => void;
};


// modal
const Modal: React.FC<IModal> = ({ title, msg, btt1, btt2, display, onClose, modalEvent }) => {
    return(
        <div className={ display ? styleModal.modal : styleModal.hidden }>
            <div className={ styleModal.modal_content }>
                <span onClick={ onClose } className={ `${styleModal.close_button} ${styleModal.span_btt}` }>
                    &times;
                </span>
                <h2 className={styleModal.h2_modal }>
                    { title }
                </h2>
                <p className={ styleModal.p_modal }>
                    { msg }
                </p>
                {
                    btt1 && (
                        <button onClick={ modalEvent } type='button' className={ styleModal.modal_button }>
                            { btt1 }
                        </button>
                    )
                }
                {
                    btt2 && (
                        <button onClick={ onClose } type='button' className={ styleModal.close_modal_button }>
                            { btt2 }
                        </button>
                    )
                }
            </div>
        </div>
    );
};

export default Modal;