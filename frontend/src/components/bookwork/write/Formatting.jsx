import React, { useState, useEffect } from "react";
import {
  SaveOutlined,
  CloseCircleOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { Button } from "antd";
import { toast } from "react-hot-toast";
import {
  createTag,
  getAllTags,
  updateTag,
  getTagById,
  deleteTag,
} from "../../../services/api";

const Formatting = () => {
  const [dataTypeCode, setDataTypeCode] = useState("BKN");
  const [openingTag, setOpeningTag] = useState("");
  const [closingTag, setClosingTag] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [formattingList, setFormattingList] = useState([]);
  const [editId, setEditId] = useState(null);

  // Enum options for data type codes
  const dataTypeOptions = [
    "BKN",  // Book Name
    "BKT",  // Book Text
    "BKT_para",  // Book Text Additional Para
    "BKT_Last",  // Book Text Additional Para Last Para
    "CHNo",  // Chapter No
    "CN",  // Chapter Name
    "CH",  // Chapter Heading
    "SHRed",  // Sub Heading 1 Red
    "SHBlue",  // Sub Heading 1 Blue
    "SH2",  // Sub Heading 2
    "SH3",  // Sub Heading 3
    "SH4",  // Sub Heading 4
    "LT1",  // Listings Type 1
    "LT2",  // Listings Type 2
    "LT3",  // Listings Type 3
    "LT4",  // Listings Type 4
    "COM",  // Comments
    "Slides"  // Slides
  ];

  const fetchTags = async () => {
    try {
      const res = await getAllTags();
      setFormattingList(res.data);
    } catch (err) {
      toast.error("Failed to fetch tags");
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const handleSave = async () => {
    if (!openingTag || !closingTag) {
      return toast.warning("Opening and closing tags are required.");
    }

    const tagPayload = {
      dataTypeCode,
      openingTag,
      closingTag,
      isDefault,
    };

    try {
      if (editId) {
        await updateTag(editId, tagPayload);
        toast.success("Formatting updated successfully");
      } else {
        await createTag(tagPayload);
        toast.success("Formatting created successfully");
      }
      fetchTags();
      handleCancel();
    } catch (err) {
      toast.error("Failed to save formatting");
    }
  };

  const handleCancel = () => {
    setOpeningTag("");
    setClosingTag("");
    setIsDefault(false);
    setEditId(null);
  };

  const handleEdit = (tag) => {
    setDataTypeCode(tag.dataTypeCode);
    setOpeningTag(tag.openingTag);
    setClosingTag(tag.closingTag);
    setIsDefault(tag.isDefault);
    setEditId(tag._id);
  };

  const handleDelete = async (id) => {
    try {
      await deleteTag(id);
      toast.success("Formatting deleted successfully");
      fetchTags();
    } catch (err) {
      toast.error("Failed to delete formatting");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto mt-6">
      {/* Create Formatting Section */}
      <div className="bg-green-100 border border-green-700 rounded-2xl p-6 shadow-md">
        <h2 className="text-3xl font-bold text-center text-green-700 underline mb-8">
          {editId ? "EDIT FORMATTING" : "CREATE FORMATTING"}
        </h2>

        <div className="mb-6 space-y-6">
          <div className="flex items-center">
            <label className="w-40 text-lg font-semibold text-green-900">Data type code:</label>
            <select
              value={dataTypeCode}
              onChange={(e) => setDataTypeCode(e.target.value)}
              className="w-full max-w-lg border border-green-800 rounded-md px-3 py-2 text-black text-base"
            >
              {dataTypeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center">
            <label className="w-40 text-lg font-semibold text-green-900">Opening Tag:</label>
            <textarea
              rows={2}
              value={openingTag}
              onChange={(e) => setOpeningTag(e.target.value)}
              className="w-full max-w-4xl border border-green-800 rounded-md px-3 py-2 text-base text-black"
            />
          </div>

          <div className="flex items-center">
            <label className="w-40 text-lg font-semibold text-green-900">Closing Tag:</label>
            <textarea
              rows={2}
              value={closingTag}
              onChange={(e) => setClosingTag(e.target.value)}
              className="w-full max-w-4xl border border-green-800 rounded-md px-3 py-2 text-base text-black"
            />
          </div>

          <div className="flex items-center">
            <label className="w-40 text-lg font-semibold text-green-900">Is Default:</label>
            <input
              type="checkbox"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="w-5 h-5 border-2 border-green-800 rounded bg-white checked:bg-green-800 "
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={handleSave}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 text-lg rounded-xl shadow"
          >
            {editId ? "Update" : "Save"}
          </Button>
          <Button
            danger
            icon={<CloseCircleOutlined />}
            onClick={handleCancel}
            className="px-8 py-2 text-lg rounded-xl shadow"
          >
            Cancel
          </Button>
        </div>
      </div>

      {/* Formatting List */}
      <div className="mt-10 border border-green-700 rounded-2xl bg-green-100 p-6 shadow-md overflow-x-auto">
        <h2 className="text-3xl font-bold text-center text-green-700 underline mb-6">
          FORMATTING LIST
        </h2>
        <table className="min-w-full border-collapse border border-green-700 text-sm text-left">
          <thead className="bg-green-800 text-white text-base">
            <tr className="h-16">
              <th className="border border-green-700 text-center px-2 py-2">Data Type Code</th>
              <th className="border border-green-700 text-center px-2 py-2">Opening Tag</th>
              <th className="border border-green-700 text-center px-2 py-2">Closing Tag</th>
              <th className="border border-green-700 text-center px-2 py-2">Is Default</th>
              <th className="border border-green-700 text-center px-2 py-2">Tag Main ID</th>
              <th className="border border-green-700 text-center px-2 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {formattingList.map((item) => (
              <tr key={item._id} className="bg-green-50 hover:bg-green-200 text-[15px]">
                <td className="border border-green-700 text-center px-2 py-2">{item.dataTypeCode}</td>
                <td className="border border-green-700 text-center px-2 py-2 whitespace-pre-wrap">{item.openingTag}</td>
                <td className="border border-green-700 text-center px-2 py-2 whitespace-pre-wrap">{item.closingTag}</td>
                <td className="border border-green-700 text-center px-2 py-2">{item.isDefault ? "Yes" : "No"}</td>
                <td className="border border-green-700 text-center px-2 py-2">{item.tagMainId}</td>
                <td className="border border-green-700 text-center px-2 py-2 text-center space-x-2">
                  <EditOutlined
                    className="text-blue-600 cursor-pointer"
                    onClick={() => handleEdit(item)}
                  />
                  <DeleteOutlined
                    className="text-red-600 cursor-pointer"
                    onClick={() => handleDelete(item._id)}
                  />
                </td>
              </tr>
            ))}
            {formattingList.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center text-green-800 py-4">
                  No formatting rules added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Formatting;
