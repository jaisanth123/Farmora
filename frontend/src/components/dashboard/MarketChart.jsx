import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  ReferenceLine,
  BarChart,
  Bar,
  ComposedChart,
} from "recharts";

const MarketChart = () => {
  const [selectedCrop, setSelectedCrop] = useState("rice");
  const [timeRange, setTimeRange] = useState("1month");
  const [chartType, setChartType] = useState("line");

  // Enhanced sample data - in a real app this would come from your API
  const marketData = {
    rice: [
      {
        date: "Feb 1",
        price: 2100,
        avgPrice: 2050,
        predicted: 2110,
        volume: 250,
      },
      {
        date: "Feb 8",
        price: 2150,
        avgPrice: 2080,
        predicted: 2160,
        volume: 220,
      },
      {
        date: "Feb 15",
        price: 2200,
        avgPrice: 2100,
        predicted: 2240,
        volume: 280,
      },
      {
        date: "Feb 22",
        price: 2280,
        avgPrice: 2150,
        predicted: 2320,
        volume: 300,
      },
      {
        date: "Mar 1",
        price: 2320,
        avgPrice: 2200,
        predicted: 2370,
        volume: 320,
      },
      {
        date: "Mar 8",
        price: 2450,
        avgPrice: 2250,
        predicted: 2490,
        volume: 290,
      },
    ],
    wheat: [
      {
        date: "Feb 1",
        price: 2400,
        avgPrice: 2350,
        predicted: 2420,
        volume: 180,
      },
      {
        date: "Feb 8",
        price: 2350,
        avgPrice: 2320,
        predicted: 2340,
        volume: 190,
      },
      {
        date: "Feb 15",
        price: 2500,
        avgPrice: 2380,
        predicted: 2510,
        volume: 220,
      },
      {
        date: "Feb 22",
        price: 2580,
        avgPrice: 2450,
        predicted: 2600,
        volume: 250,
      },
      {
        date: "Mar 1",
        price: 2620,
        avgPrice: 2500,
        predicted: 2650,
        volume: 260,
      },
      {
        date: "Mar 8",
        price: 2680,
        avgPrice: 2550,
        predicted: 2720,
        volume: 240,
      },
    ],
    cotton: [
      {
        date: "Feb 1",
        price: 6500,
        avgPrice: 6300,
        predicted: 6520,
        volume: 150,
      },
      {
        date: "Feb 8",
        price: 6600,
        avgPrice: 6400,
        predicted: 6650,
        volume: 160,
      },
      {
        date: "Feb 15",
        price: 6550,
        avgPrice: 6450,
        predicted: 6570,
        volume: 140,
      },
      {
        date: "Feb 22",
        price: 6700,
        avgPrice: 6500,
        predicted: 6750,
        volume: 170,
      },
      {
        date: "Mar 1",
        price: 6800,
        avgPrice: 6600,
        predicted: 6850,
        volume: 190,
      },
      {
        date: "Mar 8",
        price: 6850,
        avgPrice: 6650,
        predicted: 6900,
        volume: 200,
      },
    ],
  };

  // Calculate trends and insights
  const currentData = marketData[selectedCrop];
  const lastPrice = currentData[currentData.length - 1].price;
  const lastAvgPrice = currentData[currentData.length - 1].avgPrice;
  const priceChange = lastPrice - currentData[currentData.length - 2].price;
  const percentChange = (
    (priceChange / currentData[currentData.length - 2].price) *
    100
  ).toFixed(1);
  const aboveAverage = ((lastPrice / lastAvgPrice - 1) * 100).toFixed(1);
  const trend = priceChange > 0 ? "upward" : "downward";
  const priceColor = priceChange > 0 ? "text-green-500" : "text-red-500";

  // Function to render different chart types
  const renderChart = () => {
    switch (chartType) {
      case "area":
        return (
          <AreaChart
            data={marketData[selectedCrop]}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis dataKey="date" tick={{ fill: "#333" }} />
            <YAxis tick={{ fill: "#333" }} />
            <Tooltip
              formatter={(value) => [`₹${value}`, "Price"]}
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#10B981"
              fill="#10B98133"
              name="Your Market"
              activeDot={{ r: 8 }}
            />
            <Area
              type="monotone"
              dataKey="avgPrice"
              stroke="#6B7280"
              fill="#6B728033"
              name="Regional Average"
            />
            <ReferenceLine
              y={lastPrice}
              stroke="#10B981"
              strokeDasharray="3 3"
              label={{
                value: `Current: ₹${lastPrice}`,
                fill: "#10B981",
                fontSize: 12,
              }}
            />
          </AreaChart>
        );
      case "composed":
        return (
          <ComposedChart
            data={marketData[selectedCrop]}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis dataKey="date" tick={{ fill: "#333" }} />
            <YAxis tick={{ fill: "#333" }} />
            <Tooltip
              formatter={(value) => [`₹${value}`, "Price"]}
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
            <Legend />
            <Bar
              dataKey="volume"
              barSize={20}
              fill="#8884d8"
              name="Trading Volume"
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#10B981"
              name="Your Market"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 8 }}
            />
            <Line
              type="monotone"
              dataKey="predicted"
              stroke="#FF8C00"
              name="Predicted Price"
              strokeDasharray="5 5"
            />
          </ComposedChart>
        );
      default: // line chart
        return (
          <LineChart
            data={marketData[selectedCrop]}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis dataKey="date" tick={{ fill: "#333" }} />
            <YAxis tick={{ fill: "#333" }} />
            <Tooltip
              formatter={(value) => [`₹${value}`, "Price"]}
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#10B981"
              name="Your Market"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 8 }}
            />
            <Line
              type="monotone"
              dataKey="avgPrice"
              stroke="#6B7280"
              name="Regional Average"
              strokeDasharray="5 5"
            />
            <Line
              type="monotone"
              dataKey="predicted"
              stroke="#FF8C00"
              name="Predicted Price"
              strokeDasharray="3 3"
            />
          </LineChart>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white border border-gray-200 rounded-lg shadow-sm p-5"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-black">
          Market Prices Analysis
        </h2>
        <div className="flex space-x-2">
          <select
            className="text-sm border border-gray-300 rounded p-1 text-black bg-white"
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
          >
            <option value="rice">Rice</option>
            <option value="wheat">Wheat</option>
            <option value="cotton">Cotton</option>
          </select>
          <select
            className="text-sm border border-gray-300 rounded p-1 text-black bg-white"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="1month">Last Month</option>
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
          </select>
          <select
            className="text-sm border border-gray-300 rounded p-1 text-black bg-white"
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
          >
            <option value="line">Line Chart</option>
            <option value="area">Area Chart</option>
            <option value="composed">Price + Volume</option>
          </select>
        </div>
      </div>

      {/* Market Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
          <p className="text-gray-500 text-xs">Current Price</p>
          <p className="text-lg font-bold">₹{lastPrice}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
          <p className="text-gray-500 text-xs">Change</p>
          <p className={`text-lg font-bold ${priceColor}`}>
            {priceChange > 0 ? "+" : ""}₹{priceChange} ({percentChange}%)
          </p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
          <p className="text-gray-500 text-xs">Regional Average</p>
          <p className="text-lg font-bold">₹{lastAvgPrice}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
          <p className="text-gray-500 text-xs">Vs. Regional Avg</p>
          <p className="text-lg font-bold text-green-500">+{aboveAverage}%</p>
        </div>
      </div>

      <motion.div
        className="h-64"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        key={selectedCrop + timeRange + chartType} // Re-animate when data changes
      >
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </motion.div>

      <motion.div
        className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <p className="font-medium text-gray-700">Market Insights:</p>
        <ul className="mt-2 space-y-1 text-sm text-gray-700">
          <li>
            • {selectedCrop.charAt(0).toUpperCase() + selectedCrop.slice(1)}{" "}
            prices show a {trend} trend over the last month.
          </li>
          <li>
            • Current price is {aboveAverage}% above the regional average.
          </li>
          <li>
            • Based on the trend, the best time to sell would be within the next
            7-14 days.
          </li>
          <li>
            • Expected price range for next week: ₹{lastPrice} - ₹
            {Math.round(lastPrice * 1.05)}
          </li>
        </ul>
      </motion.div>
    </motion.div>
  );
};

export default MarketChart;
