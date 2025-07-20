import React from 'react';

const ChapterTree = ({ chapters, onSelect }) => {
  return (
    <ul className="ml-4 space-y-1">
      {chapters.map((chapter) => (
        <li key={chapter._id}>
          <div
            onClick={() => onSelect(chapter)}
            className="cursor-pointer font-medium hover:text-green-600 transition"
          >
            <div>
              <span style={{ color: '#8B4513' }}>📃</span> {chapter.chapterName}
            </div>

          </div>
        </li>
      ))}
    </ul>
  );
};

export default ChapterTree;
