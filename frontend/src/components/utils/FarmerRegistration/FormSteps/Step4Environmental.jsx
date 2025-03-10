import React from 'react';

const Step4Environmental = ({ landInfo, setLandInfo, setStep, getLocationData }) => {
  const handleLandInfoChange = (e) => {
    const { name, value } = e.target;
    const [parent, child] = name.split('.');
    setLandInfo(prev => ({ ...prev, [parent]: { ...prev[parent], [child]: value } }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Environmental Conditions</h2>
      <button type="button" onClick={getLocationData} disabled={!landInfo.district || !landInfo.state} className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50">Get Location & Climate Data</button>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="longitude" className="block text-sm font-medium text-gray-700">Longitude</label>
          <input type="number" id="longitude" value={landInfo.location.coordinates[0]} readOnly className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm" />
        </div>
        <div>
          <label htmlFor="latitude" className="block text-sm font-medium text-gray-700">Latitude</label>
          <input type="number" id="latitude" value={landInfo.location.coordinates[1]} readOnly className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm" />
        </div>
        <div>
          <label htmlFor="temperature" className="block text-sm font-medium text-gray-700">Temperature (°C)</label>
          <input type="number" id="temperature" name="environmentalConditions.temperature" value={landInfo.environmentalConditions.temperature} onChange={handleLandInfoChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" />
        </div>
        <div>
          <label htmlFor="humidity" className="block text-sm font-medium text-gray-700">Humidity (%)</label>
          <input type="number" id="humidity" name="environmentalConditions.humidity" value={landInfo.environmentalConditions.humidity} onChange={handleLandInfoChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" />
        </div>
        <div className="col-span-2">
          <label htmlFor="rainfall" className="block text-sm font-medium text-gray-700">Annual Rainfall (mm)</label>
          <input type="number" id="rainfall" name="environmentalConditions.rainfall" value={landInfo.environmentalConditions.rainfall} onChange={handleLandInfoChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" />
        </div>
      </div>
      <div className="flex justify-between mt-8">
        <button type="button" onClick={() => setStep(3)} className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">Previous</button>
        <button type="submit" className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">Submit</button>
      </div>
    </div>
  );
};

export default Step4Environmental;