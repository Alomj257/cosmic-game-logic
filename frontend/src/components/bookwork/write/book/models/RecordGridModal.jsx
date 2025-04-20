import React, { useState } from 'react';
import { X } from 'lucide-react';

const RecordGridModal = ({ title, values, onClose }) => {
    const itemsPerPage = 40; // 4 columns * 10 rows
    const [page, setPage] = useState(0);

    const startIndex = page * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedValues = values.slice(startIndex, endIndex);

    const totalPages = Math.ceil(values.length / itemsPerPage);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg shadow-lg max-w-2xl w-full relative">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-green-800 hover:text-green-600"
                >
                    <X size={20} />
                </button>

                <h3 className="text-lg font-bold text-green-800 mb-4 text-center">{title}</h3>

                {/* Grid */}
                <div className="grid grid-cols-4 gap-2 max-h-72 overflow-y-auto px-2">
                    {paginatedValues.map((val, index) => (
                        <div
                            key={index}
                            className="bg-green-100 text-center text-xs font-semibold border border-green-500 rounded py-1"
                        >
                            {val}
                        </div>
                    ))}
                </div>

                {/* Pagination controls */}
                <div className="flex justify-between items-center m-2">
                    {/* Prev Button */}
                    <button
                        onClick={() => setPage(prev => Math.max(prev - 1, 0))}
                        disabled={page === 0}
                        className="text-sm bg-green-600 text-white px-4 py-1 rounded disabled:opacity-50"
                    >
                        Prev
                    </button>

                    {/* Page Info */}
                    <div className="text-sm text-green-700">
                        {page + 1} of {totalPages}
                    </div>

                    {/* Next Button */}
                    <button
                        onClick={() => setPage(prev => Math.min(prev + 1, totalPages - 1))}
                        disabled={page >= totalPages - 1}
                        className="text-sm bg-green-600 text-white px-4 py-1 rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RecordGridModal;
