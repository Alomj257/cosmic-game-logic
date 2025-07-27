import React, { useEffect, useState } from "react";
import {
  getAllBooks,
  createChapter,
  getAllTags,
  getTagMainIdsByDataType,
  getTagDetailsByTagMainId,
  getChapterCountByBookId
} from "../../../../services/api";
import { toast } from "react-hot-toast";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const Chapters = () => {
  const [books, setBooks] = useState([]);
  const [groupTypes, setGroupTypes] = useState([]);
  const [chapterTagMainIds, setChapterTagMainIds] = useState([]);
  const [contentTagMainIds, setContentTagMainIds] = useState([]);

  const [formData, setFormData] = useState({
    bookId: "",
    chapterName: "",
    chapterTag: {
      groupType: "",
      tagMainVersionId: "",
      tagVersionHId: "",
      tagVersionEId: "",
    },
    contentTag: {
      groupType: "",
      tagMainVersionId: "",
      tagVersionHId: "",
      tagVersionEId: "",
    },
    content: "",
  });
  const [bookMeta, setBookMeta] = useState({
    bookNumber: "",
    recordNumber: "",
    nextChapterNumber: "",
  });


  useEffect(() => {
    const fetchBookMeta = async () => {
      if (!formData.bookId || books.length === 0) return;

      try {
        const book = books.find((b) => b._id === formData.bookId);
        if (!book) {
          console.log("Book not found");
          return;
        }

        console.log("Calling getChapterCountByBookId with", book._id);
        const countRes = await getChapterCountByBookId(book._id);
        console.log("Chapter count response:", countRes);

        setBookMeta({
          bookNumber: book.bookNumber,
          recordNumber: book.recordNumber,
          nextChapterNumber: (countRes.data.count || 0) + 1,
        });
      } catch (err) {
        console.error("Book meta error:", err);
        toast.error("Failed to fetch book metadata or chapter count");
      }
    };
    fetchBookMeta();
  }, [formData.bookId, books]);



  useEffect(() => {
    (async () => {
      try {
        const res = await getAllBooks();
        setBooks(res?.data || []);
      } catch (err) {
        // toast.error("Failed to load books");
      }
    })();
  }, []);

  useEffect(() => {
    const fetchGroupTypes = async () => {
      try {
        const res = await getAllTags();
        const types = [...new Set(res.data.map((tag) => tag.dataTypeCode))];
        setGroupTypes(types);
      } catch (err) {
        // toast.error("Failed to load group types");
      }
    };
    fetchGroupTypes();
  }, []);

  useEffect(() => {
    const fetchChapterTagMainIds = async () => {
      if (!formData.chapterTag.groupType) return;
      try {
        const res = await getTagMainIdsByDataType(formData.chapterTag.groupType);
        setChapterTagMainIds(res.data);
      } catch (err) {
        toast.error("Failed to load chapter tag main IDs");
      }
    };
    fetchChapterTagMainIds();
  }, [formData.chapterTag.groupType]);

  useEffect(() => {
    const fetchContentTagMainIds = async () => {
      if (!formData.contentTag.groupType) return;
      try {
        const res = await getTagMainIdsByDataType(formData.contentTag.groupType);
        setContentTagMainIds(res.data);
      } catch (err) {
        toast.error("Failed to load content tag main IDs");
      }
    };
    fetchContentTagMainIds();
  }, [formData.contentTag.groupType]);

  useEffect(() => {
    const fetchTagDetails = async () => {
      if (!formData.chapterTag.tagMainVersionId) return;
      try {
        const res = await getTagDetailsByTagMainId(formData.chapterTag.tagMainVersionId);
        setFormData((prev) => ({
          ...prev,
          chapterTag: {
            ...prev.chapterTag,
            tagVersionHId: res.data.openingTag,
            tagVersionEId: res.data.closingTag,
          },
        }));
      } catch (err) {
        toast.error("Failed to fetch chapter tag details");
      }
    };
    fetchTagDetails();
  }, [formData.chapterTag.tagMainVersionId]);

  useEffect(() => {
    const fetchTagDetails = async () => {
      if (!formData.contentTag.tagMainVersionId) return;
      try {
        const res = await getTagDetailsByTagMainId(formData.contentTag.tagMainVersionId);
        setFormData((prev) => ({
          ...prev,
          contentTag: {
            ...prev.contentTag,
            tagVersionHId: res.data.openingTag,
            tagVersionEId: res.data.closingTag,
          },
        }));
      } catch (err) {
        toast.error("Failed to fetch content tag details");
      }
    };
    fetchTagDetails();
  }, [formData.contentTag.tagMainVersionId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("chapterTag.") || name.includes("contentTag.")) {
      const [parent, key] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [key]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createChapter(formData);
      toast.success("Chapter created successfully!");
      setFormData({
        bookId: "",
        chapterName: "",
        chapterTag: {
          groupType: "",
          tagMainVersionId: "",
          tagVersionHId: "",
          tagVersionEId: "",
        },
        contentTag: {
          groupType: "",
          tagMainVersionId: "",
          tagVersionHId: "",
          tagVersionEId: "",
        },
        content: "",
      });
    } catch (err) {
      toast.error("Error creating chapter.");
    }
  };

  return (
    <div className="p-4 md:p-8 flex flex-col items-center gap-10">
      <form
        onSubmit={handleSubmit}
        className="bg-green-100 border border-green-700 rounded-lg p-6 w-full max-w-6xl"
      >
        <h2 className="text-3xl font-bold text-center text-green-700 mb-6 underline">CREATE CHAPTER</h2>

        <fieldset className="border border-green-700 p-4 rounded bg-green-50 mb-6">
          <legend className="text-md font-bold text-green-800">Book Details</legend>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Dropdown */}
            <div className="flex-1">
              <label className="block text-sm font-bold text-green-900 mb-1">Select Book</label>
              <select
                name="bookId"
                value={formData.bookId}
                onChange={handleChange}
                className="w-full border border-green-600 rounded p-2"
                required
              >
                <option value="">Select a Book</option>
                {books.map((book) => (
                  <option key={book._id} value={book._id}>
                    {book.bookName}
                  </option>
                ))}
              </select>
            </div>

            {/* Book No. */}
            <div className="flex-1">
              <label className="block text-sm font-bold text-green-900 mb-1">Book No.</label>
              <input
                type="text"
                value={formData.bookId ? bookMeta.bookNumber : ""}
                disabled
                placeholder="Select book please"
                className="w-full border border-green-600 rounded p-2 bg-gray-100 text-green-900"
              />
            </div>

            {/* Record No. */}
            <div className="flex-1">
              <label className="block text-sm font-bold text-green-900 mb-1">Record No.</label>
              <input
                type="text"
                value={formData.bookId ? bookMeta.recordNumber : ""}
                disabled
                placeholder="Select book please"
                className="w-full border border-green-600 rounded p-2 bg-gray-100 text-green-900"
              />
            </div>

            {/* Next Chapter No. */}
            <div className="flex-1">
              <label className="block text-sm font-bold text-green-900 mb-1">Chapter No.</label>
              <input
                type="text"
                value={formData.bookId ? bookMeta.nextChapterNumber : ""}
                disabled
                placeholder="Select book please"
                className="w-full border border-green-600 rounded p-2 bg-gray-100 text-green-900"
              />
            </div>
          </div>
        </fieldset>

        <div className="mb-4 text-center">
          <h3 className="text-2xl font-bold text-green-700">CHAPTER NAME</h3>
        </div>

        {/* Chapter Tag */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Head Tag Section */}
          <fieldset className="border border-green-700 p-4 rounded bg-green-50">
            <legend className="text-md font-bold text-green-800">Head Tag Reference for Chapter</legend>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
              <div>
                <label className="block text-sm font-semibold text-green-800 mb-1">Group Type</label>
                <select
                  name="chapterTag.groupType"
                  value={formData.chapterTag.groupType}
                  onChange={handleChange}
                  className="border border-green-600 rounded p-2 w-full"
                >
                  <option value="">Select Group</option>
                  {groupTypes.map((type, idx) => (
                    <option key={idx} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-green-800 mb-1">Tag Main Version Id</label>
                <select
                  name="chapterTag.tagMainVersionId"
                  value={formData.chapterTag.tagMainVersionId}
                  onChange={handleChange}
                  className="border border-green-600 rounded p-2 w-full"
                >
                  <option value="">Select Tag Main Id</option>
                  {chapterTagMainIds.map((id, idx) => (
                    <option key={idx} value={id}>{id}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-green-800 mb-1">Tag Version H. Id</label>
                <input
                  type="text"
                  name="chapterTag.tagVersionHId"
                  value={formData.chapterTag.tagVersionHId}
                  className="border border-green-600 rounded p-2 w-full bg-gray-100"
                  readOnly
                />
              </div>
            </div>
          </fieldset>

          {/* End Tag Section */}
          <fieldset className="border border-green-700 p-4 rounded bg-green-50">
            <legend className="text-md font-bold text-green-800">End Tag</legend>
            <div className="mt-3">
              <label className="block text-sm font-semibold text-green-800 mb-1">Tag Version E. Id</label>
              <input
                type="text"
                name="chapterTag.tagVersionEId"
                value={formData.chapterTag.tagVersionEId}
                className="border border-green-600 rounded p-2 w-full bg-gray-100"
                readOnly
              />
            </div>
          </fieldset>
        </div>


        <div className="mb-6">
          <label className="block text-sm font-bold text-green-900 mb-1">Chapter Name</label>
          <input
            type="text"
            name="chapterName"
            value={formData.chapterName}
            onChange={handleChange}
            placeholder="e.g., Chapter name"
            className="w-full border border-green-600 rounded p-2"
            required
          />
        </div>


        <div className="mb-4 text-center">
          <h3 className="text-2xl font-bold text-green-700">CHAPTER CONTENT</h3>
        </div>

        {/* Content Tag */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Head Tag Section */}
          <fieldset className="border border-green-700 p-4 rounded bg-green-50">
            <legend className="text-md font-bold text-green-800">Head Tag Reference for Content</legend>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
              <div>
                <label className="block text-sm font-semibold text-green-800 mb-1">Group Type</label>
                <select
                  name="contentTag.groupType"
                  value={formData.contentTag.groupType}
                  onChange={handleChange}
                  className="border border-green-600 rounded p-2 w-full"
                >
                  <option value="">Select Group</option>
                  {groupTypes.map((type, idx) => (
                    <option key={idx} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-green-800 mb-1">Tag Main Version Id</label>
                <select
                  name="contentTag.tagMainVersionId"
                  value={formData.contentTag.tagMainVersionId}
                  onChange={handleChange}
                  className="border border-green-600 rounded p-2 w-full"
                >
                  <option value="">Select Tag Main Id</option>
                  {contentTagMainIds.map((id, idx) => (
                    <option key={idx} value={id}>{id}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-green-800 mb-1">Tag Version H. Id</label>
                <input
                  type="text"
                  name="contentTag.tagVersionHId"
                  value={formData.contentTag.tagVersionHId}
                  className="border border-green-600 rounded p-2 w-full bg-gray-100"
                  readOnly
                />
              </div>
            </div>
          </fieldset>

          {/* End Tag Section */}
          <fieldset className="border border-green-700 p-4 rounded bg-green-50">
            <legend className="text-md font-bold text-green-800">End Tag</legend>
            <div className="mt-3">
              <label className="block text-sm font-semibold text-green-800 mb-1">Tag Version E. Id</label>
              <input
                type="text"
                name="contentTag.tagVersionEId"
                value={formData.contentTag.tagVersionEId}
                className="border border-green-600 rounded p-2 w-full bg-gray-100"
                readOnly
              />
            </div>
          </fieldset>
        </div>


        {/* Content Editor */}
        <div className="mb-6">
          <label className="block text-sm font-bold text-green-900 mb-2">Chapter Content</label>
          <ReactQuill
            theme="snow"
            value={formData.content}
            onChange={(value) => setFormData((prev) => ({ ...prev, content: value }))}
            className="bg-white border rounded"
          />
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-6 rounded"
          >
            Save Chapter
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chapters;
