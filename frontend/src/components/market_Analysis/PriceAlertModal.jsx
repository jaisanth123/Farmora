import React, { useState } from "react";
import { FaBell, FaTimes } from "react-icons/fa";

const PriceAlertModal = ({ onClose, commodities }) => {
  const [selectedCommodity, setSelectedCommodity] = useState(
    commodities[0]?.name || ""
  );
  const [alertType, setAlertType] = useState("above");
  const [priceThreshold, setPriceThreshold] = useState("");
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      commodity: "Rice",
      condition: "above",
      price: 2500,
      enabled: true,
    },
    {
      id: 2,
      commodity: "Wheat",
      condition: "below",
      price: 2000,
      enabled: true,
    },
  ]);

  const handleAddAlert = () => {
    if (!selectedCommodity || !priceThreshold) return;

    const newAlert = {
      id: Date.now(),
      commodity: selectedCommodity,
      condition: alertType,
      price: Number(priceThreshold),
      enabled: true,
    };

    setNotifications([...notifications, newAlert]);
    setPriceThreshold("");
  };

  const handleToggleAlert = (id) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id
          ? { ...notification, enabled: !notification.enabled }
          : notification
      )
    );
  };

  const handleRemoveAlert = (id) => {
    setNotifications(
      notifications.filter((notification) => notification.id !== id)
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-medium flex items-center">
            <FaBell className="text-green-500 mr-2" /> Price Alerts
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <div className="p-4">
          <p className="text-sm text-gray-600 mb-4">
            Set price alerts to get notified when commodity prices reach your
            desired thresholds.
          </p>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Commodity
            </label>
            <select
              value={selectedCommodity}
              onChange={(e) => setSelectedCommodity(e.target.value)}
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
            >
              {commodities.map((commodity) => (
                <option key={commodity.id} value={commodity.name}>
                  {commodity.name} (Current: ₹{commodity.currentPrice})
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Alert Condition
            </label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="above"
                  checked={alertType === "above"}
                  onChange={() => setAlertType("above")}
                  className="text-green-500 focus:ring-green-500"
                />
                <span className="ml-2 text-sm">Price Above</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="below"
                  checked={alertType === "below"}
                  onChange={() => setAlertType("below")}
                  className="text-green-500 focus:ring-green-500"
                />
                <span className="ml-2 text-sm">Price Below</span>
              </label>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price Threshold (₹)
            </label>
            <input
              type="number"
              value={priceThreshold}
              onChange={(e) => setPriceThreshold(e.target.value)}
              placeholder="Enter price threshold"
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <button
            onClick={handleAddAlert}
            disabled={!selectedCommodity || !priceThreshold}
            className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Alert
          </button>
        </div>

        {notifications.length > 0 && (
          <div className="border-t p-4">
            <h3 className="font-medium mb-2">Your Alerts</h3>
            <ul className="space-y-2">
              {notifications.map((notification) => (
                <li
                  key={notification.id}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={notification.enabled}
                      onChange={() => handleToggleAlert(notification.id)}
                      className="h-4 w-4 text-green-500 focus:ring-green-500 rounded"
                    />
                    <span className="ml-2 text-sm">
                      {notification.commodity}{" "}
                      {notification.condition === "above" ? "above" : "below"} ₹
                      {notification.price}
                    </span>
                  </div>
                  <button
                    onClick={() => handleRemoveAlert(notification.id)}
                    className="text-red-400 hover:text-red-600"
                  >
                    <FaTimes size={16} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="bg-gray-50 p-4 rounded-b-lg text-right">
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PriceAlertModal;
