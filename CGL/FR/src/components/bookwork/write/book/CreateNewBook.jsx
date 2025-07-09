import React, { useEffect, useState } from 'react';
import { Edit, Save, Trash2, BookOpen, FilePlus, Info } from 'lucide-react';
import { getAllTags, getTagMainIdsByDataType, getTagDetailsByTagMainId, getAllBooks, createBook } from '../../../../services/api';
import HoverPopup from '../HoverPopup';
import { toast } from 'react-hot-toast';
import ReviewModal from './models/ReviewModal';
import RecordGridModal from './models/RecordGridModal';

const CreateNewBook = () => {
    const [recordMode, setRecordMode] = useState('auto');
    const [recordNumber, setRecordNumber] = useState('');
    const [bookNumber, setBookNumber] = useState('');
    const [bookName, setBookName] = useState('');

    const isRecordDisabled = recordMode === 'auto';

    const [showConfirmation, setShowConfirmation] = useState(false);

    const [showReviewModal, setShowReviewModal] = useState(false);

    const [groupTypes, setGroupTypes] = useState([]);
    const [createGroupType, setCreateGroupType] = useState('');
    const [createTagMainIds, setCreateTagMainIds] = useState([]);
    const [createSelectedMainId, setCreateSelectedMainId] = useState('');
    const [createOpeningTag, setCreateOpeningTag] = useState('');
    const [createClosingTag, setCreateClosingTag] = useState('');

    const [showRecordNumberModal, setShowRecordNumberModal] = useState(false);
    const [showBookNumberModal, setShowBookNumberModal] = useState(false);
    const [recordNumbers, setRecordNumbers] = useState([]);
    const [bookNumbers, setBookNumbers] = useState([]);
    const [autoRecordNumber, setAutoRecordNumber] = useState('');


    useEffect(() => {
        const fetchAutoRecordNumber = async () => {
            if (recordMode === 'auto') {
                try {
                    const books = await getAllBooks();
                    const existingNumbers = books.data
                        .map(book => parseFloat(book.recordNumber))
                        .filter(n => !isNaN(n));
                    const maxNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) : 0;
                    const newNumber = (maxNumber + 2).toFixed(2);
                    setAutoRecordNumber(newNumber);
                } catch (error) {
                    console.error('Error fetching record numbers:', error);
                }
            }
        };

        fetchAutoRecordNumber();
    }, [recordMode]);

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await getAllTags();
                const tags = response.data;
                const uniqueCodes = [...new Set(tags.map(tag => tag.dataTypeCode))];
                setGroupTypes(uniqueCodes);
            } catch (error) {
                console.error('Error fetching tags:', error);
            }
        };
        fetchTags();
    }, []);

    useEffect(() => {
        const fetchCreateTagMainIds = async () => {
            if (!createGroupType) return;
            try {
                const response = await getTagMainIdsByDataType(createGroupType);
                setCreateTagMainIds(response.data);
            } catch (error) {
                console.error('Error fetching create tag main ids:', error);
            }
        };
        fetchCreateTagMainIds();
    }, [createGroupType]);

    useEffect(() => {
        const fetchCreateTagDetails = async () => {
            if (!createSelectedMainId) return;
            try {
                const response = await getTagDetailsByTagMainId(createSelectedMainId);
                setCreateOpeningTag(response.data.openingTag);
                setCreateClosingTag(response.data.closingTag);
            } catch (error) {
                console.error('Error fetching tag details for create:', error);
            }
        };
        fetchCreateTagDetails();
    }, [createSelectedMainId]);

    const handleSave = async () => {
        try {
            const books = await getAllBooks();
            const existingNumbers = books.data
                .map(book => parseFloat(book.recordNumber))
                .filter(n => !isNaN(n));
            const maxNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) : 0;
            const newRecordNumber = (maxNumber + 2).toFixed(2);

            const payload = {
                auto: recordMode === 'auto',
                bookNumber,
                groupType: createGroupType,
                tagMainVersionId: createSelectedMainId,
                tagVersionHId: createOpeningTag,
                tagVersionEId: createClosingTag,
                bookName
            };

            if (recordMode === 'manual') {
                payload.recordNumber = parseFloat(recordNumber || newRecordNumber).toFixed(2);
            }

            await createBook(payload);
            toast.success('Book created successfully!');
            setRecordNumber('');
            setBookNumber('');
            setBookName('');
            setCreateGroupType('');
            setCreateTagMainIds([]);
            setCreateSelectedMainId('');
            setCreateOpeningTag('');
            setCreateClosingTag('');
            window.location.reload();
        } catch (error) {
            console.error('Error creating book:', error);
            toast.error('Failed to create book.');
        }
    };

    const handleDelete = () => {
        setRecordNumber('');
        setBookNumber('');
        setBookName('');
        setRecordMode('auto');
        setCreateGroupType('');
        setCreateTagMainIds([]);
        setCreateSelectedMainId('');
        setCreateOpeningTag('');
        setCreateClosingTag('');
        toast.success('Form cleared!');
    };

    const hasUnsavedData = () => {
        return (
            recordNumber ||
            bookNumber ||
            bookName ||
            createGroupType ||
            createSelectedMainId ||
            createOpeningTag ||
            createClosingTag
        );
    };

    const handleNewBookClick = () => {
        setShowConfirmation(true)
    };

    const fetchRecordAndBookNumbers = async () => {
        try {
            const books = await getAllBooks();
            const records = books.data
                .map(b => b.recordNumber)
                .filter(Boolean)
                .sort((a, b) => parseFloat(a) - parseFloat(b));

            const bookNos = books.data
                .map(b => b.bookNumber)
                .filter(Boolean)
                .sort();

            setRecordNumbers(records);
            setBookNumbers(bookNos);
        } catch (error) {
            console.error('Error fetching record/book numbers:', error);
        }
    };

    const handleRecordInfoClick = async () => {
        await fetchRecordAndBookNumbers();
        setShowRecordNumberModal(true);
    };

    const handleBookInfoClick = async () => {
        await fetchRecordAndBookNumbers();
        setShowBookNumberModal(true);
    };

    return (
        <div className="p-4 md:p-8 flex flex-col items-center gap-10">
            {showConfirmation && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg border border-green-700 w-full max-w-md">
                        <h3 className="text-xl font-bold text-green-800 mb-4">Unsaved Data</h3>
                        <p className="mb-6 text-green-900">Do you want to save the current details to the database?</p>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => {
                                    handleSave();
                                    setShowConfirmation(false);
                                }}
                                className="bg-green-600 text-white px-4 py-2 rounded font-semibold"
                            >
                                Yes, Save
                            </button>
                            <button
                                onClick={() => {
                                    handleDelete();
                                    setShowConfirmation(false);
                                }}
                                className="bg-red-600 text-white px-4 py-2 rounded font-semibold"
                            >
                                No, Discard
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showReviewModal && (
                <ReviewModal
                    onClose={() => setShowReviewModal(false)}
                    recordMode={recordMode}
                    // recordNumber={recordNumber || autoRecordNumber}
                    recordNumber={recordMode === 'auto' ? autoRecordNumber : recordNumber}
                    bookNumber={bookNumber}
                    bookName={bookName}
                    groupType={createGroupType}
                    tagMainId={createSelectedMainId}
                    tagVersionHId={createOpeningTag}
                    tagVersionEId={createClosingTag}
                />
            )}

            {showRecordNumberModal && (
                <RecordGridModal
                    title="Available Record Numbers"
                    values={recordNumbers}
                    onClose={() => setShowRecordNumberModal(false)}
                />
            )}

            {showBookNumberModal && (
                <RecordGridModal
                    title="Available Book Numbers"
                    values={bookNumbers}
                    onClose={() => setShowBookNumberModal(false)}
                />
            )}

            <div className="bg-green-100 border border-green-700 rounded-lg p-6 w-full max-w-6xl">
                <h2 className="text-3xl font-bold text-center text-green-700 mb-6 underline">CREATE NEW BOOK</h2>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6 items-stretch">
                    <div className="md:col-span-3 border border-green-700 rounded p-3">
                        <label className="block text-base font-bold text-green-900 mb-2">Select Record No</label>
                        <div className="flex gap-3 mb-3">
                            <button
                                className={`px-3 py-1 text-xs font-semibold border rounded ${recordMode === 'auto' ? 'bg-green-300' : 'bg-white'} border-green-600`}
                                onClick={() => setRecordMode('auto')}

                            >
                                Auto
                            </button>
                            <button
                                className={`px-3 py-1 text-xs font-semibold border rounded ${recordMode === 'manual' ? 'bg-green-300' : 'bg-white'} border-green-600`}
                                onClick={() => setRecordMode('manual')}
                            >
                                Manual
                            </button>
                        </div>

                        {/* Record No */}
                        <div className="flex items-center gap-2 mb-3">
                            <label className="text-sm font-bold text-green-900 w-1/3">Record No</label>
                            <div className="relative w-2/3 flex items-center">
                                <input
                                    type="text"
                                    placeholder="Record No"
                                    disabled={isRecordDisabled}
                                    value={isRecordDisabled ? autoRecordNumber : recordNumber}
                                    onChange={(e) => setRecordNumber(e.target.value)}
                                    className={`py-2 px-3 text-sm border rounded ${isRecordDisabled ? 'bg-gray-200' : 'bg-white'} border-green-600 w-full pr-8`}
                                />

                                <Info
                                    onClick={handleRecordInfoClick}
                                    size={16}
                                    className="absolute right-2 text-green-700 cursor-pointer"
                                    title="Auto increments by 2.00 starting from 1.00"
                                />
                            </div>
                        </div>

                        {/* Book No */}
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-bold text-green-900 w-1/3">Book No</label>
                            <div className="relative w-2/3 flex items-center">
                                <input
                                    type="text"
                                    placeholder="Book No"
                                    value={bookNumber}
                                    onChange={(e) => setBookNumber(e.target.value)}
                                    className="py-2 px-3 text-sm border rounded bg-white border-green-600 w-full pr-8"
                                />
                                <Info
                                    onClick={handleBookInfoClick}
                                    size={16}
                                    className="absolute right-2 text-green-700 cursor-pointer"
                                    title="Manually assign a Book Number"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-6 border border-green-700 rounded p-3">
                        <label className="block text-base font-bold text-green-900 text-center mb-6">Head Tag Reference for Book</label>
                        <div className="grid grid-cols-3 gap-2 text-center text-green-900 text-sm font-bold mb-2">
                            <span>Group Type</span>
                            <span>Tag Main Version Id</span>
                            <span>Tag Version H. Id</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <select className="py-2 px-3 text-sm border border-green-600 rounded" value={createGroupType} onChange={(e) => setCreateGroupType(e.target.value)}>
                                <option value="">Select Group</option>
                                {groupTypes.map((code, index) => (
                                    <option key={index} value={code}>{code}</option>
                                ))}
                            </select>
                            <select className="py-2 px-3 text-sm border border-green-600 rounded" value={createSelectedMainId} onChange={(e) => setCreateSelectedMainId(e.target.value)}>
                                <option value="">Select Tag Main Id</option>
                                {createTagMainIds.map((id, index) => (
                                    <option key={index} value={id}>{id}</option>
                                ))}
                            </select>
                            <HoverPopup value={createOpeningTag} />
                        </div>
                    </div>

                    <div className="md:col-span-3 border border-green-700 rounded p-3">
                        <label className="block text-base font-bold text-green-900 text-center mb-6">End Tag</label>
                        <div className="text-center text-green-900 text-sm font-bold mb-2">Tag Version E. Id</div>
                        <HoverPopup value={createClosingTag} />
                    </div>
                </div>

                <div className="mb-6">
                    <label className="font-bold text-base text-green-900 block mb-2">Name of the Book</label>
                    <textarea
                        rows="2"
                        value={bookName}
                        onChange={(e) => setBookName(e.target.value)}
                        className="w-full border border-green-600 rounded py-2 px-3 text-sm bg-white"
                        placeholder="Enter the book name..."
                    />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                    <button className="bg-blue-600 text-white font-bold py-2 rounded flex items-center justify-center gap-2 text-sm"><Edit size={16} /> Edit</button>
                    <button
                        onClick={handleNewBookClick} className="bg-gradient-to-r from-light-blue to-dark-pink bg-[length:200%_100%] animate-color-blink text-white font-bold py-2 px-4 rounded flex items-center justify-center gap-2 text-sm">
                        <FilePlus size={16} /> Create New Book</button>
                    <button onClick={handleSave} className="bg-green-600 text-white font-bold py-2 rounded flex items-center justify-center gap-2 text-sm"><Save size={16} /> Save</button>
                    <button onClick={handleDelete} className="bg-red-600 text-white font-bold py-2 rounded flex items-center justify-center gap-2 text-sm"><Trash2 size={16} /> Delete</button>
                    <button onClick={() => setShowReviewModal(true)} className="bg-green-600 text-white font-bold py-2 rounded flex items-center justify-center gap-2 text-sm"><BookOpen size={16} /> Review the BOOK</button>
                </div>
            </div>
        </div>
    );
};

export default CreateNewBook;
