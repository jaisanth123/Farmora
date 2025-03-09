import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const MarketChart = () => {
  // Sample data for the chart
  const data = [
    { month: "Jan", rice: 2100, wheat: 1950 },
    { month: "Feb", rice: 2200, wheat: 1900 },
    { month: "Mar", rice: 2300, wheat: 1850 },
    { month: "Apr", rice: 2250, wheat: 1950 },
    { month: "May", rice: 2350, wheat: 2000 },
    { month: "Jun", rice: 2450, wheat: 2100 },
  ];

  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="month" />
        <YAxis tickFormatter={(value) => `₹${value}`} />
        <Tooltip formatter={(value) => [`₹${value}`, undefined]} />
        <Legend />
        <Line
          type="monotone"
          dataKey="rice"
          stroke="#10B981"
          activeDot={{ r: 8 }}
          name="Rice"
        />
        <Line type="monotone" dataKey="wheat" stroke="#3B82F6" name="Wheat" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default MarketChart;
