import React from 'react';

const ContentViewer = ({ content }) => {
  if (!content) {
    return <div className="text-gray-500">Select a book, chapter, or heading to view the content</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{content.bookName || content.chapterName || content.headingName || content.subHeadingName || content.subSubHeadingName}</h1>
      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: content.content }} />
    </div>
  );
};

export default ContentViewer;
