import React from "react";
import { motion } from "framer-motion";
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaNewspaper,
  FaExternalLinkAlt,
} from "react-icons/fa";

const NewsDetailComponent = ({ news, onBack }) => {
  // This is a mock function to simulate having the full content
  // In a real implementation, you would fetch this from your API
  const getFullContent = (newsId) => {
    // Hardcoded full content for demonstration
    const fullContentMap = {
      1: {
        fullText:
          "In 2017, the Supreme Court of Canada had the chance to change the landscape of Canadian trade through a decision around a man and his carload of booze. Now, those cross-province trade barriers are getting another look.\n\nThe 'Free the Beer' case started when Gerard Comeau was fined for bringing beer across provincial lines from Quebec to New Brunswick. This case challenged provincial trade barriers that have existed since Confederation. While the Supreme Court ultimately ruled against Comeau, the case sparked a national conversation about interprovincial trade barriers in Canada.\n\nExperts suggest that removing these barriers could add billions to Canada's economy. Recent discussions among provincial leaders have shown renewed interest in addressing these trade issues, potentially opening the door for more free trade between provinces.",
        author: "John Smith",
        url: "https://www.cbc.ca/radio/sunday/provincial-trade-tariffs-1.7470230",
      },
      8: {
        fullText:
          'The Federal Government has received the first batch of 2,000 tractors and 9,027 other farming equipment from Belarus as part of its efforts to accelerate food production in the country.\n\nThe Special Assistant to the President on Social Media, Dada Olusegun, announced this on his X handle on Sunday. According to Olusegun, the equipment is part of a diplomatic collaboration between Nigeria and Belarus to boost agricultural production and achieve food security in Nigeria.\n\n"The first batch of 2,000 tractors and 9,027 farming equipment have arrived in Nigeria from Belarus. This marks a significant milestone in our journey toward food security and agricultural transformation," he stated.\n\nThe equipment is expected to be distributed to farmers across various states to mechanize farming operations and increase productivity.',
        author: "Punch Reporter",
        url: "https://punchng.com/video-fg-receives-first-batch-of-farming-equipment-from-belarus/",
      },
      10: {
        fullText:
          "Animal waste has emerged as a valuable green energy source with significant potential for both economic and environmental benefits. Biogas produced from livestock manure can be converted into electricity, heat, and even vehicle fuel, offering farmers a sustainable revenue stream while reducing methane emissions.\n\nIndia, with its large livestock population, has tremendous potential to harness this resource. Estimates suggest that the country could produce over 18,000 million cubic meters of biogas annually from animal waste, which could replace around 20 million LPG cylinders.\n\nBeyond energy production, the process creates nutrient-rich bio-slurry that can be used as organic fertilizer, further enhancing soil health and promoting sustainable agricultural practices. Several states have already launched initiatives to promote biogas plants, with subsidies available for installation.",
        author: "Dr. Ramesh Kumar",
        url: "https://www.thehindubusinessline.com/opinion/wealth-in-animal-waste/article69295512.ece",
      },
      16: {
        fullText:
          "Government support and financial incentives are driving solar energy adoption in agriculture, promoting sustainability and energy security for farmers worldwide.\n\nPolicy initiatives such as subsidies, tax incentives, and net metering arrangements have been crucial in making solar technology accessible to farming communities. India's PM-KUSUM scheme, which aims to install 30.8 GW of solar capacity through solar water pumps and grid-connected installations, has been particularly effective.\n\nThe adoption of solar energy in agriculture offers multiple benefits: reduced electricity costs, reliable power supply in remote areas, decreased carbon emissions, and potential additional income from selling excess electricity back to the grid.\n\nEffective policies also address barriers to adoption by providing accessible financing options, technical assistance, and infrastructure support. As technology costs continue to decrease and efficiency improves, policy frameworks that evolve to support innovation will be essential for widespread adoption of solar solutions in the agricultural sector.",
        author: "Sunil Jain",
        url: "https://www.thehindubusinessline.com/economy/agri-business/the-role-of-government-policies-in-promoting-solar-adoption-among-farmers/article69248573.ece",
      },
      17: {
        fullText:
          "Women-led cooperatives in the Eastern Himalayan Region are empowering women in agriculture, addressing societal biases, and driving economic development.\n\nThese cooperatives are transforming traditional agricultural practices while challenging gender norms in rural communities. They provide women farmers with access to resources, markets, and decision-making power that was historically limited.\n\nThe Women Farmers' Producers' Organization (WFPO) in Sikkim has been particularly successful, bringing together over 250 women farmers to cultivate and market organic produce. Members report increased incomes, enhanced skills, and greater household decision-making authority.\n\nBeyond economic benefits, these cooperatives foster community resilience through knowledge sharing, sustainable farming practices, and collective bargaining power. Government initiatives supporting women's participation in agriculture, such as the Mahila Kisan Sashaktikaran Pariyojana, have been instrumental in providing training, resources, and financial support.\n\nAs these models continue to evolve, they offer valuable insights for similar initiatives worldwide, demonstrating how well-structured agricultural cooperatives can empower women and strengthen rural economies.",
        author: "Priya Sharma",
        url: "https://www.thehindubusinessline.com/economy/agri-business/women-led-farming-cooperatives-empowering-communities-through-agriculture/article69304078.ece",
      },
    };

    return (
      fullContentMap[newsId] || {
        fullText: "Detailed content not available",
        author: "Unknown",
        url: "#",
      }
    );
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const fullContent = getFullContent(news.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-lg shadow-sm p-4 mb-8"
    >
      <div className="mb-4">
        <button
          onClick={onBack}
          className="flex items-center text-green-500 hover:text-green-600 font-medium text-sm"
        >
          <FaArrowLeft className="mr-1" size={14} />
          Back to News
        </button>
      </div>

      <div className="mb-4">
        <h1 className="text-2xl font-bold mb-2">{news.title}</h1>
        <div className="flex items-center text-gray-500 text-sm mb-4">
          <span className="flex items-center mr-4">
            <FaNewspaper className="mr-1" />
            {news.source}
          </span>
          <span className="flex items-center mr-4">
            <FaCalendarAlt className="mr-1" />
            {formatDate(news.published)}
          </span>
          {fullContent.author && (
            <span className="flex items-center">By: {fullContent.author}</span>
          )}
        </div>
      </div>

      <div className="prose max-w-none">
        {fullContent.fullText.split("\n\n").map((paragraph, index) => (
          <p key={index} className="mb-4">
            {paragraph}
          </p>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <a
          href={fullContent.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-blue-500 hover:text-blue-600"
        >
          Read original article
          <FaExternalLinkAlt className="ml-1" size={12} />
        </a>
      </div>
    </motion.div>
  );
};

export default NewsDetailComponent;
