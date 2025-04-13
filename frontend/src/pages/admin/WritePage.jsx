import React, { useState } from "react";
import { Tabs } from "antd";
import {
  BookOutlined,
  FileTextOutlined,
  OrderedListOutlined,
  ApartmentOutlined,
  AlignLeftOutlined,
  BgColorsOutlined,
  UploadOutlined
} from "@ant-design/icons";

import Book from "../../components/bookwork/write/Book";
import Chapter from "../../components/bookwork/write/Chapter";
import Heading from "../../components/bookwork/write/Heading";
import SubHeading from "../../components/bookwork/write/SubHeading";
import SubSubHeading from "../../components/bookwork/write/SubSubHeading";
import Formatting from "../../components/bookwork/write/Formatting";
import UploadImage from "../../components/bookwork/write/UploadImage";

const WritePage = () => {
  const [activeKey, setActiveKey] = useState("book");

  const items = [
    {
      key: "book",
      label: (
        <span>
          <BookOutlined /> Book
        </span>
      ),
      children: <Book />,
    },
    {
      key: "chapter",
      label: (
        <span>
          <FileTextOutlined /> Chapter
        </span>
      ),
      children: <Chapter />,
    },
    {
      key: "heading",
      label: (
        <span>
          <OrderedListOutlined /> Heading
        </span>
      ),
      children: <Heading />,
    },
    {
      key: "subheading",
      label: (
        <span>
          <ApartmentOutlined /> S. Heading
        </span>
      ),
      children: <SubHeading />,
    },
    {
      key: "subsubheading",
      label: (
        <span>
          <AlignLeftOutlined /> S.S. Heading
        </span>
      ),
      children: <SubSubHeading />,
    },
    {
      key: "formatting",
      label: (
        <span>
          <BgColorsOutlined /> Create Formatting
        </span>
      ),
      children: <Formatting />,
    },
    {
      key: "upload",
      label: (
        <span>
          <UploadOutlined /> Upload Image
        </span>
      ),
      children: <UploadImage />,
    },
  ];

  return (
    <div className="p-0">
      <Tabs
        activeKey={activeKey}
        onChange={(key) => setActiveKey(key)}
        type="line"
        tabPosition="top"
        className="bg-white p-4 rounded shadow"
        size="large"
        animated
        items={items}
      />
    </div>
  );
};

export default WritePage;
