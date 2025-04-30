import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './Book.css';
import { Edit, Save, Trash2, BookOpen, Info, PlusSquare, ArrowUp, ArrowDown, Check } from 'lucide-react';
import { getAllTags, getTagMainIdsByDataType, getTagDetailsByTagMainId, getAllBooks, createBook, updateBook } from '../../../../services/api';
import HoverPopup from '../HoverPopup';
import { toast } from 'react-hot-toast';
import ReviewModal from './models/ReviewModal';
import RecordGridModal from './models/RecordGridModal';

const BriefIntroduction = () => {
    const [recordNumber, setRecordNumber] = useState('');
    const [bookNumber, setBookNumber] = useState('');
    const [bookName, setBookName] = useState('');
    const [bookNameHTML, setBookNameHTML] = useState('');
    const [introText, setIntroText] = useState('');

    const [groupTypes, setGroupTypes] = useState([]);
    const [selectedGroupType, setSelectedGroupType] = useState('');
    const [tagMainIds, setTagMainIds] = useState([]);
    const [selectedTagMainId, setSelectedTagMainId] = useState('');
    const [openingTag, setOpeningTag] = useState('');
    const [closingTag, setClosingTag] = useState('');
    const [introOpeningTag, setIntroOpeningTag] = useState('');
    const [introClosingTag, setIntroClosingTag] = useState('');

    const [booksList, setBooksList] = useState([]);
    const [recordNumbers, setRecordNumbers] = useState([]);
    const [bookNumbers, setBookNumbers] = useState([]);
    const [showRecordModal, setShowRecordModal] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);

    const [introParagraphs, setIntroParagraphs] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    const [editingText, setEditingText] = useState('');

    // Quill configurations
    const modules = {
        toolbar: [
            [{ 'header': '1' }, { 'header': '2' }],
            [{ 'font': [] }, { 'size': ['small', 'medium', 'large'] }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['bold', 'italic', 'underline'],
            ['link'],
            [{ 'align': [] }],
            ['blockquote', 'code-block'],
            [{ 'color': [] }, { 'background': [] }],
            ['image']
        ]
    };

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const tagsRes = await getAllTags();
                const uniqueTypes = [...new Set(tagsRes.data.map(tag => tag.dataTypeCode))];
                setGroupTypes(uniqueTypes);

                const booksRes = await getAllBooks();
                setBooksList(booksRes.data);

                const uniqueRecordNumbers = [
                    ...new Set(booksRes.data.map(b => b.recordNumber).filter(Boolean))
                ].sort((a, b) => parseFloat(a) - parseFloat(b));
                setRecordNumbers(uniqueRecordNumbers);

                const uniqueBookNumbers = [
                    ...new Set(booksRes.data.map(b => b.bookNumber).filter(Boolean))
                ].sort((a, b) => parseFloat(a) - parseFloat(b));
                setBookNumbers(uniqueBookNumbers);
            } catch (err) {
                console.error('Error loading initial data:', err);
            }
        };

        fetchInitialData();
    }, []);

    useEffect(() => {
        const fetchTagMainIds = async () => {
            if (!selectedGroupType) return;
            try {
                const res = await getTagMainIdsByDataType(selectedGroupType);
                setTagMainIds(res.data);
            } catch (err) {
                console.error('Error fetching tag main IDs:', err);
            }
        };
        fetchTagMainIds();
    }, [selectedGroupType]);

    useEffect(() => {
        const fetchTagDetails = async () => {
            if (!selectedTagMainId) return;
            try {
                const res = await getTagDetailsByTagMainId(selectedTagMainId);
                setOpeningTag(res.data.openingTag);
                setClosingTag(res.data.closingTag);
            } catch (err) {
                console.error('Error fetching tag details:', err);
            }
        };
        fetchTagDetails();
    }, [selectedTagMainId]);

    useEffect(() => {
        const matchingBooks = booksList.filter(b => b.bookNumber === bookNumber);
        if (matchingBooks.length === 0) {
            setBookName('');
            setIntroParagraphs([]);
            setBookNameHTML('');
            setRecordNumber('');  // Reset record number if no books are found
            return;
        }

        const selectedBook = matchingBooks.reduce((a, b) =>
            parseFloat(a.recordNumber) > parseFloat(b.recordNumber) ? a : b
        );

        const bookName = selectedBook.bookName || '';
        setBookName(bookName);

        // Check if briefIntroduction exists, then auto-fill record number, otherwise leave it for manual input
        if (selectedBook.briefIntroduction && selectedBook.briefIntroduction.length > 0) {
            setRecordNumber(selectedBook.recordNumber || '');  // Auto-fill record number
        } else {
            setRecordNumber('');  // Allow manual input
        }

        const paragraphs = Array.isArray(selectedBook.briefIntroduction)
            ? selectedBook.briefIntroduction.map(p => p.paragraph)
            : [];

        setIntroParagraphs(paragraphs);
        updateBookNameHTML(bookName, paragraphs);
    }, [bookNumber, booksList]);

    const updateBookNameHTML = (bookName, paragraphs = []) => {
        const safeParagraphs = Array.isArray(paragraphs) ? paragraphs : [];
        const formatted = `
            <div ><div class="book-name">${bookName}</div> 
            <p><strong style="color: rgb(230, 0, 0);"><u>Major content of this book</u></strong></p>
            <div class="paragraphs">${safeParagraphs.join('<br/>')}</div>
        `;
        setBookNameHTML(formatted);
    };

    const handleNextParagraph = () => {
        if (!editingText.trim()) return;
        const wrapped = editingText;
        const newParagraphs = [...introParagraphs, wrapped];
        setIntroParagraphs(newParagraphs);

        // Pass bookName along with paragraphs
        updateBookNameHTML(bookName, newParagraphs);

        setEditingText('');
    };

    const handleEditParagraph = (index) => {
        setEditingIndex(index);
        setEditingText(introParagraphs[index]);
    };

    const handleUpdateParagraph = () => {
        if (editingIndex === null || !editingText.trim()) return;
        const updatedParagraphs = [...introParagraphs];
        updatedParagraphs[editingIndex] = editingText;
        setIntroParagraphs(updatedParagraphs);

        // Pass both bookName and updatedParagraphs
        updateBookNameHTML(bookName, updatedParagraphs);

        setEditingIndex(null);
        setEditingText('');
    };

    const moveParagraph = (index, direction) => {
        const newIndex = index + direction;
        if (newIndex < 0 || newIndex >= introParagraphs.length) return;
        const newParagraphs = [...introParagraphs];
        [newParagraphs[index], newParagraphs[newIndex]] = [newParagraphs[newIndex], newParagraphs[index]];
        setIntroParagraphs(newParagraphs);
        updateBookNameHTML(newParagraphs);
        // Pass bookName along with paragraphs
        updateBookNameHTML(bookName, newParagraphs);
    };

    const handleSave = async () => {
        try {
            // Step 1: Find all books with the same bookNumber
            const matchingBooks = booksList.filter(b => b.bookNumber === bookNumber);

            // Step 2: If multiple exist, choose the one with the highest recordNumber
            if (matchingBooks.length > 1) {
                const bookToUpdate = matchingBooks.reduce((a, b) =>
                    parseFloat(a.recordNumber) > parseFloat(b.recordNumber) ? a : b
                );

                const payload = {
                    recordNumber: bookToUpdate.recordNumber,
                    bookNumber,
                    bookName,
                    groupType: bookToUpdate.selectedGroupType,
                    tagMainVersionId: bookToUpdate.selectedTagMainId,
                    tagVersionHId: bookToUpdate.openingTag,
                    tagVersionEId: bookToUpdate.closingTag,
                    briefIntroduction: introParagraphs.map(p => ({ paragraph: p })),
                };

                await updateBook(bookToUpdate._id, payload);
                toast.success('Brief Introduction updated successfully!');
            } else {
                // Step 3: If no duplicates or only one, create a new book
                const newRecordNumber = parseFloat(recordNumber).toFixed(2);
                const payload = {
                    auto: false,
                    recordNumber: newRecordNumber,
                    bookNumber,
                    bookName,
                    groupType: selectedGroupType,
                    tagMainVersionId: selectedTagMainId,
                    tagVersionHId: openingTag,
                    tagVersionEId: closingTag,
                    briefIntroduction: introParagraphs.map(p => ({ paragraph: p })),
                };

                await createBook(payload);
                toast.success('Brief Introduction saved successfully!');
            }

            const booksRes = await getAllBooks();
            setBooksList(booksRes.data);
            resetForm();
        } catch (err) {
            console.error('Error saving or updating brief introduction:', err);
            toast.error('Failed to save or update brief introduction.');
        }
    };

    const resetForm = () => {
        setRecordNumber('');
        setBookNumber('');
        setBookName('');
        setBookNameHTML('');
        setIntroText('');
        setSelectedGroupType('');
        setTagMainIds([]);
        setSelectedTagMainId('');
        setOpeningTag('');
        setClosingTag('');
        setIntroOpeningTag('');
        setIntroClosingTag('');
        setIntroParagraphs([]);
        setEditingIndex(null);
        setEditingText('');
    };

    const handleReviewBook = () => {
        setShowReviewModal(true);
    };

    return (
        <div className="p-4 md:p-8 flex flex-col items-center gap-10">
            {showReviewModal && (
                <ReviewModal
                    onClose={() => setShowReviewModal(false)}
                    recordMode="manual"
                    recordNumber={recordNumber}
                    bookName={bookName}
                    bookNumber={bookNumber}
                    groupType={selectedGroupType}
                    tagMainId={selectedTagMainId}
                    tagVersionHId={openingTag}
                    tagVersionEId={closingTag}
                    briefIntroduction={introParagraphs}
                />
            )}
            {showRecordModal && (
                <RecordGridModal
                    title="Available Record Numbers"
                    values={recordNumbers}
                    onClose={() => setShowRecordModal(false)}
                />
            )}
            <div className="bg-green-100 border border-green-700 rounded-lg p-6 w-full max-w-6xl">
                <h2 className="text-3xl font-bold text-center text-green-700 mb-6 underline">
                    BRIEF INTRODUCTION OF THE SELECTED BOOK
                </h2>

                {/* Record and Book No Section */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6 items-stretch">
                    <div className="md:col-span-3 border border-green-700 rounded p-3">
                        <label className="block text-base font-bold text-green-900 mb-2">Record No (Manual)</label>
                        <div className="flex items-center gap-2 mb-3">
                            <label className="text-sm font-bold text-green-900 w-1/3">Record No</label>
                            <div className="relative w-2/3 flex items-center">
                                <input
                                    type="text"
                                    placeholder="Record No"
                                    value={recordNumber}
                                    onChange={(e) => setRecordNumber(e.target.value)}
                                    className="py-2 px-3 text-sm border border-green-600 rounded w-full pr-8"
                                />
                                <Info onClick={() => setShowRecordModal(true)} size={16} className="absolute right-2 text-green-700 cursor-pointer" />
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <label className="text-sm font-bold text-green-900 w-1/3">Book No</label>
                            <div className="relative w-2/3 flex items-center">
                                <select
                                    value={bookNumber}
                                    onChange={(e) => setBookNumber(e.target.value)}
                                    className="py-2 px-3 text-sm border rounded bg-white border-green-600 w-full pr-8"
                                >
                                    <option value="">Select</option>
                                    {bookNumbers.map((bn, index) => (
                                        <option key={index} value={bn}>{bn}</option>
                                    ))}
                                </select>
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
                            <select className="py-2 px-3 text-sm border border-green-600 rounded" value={selectedGroupType} onChange={(e) => setSelectedGroupType(e.target.value)}>
                                <option value="">Select Group</option>
                                {groupTypes.map((code, index) => (
                                    <option key={index} value={code}>{code}</option>
                                ))}
                            </select>
                            <select className="py-2 px-3 text-sm border border-green-600 rounded" value={selectedTagMainId} onChange={(e) => setSelectedTagMainId(e.target.value)}>
                                <option value="">Select Tag Main Id</option>
                                {tagMainIds.map((id, index) => (
                                    <option key={index} value={id}>{id}</option>
                                ))}
                            </select>
                            <HoverPopup value={openingTag} />
                        </div>
                    </div>

                    <div className="md:col-span-3 border border-green-700 rounded p-3">
                        <label className="block text-base font-bold text-green-900 text-center mb-6">End Tag</label>
                        <div className="text-center text-green-900 text-sm font-bold mb-2">Tag Version E. Id</div>
                        <HoverPopup value={closingTag} />
                    </div>
                </div>

                {/* Paragraph Input Section */}
                <div className="mb-6">
                    <label className="font-bold text-left text-xl text-green-900 block mb-2">Write your Introduction</label>
                    <ReactQuill
                        value={editingText}
                        onChange={setEditingText}
                        modules={modules}
                        placeholder="Write your Introduction here..."
                        className="rounded"
                    />
                </div>

                {/* Book Name Display */}
                {/* <div className="mb-6 text-center">
                    <label className="font-bold text-left text-xl text-green-900 block mb-2">Book Name</label>
                    <div
                        className="border border-green-600 rounded bg-white p-4 text-center text-base min-h-[100px]"
                        dangerouslySetInnerHTML={{ __html: bookNameHTML }}
                    />
                </div> */}

                {/* Editable Paragraphs List */}
                {introParagraphs.length > 0 && (
                    <div>
                        {introParagraphs.map((para, index) => (
                            <div key={index} className="flex items-center gap-2 mb-2">
                                {editingIndex === index ? (
                                    <>
                                        <textarea
                                            value={editingText}
                                            onChange={(e) => setEditingText(e.target.value)}
                                            className="w-full border border-green-600 rounded px-2 py-1 text-sm"
                                        />
                                        <button onClick={handleUpdateParagraph} className="text-white bg-green-600 rounded px-2 py-1">
                                            <Check size={16} />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <div
                                            className="w-full border border-green-600 rounded px-2 py-1 text-sm bg-white"
                                            dangerouslySetInnerHTML={{ __html: para }}
                                        />
                                        <button onClick={() => handleEditParagraph(index)} className="text-blue-600">
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => moveParagraph(index, -1)}
                                            disabled={index === 0}
                                            className="text-gray-700"
                                        >
                                            <ArrowUp size={16} />
                                        </button>
                                        <button
                                            onClick={() => moveParagraph(index, 1)}
                                            disabled={index === introParagraphs.length - 1}
                                            className="text-gray-700"
                                        >
                                            <ArrowDown size={16} />
                                        </button>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                    {/* <button onClick={() => {}} className="bg-blue-600 text-white font-bold py-2 rounded flex items-center justify-center gap-2 text-sm">
                        <Edit size={16} /> Edit
                    </button> */}
                    <button onClick={resetForm} className="bg-red-600 text-white font-bold py-2 rounded flex items-center justify-center gap-2 text-sm">
                        <Trash2 size={16} /> Delete
                    </button>
                    <button onClick={handleSave} className="bg-green-600 text-white font-bold py-2 rounded flex items-center justify-center gap-2 text-sm">
                        <Save size={16} /> Save
                    </button>
                    <button onClick={handleNextParagraph} className="bg-teal-600 text-white font-bold py-2 rounded flex items-center justify-center gap-2 text-sm">
                        <PlusSquare size={16} /> Add Paragraph
                    </button>
                    <button onClick={handleReviewBook} className="bg-purple-600 text-white font-bold py-2 rounded flex items-center justify-center gap-2 text-sm">
                        <BookOpen size={16} /> Review Book
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BriefIntroduction;
