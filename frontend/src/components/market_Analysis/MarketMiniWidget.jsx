import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaChartLine, FaArrowRight } from "react-icons/fa";

const MarketMiniWidget = () => {
  const [trendingCommodities] = useState([
    { name: "Rice", price: "₹2,450", change: "+8%", trend: "up" },
    { name: "Wheat", price: "₹2,100", change: "+2.4%", trend: "up" },
    { name: "Potato", price: "₹1,150", change: "+17.3%", trend: "up" },
    { name: "Tomato", price: "₹1,300", change: "-27.8%", trend: "down" },
  ]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium flex items-center">
          <FaChartLine className="text-green-600 mr-2" />
          Market Insights
        </h2>
        <Link
          to="/market-analysis"
          className="text-green-500 hover:text-green-700 flex items-center text-sm"
        >
          Full Analysis <FaArrowRight className="ml-1" size={12} />
        </Link>
      </div>

      <div className="space-y-3">
        {trendingCommodities.map((commodity, index) => (
          <div
            key={index}
            className="flex justify-between items-center border-b border-gray-100 pb-2"
          >
            <span className="font-medium">{commodity.name}</span>
            <div className="flex items-center">
              <span className="mr-2">{commodity.price}</span>
              <span
                className={
                  commodity.trend === "up" ? "text-green-500" : "text-red-500"
                }
              >
                {commodity.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 text-center">
        <Link
          to="/market-analysis"
          className="text-sm text-blue-500 hover:underline"
        >
          View all commodities and set price alerts
        </Link>
      </div>
    </div>
  );
};

export default MarketMiniWidget;
