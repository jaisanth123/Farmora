import React from "react";
import { FaArrowUp, FaArrowDown, FaMinus, FaInfoCircle } from "react-icons/fa";

const CommodityPriceTable = ({ commodities }) => {
  // Get trend icon based on price trend
  const getTrendIcon = (trend) => {
    if (trend === "up") return <FaArrowUp className="text-green-500" />;
    if (trend === "down") return <FaArrowDown className="text-red-500" />;
    return <FaMinus className="text-gray-400" />;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Commodity
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Current Price
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Previous Price
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Change
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Trend
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Unit
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {commodities.length > 0 ? (
            commodities.map((commodity) => (
              <tr key={commodity.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {commodity.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 font-medium">
                  ₹{commodity.currentPrice}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                  ₹{commodity.prevPrice}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${
                    commodity.change.startsWith("+")
                      ? "text-green-600"
                      : commodity.change.startsWith("-")
                      ? "text-red-600"
                      : "text-gray-500"
                  }`}
                >
                  {commodity.change}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                  {getTrendIcon(commodity.trend)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                  per {commodity.unit}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                  <button className="text-gray-400 hover:text-green-500">
                    <FaInfoCircle size={16} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="7"
                className="px-6 py-4 text-center text-sm text-gray-500"
              >
                No commodities found matching your search criteria
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CommodityPriceTable;
