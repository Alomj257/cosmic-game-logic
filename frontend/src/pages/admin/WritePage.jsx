import React, { useState } from "react";

const WritePage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Call API to save book/post here
    console.log("Submitted:", { title, content });
  };

  return (
    <div className="p-8 max-w-3xl mx-auto bg-white rounded-lg shadow-md mt-6">
      <h2 className="text-2xl font-bold mb-6">Write a New Book</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Book Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
          className="w-full border p-2 rounded"
          required
        />
        <button type="submit" className="bg-yellow-700 text-white px-6 py-2 rounded hover:bg-yellow-800">
          Publish
        </button>
      </form>
    </div>
  );
};

export default WritePage;
