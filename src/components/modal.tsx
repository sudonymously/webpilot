import { ReactNode, useEffect, useRef } from "react";

interface ModalProps {
    children: ReactNode;
    showModal: boolean;
    onClose: () => void;
}

function Modal({ children, showModal, onClose = () => null }: ModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [modalRef, onClose]);

    return (
        <>
            {showModal && (
                <div
                    className="fixed top-0 left-0 bottom-0 right-0 flex justify-center items-center bg-zinc-700 bg-opacity-50 z-50"
                >
                    <div
                        ref={modalRef}
                        className="bg-[#111215] p-6 rounded shadow-md relative max-w-[500px]"
                    >
                        <button
                            className="absolute top-0 right-0 p-4 focus:outline-none"
                            onClick={onClose}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                        {children}
                    </div>
                </div>
            )}
        </>
    );
}

export default Modal;