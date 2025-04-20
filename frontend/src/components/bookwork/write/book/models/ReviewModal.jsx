import React from 'react';

const ReviewModal = ({
    onClose,
    recordMode,
    recordNumber,
    bookNumber,
    bookName,
    groupType,
    tagMainId,
    tagVersionHId,
    tagVersionEId
}) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg border border-green-700 w-full max-w-2xl">
                <h3 className="text-2xl font-bold text-green-800 mb-4 text-center">Review Book Details</h3>
                <div className="space-y-2 text-green-900 text-sm">
                    <p><span className="font-semibold">Record Mode:</span> {recordMode}</p>
                    {recordMode === 'manual' && (
                        <p><span className="font-semibold">Record Number:</span> {recordNumber}</p>
                    )}
                    <p><span className="font-semibold">Book Number:</span> {bookNumber}</p>
                    <p><span className="font-semibold">Book Name:</span> {bookName}</p>
                    <p><span className="font-semibold">Group Type:</span> {groupType}</p>
                    <p><span className="font-semibold">Tag Main Version ID:</span> {tagMainId}</p>
                    <p><span className="font-semibold">Tag Version H. ID:</span> {tagVersionHId}</p>
                    <p><span className="font-semibold">Tag Version E. ID:</span> {tagVersionEId}</p>
                </div>
                <div className="flex justify-end mt-6">
                    <button
                        onClick={onClose}
                        className="bg-green-600 text-white px-4 py-2 rounded font-bold"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReviewModal;
