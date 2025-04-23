import React, { useState } from 'react';
import {
    Edit, Trash2, PlusSquare, BookOpen, ArrowUp, ArrowDown, X, Check, Save
} from 'lucide-react';

const AuthorNotes = () => {
    const [notesInput, setNotesInput] = useState('');
    const [savedNotes, setSavedNotes] = useState([]);
    const [isEditing, setIsEditing] = useState(false);

    // SAVE NOTES API END POINT WILL BE HERE
    const handleSaveNotes = async () => {
        const lines = notesInput.split('\n').filter(line => line.trim() !== '');
        setSavedNotes(lines);

        try {
            const payload = { notes: lines };
            // await axios.post('http://localhost:8000/api/your-endpoint', payload);
            console.log("Notes prepared to be saved:", payload);
        } catch (error) {
            console.error("Error saving notes:", error);
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

    const saveIndividualNote = async (note) => {
        try {
            const payload = { note };
            // await axios.post('http://localhost:8000/api/save-note', payload);
            console.log('Individual note saved:', payload);
        } catch (error) {
            console.error('Error saving individual note:', error);
        }
    };

    return (
        <div className="p-4 md:p-8 flex flex-col items-center gap-10">
            <div className="bg-green-100 border border-green-700 rounded-lg p-6 w-full max-w-6xl">
                <h2 className="text-3xl font-bold text-center text-green-700 mb-6 underline">AUTHOR'S NOTE PAD</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Left input */}
                    <div>
                        <label className="block text-base font-bold text-green-900 mb-2">Write your notes</label>
                        <textarea
                            rows="14"
                            value={notesInput}
                            onChange={(e) => setNotesInput(e.target.value)}
                            className="w-full border border-green-600 rounded py-2 px-3 text-sm bg-white"
                            placeholder="Write your points here, each on a new line..."
                        />
                    </div>

                    {/* Right preview */}
                    <div>
                        <label className="block text-base font-bold text-green-900 mb-2">Points Preview</label>
                        <div className="border border-green-600 rounded p-4 h-[300px] overflow-y-auto bg-white">
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
                                                        className="w-4/5 border border-green-600 rounded px-2 py-1 text-sm"
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
                                                        <button onClick={() => saveIndividualNote(note)} className="text-green-600" title="Save note">
                                                            <Check size={16} />
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
                        </div>
                    </div>
                </div>

                {/* Bottom Buttons */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    <button
                        className="bg-blue-600 text-white font-bold py-2 rounded flex items-center justify-center gap-2 text-sm"
                        onClick={() => setIsEditing(!isEditing)}
                    >
                        <Edit size={16} /> {isEditing ? 'Cancel Edit' : 'Edit'}
                    </button>

                    <button
                        className="bg-red-600 text-white font-bold py-2 rounded flex items-center justify-center gap-2 text-sm"
                        onClick={() => {
                            setNotesInput('');
                            setSavedNotes([]);
                            setIsEditing(false);
                        }}
                    >
                        <Trash2 size={16} /> Delete
                    </button>

                    <button className="bg-green-600 text-white font-bold py-2 rounded flex items-center justify-center gap-2 text-sm" onClick={handleSaveNotes}><Save size={16} /> Save</button>

                    <button
                        className="bg-teal-600 text-white font-bold py-2 rounded flex items-center justify-center gap-2 text-sm"
                        onClick={handleNextPoint}
                    >
                        <PlusSquare size={16} /> Next Point
                    </button>

                    <button className="bg-purple-600 text-white font-bold py-2 rounded flex items-center justify-center gap-2 text-sm">
                        <BookOpen size={16} /> Review Book
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthorNotes;
