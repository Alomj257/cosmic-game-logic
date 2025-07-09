import React from 'react';

const ContentViewer = ({ content }) => {
    if (!content) {
        return (
            <div className="text-gray-500 p-4 text-center">
                Select a book, chapter, or heading to view the content
            </div>
        );
    }

    const isBook = !!content.briefIntroduction; // If briefIntroduction exists, treat as book
    const isChapter = !!content.content; // If content field exists, treat as chapter

    return (
        <div className="p-2 flex flex-col rounded-lg">
            <div className="relative w-full flex flex-col bg-brown-100">
                <div className="absolute inset-0 border-2 border-brown-600 rounded-lg"></div>
                <div className="absolute inset-1 border-2 border-brown-600 rounded-lg"></div>

                <div className="relative z-10 flex flex-col p-4">
                    <h1 className="text-3xl font-bold mb-3 text-center p-2">
                        {content.bookName ||
                            content.chapterName ||
                            content.headingName ||
                            content.subHeadingName ||
                            content.subSubHeadingName}
                    </h1>

                    <div className="px-2 pb-4">
                        {/* Show major content header & briefIntro ONLY for books */}
                        {isBook && (
                            <>
                                <p className="text-red-600 text-center text-lg underline font-bold mb-4">
                                    Major content of this book
                                </p>

                                <div className="prose max-w-none text-justify">
                                    {content.briefIntroduction.map((item) => (
                                        <div
                                            key={item._id || Math.random()}
                                            dangerouslySetInnerHTML={{ __html: item.paragraph }}
                                        />
                                    ))}
                                </div>
                            </>
                        )}

                        {/* Show chapter content ONLY if chapter */}
                        {isChapter && (
                            <div className="mt-4 whitespace-pre-wrap text-justify">
                                {content.content}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContentViewer;
