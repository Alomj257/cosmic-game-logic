import React, { useEffect, useState } from 'react';
import { getAllBooks, updateBook, deleteBook } from '../../../services/api';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { X } from 'lucide-react';

const Book = () => {
  const [books, setBooks] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [viewData, setViewData] = useState(null);
  const [briefIntroViewData, setBriefIntroViewData] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await getAllBooks();
      let bookList = Array.isArray(res.data) ? res.data : res.data.books || [];

      // Sort by Book Number (assuming they are numeric or can be parsed as numbers)
      bookList.sort((a, b) => {
        const numA = parseFloat(a.bookNumber);
        const numB = parseFloat(b.bookNumber);
        return isNaN(numA) || isNaN(numB)
          ? String(a.bookNumber).localeCompare(String(b.bookNumber))
          : numA - numB;
      });

      setBooks(bookList);
    } catch (err) {
      console.error('❌ Failed to fetch books:', err);
    }
  };

  const handleDelete = async () => {
    await deleteBook(deleteId);
    setShowDeleteModal(false);
    fetchBooks();
  };
  const handleAuthorNoteChange = (e, index) => {
    const updatedNotes = [...editData.authorNotes];
    updatedNotes[index].point = e.target.value;
    setEditData({ ...editData, authorNotes: updatedNotes });
  };

  const handleAddAuthorNote = () => {
    const newNote = { point: '' };
    setEditData({
      ...editData,
      authorNotes: [...editData.authorNotes, newNote],
    });
  };

  const handleRemoveAuthorNote = (index) => {
    const updatedNotes = [...editData.authorNotes];
    updatedNotes.splice(index, 1);
    setEditData({ ...editData, authorNotes: updatedNotes });
  };

  const handleEditSave = async () => {
    const updatedData = {
      ...editData,
      briefIntroduction: editData.briefIntroduction
        .split('\n')
        .filter(p => p.trim() !== '')
        .map(p => ({ paragraph: p.trim() }))
    };
    await updateBook(editData._id, updatedData);
    setShowEditModal(false);
    fetchBooks();
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="m-10 border border-green-700 rounded-2xl bg-green-100 p-6 shadow-md overflow-x-auto">
      <h2 className="text-3xl font-bold text-center text-green-700 underline mb-6">
        BOOK DATABASE
      </h2>
      <table className="min-w-full border-collapse border border-green-700 text-sm text-left">
        <thead className="bg-green-800 text-white text-base">
          <tr className="h-16">
            <th className="border border-green-700 text-center px-2 py-2">Record No</th>
            <th className="border border-green-700 text-center px-2 py-2 ">Book No</th>
            <th className="border border-green-700 text-center px-2 py-2">Group Type</th>
            <th className="border border-green-700 text-center px-2 py-2">Tag Main Version ID</th>
            <th className="border border-green-700 text-center px-2 py-2 w-[180px]">Tag Version H ID</th>
            <th className="border border-green-700 text-center px-2 py-2">Tag Version E ID</th>
            <th className="border border-green-700 text-center px-2 py-2 w-[180px]">Book Name</th>
            <th className="border border-green-700 text-center px-2 py-2 w-[180px]">Brief Intro</th>
            <th className="border border-green-700 text-center px-2 py-2 w-[180px]">Author Notes</th>
            <th className="border border-green-700 text-center px-2 py-2 w-[100px]">Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book._id} className="bg-green-50 hover:bg-green-200 text-[15px]">
              <td className="border border-green-700 text-center px-2 py-2">{book.recordNumber || '---'}</td>
              <td className="border border-green-700 text-center px-2 py-2">{book.bookNumber || '---'}</td>
              <td className="border border-green-700 text-center px-2 py-2">{book.groupType || '---'}</td>
              <td className="border border-green-700 text-center px-2 py-2">{book.tagMainVersionId || '---'}</td>
              <td className="border border-green-700 text-center px-2 py-2 w-[180px]">{(book.tagVersionHId || '').slice(0, 50)}</td>
              <td className="border border-green-700 text-center px-2 py-2">{book.tagVersionEId || '---'}</td>
              <td className="border border-green-700 text-center px-2 py-2 w-[180px]">{book.bookName || '---'}</td>
              {/* <td className="border border-green-700 text-left px-2 py-2 w-[180px]">
                {Array.isArray(book.briefIntroduction) && book.briefIntroduction.length > 0
                  ? book.briefIntroduction.slice(0, 3).map((p, index) => {
                    const truncated = p.paragraph.length > 30 ? p.paragraph.slice(0, 30) + 'more' : p.paragraph;
                    return <p key={index}>{truncated}</p>;
                  })
                  : '---'}
              </td>
              <td className="border border-green-700 text-left px-2 py-2 w-[180px]">
                {book.authorNotes && book.authorNotes.length > 0
                  ? book.authorNotes.slice(0, 3).map((note, index) => {
                    const truncated = note.point.length > 30 ? note.point.slice(0, 30) + 'more' : note.point;
                    return <p key={index}>{truncated}</p>;
                  })
                  : '---'}
              </td> */}
              <td className="border border-green-700 text-left px-2 py-2 w-[180px]">
                {Array.isArray(book.briefIntroduction) && book.briefIntroduction.length > 0
                  ? book.briefIntroduction.slice(0, 3).map((p, index) => {
                    const isTruncated = p.paragraph.length > 30;
                    const truncated = p.paragraph.slice(0, 30);
                    return (
                      <p key={index}>
                        {truncated}
                        {isTruncated && <span className="text-red-600 font-bold">...more</span>}
                      </p>
                    );
                  })
                  : '---'}
              </td>

              <td className="border border-green-700 text-left px-2 py-2 w-[180px]">
                {book.authorNotes && book.authorNotes.length > 0
                  ? book.authorNotes.slice(0, 3).map((note, index) => {
                    const isTruncated = note.point.length > 30;
                    const truncated = note.point.slice(0, 30);
                    return (
                      <p key={index}>
                        {truncated}
                        {isTruncated && <span className="text-red-600 font-bold">...more</span>}
                      </p>
                    );
                  })
                  : '---'}
              </td>

              <td className="border border-green-700 text-center px-2 py-2 space-x-2 w-[100px]">
                <EyeOutlined
                  className="text-purple-700 cursor-pointer"
                  onClick={() => setBriefIntroViewData(book)}
                  title="View Brief Intro Tag Info"
                />
                <EyeOutlined
                  className="text-green-700 cursor-pointer"
                  onClick={() => setViewData(book)}
                />
                {/* <EditOutlined
                  className="text-blue-600 cursor-pointer"
                  onClick={() => {
                    setEditData({
                      ...book,
                      briefIntroduction: Array.isArray(book.briefIntroduction)
                        ? book.briefIntroduction.map(p => p.paragraph).join('\n')
                        : ''
                    });
                    setShowEditModal(true);
                  }}
                /> */}
                <DeleteOutlined
                  className="text-red-600 cursor-pointer"
                  onClick={() => {
                    setDeleteId(book._id);
                    setShowDeleteModal(true);
                  }}
                />
              </td>
            </tr>
          ))}
          {books.length === 0 && (
            <tr>
              <td colSpan="10" className="text-center text-green-800 py-4">
                No books found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <div className="bg-green-100 border border-green-700 rounded-xl p-6 shadow-lg w-[90%] max-w-md text-center">
            <h2 className="text-xl font-bold text-green-800 mb-4 underline">Delete Book</h2>
            <p className="text-green-900 mb-6">Are you sure you want to delete this book?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-white border border-green-700 rounded hover:bg-green-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEditModal && editData && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-[95%] max-w-4xl p-8 overflow-y-auto h-[80vh] relative">

            {/* Close Icon at the top-right (red X icon) */}
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-4 right-4 text-red-600 hover:text-red-800"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="text-2xl font-bold text-green-700 mb-6 text-center underline">Edit Book</h2>

            {/* Book Details */}
            <div className="space-y-4 text-sm">
              {/* Side by side layout for the fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="text-green-900">
                  <label className="font-semibold text-green-900">Record Number:</label>
                  <input
                    type="text"
                    name="recordNumber"
                    value={editData.recordNumber}
                    onChange={handleEditChange}
                    placeholder="Record Number"
                    className="border border-green-700 rounded px-4 py-2 w-full"
                  />
                </div>
                <div className="text-green-900">
                  <label className="font-semibold text-green-900">Book Number:</label>
                  <input
                    type="text"
                    name="bookNumber"
                    value={editData.bookNumber}
                    onChange={handleEditChange}
                    placeholder="Book Number"
                    className="border border-green-700 rounded px-4 py-2 w-full"
                  />
                </div>
                <div className="text-green-900">
                  <label className="font-semibold text-green-900">Group Type:</label>
                  <input
                    type="text"
                    name="groupType"
                    value={editData.groupType}
                    onChange={handleEditChange}
                    placeholder="Group Type"
                    className="border border-green-700 rounded px-4 py-2 w-full"
                  />
                </div>
                <div className="text-green-900">
                  <label className="font-semibold text-green-900">Tag Main Version ID:</label>
                  <input
                    type="text"
                    name="tagMainVersionId"
                    value={editData.tagMainVersionId}
                    onChange={handleEditChange}
                    placeholder="Tag Main Version ID"
                    className="border border-green-700 rounded px-4 py-2 w-full"
                  />
                </div>
                <div className="text-green-900">
                  <label className="font-semibold text-green-900">Tag Version H ID:</label>
                  <input
                    type="text"
                    name="tagVersionHId"
                    value={editData.tagVersionHId}
                    onChange={handleEditChange}
                    placeholder="Tag Version H ID"
                    className="border border-green-700 rounded px-4 py-2 w-full"
                  />
                </div>
                <div className="text-green-900">
                  <label className="font-semibold text-green-900">Tag Version E ID:</label>
                  <input
                    type="text"
                    name="tagVersionEId"
                    value={editData.tagVersionEId}
                    onChange={handleEditChange}
                    placeholder="Tag Version E ID"
                    className="border border-green-700 rounded px-4 py-2 w-full"
                  />
                </div>
              </div>

              {/* Book Name (Larger label) */}
              <div className="text-green-900">
                <label className="font-semibold text-lg">Book Name:</label>
                <input
                  type="text"
                  name="bookName"
                  value={editData.bookName}
                  onChange={handleEditChange}
                  placeholder="Book Name"
                  className="border border-green-700 rounded px-4 py-2 w-full"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="text-green-900">
                  <label className="font-semibold text-green-900">Brief Intro Group Type:</label>
                  <input
                    type="text"
                    name="briefIntroGroupType"
                    value={editData.briefIntroGroupType || ''}
                    onChange={handleEditChange}
                    placeholder="Brief Intro Group Type"
                    className="border border-green-700 rounded px-4 py-2 w-full"
                  />
                </div>

                <div className="text-green-900">
                  <label className="font-semibold text-green-900">Brief Intro Main Version ID:</label>
                  <input
                    type="text"
                    name="briefIntroMainVersionId"
                    value={editData.briefIntroMainVersionId || ''}
                    onChange={handleEditChange}
                    placeholder="Brief Intro Main Version ID"
                    className="border border-green-700 rounded px-4 py-2 w-full"
                  />
                </div>

                <div className="text-green-900">
                  <label className="font-semibold text-green-900">Brief Intro Version H ID:</label>
                  <textarea
                    name="briefIntroVersionHId"
                    value={editData.briefIntroVersionHId || ''}
                    onChange={handleEditChange}
                    placeholder="Brief Intro Version H ID"
                    className="border border-green-700 rounded px-4 py-2 w-full"
                    rows={3}
                  />
                </div>

                <div className="text-green-900">
                  <label className="font-semibold text-green-900">Brief Intro Version E ID:</label>
                  <textarea
                    name="briefIntroVersionEId"
                    value={editData.briefIntroVersionEId || ''}
                    onChange={handleEditChange}
                    placeholder="Brief Intro Version E ID"
                    className="border border-green-700 rounded px-4 py-2 w-full"
                    rows={3}
                  />
                </div>
              </div>

              {/* Brief Introduction (Larger label) */}
              <div className="text-green-900">
                <label className="font-semibold text-lg">Brief Introduction:</label>
                <textarea
                  name="briefIntroduction"
                  value={editData.briefIntroduction}
                  onChange={handleEditChange}
                  placeholder="Brief Introduction (one paragraph per line)"
                  className="border border-green-700 rounded px-4 py-2 w-full"
                  rows="4"
                />
              </div>

              {/* Editable Author Notes (Similar to Brief Introduction) */}
              <div className="text-green-900">
                <label className="font-semibold text-lg">Author Notes:</label>

                {/* Displaying author notes as editable paragraphs */}
                <div className="space-y-4">
                  {editData.authorNotes && editData.authorNotes.length > 0 ? (
                    editData.authorNotes.map((note, index) => (
                      <div key={note._id} className="flex space-x-3 items-center">
                        <textarea
                          value={note.point}
                          onChange={(e) => handleAuthorNoteChange(e, index)}
                          className="w-full border-none rounded px-4 py-2 focus:outline-none focus:ring-1 focus:ring-green-600"
                          rows="2"
                          placeholder="Edit author note..."
                        />
                        <button
                          onClick={() => handleRemoveAuthorNote(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))
                  ) : (
                    <p>No author notes available</p>
                  )}
                </div>

                {/* Button to Add New Author Note */}
                <div className="mt-4">
                  <button
                    onClick={handleAddAuthorNote}
                    className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800"
                  >
                    Add Author Note
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODAL */}
      {viewData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full p-8 overflow-y-auto max-h-[85vh] relative">
            {/* Close Button */}
            <button
              onClick={() => setViewData(null)}
              className="absolute top-4 right-4 text-red-600 hover:text-red-800"
            >
              <X size={24} />
            </button>

            <h2 className="text-2xl font-bold text-green-700 mb-6 text-center underline">Book Details</h2>

            {/* Book Details */}
            <div className="space-y-4 text-sm">
              {/* Side by side layout for the general fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="text-green-900">
                  <strong className="font-semibold">Record Number:</strong>
                  <span className="text-black ml-2">{viewData.recordNumber || ''}</span>
                </div>
                <div className="text-green-900">
                  <strong className="font-semibold">Book Number:</strong>
                  <span className="text-black ml-2">{viewData.bookNumber || ''}</span>
                </div>
                <div className="text-green-900">
                  <strong className="font-semibold">Group Type:</strong>
                  <span className="text-black ml-2">{viewData.groupType || ''}</span>
                </div>
                <div className="text-green-900">
                  <strong className="font-semibold">Tag Main Version ID:</strong>
                  <span className="text-black ml-2">{viewData.tagMainVersionId || ''}</span>
                </div>
                <div className="text-green-900">
                  <strong className="font-semibold">Tag Version H ID:</strong>
                  <span className="text-black ml-2">{viewData.tagVersionHId || ''}</span>
                </div>
                <div className="text-green-900">
                  <strong className="font-semibold">Tag Version E ID:</strong>
                  <span className="text-black ml-2">{viewData.tagVersionEId || ''}</span>
                </div>
              </div>

              {/* Book Name (Larger label) */}
              <div>
                <strong className="font-semibold text-lg text-green-900">Book Name:</strong>
                <span className="text-black ml-2">{viewData.bookName || ''}</span>
              </div>

              {/* Brief Introduction (Larger label) */}
              <div>
                <strong className="font-semibold text-lg text-green-900">Brief Introduction:</strong>
                <div
                  className="mt-2 border p-3 rounded bg-gray-50"
                  dangerouslySetInnerHTML={{
                    __html: viewData.briefIntroduction.map(p => p.paragraph).join('<br/>')
                  }}
                />
              </div>

              {/* Author Notes (Larger label) */}
              <div>
                <strong className="font-semibold text-lg text-green-900">Author Notes:</strong>
                <div className="mt-2 border p-3 rounded bg-gray-50">
                  {viewData.authorNotes?.length > 0
                    ? viewData.authorNotes.map((note, index) => (
                      <p key={index} className="text-black">{note.point}</p>
                    ))
                    : <span className="text-black">No notes available</span>}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {briefIntroViewData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-xl w-full p-8 relative">
            {/* Close Button */}
            <button
              onClick={() => setBriefIntroViewData(null)}
              className="absolute top-4 right-4 text-red-600 hover:text-red-800"
            >
              <X size={24} />
            </button>

            <h2 className="text-xl font-bold text-center text-purple-700 underline mb-6">
              Brief Intro Tag Details
            </h2>

            <div className="space-y-4 text-sm">
              <div className="text-purple-900">
                <strong className="font-semibold">Group Type:</strong>
                <span className="ml-2 text-black">{briefIntroViewData.briefIntroGroupType || '---'}</span>
              </div>
              <div className="text-purple-900">
                <strong className="font-semibold">Main Version ID:</strong>
                <span className="ml-2 text-black">{briefIntroViewData.briefIntroMainVersionId || '---'}</span>
              </div>
              <div className="text-purple-900">
                <strong className="font-semibold">Version H ID:</strong>
                <div className="mt-2 border p-3 bg-gray-50 rounded">
                  <pre className="text-xs overflow-x-auto">{briefIntroViewData.briefIntroVersionHId || '---'}</pre>
                </div>
              </div>
              <div className="text-purple-900">
                <strong className="font-semibold">Version E ID:</strong>
                <div className="mt-2 border p-3 bg-gray-50 rounded">
                  <pre className="text-xs overflow-x-auto">{briefIntroViewData.briefIntroVersionEId || '---'}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Book;
