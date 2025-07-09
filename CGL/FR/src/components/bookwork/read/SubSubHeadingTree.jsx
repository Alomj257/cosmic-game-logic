import React from 'react';

const SubSubHeadingTree = ({ subSubHeadings, onSelect }) => {
  return (
    <ul className="ml-10 space-y-1">
      {subSubHeadings.map((subSubHeading) => (
        <li key={subSubHeading._id}>
          <div 
            onClick={() => onSelect(subSubHeading)}
            className="cursor-pointer hover:text-red-500 transition"
          >
            🔖 {subSubHeading.subSubHeadingName}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default SubSubHeadingTree;
