import React from 'react';
import ChapterTree from './ChapterTree';

const BookTree = ({ books, onSelect }) => {
  return (
    <ul className="space-y-2">
      {books.map((book) => (
        <li key={book._id}>
          <div 
            onClick={() => onSelect(book)}
            className="cursor-pointer font-semibold hover:text-blue-600 transition"
          >
            📖 {book.bookName}
          </div>
          {book.chapters && <ChapterTree chapters={book.chapters} onSelect={onSelect} />}
        </li>
      ))}
    </ul>
  );
};

export default BookTree;
