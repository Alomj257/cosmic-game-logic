import React from 'react';

const ContentViewer = ({ content }) => {
  if (!content) {
    return (
      <div className="text-gray-500">
        Select a book, chapter, or heading to view the content
      </div>
    );
  }

  return (
    <div className="p-4 flex flex-col">
      {/* Outer container with two brown borders and rounded corners */}
      <div className="relative w-full flex flex-col">
        {/* Outer Border - Brown Border 1 */}
        <div className="absolute inset-0 border-2 border-brown-600 rounded-lg"></div>

        {/* Inner Border - Brown Border 2 */}
        <div className="absolute inset-1 border-2 border-brown-500 rounded-lg"></div>

        {/* Inner content */}
        <div className="relative z-10 flex flex-col p-4">
          {/* Centered Book Name */}
          <h1 className="text-3xl font-bold mb-4 text-center">
            {content.bookName || content.chapterName || content.headingName || content.subHeadingName || content.subSubHeadingName}
          </h1>

          {/* Main Content */}
          <div className="px-2 pb-6 bg-white">
            {content.briefIntroduction && (
              <div className="prose max-w-none text-justify">
                {content.briefIntroduction.map((item) => (
                  <div key={item._id} dangerouslySetInnerHTML={{ __html: item.paragraph }} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentViewer;
