import React from "react";
import { Line } from "recharts";
import {
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const MarketTrendsChart = ({ data, timeRange }) => {
  // Transform data for Recharts
  const transformedData = [];

  // Get all unique dates from all commodities
  const allDates = new Set();
  data.forEach((commodity) => {
    commodity.data.forEach((point) => {
      allDates.add(point.date);
    });
  });

  // Sort dates chronologically
  const sortedDates = Array.from(allDates).sort(
    (a, b) => new Date(a) - new Date(b)
  );

  // For each date, create a data point with all commodity prices
  sortedDates.forEach((date) => {
    const dataPoint = { date };

    // Add each commodity's price for this date
    data.forEach((commodity) => {
      const matchingPoint = commodity.data.find((point) => point.date === date);
      if (matchingPoint) {
        dataPoint[commodity.name] = matchingPoint.price;
      }
    });

    transformedData.push(dataPoint);
  });

  // Sample data for display based on time range
  let displayData = transformedData;
  if (transformedData.length > 30 && timeRange !== "1W") {
    // For longer time ranges, sample data to keep chart readable
    const sampleInterval = Math.ceil(transformedData.length / 30);
    displayData = transformedData.filter(
      (_, index) => index % sampleInterval === 0
    );
    // Always include the last data point
    if (
      displayData[displayData.length - 1] !==
      transformedData[transformedData.length - 1]
    ) {
      displayData.push(transformedData[transformedData.length - 1]);
    }
  }

  // Custom tooltip to format prices
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
          <p className="font-medium text-sm">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: ₹{entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={displayData}
        margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis
          dataKey="date"
          tickFormatter={(value) => {
            // Different formatting based on time range
            if (timeRange === "1W" || timeRange === "1M") {
              return value;
            } else {
              return value.split("/").slice(0, 2).join("/");
            }
          }}
          tick={{ fontSize: 12 }}
        />
        <YAxis
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => `₹${value}`}
          domain={["auto", "auto"]}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        {data.map((commodity, index) => (
          <Line
            key={commodity.name}
            type="monotone"
            dataKey={commodity.name}
            stroke={index === 0 ? "#10B981" : "#3B82F6"}
            strokeWidth={2}
            dot={{ r: 2 }}
            activeDot={{ r: 6 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default MarketTrendsChart;
