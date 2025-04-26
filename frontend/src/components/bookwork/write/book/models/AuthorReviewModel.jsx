import React from 'react';
import { X } from 'lucide-react';

const AuthoReviewModel = ({ isOpen, onClose, recordNumber, bookDetails, authorNotes }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full p-6 overflow-y-auto max-h-[90vh] relative">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-red-600 hover:text-red-800"
                >
                    <X size={24} />
                </button>

                {/* Modal Heading */}
                <h2 className="text-2xl font-bold text-green-700 mb-6 text-center underline">
                    Review Book Details
                </h2>

                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-6">
                    <div>
                        <span className="text-green-700 font-semibold">Record Number:</span> 
                        <span className="text-gray-800 ml-1">{recordNumber}</span>
                    </div>
                    <div>
                        <span className="text-green-700 font-semibold">Book Number:</span> 
                        <span className="text-gray-800 ml-1">{bookDetails?.bookNumber}</span>
                    </div>
                    <div>
                        <span className="text-green-700 font-semibold">Group Type:</span> 
                        <span className="text-gray-800 ml-1">{bookDetails?.groupType}</span>
                    </div>
                    <div>
                        <span className="text-green-700 font-semibold">Tag Main Version ID:</span> 
                        <span className="text-gray-800 ml-1">{bookDetails?.tagMainVersionId}</span>
                    </div>
                    <div>
                        <span className="text-green-700 font-semibold">Tag Version H ID:</span> 
                        <span className="text-gray-800 ml-1">{bookDetails?.tagVersionHId}</span>
                    </div>
                    <div>
                        <span className="text-green-700 font-semibold">Tag Version E ID:</span> 
                        <span className="text-gray-800 ml-1">{bookDetails?.tagVersionEId}</span>
                    </div>
                </div>

                {/* Book Name */}
                <div className="mb-6">
                    <h3 className="text-xl font-bold text-green-700 mb-2">Book Name</h3>
                    <div 
                        className="border border-green-600 rounded p-3 bg-gray-50 text-gray-900 text-sm leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: bookDetails?.bookName || 'No Book Name' }}
                    />
                </div>

                {/* Brief Introduction */}
                <div className="mb-6">
                    <h3 className="text-xl font-bold text-green-700 mb-2">Brief Introduction</h3>
                    <div className="border border-green-600 rounded p-3 bg-gray-50 text-gray-900 space-y-3 text-sm leading-relaxed">
                        {bookDetails?.briefIntroduction?.length > 0 ? (
                            bookDetails.briefIntroduction.map((paraObj, idx) => (
                                <div 
                                    key={paraObj._id || idx}
                                    dangerouslySetInnerHTML={{ __html: paraObj.paragraph }}
                                />
                            ))
                        ) : (
                            <p className="italic text-gray-500">No introduction available</p>
                        )}
                    </div>
                </div>

                {/* Author Notes */}
                <div>
                    <h3 className="text-xl font-bold text-green-700 mb-2">Author Notes</h3>
                    <div className="border border-green-600 rounded p-3 bg-gray-50 text-gray-900 space-y-3 text-sm leading-relaxed">
                        {authorNotes?.length > 0 ? (
                            authorNotes.map((noteObj, idx) => (
                                <div 
                                    key={noteObj._id || idx}
                                    dangerouslySetInnerHTML={{ __html: noteObj.note || noteObj.paragraph || noteObj }}
                                />
                            ))
                        ) : (
                            <p className="italic text-gray-500">No author notes added</p>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AuthoReviewModel;
