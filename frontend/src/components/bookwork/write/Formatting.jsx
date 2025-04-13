import React, { useState } from "react";
import { SaveOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { Button } from "antd";

const Formatting = () => {
  const [dataType, setDataType] = useState("GPN");
  const [openingTag, setOpeningTag] = useState("");
  const [closingTag, setClosingTag] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  const handleSave = () => {
    console.log({ dataType, openingTag, closingTag, isDefault });
  };

  const handleCancel = () => {
    setOpeningTag("");
    setClosingTag("");
    setIsDefault(false);
  };

  return (
    <div className="bg-amber-100 border border-amber-700 rounded-2xl p-6 max-w-4xl mx-auto mt-6 shadow-md">
      <h2 className="text-3xl font-bold text-center text-amber-950 underline mb-8">
        CREATE FORMATTING
      </h2>

      <div className="mb-6 space-y-6">
        <div className="flex items-center">
          <label className="w-40 text-lg font-semibold text-amber-900">Data type code:</label>
          <select
            value={dataType}
            onChange={(e) => setDataType(e.target.value)}
            className="w-full max-w-lg border border-amber-800 rounded-md px-3 py-2 text-black text-base focus:outline-none focus:ring-0"
          >
            <option value="GPN">GPN</option>
            <option value="CHP">CHP</option>
            <option value="HDG">HDG</option>
            <option value="SHD">SHD</option>
            <option value="SSH">SSH</option>
          </select>
        </div>

        <div className="flex items-center">
          <label className="w-40 text-lg font-semibold text-amber-900">Opening Tag:</label>
          <textarea
            rows={2}
            value={openingTag}
            onChange={(e) => setOpeningTag(e.target.value)}
            className="w-full max-w-2xl border border-amber-800 rounded-md px-3 py-2 text-base text-black focus:outline-none focus:ring-0"
          />
        </div>

        <div className="flex items-center">
          <label className="w-40 text-lg font-semibold text-amber-900">Closing Tag:</label>
          <textarea
            rows={2}
            value={closingTag}
            onChange={(e) => setClosingTag(e.target.value)}
            className="w-full max-w-2xl border border-amber-800 rounded-md px-3 py-2 text-base text-black focus:outline-none focus:ring-0"
          />
        </div>

        <div className="flex items-center">
          <label className="w-40 text-lg font-semibold text-amber-900">Is Default:</label>
          <input
            type="checkbox"
            checked={isDefault}
            onChange={(e) => setIsDefault(e.target.checked)}
            className="w-5 h-5 border-2 border-amber-800 rounded bg-white checked:bg-amber-800 checked:border-amber-900 checked:accent-amber-900 focus:outline-none focus:ring-0"
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
          Save
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
  );
};

export default Formatting;
