// src/components/market-analysis/MarketAnalysisPage.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaChartLine,
  FaMapMarkerAlt,
  FaSearch,
  FaFilter,
  FaDownload,
  FaExchangeAlt,
  FaInfo,
} from "react-icons/fa";
import PriceComparisonChart from "./PriceComparisonChart";
import MarketTrendsChart from "./MarketTrendsChart";
import CommodityPriceTable from "./CommodityPriceTable";
import MarketNewsCard from "./MarketNewsCard";
import PriceAlertModal from "./PriceAlertModal";
import SelectableCropList from "./SelectableCropList";
import ChatbotWrapper from "../dashboard/utils/ChatbotWrapper";

const MarketAnalysisPage = () => {
  // State management
  const [selectedCommodities, setSelectedCommodities] = useState([
    "Rice",
    "Wheat",
  ]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedMarket, setSelectedMarket] = useState("Delhi");
  const [timeRange, setTimeRange] = useState("1M"); // 1W, 1M, 3M, 6M, 1Y
  const [loading, setLoading] = useState(true);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [marketData, setMarketData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Sample markets
  const markets = [
    "Delhi",
    "Mumbai",
    "Bangalore",
    "Chennai",
    "Kolkata",
    "Hyderabad",
    "Pune",
    "Lucknow",
    "Jaipur",
    "Ahmedabad",
  ];

  // Sample time ranges
  const timeRanges = [
    { label: "1W", name: "1 Week" },
    { label: "1M", name: "1 Month" },
    { label: "3M", name: "3 Months" },
    { label: "6M", name: "6 Months" },
    { label: "1Y", name: "1 Year" },
  ];

  // Fetch market data (simulated)
  useEffect(() => {
    setLoading(true);

    // Simulating API call with setTimeout
    const fetchMarketData = setTimeout(() => {
      // In a real application, you would use an API like:
      // - Agmarknet API (Indian agricultural market data)
      // - USDA Market News API
      // - FAO GIEWS API (Global Information and Early Warning System)

      // Sample market data structure
      const data = {
        commodities: generateSampleCommodityData(),
        marketNews: generateSampleMarketNews(),
        forecast: generatePriceForecast(),
        nearbyMarkets: generateNearbyMarkets(),
      };

      setMarketData(data);
      setLoading(false);
    }, 1200);

    return () => clearTimeout(fetchMarketData);
  }, [selectedMarket, timeRange, selectedCommodities]);

  // Generate sample data
  const generateSampleCommodityData = () => {
    const sampleCrops = [
      {
        id: 1,
        name: "Rice",
        currentPrice: 2450,
        prevPrice: 2265,
        unit: "quintal",
        change: "+8.2%",
        trend: "up",
      },
      {
        id: 2,
        name: "Wheat",
        currentPrice: 2100,
        prevPrice: 2050,
        unit: "quintal",
        change: "+2.4%",
        trend: "up",
      },
      {
        id: 3,
        name: "Maize",
        currentPrice: 1850,
        prevPrice: 1950,
        unit: "quintal",
        change: "-5.1%",
        trend: "down",
      },
      {
        id: 4,
        name: "Soybean",
        currentPrice: 3800,
        prevPrice: 3600,
        unit: "quintal",
        change: "+5.6%",
        trend: "up",
      },
      {
        id: 5,
        name: "Cotton",
        currentPrice: 6200,
        prevPrice: 6500,
        unit: "quintal",
        change: "-4.6%",
        trend: "down",
      },
      {
        id: 6,
        name: "Sugarcane",
        currentPrice: 285,
        prevPrice: 280,
        unit: "quintal",
        change: "+1.8%",
        trend: "stable",
      },
      {
        id: 7,
        name: "Potato",
        currentPrice: 1150,
        prevPrice: 980,
        unit: "quintal",
        change: "+17.3%",
        trend: "up",
      },
      {
        id: 8,
        name: "Tomato",
        currentPrice: 1300,
        prevPrice: 1800,
        unit: "quintal",
        change: "-27.8%",
        trend: "down",
      },
      {
        id: 9,
        name: "Onion",
        currentPrice: 950,
        prevPrice: 1100,
        unit: "quintal",
        change: "-13.6%",
        trend: "down",
      },
      {
        id: 10,
        name: "Pulses",
        currentPrice: 5500,
        prevPrice: 5450,
        unit: "quintal",
        change: "+0.9%",
        trend: "stable",
      },
    ];

    return sampleCrops;
  };

  const generateSampleMarketNews = () => {
    return [
      {
        id: 1,
        title: "Government announces MSP increase for kharif crops",
        summary:
          "The government has announced an increase in the Minimum Support Price (MSP) for kharif crops for the 2025-26 marketing season.",
        source: "Ministry of Agriculture",
        date: "2 days ago",
        url: "#",
        impact: "positive",
      },
      {
        id: 2,
        title: "Heavy rainfall affects vegetable supply chains",
        summary:
          "Excessive rainfall in key growing regions has led to supply disruptions, causing price volatility in vegetable markets.",
        source: "Agri Market Watch",
        date: "5 days ago",
        url: "#",
        impact: "negative",
      },
      {
        id: 3,
        title: "Export restrictions lifted on key agricultural commodities",
        summary:
          "The government has eased export restrictions on several agricultural commodities, opening new market opportunities for farmers.",
        source: "Trade Department",
        date: "1 week ago",
        url: "#",
        impact: "positive",
      },
    ];
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const generatePriceForecast = () => {
    // Sample 3-month forecast data
    return {
      rice: [
        { month: "Current", price: 2450 },
        { month: "Apr", price: 2500 },
        { month: "May", price: 2580 },
        { month: "Jun", price: 2450 },
      ],
      wheat: [
        { month: "Current", price: 2100 },
        { month: "Apr", price: 2150 },
        { month: "May", price: 2200 },
        { month: "Jun", price: 2250 },
      ],
    };
  };

  const generateNearbyMarkets = () => {
    return [
      { name: "Ghaziabad Mandi", distance: "28 km", priceChange: "+2%" },
      { name: "Gurugram Market", distance: "35 km", priceChange: "-1%" },
      { name: "Noida Wholesale Market", distance: "22 km", priceChange: "+3%" },
      { name: "Faridabad Mandi", distance: "40 km", priceChange: "Same" },
    ];
  };

  // Historical market data for charts (simulated)
  const generateHistoricalData = (commodity) => {
    const data = [];
    let basePrice = commodity === "Rice" ? 2200 : 1900;

    // Generate data points based on time range
    const points =
      timeRange === "1W"
        ? 7
        : timeRange === "1M"
        ? 30
        : timeRange === "3M"
        ? 90
        : timeRange === "6M"
        ? 180
        : 365;

    for (let i = 0; i < points; i++) {
      const fluctuation = Math.random() * 200 - 100;
      const trend = (i / points) * 200; // Gradual upward trend
      data.push({
        date: new Date(
          Date.now() - (points - i) * 24 * 60 * 60 * 1000
        ).toLocaleDateString(),
        price: Math.round(basePrice + fluctuation + trend),
      });
    }

    return data;
  };

  // Filtered commodities based on search
  const filteredCommodities =
    marketData?.commodities.filter((crop) =>
      crop.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      {/* Header section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row justify-between items-center mb-6"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <FaChartLine className="mr-2 text-green-600" /> Market Analysis
          </h1>
          <p className="text-gray-600 mt-1">
            Track prices, trends, and make informed decisions
          </p>
        </div>

        <div className="mt-4 sm:mt-0 flex space-x-2">
          <button
            onClick={() => setShowAlertModal(true)}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm flex items-center transition duration-200"
          >
            <FaInfo className="mr-1" /> Set Price Alerts
          </button>
          <button className="bg-white border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm flex items-center transition duration-200">
            <FaDownload className="mr-1" /> Export Data
          </button>
        </div>
      </motion.div>

      {/* Filter and search section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white rounded-lg shadow-sm p-4 mb-6"
      >
        <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4 items-start lg:items-center">
          {/* Market selector */}
          <div className="w-full lg:w-1/4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Market
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaMapMarkerAlt className="text-gray-400" />
              </div>
              <select
                value={selectedMarket}
                onChange={(e) => setSelectedMarket(e.target.value)}
                className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
              >
                {markets.map((market) => (
                  <option key={market} value={market}>
                    {market}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Time range selector */}
          <div className="w-full lg:w-1/4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Time Range
            </label>
            <div className="flex border border-gray-300 rounded-md overflow-hidden">
              {timeRanges.map((range) => (
                <button
                  key={range.label}
                  onClick={() => setTimeRange(range.label)}
                  className={`flex-1 py-2 text-sm ${
                    timeRange === range.label
                      ? "bg-green-500 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search commodities */}
          <div className="w-full lg:w-1/2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search Commodities
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search for a crop or commodity..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>
        </div>

        {/* Crop selection pills */}
        {!loading && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selected Commodities
            </label>
            <SelectableCropList
              allCrops={marketData.commodities.map((c) => c.name)}
              selectedCrops={selectedCommodities}
              onSelectionChange={setSelectedCommodities}
            />
          </div>
        )}
      </motion.div>

      {loading ? (
        // Loading state
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center items-center h-64"
        >
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
            <p className="mt-4 text-gray-600">Loading market data...</p>
          </div>
        </motion.div>
      ) : (
        // Content when data is loaded
        <>
          {/* Price comparison and trends charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-lg shadow-sm p-4"
            >
              <h2 className="text-lg font-medium mb-4">Price Trends</h2>
              <MarketTrendsChart
                data={selectedCommodities.map((commodity) => ({
                  name: commodity,
                  data: generateHistoricalData(commodity),
                }))}
                timeRange={timeRange}
              />
              <div className="mt-2 text-xs text-gray-500 text-right">
                * Data sourced from Agricultural Market Information System
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-lg shadow-sm p-4"
            >
              <h2 className="text-lg font-medium mb-4">
                Price Forecast (3 Months)
              </h2>
              <PriceComparisonChart
                data={selectedCommodities.map((commodity) => ({
                  name: commodity,
                  data:
                    marketData.forecast[commodity.toLowerCase()] ||
                    marketData.forecast.rice,
                }))}
              />
              <div className="mt-2 text-xs text-gray-500 text-right">
                * Forecast based on historical data and seasonal patterns
              </div>
            </motion.div>
          </div>

          {/* Commodity price table and market news */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="lg:col-span-2 bg-white rounded-lg shadow-sm overflow-hidden"
            >
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-lg font-medium">Commodity Prices</h2>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">
                    {selectedMarket} Market
                  </span>
                  <button className="text-sm text-green-500 flex items-center hover:underline">
                    <FaExchangeAlt className="mr-1" size={12} />
                    Compare Markets
                  </button>
                </div>
              </div>
              <CommodityPriceTable commodities={filteredCommodities} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-white rounded-lg shadow-sm p-4"
            >
              <h2 className="text-lg font-medium mb-4">
                Market News & Updates
              </h2>
              <div className="space-y-4">
                {marketData.marketNews.map((news) => (
                  <MarketNewsCard key={news.id} news={news} />
                ))}
              </div>
              <button className="mt-4 w-full text-center text-green-500 hover:underline py-2">
                View All Market News
              </button>
            </motion.div>
          </div>

          {/* Nearby markets and trading information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-white rounded-lg shadow-sm p-4"
          >
            <h2 className="text-lg font-medium mb-4">Nearby Markets</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {marketData.nearbyMarkets.map((market, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-3 hover:border-green-500 transition-colors duration-200"
                >
                  <div className="flex items-center mb-2">
                    <FaMapMarkerAlt className="text-green-500 mr-2" />
                    <h3 className="font-medium">{market.name}</h3>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Distance</span>
                    <span>{market.distance}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Price Difference</span>
                    <span
                      className={
                        market.priceChange.includes("+")
                          ? "text-green-500"
                          : market.priceChange.includes("-")
                          ? "text-red-500"
                          : "text-gray-600"
                      }
                    >
                      {market.priceChange}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-center">
              <button className="text-green-500 hover:underline flex items-center">
                <FaFilter className="mr-1" size={12} />
                View More Markets
              </button>
            </div>
          </motion.div>
        </>
      )}

      {/* Price Alert Modal */}
      {showAlertModal && (
        <PriceAlertModal
          onClose={() => setShowAlertModal(false)}
          commodities={marketData?.commodities || []}
        />
      )}
      <ChatbotWrapper
        isChatOpen={isChatOpen}
        toggleChat={toggleChat}
        setIsChatOpen={setIsChatOpen}
      />
    </div>
  );
};

export default MarketAnalysisPage;
