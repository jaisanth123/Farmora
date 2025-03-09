import React from "react";
import Card from "../common/Card";

const StatCard = ({ title, value, change, icon }) => {
  const isPositive = change && change.startsWith("+");

  return (
    <Card>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {change && (
            <span
              className={`text-xs font-medium ${
                isPositive ? "text-green-500" : "text-red-500"
              }`}
            >
              {change} from last month
            </span>
          )}
        </div>
        <div className="p-3 rounded-full bg-gray-100">{icon}</div>
      </div>
    </Card>
  );
};

export default StatCard;
