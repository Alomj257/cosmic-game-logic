import React, { useState } from 'react';

const HoverPopup = ({ value }) => {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div
      className="relative w-full"
      onMouseEnter={() => setShowPopup(true)}
      onMouseLeave={() => setShowPopup(false)}
    >
      <input
        type="text"
        value={value}
        readOnly
        className="py-2 px-3 text-sm border border-green-600 rounded bg-gray-100 truncate w-full"
      />
      {showPopup && (
        <div className="absolute z-10 top-full left-0 mt-1 bg-white text-black border border-green-600 shadow-md rounded p-2 w-max max-w-sm break-words text-sm">
          {value}
        </div>
      )}
    </div>
  );
};

export default HoverPopup;
