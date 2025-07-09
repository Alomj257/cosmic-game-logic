import React from 'react';

const ContentViewer = ({ content }) => {
    if (!content) {
        return (
            <div className="text-gray-500 p-4 text-center">
                Select a book, chapter, or heading to view the content
            </div>
        );
    }

    return (
        <div className="p-2 flex flex-col rounded-lg">
            {/* Outer container with two brown borders and rounded corners */}
            <div className="relative w-full flex flex-col bg-brown-100">
                {/* Outer Border - brown Border 1 */}
                <div className="absolute inset-0 border-2 border-brown-600 rounded-lg"></div>

                {/* Inner Border - brown Border 2 */}
                <div className="absolute inset-1 border-2 border-brown-600 rounded-lg"></div>

                {/* Inner content */}
                <div className="relative z-10 flex flex-col p-4">
                    {/* Centered Book Name */}
                    <h1 className="text-3xl font-bold mb-4 text-center p-2">
                        {content.bookName || content.chapterName || content.headingName || content.subHeadingName || content.subSubHeadingName}
                        <p style={{color: 'red', fontSize: '20px'}}><u>Major content of this book</u></p>
                    </h1>

                    {/* Main Content */}
                    <div className="px-2 pb-6">
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
