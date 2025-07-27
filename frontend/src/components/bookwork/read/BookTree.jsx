import React, { useState } from 'react';
import ChapterTree from './ChapterTree';

const BookTree = ({ books, onSelect }) => {
  const [activeBookId, setActiveBookId] = useState(null);

  const handleBookClick = (book) => {
    setActiveBookId((prev) => (prev === book._id ? null : book._id));
    onSelect(book);
  };

  return (
  <ul className="space-y-2">
    {[...books]
      .sort((a, b) => Number(a.bookNumber) - Number(b.bookNumber))
      .map((book) => (
        <li key={book._id}>
          <div
            onClick={() => handleBookClick(book)}
            className={`cursor-pointer font-semibold px-3 py-1 rounded-md transition text-sm
              ${activeBookId === book._id
                ? 'bg-brown-600 text-white'
                : 'bg-white text-brown-600 hover:bg-gray-300'}`}
          >
            {book.bookName}
          </div>

          {activeBookId === book._id && book.chapters && book.chapters.length > 0 && (
            <ChapterTree chapters={book.chapters} onSelect={onSelect} />
          )}
        </li>
      ))}
  </ul>
);

};

export default BookTree;
