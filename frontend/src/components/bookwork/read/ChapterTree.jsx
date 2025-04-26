import React from 'react';
import HeadingTree from './HeadingTree';

const ChapterTree = ({ chapters, onSelect }) => {
  return (
    <ul className="ml-4 space-y-1">
      {chapters.map((chapter) => (
        <li key={chapter._id}>
          <div 
            onClick={() => onSelect(chapter)}
            className="cursor-pointer font-medium hover:text-green-600 transition"
          >
            📄 {chapter.chapterName}
          </div>
          {chapter.headings && <HeadingTree headings={chapter.headings} onSelect={onSelect} />}
        </li>
      ))}
    </ul>
  );
};

export default ChapterTree;
