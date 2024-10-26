import React, { useState } from 'react';

const Modal = ({ isOpen, onClose, selectedOption, handleOptionClick, searchTerm, handleSearchChange, filteredOptions }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg w-80">
                <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                    onClick={onClose}
                >
                    <svg
                        className="h-6 w-6"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            fillRule="evenodd"
                            d="M6.293 4.293a1 1 0 011.414 0L10 5.586l2.293-1.293a1 1 0 111.414 1.414L11.414 7l2.293 2.293a1 1 0 01-1.414 1.414L10 8.414l-2.293 2.293a1 1 0 01-1.414-1.414L8.586 7 6.293 4.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>

                <div className="p-4">
                    <div className="relative flex justify-end text-left w-full">
                        <div className="w-full">
                            <button
                                type="button"
                                className="inline-flex justify-between w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                {selectedOption || "Options"}
                                <svg
                                    className="-mr-1 ml-2 h-5 w-5"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M5.23 7.21a.75.75 0 011.06 0L10 10.94l3.71-3.73a.75.75 0 111.06 1.06l-4 4a.75.75 0 01-1.06 0l-4-4a.75.75 0 010-1.06z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>
                        </div>

                        {/* Dropdown menu */}
                        <div className="relative flex justify-end mt-2">
                            <div
                                className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-black ring-opacity-5 focus:outline-none z-10"
                            >
                                <div className="py-1">
                                    {/* Search Input */}
                                    <input
                                        type="text"
                                        className="block w-full px-4 py-2 text-sm border-b border-gray-300 focus:outline-none"
                                        placeholder="Search..."
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                    />

                                    {/* Filtered options */}
                                    {filteredOptions.length > 0 ? (
                                        filteredOptions.map((option, index) => (
                                            <button
                                                key={index}
                                                className="text-gray-700 block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                                onClick={() => handleOptionClick(option)}
                                            >
                                                {option}
                                            </button>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 block px-4 py-2 text-sm">No results found</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;
