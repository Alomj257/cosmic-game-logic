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
    tagVersionEId,
    briefIntroduction, // Add the briefIntroduction prop
    authorNotes // Add the authorNotes prop
}) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg border border-green-700 w-full max-w-2xl">
                <h3 className="text-2xl font-bold text-green-800 mb-4 text-center">Review Book Details</h3>
                <div className="space-y-2 text-green-900 text-sm">
                    <p><span className="font-semibold">Record Mode:</span> {recordMode || 'N/A'}</p>

                    {recordMode === 'manual' && recordNumber && (
                        <p><span className="font-semibold">Record Number:</span> {recordNumber}</p>
                    )}

                    {bookNumber && (
                        <p><span className="font-semibold">Book Number:</span> {bookNumber}</p>
                    )}

                    {bookName && (
                        <p><span className="font-semibold">Book Name:</span> {bookName}</p>
                    )}

                    {groupType && (
                        <p><span className="font-semibold">Group Type:</span> {groupType}</p>
                    )}

                    {tagMainId && (
                        <p><span className="font-semibold">Tag Main Version ID:</span> {tagMainId}</p>
                    )}

                    {tagVersionHId && (
                        <p><span className="font-semibold">Tag Version H. ID:</span> {tagVersionHId}</p>
                    )}

                    {tagVersionEId && (
                        <p><span className="font-semibold">Tag Version E. ID:</span> {tagVersionEId}</p>
                    )}

                    {briefIntroduction && briefIntroduction.length > 0 && (
                        <div>
                            <span className="font-semibold">Brief Introduction:</span>
                            <ul className="ml-4 list-disc">
                                {briefIntroduction.map((intro, index) => (
                                    <li key={index} className="text-sm">{intro}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Author Notes Section */}
                    {authorNotes && authorNotes.length > 0 && (
                        <div>
                            <span className="font-semibold">Author's Notes:</span>
                            <ul className="ml-4 list-disc">
                                {authorNotes.map((note, index) => (
                                    <li key={index} className="text-sm">{note}</li>
                                ))}
                            </ul>
                        </div>
                    )}
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
