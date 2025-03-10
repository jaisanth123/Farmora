import React from 'react';

const Step2LandInfo = ({ landInfo, setLandInfo, setStep }) => {
  const handleLandInfoChange = (e) => {
    const { name, value } = e.target;
    setLandInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleCropChange = (index, value) => {
    const updatedCrops = [...landInfo.crops];
    updatedCrops[index] = value;
    setLandInfo({ ...landInfo, crops: updatedCrops });
  };

  const addCropField = () => setLandInfo({ ...landInfo, crops: [...landInfo.crops, ''] });
  const removeCropField = (index) => {
    const updatedCrops = [...landInfo.crops];
    updatedCrops.splice(index, 1);
    setLandInfo({ ...landInfo, crops: updatedCrops });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Land Information</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="landDistrict" className="block text-sm font-medium text-gray-700">District</label>
          <input type="text" id="landDistrict" name="district" value={landInfo.district} onChange={handleLandInfoChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" />
        </div>
        <div>
          <label htmlFor="landState" className="block text-sm font-medium text-gray-700">State</label>
          <input type="text" id="landState" name="state" value={landInfo.state} onChange={handleLandInfoChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Crops</label>
          {landInfo.crops.map((crop, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input type="text" value={crop} onChange={(e) => handleCropChange(index, e.target.value)} placeholder="Enter crop name" className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" />
              {index > 0 && <button type="button" onClick={() => removeCropField(index)} className="px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 rounded-md border border-red-300 hover:border-red-400">Remove</button>}
            </div>
          ))}
          <button type="button" onClick={addCropField} className="mt-2 inline-flex items-center px-3 py-2 border border-green-300 text-sm font-medium rounded-md text-green-600 hover:text-green-700 hover:border-green-400">
            <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Crop
          </button>
        </div>
      </div>
      <div className="flex justify-between mt-8">
        <button type="button" onClick={() => setStep(1)} className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">Previous</button>
        <button type="button" onClick={() => setStep(3)} className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">Next</button>
      </div>
    </div>
  );
};

export default Step2LandInfo;