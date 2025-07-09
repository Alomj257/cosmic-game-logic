import React from 'react';
import SubHeadingTree from './SubHeadingTree';

const HeadingTree = ({ headings, onSelect }) => {
  return (
    <ul className="ml-6 space-y-1">
      {headings.map((heading) => (
        <li key={heading._id}>
          <div 
            onClick={() => onSelect(heading)}
            className="cursor-pointer hover:text-purple-600 transition"
          >
            📑 {heading.headingName}
          </div>
          {heading.subHeadings && <SubHeadingTree subHeadings={heading.subHeadings} onSelect={onSelect} />}
        </li>
      ))}
    </ul>
  );
};

export default HeadingTree;
