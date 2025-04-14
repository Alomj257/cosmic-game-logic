import React, { useState } from 'react';
import { Edit, Save, Trash2, PlusSquare, BookOpen, FilePlus, Hash, Settings } from 'lucide-react';

const Book = () => {
  const [recordMode, setRecordMode] = useState('auto');
  const isDisabled = recordMode === 'auto';

  return (
    <div className="p-4 md:p-8 flex justify-center">
      <div className="bg-green-100 border border-green-700 rounded-lg p-6 w-full max-w-6xl">
        <h2 className="text-3xl md:text-3xl font-bold text-center text-green-700 mb-6 underline">CREATE NEW BOOK</h2>

        {/* Top Row */}
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
                className={`py-2 px-3 text-sm border rounded ${isDisabled ? 'bg-gray-200' : 'bg-white'} border-green-600 placeholder:font-normal placeholder:text-sm`}
              />
              <input
                type="text"
                placeholder="Book No"
                disabled={isDisabled}
                className={`py-2 px-3 text-sm border rounded ${isDisabled ? 'bg-gray-200' : 'bg-white'} border-green-600 placeholder:font-normal placeholder:text-sm`}
              />
            </div>
          </div>

          {/* Head Tag Reference (Wider) */}
          <div className="md:col-span-6 border border-green-700 rounded p-4 flex flex-col justify-center">
            <label className="block text-base font-bold text-green-900 text-center mb-10">Head Tag Reference for Book</label>
            <div className="grid grid-cols-3 gap-2 text-center text-green-900 text-sm font-bold mb-2">
              <span>Group Type</span>
              <span>Tag Main Version Id</span>
              <span>Tag Version H. Id</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <select className="py-2 px-3 text-sm border border-green-600 rounded">
                <option>Group 1</option>
                <option>Group 2</option>
              </select>
              <select className="py-2 px-3 text-sm border border-green-600 rounded">
                <option>Tag Main</option>
              </select>
              <select className="py-2 px-3 text-sm border border-green-600 rounded">
                <option>Version H</option>
              </select>
            </div>
          </div>

          {/* End Tag (Smaller) */}
          <div className="md:col-span-3 border border-green-700 rounded p-4 flex flex-col justify-center">
            <label className="block text-base font-bold text-green-900 text-center mb-10">End Tag</label>
            <div className="text-center text-green-900 text-sm font-bold mb-2">Tag Version E. Id</div>
            <select className="py-2 px-3 text-sm border border-green-600 rounded">
              <option>Version E</option>
            </select>
          </div>
        </div>

        {/* Book Name */}
        <div className="mb-6">
          <label className="font-bold text-base text-green-900 block mb-2">Name of the Book</label>
          <textarea
            rows="2"
            className="w-full border border-green-600 rounded py-2 px-3 text-sm bg-white placeholder:font-normal placeholder:text-sm"
            placeholder="Enter the book name..."
          />
        </div>

        {/* Buttons Row 1 */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded flex items-center justify-center gap-2 text-sm">
            <Edit size={16} /> Edit
          </button>
          <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded flex items-center justify-center gap-2 text-sm">
            <Save size={16} /> Save
          </button>
          <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded flex items-center justify-center gap-2 text-sm">
            <Trash2 size={16} /> Delete
          </button>
          <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded flex items-center justify-center gap-2 text-sm">
            <PlusSquare size={16} /> Next Book
          </button>
          <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded flex items-center justify-center gap-2 text-sm">
            <BookOpen size={16} /> Review
          </button>
        </div>

        {/* Buttons Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded flex items-center justify-center gap-2 text-sm">
            <FilePlus size={16} /> Create Book
          </button>
          <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded flex items-center justify-center gap-2 text-sm">
            <Hash size={16} /> System Numbering
          </button>
          <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded flex items-center justify-center gap-2 text-sm">
            <Settings size={16} /> Manual Numbering
          </button>
        </div>
      </div>
    </div>
  );
};

export default Book;
