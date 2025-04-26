import React from 'react';
import SubSubHeadingTree from './SubSubHeadingTree';

const SubHeadingTree = ({ subHeadings, onSelect }) => {
  return (
    <ul className="ml-8 space-y-1">
      {subHeadings.map((subHeading) => (
        <li key={subHeading._id}>
          <div 
            onClick={() => onSelect(subHeading)}
            className="cursor-pointer hover:text-pink-500 transition"
          >
            📝 {subHeading.subHeadingName}
          </div>
          {subHeading.subSubHeadings && <SubSubHeadingTree subSubHeadings={subHeading.subSubHeadings} onSelect={onSelect} />}
        </li>
      ))}
    </ul>
  );
};

export default SubHeadingTree;
