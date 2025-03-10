import React from "react";
import { DISTRICT_SOIL_MAP } from "../data/SoilData";

const Step3SoilProperties = ({
  landInfo,
  setLandInfo,
  setStep,
  reportUploadOption,
  setReportUploadOption,
  soilReport,
  setSoilReport,
  processSoilReport,
  getNPKValues,
}) => {
  // Handle changes to nested soilProperties fields
  const handleLandInfoChange = (e) => {
    const { name, value } = e.target;
    const [parent, child] = name.split(".");
    console.log("----------------parent:", parent);
    console.log("----------------chile:", child);
    console.log(`Updating ${parent}.${child} to ${value}`); // Debug log

    // Map input field names to the expected keys from DISTRICT_SOIL_MAP
    const keyMap = {
      nitrogen: "N",
      phosphorous: "P",
      potassium: "K",
      pH: "pH",
      soilColor: "soilColor",
    };

    const mappedChild = keyMap[child] || child;

    setLandInfo((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [mappedChild]: value,
      },
    }));
  };

  // Handle file upload for soil report
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    console.log("File uploaded:", file); // Debug log
    setSoilReport(file);
  };

  // Ensure props are received correctly
  console.log("Step3 Props:", {
    landInfo,
    reportUploadOption,
    soilReport,
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Soil Properties</h2>
      <div className="bg-gray-50 p-4 rounded-lg space-y-4">
        {/* Radio buttons for input method */}
        <div className="space-x-6">
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="reportUploadOption"
              value="manual"
              checked={reportUploadOption === "manual"}
              onChange={() => {
                console.log("Switched to manual"); // Debug log
                setReportUploadOption("manual");
              }}
              className="form-radio h-4 w-4 text-green-600"
            />
            <span className="ml-2 text-sm text-gray-700">
              Enter soil details manually
            </span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="reportUploadOption"
              value="upload"
              checked={reportUploadOption === "upload"}
              onChange={() => {
                console.log("Switched to upload"); // Debug log
                setReportUploadOption("upload");
              }}
              className="form-radio h-4 w-4 text-green-600"
            />
            <span className="ml-2 text-sm text-gray-700">
              Upload soil report
            </span>
          </label>
        </div>

        {/* Conditional rendering based on reportUploadOption */}
        {reportUploadOption === "manual" ? (
          <div className="space-y-4">
            <div>
              <label
                htmlFor="soilColor"
                className="block text-sm font-medium text-gray-700"
              >
                Soil Color
              </label>
              <select
                id="soilColor"
                name="soilProperties.soilColor"
                value={landInfo.soilProperties.soilColor || ""} // Use soilColor directly
                onChange={handleLandInfoChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              >
                <option value="">Select Soil Color</option>
                {Object.keys(DISTRICT_SOIL_MAP.soil_color_map).map((color) => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={() => {
                console.log("Fetching NPK values"); // Debug log
                getNPKValues();
              }}
              disabled={
                !landInfo.district || !landInfo.soilProperties.soilColor
              }
              className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              Get NPK Values
            </button>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="nitrogen"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nitrogen (N)
                </label>
                <input
                  type="number"
                  id="nitrogen"
                  name="soilProperties.nitrogen"
                  value={
                    landInfo.soilProperties.N ||
                    landInfo.soilProperties.nitrogen ||
                    ""
                  } // Fallback to N or nitrogen
                  onChange={handleLandInfoChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
              </div>
              <div>
                <label
                  htmlFor="phosphorous"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phosphorous (P)
                </label>
                <input
                  type="number"
                  id="phosphorous"
                  name="soilProperties.phosphorous"
                  value={
                    landInfo.soilProperties.P ||
                    landInfo.soilProperties.phosphorous ||
                    ""
                  } // Fallback to P or phosphorous
                  onChange={handleLandInfoChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
              </div>
              <div>
                <label
                  htmlFor="potassium"
                  className="block text-sm font-medium text-gray-700"
                >
                  Potassium (K)
                </label>
                <input
                  type="number"
                  id="potassium"
                  name="soilProperties.potassium"
                  value={
                    landInfo.soilProperties.K ||
                    landInfo.soilProperties.potassium ||
                    ""
                  } // Fallback to K or potassium
                  onChange={handleLandInfoChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
              </div>
              <div>
                <label
                  htmlFor="pH"
                  className="block text-sm font-medium text-gray-700"
                >
                  pH Level
                </label>
                <input
                  type="number"
                  id="pH"
                  name="soilProperties.pH"
                  value={landInfo.soilProperties.pH || ""} // Use pH directly
                  onChange={handleLandInfoChange}
                  step="0.1"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <div className="text-center">
                <input
                  type="file"
                  id="soilReport"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label
                  htmlFor="soilReport"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <svg
                    className="h-12 w-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <span className="mt-2 text-sm text-gray-600">
                    Upload Soil Report
                  </span>
                  <span className="mt-1 text-xs text-gray-500">
                    PDF, JPG, JPEG, or PNG
                  </span>
                </label>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                console.log("Processing soil report"); // Debug log
                processSoilReport();
              }}
              disabled={!soilReport}
              className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              Process Report
            </button>
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between mt-8">
        <button
          type="button"
          onClick={() => setStep(2)}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={() => setStep(4)}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Step3SoilProperties;
