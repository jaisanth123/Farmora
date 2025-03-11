import React from "react";
import { useNavigate } from "react-router-dom";
import { Leaf, BarChart2, FlaskConical } from "lucide-react";

const Recommendation = () => {
  const navigate = useNavigate();

  const recommendationCards = [
    {
      title: "Seasonal Prediction",
      description:
        "Get predictions based on seasonal patterns for optimal planting and harvesting times",
      icon: <Leaf className="h-12 w-12 text-green-600" />,
      path: "/seasonal",
      color: "bg-green-400 hover:bg-green-500",
      borderColor: "border-green-200",
      iconBg: "bg-green-100",
    },
    {
      title: "Demand Analysis",
      description:
        "Analyze market demand for various crops to maximize your profits",
      icon: <BarChart2 className="h-12 w-12 text-blue-800" />,
      path: "/demand",
      color: "bg-blue-400 hover:bg-blue-500",
      borderColor: "border-blue-200",
      iconBg: "bg-blue-100",
    },
    {
      title: "Soil Analysis",
      description:
        "Get crop recommendations based on your soil composition and nature",
      icon: <FlaskConical className="h-12 w-12 text-amber-600" />,
      path: "/soil-nature",
      color: "bg-amber-400 hover:bg-amber-500",
      borderColor: "border-amber-200",
      iconBg: "bg-amber-100",
    },
  ];

  return (
    <div className="bg-gradient-to-b from-green-50 to-white min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-green-800 mb-4">Farm Smart</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our intelligent farming tools help you make data-driven decisions
            for better yields and sustainable farming practices.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {recommendationCards.map((card, index) => (
            <div
              key={index}
              className={`relative overflow-hidden rounded-lg border ${card.borderColor} p-6 shadow-md transition-all duration-300 transform hover:scale-105 ${card.color}`}
              onClick={() => navigate(card.path)}
            >
              <div
                className={`absolute -top-6 -right-6 h-24 w-24 rounded-full opacity-20 ${card.iconBg}`}
              ></div>

              <div className="flex items-center justify-center mb-4">
                <div className={`p-3 rounded-full ${card.iconBg}`}>
                  {card.icon}
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">
                {card.title}
              </h3>
              <p className="text-gray-600 text-center">{card.description}</p>

              <div className="flex justify-center mt-6">
                <button className="px-4 py-2 bg-white rounded-md shadow-sm text-gray-700 hover:bg-gray-50 border border-gray-200 transition-colors">
                  Explore Now
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-green-800 mb-6">
            Why Choose Our Smart Farming Tools?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-4">
              <div className="bg-green-100 p-3 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">
                  Data-Driven Decisions
                </h3>
                <p className="text-gray-600">
                  Make informed farming decisions based on scientific analysis
                  and historical data
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-green-100 p-3 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Save Time</h3>
                <p className="text-gray-600">
                  Get instant recommendations without lengthy research or
                  consultations
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-green-100 p-3 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">
                  Increase Profits
                </h3>
                <p className="text-gray-600">
                  Optimize your crop selection and farming practices to maximize
                  your revenue
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-green-100 p-3 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">
                  Sustainable Farming
                </h3>
                <p className="text-gray-600">
                  Learn practices that are good for both your farm and the
                  environment
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-green-800 mb-4">
            Ready to Transform Your Farming?
          </h2>
          <p className="text-gray-600 mb-6">
            Choose one of our tools above to get started or contact our team for
            personalized assistance.
          </p>
          <button className="px-6 py-3 bg-green-600 text-white rounded-md shadow-md hover:bg-green-700 transition-colors">
            Contact Agricultural Experts
          </button>
        </div>
      </div>
    </div>
  );
};

export default Recommendation;
