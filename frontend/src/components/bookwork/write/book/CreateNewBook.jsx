import React, { useEffect, useState } from 'react';
import { Edit, Save, Trash2, PlusSquare, BookOpen, FilePlus } from 'lucide-react';
import { getAllTags, getTagMainIdsByDataType, getTagDetailsByTagMainId } from '../../../../services/api';
import HoverPopup from '../HoverPopup';

const CreateNewBook = () => {
    const [recordMode, setRecordMode] = useState('auto');
    const isRecordDisabled = recordMode === 'auto';

    const [groupTypes, setGroupTypes] = useState([]);

    // Create states
    const [createGroupType, setCreateGroupType] = useState('');
    const [createTagMainIds, setCreateTagMainIds] = useState([]);
    const [createSelectedMainId, setCreateSelectedMainId] = useState('');
    const [createOpeningTag, setCreateOpeningTag] = useState('');
    const [createClosingTag, setCreateClosingTag] = useState('');

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

    return (
        <div className="p-4 md:p-8 flex flex-col items-center gap-10">

            {/* CREATE NEW BOOK */}
            <div className="bg-green-100 border border-green-700 rounded-lg p-6 w-full max-w-6xl">
                <h2 className="text-3xl font-bold text-center text-green-700 mb-6 underline">CREATE NEW BOOK</h2>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6 items-stretch">
                    {/* Select Record */}
                    <div className="md:col-span-3 border border-green-700 rounded p-3 flex flex-col justify-start">
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
                        <div className="flex items-center gap-3 mb-3">
                            <label className="text-sm font-bold text-green-900 w-1/3">Record No</label>
                            <input
                                type="text"
                                placeholder="Record No"
                                disabled={isRecordDisabled}
                                className={`py-2 px-3 text-sm border rounded ${isRecordDisabled ? 'bg-gray-200' : 'bg-white'} border-green-600 w-2/3`}
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <label className="text-sm font-bold text-green-900 w-1/3">Book No</label>
                            <input
                                type="text"
                                placeholder="Book No"
                                className="py-2 px-3 text-sm border rounded bg-white border-green-600 w-2/3"
                            />
                        </div>
                    </div>

                    {/* Head Tag Reference */}
                    <div className="md:col-span-6 border border-green-700 rounded p-3 flex flex-col justify-start">
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

                    {/* End Tag */}
                    <div className="md:col-span-3 border border-green-700 rounded p-3 flex flex-col justify-start">
                        <label className="block text-base font-bold text-green-900 text-center mb-6">End Tag</label>
                        <div className="text-center text-green-900 text-sm font-bold mb-2">Tag Version E. Id</div>
                        <HoverPopup value={createClosingTag} />
                    </div>
                </div>

                {/* Book Name */}
                <div className="mb-6">
                    <label className="font-bold text-base text-green-900 block mb-2">Name of the Book</label>
                    <textarea rows="2" className="w-full border border-green-600 rounded py-2 px-3 text-sm bg-white" placeholder="Enter the book name..." />
                </div>

                {/* Buttons */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    <button className="bg-blue-600 text-white font-bold py-2 rounded flex items-center justify-center gap-2 text-sm"><Edit size={16} /> Edit</button>
                    <button className="bg-green-600 text-white font-bold py-2 rounded flex items-center justify-center gap-2 text-sm"><Save size={16} /> Save</button>
                    <button className="bg-red-600 text-white font-bold py-2 rounded flex items-center justify-center gap-2 text-sm"><Trash2 size={16} /> Delete</button>
                    <button className="bg-green-600 text-white font-bold py-2 rounded flex items-center justify-center gap-2 text-sm"><BookOpen size={16} /> Review the BOOK</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <button className="bg-gradient-to-r from-light-blue to-dark-pink bg-[length:200%_100%] animate-color-blink text-white font-bold py-2 px-4 rounded flex items-center justify-center gap-2 text-sm">
                        <FilePlus size={16} /> Create New Book
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateNewBook;
