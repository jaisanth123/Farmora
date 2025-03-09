import React from "react";
import Card from "../common/Card";
import Button from "../common/Button";
import {
  FaFileUpload,
  FaUserGraduate,
  FaPlus,
  FaHistory,
} from "react-icons/fa";

const QuickActions = () => {
  return (
    <Card>
      <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
      <div className="space-y-3">
        <Button
          label="Take Test"
          icon={<FaUserGraduate />}
          onClick={() => {}}
          className="w-full justify-center bg-blue-600 hover:bg-blue-700"
        />
        <Button
          label="Upload Document"
          icon={<FaFileUpload />}
          onClick={() => {}}
          className="w-full justify-center bg-green-600 hover:bg-green-700"
        />
        <Button
          label="Create New Test"
          icon={<FaPlus />}
          onClick={() => {}}
          className="w-full justify-center bg-purple-600 hover:bg-purple-700"
        />
        <Button
          label="View History"
          icon={<FaHistory />}
          onClick={() => {}}
          className="w-full justify-center bg-gray-600 hover:bg-gray-700"
        />
      </div>
    </Card>
  );
};

export default QuickActions;
