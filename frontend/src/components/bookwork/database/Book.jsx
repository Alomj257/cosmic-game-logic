import React, { useEffect, useState } from 'react';
import { getAllBooks, updateBook, deleteBook } from '../../../services/api';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';

const Book = () => {
  const [books, setBooks] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [viewData, setViewData] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await getAllBooks();
      setBooks(Array.isArray(res.data) ? res.data : res.data.books || []);
    } catch (err) {
      console.error('❌ Failed to fetch books:', err);
    }
  };

  const handleDelete = async () => {
    await deleteBook(deleteId);
    setShowDeleteModal(false);
    fetchBooks();
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
    <div className="mt-10 border border-green-700 rounded-2xl bg-green-100 p-6 shadow-md overflow-x-auto">
      <h2 className="text-3xl font-bold text-center text-green-700 underline mb-6">
        BOOK DATABASE
      </h2>
      <table className="min-w-full border-collapse border border-green-700 text-sm text-left">
        <thead className="bg-green-800 text-white text-base">
          <tr className="h-16">
            <th className="border border-green-700 text-center px-2 py-2">Record No</th>
            <th className="border border-green-700 text-center px-2 py-2">Book No</th>
            <th className="border border-green-700 text-center px-2 py-2">Group Type</th>
            <th className="border border-green-700 text-center px-2 py-2">Tag Main Version ID</th>
            <th className="border border-green-700 text-center px-2 py-2 w-[200px]">Tag Version H ID</th>
            <th className="border border-green-700 text-center px-2 py-2">Tag Version E ID</th>
            <th className="border border-green-700 text-center px-2 py-2">Book Name</th>
            <th className="border border-green-700 text-center px-2 py-2 w-[200px]">Brief Intro</th>
            <th className="border border-green-700 text-center px-2 py-2 w-[200px]">Author Notes</th>
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
              <td className="border border-green-700 text-center px-2 py-2 w-[200px]">{(book.tagVersionHId || '').slice(0, 50)}</td>
              <td className="border border-green-700 text-center px-2 py-2">{book.tagVersionEId || '---'}</td>
              <td className="border border-green-700 text-center px-2 py-2">{book.bookName || '---'}</td>
              <td className="border border-green-700 text-left px-2 py-2 w-[200px]">
                {Array.isArray(book.briefIntroduction)
                  ? book.briefIntroduction.slice(0, 3).map((p, index) => {
                      const truncated = p.paragraph.length > 30 ? p.paragraph.slice(0, 30) + '...' : p.paragraph;
                      return <p key={index}>{truncated}</p>;
                    })
                  : '---'}
              </td>
              <td className="border border-green-700 text-left px-2 py-2 w-[200px]">
                {book.authorNotes && book.authorNotes.length > 0
                  ? book.authorNotes.slice(0, 3).map((note, index) => {
                      const truncated = note.point.length > 30 ? note.point.slice(0, 30) + '...' : note.point;
                      return <p key={index}>{truncated}</p>;
                    })
                  : '---'}
              </td>
              <td className="border border-green-700 text-center px-2 py-2 space-x-2 w-[100px]">
                <EyeOutlined
                  className="text-green-700 cursor-pointer"
                  onClick={() => setViewData(book)}
                />
                <EditOutlined
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
                />
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
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <div className="bg-white rounded-xl p-6 shadow-lg w-[90%] max-w-2xl">
            <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">Edit Book</h2>
            <div className="grid grid-cols-2 gap-4">
              <input type="text" name="recordNumber" value={editData.recordNumber} onChange={handleEditChange} placeholder="Record Number" className="border border-green-700 rounded px-4 py-2" />
              <input type="text" name="bookNumber" value={editData.bookNumber} onChange={handleEditChange} placeholder="Book Number" className="border border-green-700 rounded px-4 py-2" />
              <input type="text" name="groupType" value={editData.groupType} onChange={handleEditChange} placeholder="Group Type" className="border border-green-700 rounded px-4 py-2" />
              <input type="text" name="tagMainVersionId" value={editData.tagMainVersionId} onChange={handleEditChange} placeholder="Tag Main Version ID" className="border border-green-700 rounded px-4 py-2" />
              <input type="text" name="tagVersionHId" value={editData.tagVersionHId} onChange={handleEditChange} placeholder="Tag Version H ID" className="border border-green-700 rounded px-4 py-2" />
              <input type="text" name="tagVersionEId" value={editData.tagVersionEId} onChange={handleEditChange} placeholder="Tag Version E ID" className="border border-green-700 rounded px-4 py-2" />
              <input type="text" name="bookName" value={editData.bookName} onChange={handleEditChange} placeholder="Book Name" className="border border-green-700 rounded px-4 py-2 col-span-2" />
              <textarea
                name="briefIntroduction"
                value={editData.briefIntroduction}
                onChange={handleEditChange}
                placeholder="Brief Introduction (one paragraph per line)"
                className="border border-green-700 rounded px-4 py-2 col-span-2"
                rows="4"
              />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowEditModal(false)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
                Cancel
              </button>
              <button onClick={handleEditSave} className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800">
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODAL */}
      {viewData && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <div className="bg-white border border-green-700 rounded-xl p-6 shadow-lg w-[95%] max-w-4xl max-h-[80vh] overflow-auto">
            <h2 className="text-2xl font-bold text-green-700 mb-4 text-center underline">Book Details</h2>
            <div className="text-green-900 whitespace-pre-wrap">
              <p><strong>Record Number:</strong> {viewData.recordNumber}</p>
              <p><strong>Book Number:</strong> {viewData.bookNumber}</p>
              <p><strong>Group Type:</strong> {viewData.groupType}</p>
              <p><strong>Tag Main Version ID:</strong> {viewData.tagMainVersionId}</p>
              <p><strong>Tag Version H ID:</strong> {viewData.tagVersionHId}</p>
              <p><strong>Tag Version E ID:</strong> {viewData.tagVersionEId}</p>
              <p><strong>Book Name:</strong> {viewData.bookName}</p>
              <p><strong>Brief Introduction:</strong></p>
              <pre>{viewData.briefIntroduction.map(p => p.paragraph).join('\n')}</pre>
              <p><strong>Author Notes:</strong></p>
              <pre>{viewData.authorNotes ? viewData.authorNotes.map(note => note.point).join('\n') : 'No notes available'}</pre>
            </div>
            <div className="text-center mt-6">
              <button
                onClick={() => setViewData(null)}
                className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Book;
