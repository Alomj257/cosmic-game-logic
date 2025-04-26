import React, { useState } from "react";
import { Tabs } from "antd";
import {
  BookOutlined,
  FileTextOutlined,
  OrderedListOutlined,
  ApartmentOutlined,
  AlignLeftOutlined,
} from "@ant-design/icons";

import Book from "../../components/bookwork/database/Book";
import Chapter from "../../components/bookwork/database/Chapter";
import Heading from "../../components/bookwork/database/Heading";
import SubHeading from "../../components/bookwork/database/SubHeading";
import SubSubHeading from "../../components/bookwork/database/SubSubHeading";

const DatabasePage = () => {
  const [activeKey, setActiveKey] = useState("book");

  const items = [
    {
      key: "book",
      label: (
        <span className="font-bold py-1 text-base inline-flex items-center gap-2">
          <BookOutlined /> Book
        </span>
      ),
      children: <Book />,
    },
    {
      key: "chapter",
      label: (
        <span className="font-bold py-1 text-base inline-flex items-center gap-2">
          <FileTextOutlined /> Chapter
        </span>
      ),
      children: <Chapter />,
    },
    {
      key: "heading",
      label: (
        <span className="font-bold py-1 text-base inline-flex items-center gap-2">
          <OrderedListOutlined /> Heading
        </span>
      ),
      children: <Heading />,
    },
    {
      key: "subheading",
      label: (
        <span className="font-bold py-1 text-base inline-flex items-center gap-2">
          <ApartmentOutlined /> S. Heading
        </span>
      ),
      children: <SubHeading />,
    },
    {
      key: "subsubheading",
      label: (
        <span className="font-bold py-1 text-base inline-flex items-center gap-2">
          <AlignLeftOutlined /> S.S. Heading
        </span>
      ),
      children: <SubSubHeading />,
    },
  ];

  return (
    <div className="h-screen flex flex-col h-[90vh]">
      {/* Sticky and padded Tabs header */}
      <div className="sticky top-0 z-30 bg-white px-10 py-2 border-gray-200">
        <Tabs
          activeKey={activeKey}
          onChange={(key) => setActiveKey(key)}
          type="line"
          tabPosition="top"
          className="font-bold"
          items={items.map((item) => ({
            key: item.key,
            label: item.label,
          }))}
        />
      </div>

      {/* Scrollable content (no scrollbar visible) */}
      <div className="flex-1 overflow-y-auto px-2 pb-6 bg-white scrollbar-hide">
        {items.find((item) => item.key === activeKey)?.children}
      </div>
    </div>
  );
};

export default DatabasePage;
