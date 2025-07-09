import React, { useEffect, useState } from 'react';
import BookTree from '../../components/bookwork/read/BookTree';
import ContentViewer from '../../components/bookwork/read/ContentViewer';
import { getBooksWithChapters } from '../../services/api';

const ReadPage = () => {
  const [books, setBooks] = useState([]);
  const [selectedContent, setSelectedContent] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await getBooksWithChapters();
        setBooks(response.data);
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
        <h2 className="text-xl font-bold mb-4">Books</h2>
        {books.length === 0 ? (
          <p>No books available.</p>
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
