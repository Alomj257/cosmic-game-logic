import React, { useEffect, useState } from 'react';
import BookTree from '../../components/bookwork/read/BookTree';
import ContentViewer from '../../components/bookwork/read/ContentViewer';
import { getAllBooks } from '../../services/api';

const ReadPage = () => {
  const [books, setBooks] = useState([]);
  const [selectedContent, setSelectedContent] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await getAllBooks();
        const booksData = response.data;
  
        // Group books by bookNumber
        const bookMap = new Map();
  
        booksData.forEach((book) => {
          if (!book.bookNumber) return;
  
          const existing = bookMap.get(book.bookNumber);
  
          // Prefer book with briefIntroduction if duplicate
          if (
            !existing ||
            (Array.isArray(book.briefIntroduction) && book.briefIntroduction.length > 0)
          ) {
            bookMap.set(book.bookNumber, book);
          }
        });
  
        const uniqueBooks = Array.from(bookMap.values());
        setBooks(uniqueBooks);
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
    <div className="flex h-[90vh]">
      {/* Left Sidebar */}
      <div className="w-1/3 border-r overflow-y-auto p-4 hide-scrollbar">
        <h2 className="text-xl font-bold mb-4">Books</h2> {/* Emoji removed */}
        {books.length === 0 ? (
          <p>No books available with complete data.</p>
        ) : (
          <BookTree books={books} onSelect={handleSelect} />
        )}
      </div>

      {/* Right Content Area */}
      <div className="flex-1 overflow-y-scroll scrollbar-hide bg-white">
        <ContentViewer content={selectedContent} />
      </div>
    </div>
  );
};

export default ReadPage;
