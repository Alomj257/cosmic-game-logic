import React from 'react';
import { X } from 'lucide-react';

const ReviewModal = ({
    onClose,
    recordMode,
    recordNumber,
    bookNumber,
    bookName,
    groupType,
    tagMainId,
    tagVersionHId,
    tagVersionEId,
    briefIntroduction
}) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg border border-green-700 w-full max-w-3xl relative overflow-y-auto max-h-[90vh]">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-red-600 hover:text-red-800"
                >
                    <X size={24} />
                </button>

                {/* Modal Heading */}
                <h3 className="text-2xl font-bold text-green-700 mb-6 text-center underline">
                    Review Book Details
                </h3>

                {/* Basic Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-6 text-gray-900">
                    <div>
                        <span className="text-green-700 font-semibold">Record Mode:</span> 
                        <span className="ml-1">{recordMode || ''}</span>
                    </div>

                    <div>
                        <span className="text-green-700 font-semibold">Record Number:</span> 
                        <span className="ml-1">{recordNumber || ''}</span>
                    </div>

                    <div>
                        <span className="text-green-700 font-semibold">Book Number:</span> 
                        <span className="ml-1">{bookNumber || ''}</span>
                    </div>

                    <div>
                        <span className="text-green-700 font-semibold">Group Type:</span> 
                        <span className="ml-1">{groupType || ''}</span>
                    </div>

                    <div>
                        <span className="text-green-700 font-semibold">Tag Main Version ID:</span> 
                        <span className="ml-1">{tagMainId || ''}</span>
                    </div>

                    <div>
                        <span className="text-green-700 font-semibold">Tag Version H. ID:</span> 
                        <span className="ml-1">{tagVersionHId || ''}</span>
                    </div>

                    <div>
                        <span className="text-green-700 font-semibold">Tag Version E. ID:</span> 
                        <span className="ml-1">{tagVersionEId || ''}</span>
                    </div>
                </div>

                {/* Book Name */}
                <div className="mb-6">
                    <h4 className="text-xl font-bold text-green-700 mb-2">Book Name</h4>
                    <div className="border border-green-600 rounded p-3 bg-gray-50 text-gray-900 text-sm leading-relaxed min-h-[50px]"
                        dangerouslySetInnerHTML={{ __html: bookName || '' }}
                    />
                </div>

                {/* Brief Introduction */}
                <div className="mb-6">
                    <h4 className="text-xl font-bold text-green-700 mb-2">Brief Introduction</h4>
                    <div className="border border-green-600 rounded p-3 bg-gray-50 text-gray-900 space-y-3 text-sm leading-relaxed min-h-[50px]">
                        {briefIntroduction && briefIntroduction.length > 0 ? (
                            briefIntroduction.map((intro, idx) => (
                                <div
                                    key={idx}
                                    dangerouslySetInnerHTML={{ __html: intro }}
                                />
                            ))
                        ) : (
                            <div>No Introduction</div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ReviewModal;
