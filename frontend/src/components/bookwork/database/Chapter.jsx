import React, { useEffect, useState } from "react";
import { EyeOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  getChapters,
  getChapterById,
  updateChapter,
  deleteChapter,
  getAllTags, getTagMainIdsByDataType,
  getTagDetailsByTagMainId
} from "../../../services/api";

const Chapter = () => {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchChapters();
  }, []);

  const openEditModal = (chapter) => {
    setEditData(chapter);
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };
  const handleEditTagChange = async (e, tagType) => {
    const { name, value } = e.target;

    // Update the nested editData for chapterTag or contentTag
    setEditData((prev) => {
      const updatedTag = { ...prev[tagType], [name]: value };

      // If groupType changed, reset tagMainVersionId and version Ids
      if (name === "groupType") {
        updatedTag.tagMainVersionId = "";
        updatedTag.tagVersionHId = "";
        updatedTag.tagVersionEId = "";
      }

      return { ...prev, [tagType]: updatedTag };
    });

    // If groupType changed, fetch new tag main ids
    if (name === "groupType") {
      try {
        const res = await getTagMainIdsByDataType(value);
        if (tagType === "chapterTag") setChapterTagMainIds(res.data);
        else setContentTagMainIds(res.data);
      } catch {
        toast.error("Failed to load tag main IDs");
      }
    }

    // If tagMainVersionId changed, fetch tag details (openingTag & closingTag)
    if (name === "tagMainVersionId") {
      try {
        const res = await getTagDetailsByTagMainId(value);
        setEditData((prev) => ({
          ...prev,
          [tagType]: {
            ...prev[tagType],
            tagVersionHId: res.data.openingTag,
            tagVersionEId: res.data.closingTag,
          },
        }));
      } catch {
        toast.error("Failed to fetch tag details");
      }
    }
  };
  const [groupTypes, setGroupTypes] = useState([]);
  const [chapterTagMainIds, setChapterTagMainIds] = useState([]);
  const [contentTagMainIds, setContentTagMainIds] = useState([]);

  // Load groupTypes once, for example on modal open or component mount
  useEffect(() => {
    const fetchGroupTypes = async () => {
      try {
        const res = await getAllTags();
        const types = [...new Set(res.data.map((tag) => tag.dataTypeCode))];
        setGroupTypes(types);
      } catch {
        toast.error("Failed to load group types");
      }
    };
    fetchGroupTypes();
  }, []);


  // Special handler for ReactQuill content changes (HTML string)
  const handleContentChange = (content) => {
    setEditData((prev) => ({ ...prev, content }));
  };

  const handleSaveEdit = async () => {
    if (!editData?._id) return;
    setSaving(true);
    try {
      const updated = await updateChapter(editData._id, editData);
      setChapters((prev) =>
        prev.map((ch) => (ch._id === updated.data._id ? updated.data : ch))
      );
      setShowEditModal(false);
      setEditData(null);
    } catch (error) {
      console.error("Failed to update chapter:", error);
    } finally {
      setSaving(false);
    }
  };

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

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteChapter(deleteId);
      setChapters((prev) => prev.filter((chapter) => chapter._id !== deleteId));
      setShowDeleteModal(false);
      setDeleteId(null);
    } catch (error) {
      console.error("Failed to delete chapter:", error);
    }
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
            <th className="border border-green-700 px-2 py-2 w-[200px]">Chapter Tag</th>
            <th className="border border-green-700 px-2 py-2 w-[200px]">Content Tag</th>
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
                <td className="border border-green-700 text-center px-2 py-2 w-[100px]">
                  <div className="flex justify-center items-center space-x-2">
                    <EyeOutlined
                      className="text-green-700 cursor-pointer"
                      title="View Chapter"
                      onClick={() => {
                        setViewData(chapter);
                        setShowViewModal(true);
                      }}
                    />
                    <EditOutlined
                      onClick={() => openEditModal(chapter)}
                      className="text-blue-700 cursor-pointer"
                      title="Edit Chapter"
                    />
                    <DeleteOutlined
                      className="text-red-600 cursor-pointer"
                      title="Delete Chapter"
                      onClick={() => {
                        setDeleteId(chapter._id);
                        setShowDeleteModal(true);
                      }}
                    />
                  </div>
                </td>

              </tr>
            ))
          )}
        </tbody>
      </table>

      {viewData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full p-8 overflow-y-auto max-h-[85vh] relative">
            <button
              onClick={() => setViewData(null)}
              className="absolute top-4 right-4 text-red-600 hover:text-red-800"
            >
              <span className="text-4xl">×</span>
            </button>
            <h2 className="text-2xl font-bold text-green-700 mb-6 text-center underline">
              Chapter Details
            </h2>
            <div className="space-y-4 text-sm">
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
              <div className="mt-4">
                <strong className="font-bold text-xl text-green-900">
                  Chapter Name:
                </strong>
                <span className="text-black ml-2 text-xl font-bold">
                  {viewData.chapterName || "---"}
                </span>
              </div>
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

      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <div className="bg-green-100 border border-green-700 rounded-xl p-6 shadow-lg w-[90%] max-w-md text-center">
            <h2 className="text-xl font-bold text-green-800 mb-4 underline">Delete Chapter</h2>
            <p className="text-green-900 mb-6">Are you sure you want to delete this chapter?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-white border border-green-700 rounded hover:bg-green-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && editData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full p-8 max-h-[85vh] overflow-y-auto relative">
            <button
              onClick={() => {
                setShowEditModal(false);
                setEditData(null);
              }}
              className="absolute top-4 right-4 text-red-600 hover:text-red-800"
            >
              <span className="text-4xl">×</span>
            </button>

            <h2 className="text-2xl font-bold text-green-700 mb-6 text-center underline">
              Edit Chapter
            </h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveEdit();
              }}
              className="space-y-6 text-sm"
            ><div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block font-semibold text-green-900 mb-1">
                    Record Number
                  </label>
                  <input
                    type="text"
                    name="recordNumber"
                    value={editData.recordNumber || ""}
                    onChange={handleEditChange}
                    className="w-full border border-green-300 rounded p-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-green-900 mb-1">
                    Book Number
                  </label>
                  <input
                    type="text"
                    name="bookNumber"
                    value={editData.bookNumber || ""}
                    onChange={handleEditChange}
                    className="w-full border border-green-300 rounded p-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-green-900 mb-1">
                    Chapter Number
                  </label>
                  <input
                    type="text"
                    name="chapterNumber"
                    value={editData.chapterNumber || ""}
                    onChange={handleEditChange}
                    className="w-full border border-green-300 rounded p-2"
                  />
                </div>
              </div>
              {/* Chapter Tag */}
              <fieldset className="border border-green-300 p-4 rounded">
                <legend className="text-green-800 font-semibold">Chapter Tag</legend>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label>Group Type</label>
                    <select
                      name="groupType"
                      value={editData.chapterTag.groupType || ""}
                      onChange={(e) => handleEditTagChange(e, "chapterTag")}
                      className="w-full border border-green-300 rounded p-2"
                    >
                      <option value="">Select Group Type</option>
                      {groupTypes.map((type, idx) => (
                        <option key={idx} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label>Main Version Id</label>
                    <select
                      name="tagMainVersionId"
                      value={editData.chapterTag.tagMainVersionId || ""}
                      onChange={(e) => handleEditTagChange(e, "chapterTag")}
                      className="w-full border border-green-300 rounded p-2"
                    >
                      <option value="">Select Tag Main Id</option>
                      {chapterTagMainIds.map((id, idx) => (
                        <option key={idx} value={id}>{id}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label>Version H Id</label>
                    <input type="text" value={editData.chapterTag.tagVersionHId || ""} readOnly className="w-full border p-2 rounded bg-gray-100" />
                  </div>
                  <div>
                    <label>Version E Id</label>
                    <input type="text" value={editData.chapterTag.tagVersionEId || ""} readOnly className="w-full border p-2 rounded bg-gray-100" />
                  </div>
                </div>
              </fieldset>

              {/* Chapter Name */}
              <div>
                <label className="block font-semibold text-green-900 mb-1">Chapter Name</label>
                <input
                  type="text"
                  name="chapterName"
                  value={editData.chapterName || ""}
                  onChange={handleEditChange}
                  className="w-full border border-green-300 rounded p-2 text-lg font-semibold"
                />
              </div>

              {/* Content Tag */}
              <fieldset className="border border-green-300 p-4 rounded">
                <legend className="text-green-800 font-semibold">Content Tag</legend>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label>Group Type</label>
                    <select
                      name="groupType"
                      value={editData.contentTag.groupType || ""}
                      onChange={(e) => handleEditTagChange(e, "contentTag")}
                      className="w-full border border-green-300 rounded p-2"
                    >
                      <option value="">Select Group Type</option>
                      {groupTypes.map((type, idx) => (
                        <option key={idx} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label>Main Version Id</label>
                    <select
                      name="tagMainVersionId"
                      value={editData.contentTag.tagMainVersionId || ""}
                      onChange={(e) => handleEditTagChange(e, "contentTag")}
                      className="w-full border border-green-300 rounded p-2"
                    >
                      <option value="">Select Tag Main Id</option>
                      {contentTagMainIds.map((id, idx) => (
                        <option key={idx} value={id}>{id}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label>Version H Id</label>
                    <input type="text" value={editData.contentTag.tagVersionHId || ""} readOnly className="w-full border p-2 rounded bg-gray-100" />
                  </div>
                  <div>
                    <label>Version E Id</label>
                    <input type="text" value={editData.contentTag.tagVersionEId || ""} readOnly className="w-full border p-2 rounded bg-gray-100" />
                  </div>
                </div>
              </fieldset>

              {/* Content */}
              <div>
                <label className="block font-semibold text-green-900 mb-1">Content (HTML allowed)</label>
                <ReactQuill
                  theme="snow"
                  value={editData.content || ""}
                  onChange={handleContentChange}
                  modules={{
                    toolbar: [
                      [{ header: [1, 2, false] }],
                      ["bold", "italic", "underline", "strike", "blockquote"],
                      [{ list: "ordered" }, { list: "bullet" }],
                      [{ color: [] }, { background: [] }],
                      ["link", "image"],
                      ["clean"]
                    ],
                  }}
                  formats={[
                    "header",
                    "bold",
                    "italic",
                    "underline",
                    "strike",
                    "blockquote",
                    "list",
                    "bullet",
                    "color",
                    "background",
                    "link",
                    "image"
                  ]}
                  style={{ height: "200px", marginBottom: "50px" }}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditData(null);
                  }}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Chapter;
