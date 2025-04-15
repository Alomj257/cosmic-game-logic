import React, { useEffect, useState } from 'react';
import { Edit, Save, Trash2, PlusSquare, BookOpen, FilePlus, Hash, Settings } from 'lucide-react';
import { getAllTags, getTagMainIdsByDataType } from '../../../services/api';

const Book = () => {
  const [recordMode, setRecordMode] = useState('auto');
  const isDisabled = recordMode === 'auto';

  const [notesInput, setNotesInput] = useState('');
  const [savedNotes, setSavedNotes] = useState([]);

  const [groupTypes, setGroupTypes] = useState([]);

  // Independent states for Create and Brief
  const [createGroupType, setCreateGroupType] = useState('');
  const [createTagMainIds, setCreateTagMainIds] = useState([]);

  const [briefGroupType, setBriefGroupType] = useState('');
  const [briefTagMainIds, setBriefTagMainIds] = useState([]);

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
    const fetchBriefTagMainIds = async () => {
      if (!briefGroupType) return;
      try {
        const response = await getTagMainIdsByDataType(briefGroupType);
        setBriefTagMainIds(response.data);
      } catch (error) {
        console.error('Error fetching brief tag main ids:', error);
      }
    };

    fetchBriefTagMainIds();
  }, [briefGroupType]);

  const handleSaveNotes = () => {
    const lines = notesInput.split('\n').filter(line => line.trim() !== '');
    setSavedNotes(lines);
  };

  return (
    <div className="p-4 md:p-8 min-h-screen flex flex-col items-center gap-10">
      {/* CREATE NEW BOOK */}
      <div className="bg-green-100 border border-green-700 rounded-lg p-6 w-full max-w-6xl">
        <h2 className="text-3xl font-bold text-center text-green-700 mb-6 underline">CREATE NEW BOOK</h2>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6 items-stretch">
          {/* Select Record */}
          <div className="md:col-span-3 border border-green-700 rounded p-4 flex flex-col justify-between">
            <label className="block text-base font-bold text-green-900 mb-3">Select Record No</label>
            <div className="flex gap-4 mb-4">
              <button
                className={`px-5 py-2 text-sm font-bold border rounded ${recordMode === 'auto' ? 'bg-green-300' : 'bg-white'} border-green-600`}
                onClick={() => setRecordMode('auto')}
              >
                Auto
              </button>
              <button
                className={`px-5 py-2 text-sm font-bold border rounded ${recordMode === 'manual' ? 'bg-green-300' : 'bg-white'} border-green-600`}
                onClick={() => setRecordMode('manual')}
              >
                Manual
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Record No"
                disabled={isDisabled}
                className={`py-2 px-3 text-sm border rounded ${isDisabled ? 'bg-gray-200' : 'bg-white'} border-green-600`}
              />
              <input
                type="text"
                placeholder="Book No"
                disabled={isDisabled}
                className={`py-2 px-3 text-sm border rounded ${isDisabled ? 'bg-gray-200' : 'bg-white'} border-green-600`}
              />
            </div>
          </div>

          {/* Head Tag Reference */}
          <div className="md:col-span-6 border border-green-700 rounded p-4 flex flex-col justify-center">
            <label className="block text-base font-bold text-green-900 text-center mb-10">Head Tag Reference for Book</label>
            <div className="grid grid-cols-3 gap-2 text-center text-green-900 text-sm font-bold mb-2">
              <span>Group Type</span>
              <span>Tag Main Version Id</span>
              <span>Tag Version H. Id</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <select
                className="py-2 px-3 text-sm border border-green-600 rounded"
                value={createGroupType}
                onChange={(e) => setCreateGroupType(e.target.value)}
              >
                <option value="">Select Group</option>
                {groupTypes.map((code, index) => (
                  <option key={index} value={code}>{code}</option>
                ))}
              </select>
              <select className="py-2 px-3 text-sm border border-green-600 rounded">
                {createTagMainIds.map((id, index) => (
                  <option key={index} value={id}>{id}</option>
                ))}
              </select>
              <select className="py-2 px-3 text-sm border border-green-600 rounded">
                <option>Version H</option>
              </select>
            </div>
          </div>

          {/* End Tag */}
          <div className="md:col-span-3 border border-green-700 rounded p-4 flex flex-col justify-center">
            <label className="block text-base font-bold text-green-900 text-center mb-10">End Tag</label>
            <div className="text-center text-green-900 text-sm font-bold mb-2">Tag Version E. Id</div>
            <select className="py-2 px-3 text-sm border border-green-600 rounded">
              <option>Version E</option>
            </select>
          </div>
        </div>

        <div className="mb-6">
          <label className="font-bold text-base text-green-900 block mb-2">Name of the Book</label>
          <textarea
            rows="2"
            className="w-full border border-green-600 rounded py-2 px-3 text-sm bg-white"
            placeholder="Enter the book name..."
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
          <button className="bg-blue-600 text-white font-bold py-2 rounded flex items-center justify-center gap-2 text-sm"><Edit size={16} /> Edit</button>
          <button className="bg-green-600 text-white font-bold py-2 rounded flex items-center justify-center gap-2 text-sm"><Save size={16} /> Save</button>
          <button className="bg-red-600 text-white font-bold py-2 rounded flex items-center justify-center gap-2 text-sm"><Trash2 size={16} /> Delete</button>
          <button className="bg-green-600 text-white font-bold py-2 rounded flex items-center justify-center gap-2 text-sm"><PlusSquare size={16} /> Next Book</button>
          <button className="bg-green-600 text-white font-bold py-2 rounded flex items-center justify-center gap-2 text-sm"><BookOpen size={16} /> Review</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button className="bg-green-600 text-white font-bold py-2 rounded flex items-center justify-center gap-2 text-sm"><FilePlus size={16} /> Create Book</button>
          <button className="bg-green-600 text-white font-bold py-2 rounded flex items-center justify-center gap-2 text-sm"><Hash size={16} /> System Numbering</button>
          <button className="bg-green-600 text-white font-bold py-2 rounded flex items-center justify-center gap-2 text-sm"><Settings size={16} /> Manual Numbering</button>
        </div>
      </div>

      {/* BRIEF INTRODUCTION */}
      <div className="bg-green-100 border border-green-700 rounded-lg p-6 w-full max-w-6xl">
        <h2 className="text-3xl font-bold text-center text-green-700 mb-6 underline">BRIEF INTRODUCTION OF THE SELECTED BOOK</h2>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6 items-stretch">
          {/* Select Record */}
          <div className="md:col-span-3 border border-green-700 rounded p-4">
            <label className="block text-base font-bold text-green-900 mb-3">Select Record No</label>
            <div className="grid grid-cols-2 gap-2">
              <input type="text" placeholder="Record No" className="py-2 px-3 text-sm border border-green-600 rounded" />
              <input type="text" placeholder="Book No" className="py-2 px-3 text-sm border border-green-600 rounded" />
            </div>
          </div>

          {/* Head Tag Reference */}
          <div className="md:col-span-6 border border-green-700 rounded p-4">
            <label className="block text-base font-bold text-green-900 text-center mb-10">Head Tag Reference for Book</label>
            <div className="grid grid-cols-3 gap-2 text-center text-green-900 text-sm font-bold mb-2">
              <span>Group Type</span>
              <span>Tag Main Version Id</span>
              <span>Tag Version H. Id</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <select
                className="py-2 px-3 text-sm border border-green-600 rounded"
                value={briefGroupType}
                onChange={(e) => setBriefGroupType(e.target.value)}
              >
                <option value="">Select Group</option>
                {groupTypes.map((code, index) => (
                  <option key={index} value={code}>{code}</option>
                ))}
              </select>
              <select className="py-2 px-3 text-sm border border-green-600 rounded">
                {briefTagMainIds.map((id, index) => (
                  <option key={index} value={id}>{id}</option>
                ))}
              </select>
              <select className="py-2 px-3 text-sm border border-green-600 rounded">
                <option>Version H</option>
              </select>
            </div>
          </div>

          {/* End Tag */}
          <div className="md:col-span-3 border border-green-700 rounded p-4 flex flex-col justify-center">
            <label className="block text-base font-bold text-green-900 text-center mb-10">End Tag</label>
            <div className="text-center text-green-900 text-sm font-bold mb-2">Tag Version E. Id</div>
            <select className="py-2 px-3 text-sm border border-green-600 rounded">
              <option>Version E</option>
            </select>
          </div>
        </div>

        <div className="mb-6">
          <label className="font-bold text-base text-green-900 block mb-2">Introduction</label>
          <textarea
            rows="6"
            className="w-full border border-green-600 rounded py-2 px-3 text-sm bg-white"
            placeholder="Enter brief introduction of the selected book..."
          />
        </div>

        <div className="mb-6">
          <label className="block text-base font-bold text-green-900 mb-3">Are you planning for extra para?</label>
          <div className="flex gap-4">
            <button className="bg-green-600 text-white font-bold px-6 py-2 rounded text-sm">Yes</button>
            <button className="bg-red-600 text-white font-bold px-6 py-2 rounded text-sm">No</button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <button className="bg-blue-600 text-white font-bold py-2 rounded flex items-center justify-center gap-2 text-sm"><Edit size={16} /> Edit</button>
          <button className="bg-green-600 text-white font-bold py-2 rounded flex items-center justify-center gap-2 text-sm"><Save size={16} /> Save</button>
          <button className="bg-red-600 text-white font-bold py-2 rounded flex items-center justify-center gap-2 text-sm"><Trash2 size={16} /> Delete</button>
          <button className="bg-green-600 text-white font-bold py-2 rounded flex items-center justify-center gap-2 text-sm"><PlusSquare size={16} /> Next Book</button>
          <button className="bg-green-600 text-white font-bold py-2 rounded flex items-center justify-center gap-2 text-sm"><BookOpen size={16} /> Review</button>
        </div>
      </div>

      {/* AUTHOR'S NOTE PAD */}
      <div className="bg-green-100 border border-green-700 rounded-lg p-6 w-full max-w-6xl">
        <h2 className="text-3xl font-bold text-center text-green-700 mb-6 underline">AUTHOR'S NOTE PAD</h2>

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
            <div className="border border-green-600 rounded p-4 min-h-[240px] bg-white">
              {savedNotes.length === 0 ? (
                <p className="text-gray-400 text-sm italic">Nothing saved yet...</p>
              ) : (
                <ul className="list-disc list-inside text-green-900 text-sm space-y-1">
                  {savedNotes.map((note, index) => (
                    <li key={index}>{note}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <button className="bg-blue-600 text-white font-bold py-2 rounded flex items-center justify-center gap-2 text-sm"><Edit size={16} /> Edit</button>
          <button className="bg-green-600 text-white font-bold py-2 rounded flex items-center justify-center gap-2 text-sm" onClick={handleSaveNotes}><Save size={16} /> Save</button>
          <button className="bg-red-600 text-white font-bold py-2 rounded flex items-center justify-center gap-2 text-sm" onClick={() => { setNotesInput(''); setSavedNotes([]); }}><Trash2 size={16} /> Delete</button>
          <button className="bg-green-600 text-white font-bold py-2 rounded flex items-center justify-center gap-2 text-sm"><PlusSquare size={16} /> Next Point</button>
          <button className="bg-green-600 text-white font-bold py-2 rounded flex items-center justify-center gap-2 text-sm"><BookOpen size={16} /> Review</button>
        </div>
      </div>
    </div>
  );
};

export default Book;
