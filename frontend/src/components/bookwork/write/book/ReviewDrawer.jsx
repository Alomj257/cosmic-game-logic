import React from "react";
import { Drawer, Descriptions } from "antd";

const ReviewDrawer = ({ visible, onClose, bookData }) => {
  return (
    <Drawer
      title="Review Book Data"
      placement="right"
      onClose={onClose}
      visible={visible}
      width={400}
    >
      <Descriptions column={1} bordered>
        <Descriptions.Item label="Book Name">{bookData.bookName}</Descriptions.Item>
        <Descriptions.Item label="Book Description">{bookData.bookDesc}</Descriptions.Item>
        <Descriptions.Item label="Type">{bookData.type}</Descriptions.Item>
        <Descriptions.Item label="Group">{bookData.group}</Descriptions.Item>
        <Descriptions.Item label="Sub Group">{bookData.subGroup}</Descriptions.Item>
        <Descriptions.Item label="Date">{bookData.date}</Descriptions.Item>
        <Descriptions.Item label="Debit Amount">{bookData.debitAmount}</Descriptions.Item>
        <Descriptions.Item label="Credit Amount">{bookData.creditAmount}</Descriptions.Item>
        <Descriptions.Item label="Payment Method">{bookData.paymentMethod}</Descriptions.Item>
        <Descriptions.Item label="Paid To">{bookData.paidTo}</Descriptions.Item>
        <Descriptions.Item label="Narration">{bookData.narration}</Descriptions.Item>
      </Descriptions>
    </Drawer>
  );
};

export default ReviewDrawer;
