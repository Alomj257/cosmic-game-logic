import React, { useState } from 'react';
import ChapterTree from './ChapterTree';

const BookTree = ({ books, onSelect }) => {
  const [activeBook, setActiveBook] = useState(null);

  const handleSelect = (book) => {
    setActiveBook(book._id);
    onSelect(book);
  };

  return (
    <ul className="space-y-2">
      {books.map((book) => (
        <li key={book._id}>
          <div
            onClick={() => handleSelect(book)}
            className={`cursor-pointer font-semibold px-3 py-1 rounded-md transition text-sm
              ${activeBook === book._id 
                ? 'bg-brown-600 text-white' 
                : 'bg-white text-brown-600 hover:bg-gray-300'}`}
          >
            {book.bookName}
          </div>
          {book.chapters && <ChapterTree chapters={book.chapters} onSelect={onSelect} />}
        </li>
      ))}
    </ul>
  );
};

export default BookTree;
