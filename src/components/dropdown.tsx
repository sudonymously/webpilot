import React, { ReactNode } from "react";

interface DropdownProps {
    title: string | JSX.Element;
    children: ReactNode;
    isDropdownOpen: boolean;
    setIsDropdownOpen: (isDropdownOpen: boolean) => void;
}

function Dropdown({ title = '', children, isDropdownOpen, setIsDropdownOpen }: DropdownProps) {

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };
    
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="relative inline-block">
                <button
                    type="button"
                    className="inline-flex justify-center w-48 rounded-md border border-zinc-800 shadow-sm px-4 py-2 bg-zinc-900 text-sm font-medium text-zinc-300 hover:text-zinc-200 hover:border-zinc-200"
                    id="options-menu"
                    aria-haspopup="true"
                    aria-expanded="true"
                    onClick={toggleDropdown}
                >
                    {title}
                </button>

                {/* Dropdown menu */}
                {isDropdownOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-96 rounded-md shadow-xl text-white bg-[#111215]  border border-zinc-500 ring-opacity-5 py-2 px-2">
                        <div className="py-1">
                            <div className="flex flex-col">
                                {children}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Dropdown;