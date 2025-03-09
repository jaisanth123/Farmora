import React from "react";
import Card from "../common/Card";

// This would typically use a chart library like Chart.js or Recharts
// We'll create a simple placeholder here
const PerformanceChart = () => {
  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Performance Overview</h2>
        <select className="text-sm border rounded p-1">
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
          <option>Last 3 Months</option>
        </select>
      </div>
      <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
        {/* Placeholder for actual chart */}
        <div className="text-center text-gray-500">
          <p>Performance chart will display here</p>
          <p className="text-sm">
            (Would implement with Chart.js or Recharts in a real app)
          </p>
        </div>
      </div>
    </Card>
  );
};

export default PerformanceChart;
