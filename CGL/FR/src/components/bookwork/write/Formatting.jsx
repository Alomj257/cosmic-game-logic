import React, { useState, useEffect } from "react";
import {
  SaveOutlined,
  CloseCircleOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { Button, Modal } from "antd";
import { toast } from "react-hot-toast";
import {
  createTag,
  getAllTags,
  updateTag,
  deleteTag,
} from "../../../services/api";

const Formatting = () => {
  const [dataTypeCode, setDataTypeCode] = useState("BKN");
  const [openingTag, setOpeningTag] = useState("");
  const [closingTag, setClosingTag] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [formattingList, setFormattingList] = useState([]);
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null); // For storing the tag ID to be deleted
  const [isModalVisible, setIsModalVisible] = useState(false); // For showing the modal

  // Enum options for data type codes
  const dataTypeOptions = [
    "BKN", "BKT", "BKT_para", "BKT_Last", "CHNo", "CN", "CH", "SHRed", "SHBlue", "SH2", "SH3", "SH4", "LT1", "LT2", "LT3", "LT4", "COM", "Slides"
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

  const showDeleteModal = (id) => {
    setDeleteId(id); // Store the ID of the tag to be deleted
    setIsModalVisible(true); // Show the modal
  };

  const handleDelete = async () => {
    try {
      await deleteTag(deleteId); // Delete the tag using the ID stored in deleteId
      toast.success("Formatting deleted successfully");
      fetchTags();
      setIsModalVisible(false); // Close the modal after deletion
    } catch (err) {
      toast.error("Failed to delete formatting");
      setIsModalVisible(false); // Close the modal even if deletion fails
    }
  };

  const handleCancelModal = () => {
    setIsModalVisible(false); // Close the modal without deleting
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
              className="w-5 h-5 border-2 border-green-800 rounded bg-white checked:bg-green-800 focus:outline-none"
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
                    onClick={() => showDeleteModal(item._id)}
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

      {/* Confirmation Modal */}
      <Modal
        title="Confirm Deletion"
        visible={isModalVisible}
        onOk={handleDelete}
        onCancel={handleCancelModal}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{
          className: "bg-green-600 hover:bg-green-700 text-white",
        }}
        cancelButtonProps={{
          className: "border border-green-700 text-green-700",
        }}
      >
        <p>Are you sure you want to delete this formatting?</p>
      </Modal>
    </div>
  );
};

export default Formatting;
