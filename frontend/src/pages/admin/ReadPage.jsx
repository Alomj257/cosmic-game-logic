import React, { useEffect, useState } from 'react';
import BookTree from '../../components/bookwork/read/BookTree';
import ContentViewer from '../../components/bookwork/read/ContentViewer';
import { getAllBooks } from '../../services/api'; // <- use your API function

const ReadPage = () => {
  const [books, setBooks] = useState([]);
  const [selectedContent, setSelectedContent] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await getAllBooks();
        const filteredBooks = response.data.filter(book => 
          book.bookName && 
          Array.isArray(book.briefIntroduction) && book.briefIntroduction.length > 0 && 
          Array.isArray(book.authorNotes) && book.authorNotes.length > 0
        );
        setBooks(filteredBooks);
      } catch (error) {
        console.error('Error fetching books:', error);
        setBooks([]);
      }
    };

    fetchBooks();
  }, []);

  const handleSelect = (item) => {
    setSelectedContent(item);
  };

  return (
    <div className="flex h-screen">
      {/* Left Sidebar */}
      <div className="w-1/3 border-r overflow-y-auto p-4 bg-gray-50 hide-scrollbar">
        <h2 className="text-xl font-bold mb-4">📚 Books</h2>
        {books.length === 0 ? (
          <p>No books available with complete data.</p>
        ) : (
          <BookTree books={books} onSelect={handleSelect} />
        )}
      </div>

      {/* Right Content Area */}
      <div className="flex-1 overflow-y-scroll scrollbar-hide p-6 bg-white">
        <ContentViewer content={selectedContent} />
      </div>
    </div>
  );
};

export default ReadPage;
