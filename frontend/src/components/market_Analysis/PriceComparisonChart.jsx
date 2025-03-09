import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const PriceComparisonChart = ({ data }) => {
  // Transform data for Recharts
  const transformedData = [];

  // Get all unique months from all commodities
  const allMonths = new Set();
  data.forEach((commodity) => {
    commodity.data.forEach((point) => {
      allMonths.add(point.month);
    });
  });

  // Sort months in chronological order
  const monthOrder = [
    "Current",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const sortedMonths = Array.from(allMonths).sort(
    (a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b)
  );

  // For each month, create a data point with all commodity prices
  sortedMonths.forEach((month) => {
    const dataPoint = { month };

    // Add each commodity's price for this month
    data.forEach((commodity) => {
      const matchingPoint = commodity.data.find(
        (point) => point.month === month
      );
      if (matchingPoint) {
        dataPoint[commodity.name] = matchingPoint.price;
      }
    });

    transformedData.push(dataPoint);
  });

  // Custom tooltip
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
      <BarChart
        data={transformedData}
        margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
        <YAxis
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => `₹${value}`}
          domain={["auto", "auto"]}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        {data.map((commodity, index) => (
          <Bar
            key={commodity.name}
            dataKey={commodity.name}
            fill={index === 0 ? "#10B981" : "#3B82F6"}
            barSize={30}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default PriceComparisonChart;
