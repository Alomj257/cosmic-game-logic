import React, { useEffect, useState } from "react";
import { EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  getChapters,
  getChapterById,
  updateChapter,
  deleteChapter,
} from "../../../services/api";

const Chapter = () => {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchChapters();
  }, []);

  const fetchChapters = async () => {
    setLoading(true);
    try {
      const res = await getChapters();
      if (res?.data?.success) {
        // Convert bookNumber to float for proper sorting
        const sorted = res.data.chapters.sort(
          (a, b) => parseFloat(a.bookNumber) - parseFloat(b.bookNumber)
        );
        setChapters(sorted);
      }
    } catch (err) {
      console.error("Failed to fetch chapters:", err);
    } finally {
      setLoading(false);
    }
  };

  const renderTagDetails = (tag) => {
    return tag ? (
      <div className="text-xs text-gray-700 leading-5">
        <div><b>Group:</b> {tag.groupType || "---"}</div>
        <div><b>Main ID:</b> {tag.tagMainVersionId || "---"}</div>
        <div><b>H ID:</b> {tag.tagVersionHId || "---"}</div>
        <div><b>E ID:</b> {tag.tagVersionEId || "---"}</div>
      </div>
    ) : (
      "---"
    );
  };

  return (
    <div className="m-10 border border-green-700 rounded-2xl bg-green-100 p-6 shadow-md overflow-x-auto">
      <h2 className="text-3xl font-bold text-center text-green-700 underline mb-6">
        CHAPTER DATABASE
      </h2>

      <table className="min-w-full border-collapse border border-green-700 text-sm text-left">
        <thead className="bg-green-800 text-white text-base">
          <tr className="h-16">
            <th className="border border-green-700 text-center px-2 py-2">Record No</th>
            <th className="border border-green-700 text-center px-2 py-2">Book No</th>
            <th className="border border-green-700 text-center px-2 py-2">Chapter No</th>
            <th className="border border-green-700 text-center px-2 py-2 w-[180px]">Chapter Name</th>
            <th className="border border-green-700 text-center px-2 py-2 w-[250px]">Content</th>
            <th className="border border-green-700 text-center px-2 py-2 w-[200px]">Chapter Tag</th>
            <th className="border border-green-700 text-center px-2 py-2 w-[200px]">Content Tag</th>
            <th className="border border-green-700 text-center px-2 py-2 w-[100px]">Actions</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan="8" className="text-center text-green-700 py-4">Loading...</td>
            </tr>
          ) : chapters.length === 0 ? (
            <tr>
              <td colSpan="8" className="text-center text-green-700 py-4">No chapters found.</td>
            </tr>
          ) : (
            chapters.map((chapter) => (
              <tr key={chapter._id} className="bg-green-50 hover:bg-green-200 text-[15px]">
                <td className="border border-green-700 text-center px-2 py-2">{chapter.recordNumber || "---"}</td>
                <td className="border border-green-700 text-center px-2 py-2">{chapter.bookNumber || "---"}</td>
                <td className="border border-green-700 text-center px-2 py-2">{chapter.chapterNumber || "---"}</td>
                <td className="border border-green-700 px-2 py-2">{chapter.chapterName || "---"}</td>
                <td className="border border-green-700 px-2 py-2 w-[250px]">
                  {chapter.content
                    ? chapter.content.replace(/<\/?[^>]+(>|$)/g, "").slice(0, 80) +
                      (chapter.content.length > 80 ? "..." : "")
                    : "---"}
                </td>
                <td className="border border-green-700 px-2 py-2">{renderTagDetails(chapter.chapterTag)}</td>
                <td className="border border-green-700 px-2 py-2">{renderTagDetails(chapter.contentTag)}</td>
                <td className="border border-green-700 text-center px-2 py-2 space-x-2 w-[100px]">
                  <EyeOutlined
                    className="text-green-700 cursor-pointer"
                    title="View Chapter"
                    onClick={() => setViewData(chapter)}
                  />
                  <DeleteOutlined
                    className="text-red-600 cursor-pointer"
                    title="Delete Chapter"
                    onClick={() => {
                      setDeleteId(chapter._id);
                      setShowDeleteModal(true);
                    }}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Optional: Modals for delete/view can be added here */}
    </div>
  );
};

export default Chapter;
