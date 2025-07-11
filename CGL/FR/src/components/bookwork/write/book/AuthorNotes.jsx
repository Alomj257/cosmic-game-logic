import React, { useEffect, useState } from 'react';
import {
    Edit, Trash2, PlusSquare, BookOpen, ArrowUp, ArrowDown, X, Check, Save
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import AuthoReviewModel from './models/AuthorReviewModel';
import { getAllBooks, updateBook } from '../../../../services/api';

const AuthorNotes = () => {
    const [books, setBooks] = useState([]);
    const [bookNumbers, setBookNumbers] = useState([]);
    const [selectedBookNumber, setSelectedBookNumber] = useState('');
    const [selectedBook, setSelectedBook] = useState(null);
    const [notesInput, setNotesInput] = useState('');
    const [savedNotes, setSavedNotes] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [manualRecordNumber, setManualRecordNumber] = useState('');
    const [isReviewOpen, setIsReviewOpen] = useState(false);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await getAllBooks();
                const allBooks = response.data || [];
                const uniqueBookNumbers = [...new Set(allBooks.map(b => b.bookNumber))];
                setBooks(allBooks);
                setBookNumbers(uniqueBookNumbers);
            } catch (error) {
                console.error("Error fetching books:", error);
            }
        };
        fetchBooks();
    }, []);

    const handleBookNumberChange = (e) => {
        const selectedNumber = e.target.value;
        setSelectedBookNumber(selectedNumber);
        const matchedBook = books.find(b => b.bookNumber === selectedNumber);
        setSelectedBook(matchedBook || null);
        setManualRecordNumber(matchedBook?.recordNumber || '');
        setSavedNotes(matchedBook?.authorNotes?.map(n => n.point) || []);
        setNotesInput('');  // Clear input on book change
        setIsEditing(false);
    };

    const handleSaveNotes = async () => {
        const lines = savedNotes.map(point => ({ point }));

        if (!selectedBook) {
            toast.error("Please select a book first.");
            return;
        }

        if (!manualRecordNumber) {
            toast.error("Record Number is required.");
            return;
        }

        try {
            const payload = {
                ...selectedBook,
                recordNumber: manualRecordNumber.trim(),
                authorNotes: lines,
            };

            await updateBook(selectedBook._id, payload);
            toast.success("Updated notes successfully!");

            // Reset form
            setNotesInput('');
            setSavedNotes([]);
            setManualRecordNumber('');
            setSelectedBookNumber('');
            setSelectedBook(null);
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating book:", error.response?.data || error.message);
            toast.error("Failed to update book.");
        }
    };

    const handleNextPoint = () => {
        const trimmedNote = notesInput.trim();
        if (trimmedNote !== '') {
            setSavedNotes(prev => [...prev, trimmedNote]);
            setNotesInput('');
        }
    };

    const handleNoteChange = (index, value) => {
        const updatedNotes = [...savedNotes];
        updatedNotes[index] = value;
        setSavedNotes(updatedNotes);
    };

    const moveNote = (index, direction) => {
        const newNotes = [...savedNotes];
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex >= 0 && newIndex < newNotes.length) {
            [newNotes[index], newNotes[newIndex]] = [newNotes[newIndex], newNotes[index]];
            setSavedNotes(newNotes);
        }
    };

    const deleteNote = (index) => {
        const newNotes = savedNotes.filter((_, i) => i !== index);
        setSavedNotes(newNotes);
    };

    const updatePoints = () => {
        setIsEditing(false);
    };

    return (
        <div className="p-4 md:p-8 flex flex-col items-center gap-10">
            <div className="bg-green-100 border border-green-700 rounded-lg p-6 w-full max-w-6xl">
                <h2 className="text-3xl font-bold text-center text-green-700 mb-6 underline">AUTHOR'S NOTE PAD</h2>
                <div className="mb-6 flex flex-col md:flex-row gap-6">
                    <div className="flex md:w-1/2 gap-6">
                        <div className="flex-1">
                            <label className="block font-bold text-green-900 mb-2">Record Number</label>
                            <input
                                type="text"
                                value={manualRecordNumber}
                                onChange={(e) => setManualRecordNumber(e.target.value)}
                                className="w-full border border-green-600 rounded py-2 px-3"
                                placeholder="e.g., 4.00"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block font-bold text-green-900 mb-2">Book Number</label>
                            <select
                                value={selectedBookNumber}
                                onChange={handleBookNumberChange}
                                className="w-full border border-green-600 rounded py-2 px-3"
                            >
                                <option value="">Select Book No</option>
                                {bookNumbers.map((num, i) => (
                                    <option key={i} value={num}>{num}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {selectedBook && (
                        <div className="flex-1 md:w-1/2">
                            <label className="block font-bold text-green-900 mb-2">Book Name</label>
                            <div className="w-full border border-green-600 rounded py-2 px-3 bg-gray-50 text-green-700">
                                {selectedBook.bookName}
                            </div>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-base font-bold text-green-900 mb-2">Write your notes</label>
                        <textarea
                            rows="11"
                            value={notesInput}
                            onChange={(e) => setNotesInput(e.target.value)}
                            className="w-full border border-green-600 rounded py-2 px-3 text-sm bg-white"
                            placeholder="Write your points here, each on a new line..."
                        />
                    </div>

                    <div>
                        <label className="block text-base font-bold text-green-900 mb-2">Points Preview</label>
                        <div className="border border-green-600 rounded p-4 h-[240px] overflow-y-auto bg-white">
                            {savedNotes.length === 0 ? (
                                <p className="text-gray-400 text-sm italic">Nothing saved yet...</p>
                            ) : (
                                <ul className="space-y-3 text-green-900 text-sm">
                                    {savedNotes.map((note, index) => (
                                        <li key={index} className="flex gap-1">
                                            {isEditing ? (
                                                <>
                                                    <input
                                                        type="text"
                                                        value={note}
                                                        onChange={(e) => handleNoteChange(index, e.target.value)}
                                                        className="w-5/6 border border-green-600 rounded px-2 py-1 text-sm"
                                                    />
                                                    <div className="flex gap-2 mt-1">
                                                        <button onClick={() => moveNote(index, 'up')} className="text-blue-600" title="Move up">
                                                            <ArrowUp size={16} />
                                                        </button>
                                                        <button onClick={() => moveNote(index, 'down')} className="text-blue-600" title="Move down">
                                                            <ArrowDown size={16} />
                                                        </button>
                                                        <button onClick={() => deleteNote(index)} className="text-red-600" title="Delete">
                                                            <X size={16} />
                                                        </button>
                                                    </div>
                                                </>
                                            ) : (
                                                <span className="list-disc list-inside">{note}</span>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            )}
                            {isEditing && (
                                <div className="mt-4 flex justify-center">
                                    <button
                                        onClick={updatePoints}
                                        className="bg-green-600 text-white font-bold py-2 px-8 rounded flex items-center justify-center gap-2 text-sm"
                                    >
                                        <Check size={16} /> Update Points
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    <button
                        className="bg-blue-600 text-white font-bold py-2 rounded flex items-center justify-center gap-2 text-sm"
                        onClick={() => setIsEditing(true)}
                    >
                        <Edit size={16} />
                        Edit
                    </button>
                    <button
                        className="bg-red-600 text-white font-bold py-2 rounded flex items-center justify-center gap-2 text-sm"
                        onClick={() => {
                            setNotesInput('');
                            setSavedNotes([]);
                            setIsEditing(false);
                            setManualRecordNumber('');
                            setSelectedBookNumber('');
                            setSelectedBook(null);
                        }}
                    >
                        <Trash2 size={16} /> Delete
                    </button>

                    <button
                        disabled={notesInput.trim() !== ''}
                        className={`${
                            notesInput.trim() !== ''
                                ? 'bg-green-400 cursor-not-allowed'
                                : 'bg-green-600 hover:bg-green-700'
                        } text-white font-bold py-2 rounded flex items-center justify-center gap-2 text-sm`}
                        onClick={handleSaveNotes}
                    >
                        <Save size={16} /> Save Notes
                    </button>

                    <button
                        className="bg-teal-600 text-white font-bold py-2 rounded flex items-center justify-center gap-2 text-sm"
                        onClick={handleNextPoint}
                    >
                        <PlusSquare size={16} /> Next Point
                    </button>

                    <button
                        className="bg-purple-600 text-white font-bold py-2 rounded flex items-center justify-center gap-2 text-sm"
                        onClick={() => setIsReviewOpen(true)}
                    >
                        <BookOpen size={16} /> Review Book
                    </button>
                </div>
            </div>

            <AuthoReviewModel
                isOpen={isReviewOpen}
                onClose={() => setIsReviewOpen(false)}
                recordNumber={manualRecordNumber}
                bookDetails={selectedBook}
                authorNotes={savedNotes}
            />
        </div>
    );
};

export default AuthorNotes;
