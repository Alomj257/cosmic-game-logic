import React, { useEffect, useState } from "react";
import { EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import { Modal } from "antd"; // <-- Import Ant Design Modal
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
  const [showViewModal, setShowViewModal] = useState(false); // <-- View Modal toggle

  useEffect(() => {
    fetchChapters();
  }, []);

  const fetchChapters = async () => {
    setLoading(true);
    try {
      const res = await getChapters();
      if (res?.data?.success) {
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
                    onClick={() => {
                      setViewData(chapter);
                      setShowViewModal(true);
                    }}
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

      {viewData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full p-8 overflow-y-auto max-h-[85vh] relative">
            {/* Close Button */}
            <button
              onClick={() => setViewData(null)}
              className="absolute top-4 right-4 text-red-600 hover:text-red-800"
            >
              <span className="text-xl font-bold">×</span>
            </button>

            <h2 className="text-2xl font-bold text-green-700 mb-6 text-center underline">
              Chapter Details
            </h2>

            <div className="space-y-4 text-sm">
              {/* Grid layout for general fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="text-green-900">
                  <strong className="font-semibold">Record Number:</strong>
                  <span className="text-black ml-2">{viewData.recordNumber || "---"}</span>
                </div>
                <div className="text-green-900">
                  <strong className="font-semibold">Book Number:</strong>
                  <span className="text-black ml-2">{viewData.bookNumber || "---"}</span>
                </div>
                <div className="text-green-900">
                  <strong className="font-semibold">Chapter Number:</strong>
                  <span className="text-black ml-2">{viewData.chapterNumber || "---"}</span>
                </div>
              </div>

              {/* Chapter Tag Section */}
              <div className="border border-green-300 p-4 rounded bg-green-50">
                <h3 className="text-md font-semibold text-green-700 mb-2">Chapter Tag</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <strong>Group Type:</strong>{" "}
                    <span className="text-black ml-1">{viewData.chapterTag?.groupType || "---"}</span>
                  </div>
                  <div>
                    <strong>Tag Main Version ID:</strong>{" "}
                    <span className="text-black ml-1">{viewData.chapterTag?.tagMainVersionId || "---"}</span>
                  </div>
                  <div>
                    <strong>Tag Version H ID:</strong>{" "}
                    <span className="text-black ml-1">{viewData.chapterTag?.tagVersionHId || "---"}</span>
                  </div>
                  <div>
                    <strong>Tag Version E ID:</strong>{" "}
                    <span className="text-black ml-1">{viewData.chapterTag?.tagVersionEId || "---"}</span>
                  </div>
                </div>
              </div>

              {/* Chapter Name */}
              <div className="mt-4">
                <strong className="font-bold text-xl text-green-900">
                  Chapter Name:
                </strong>
                <span className="text-black ml-2 text-xl font-bold">
                  {viewData.chapterName || "---"}
                </span>
              </div>

              {/* Content Tag Section */}
              <div className="border border-green-300 p-4 rounded bg-green-50">
                <h3 className="text-md font-semibold text-green-700 mb-2">Content Tag</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <strong>Group Type:</strong>{" "}
                    <span className="text-black ml-1">{viewData.contentTag?.groupType || "---"}</span>
                  </div>
                  <div>
                    <strong>Tag Main Version ID:</strong>{" "}
                    <span className="text-black ml-1">{viewData.contentTag?.tagMainVersionId || "---"}</span>
                  </div>
                  <div>
                    <strong>Tag Version H ID:</strong>{" "}
                    <span className="text-black ml-1">{viewData.contentTag?.tagVersionHId || "---"}</span>
                  </div>
                  <div>
                    <strong>Tag Version E ID:</strong>{" "}
                    <span className="text-black ml-1">{viewData.contentTag?.tagVersionEId || "---"}</span>
                  </div>
                </div>
              </div>

              {/* Chapter Content */}
              <div>
                <strong className="font-bold text-xl text-green-900">Chapter Content:</strong>
                <div
                  className="mt-2 border p-3 rounded bg-gray-50 whitespace-pre-wrap text-black text-justify"
                  dangerouslySetInnerHTML={{
                    __html: viewData.content || "---"
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}


      {/* (Optional) You can add Delete Modal here */}
    </div>
  );
};

export default Chapter;
