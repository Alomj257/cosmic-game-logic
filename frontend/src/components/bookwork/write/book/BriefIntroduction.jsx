import React, { useEffect, useState } from 'react';
import { Edit, Save, Trash2, BookOpen, Info, PlusSquare } from 'lucide-react';
import {
    getAllTags,
    getTagMainIdsByDataType,
    getTagDetailsByTagMainId,
    getAllBooks,
    createBook
} from '../../../../services/api';
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

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const tagsRes = await getAllTags();
                const uniqueTypes = [...new Set(tagsRes.data.map(tag => tag.dataTypeCode))];
                setGroupTypes(uniqueTypes);

                const booksRes = await getAllBooks();
                setBooksList(booksRes.data);
                setRecordNumbers(booksRes.data.map(b => b.recordNumber).filter(Boolean).sort((a, b) => parseFloat(a) - parseFloat(b)));
                setBookNumbers(booksRes.data.map(b => b.bookNumber).filter(Boolean).sort());
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
        const selectedBook = booksList.find(b => b.bookNumber === bookNumber);
        setBookName(selectedBook?.bookName || '');
        setBookNameHTML(selectedBook?.bookName || '');
    }, [bookNumber, booksList]);

    const handleNextParagraph = () => {
        if (!introText.trim()) return;
        const wrapped = `${introOpeningTag}${introText}${introClosingTag}`;
        const updatedHTML = `${bookNameHTML}<br/>${wrapped}`;
        setBookNameHTML(updatedHTML);
        setIntroText('');
    };

    const handleSave = async () => {
        try {
            const payload = {
                auto: false,
                recordNumber: parseFloat(recordNumber).toFixed(2),
                bookNumber,
                bookName: bookNameHTML,
                groupType: selectedGroupType,
                tagMainVersionId: selectedTagMainId,
                tagVersionHId: openingTag,
                tagVersionEId: closingTag,
                briefIntroduction: '',
            };
            await createBook(payload);
            toast.success('Brief Introduction saved successfully!');
            resetForm();
        } catch (err) {
            console.error('Error saving brief introduction:', err);
            toast.error('Failed to save brief introduction.');
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
    };

    return (
        <div className="p-4 md:p-8 flex flex-col items-center gap-10">
            {showReviewModal && (
                <ReviewModal
                    onClose={() => setShowReviewModal(false)}
                    recordMode="manual"
                    recordNumber={recordNumber}
                    bookName={bookNameHTML}
                    bookNumber={bookNumber}
                    groupType={selectedGroupType}
                    tagMainId={selectedTagMainId}
                    tagVersionHId={openingTag}
                    tagVersionEId={closingTag}
                    briefIntroduction=""
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

                <div className="mb-6 text-center">
                    <label className="font-bold text-xl text-green-900 block mb-2">Book Name</label>
                    <div className="border border-green-600 rounded bg-white p-4 text-center text-base min-h-[100px]" dangerouslySetInnerHTML={{ __html: bookNameHTML }} />
                </div>

                <div className="mb-6 flex items-start gap-2">
                    <select
                        value={introOpeningTag}
                        onChange={(e) => setIntroOpeningTag(e.target.value)}
                        className="py-2 px-3 text-sm border border-green-600 rounded w-1/24"
                    >
                        <option value="">Open</option>
                        <option value="<i>">&lt;i&gt;</option>
                        <option value="<b>">&lt;b&gt;</option>
                        <option value="<u>">&lt;u&gt;</option>
                    </select>

                    <textarea
                        rows="4"
                        value={introText}
                        onChange={(e) => setIntroText(e.target.value)}
                        className="w-5/6 border border-green-600 rounded py-2 px-3 text-sm bg-white"
                        placeholder="Enter paragraph to add to Book Name..."
                    />

                    <select
                        value={introClosingTag}
                        onChange={(e) => setIntroClosingTag(e.target.value)}
                        className="py-2 px-3 text-sm border border-green-600 rounded w-1/24"
                    >
                        <option value="">Close</option>
                        <option value="</i>">&lt;/i&gt;</option>
                        <option value="</b>">&lt;/b&gt;</option>
                        <option value="</u>">&lt;/u&gt;</option>
                    </select>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                    <button className="bg-blue-600 text-white font-bold py-2 rounded flex items-center justify-center gap-2 text-sm"><Edit size={16} /> Edit</button>
                    <button onClick={handleSave} className="bg-green-600 text-white font-bold py-2 rounded flex items-center justify-center gap-2 text-sm"><Save size={16} /> Save</button>
                    <button onClick={resetForm} className="bg-red-600 text-white font-bold py-2 rounded flex items-center justify-center gap-2 text-sm"><Trash2 size={16} /> Delete</button>
                    <button onClick={handleNextParagraph} className="bg-pink-600 text-white font-bold py-2 rounded flex items-center justify-center gap-2 text-sm"><PlusSquare size={16} /> Next Paragraph</button>
                    <button onClick={() => setShowReviewModal(true)} className="bg-green-600 text-white font-bold py-2 rounded flex items-center justify-center gap-2 text-sm"><BookOpen size={16} /> Review the BOOK</button>
                </div>
            </div>
        </div>
    );
};

export default BriefIntroduction;
