import React from 'react';

const Step1PersonalInfo = ({ farmerInfo, setFarmerInfo, setStep }) => {
  const handleFarmerInfoChange = (e) => {
    const { name, value } = e.target;
    setFarmerInfo(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Personal Information</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
          <input type="text" id="name" name="name" value={farmerInfo.name} onChange={handleFarmerInfoChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" />
        </div>
        <div>
          <label htmlFor="age" className="block text-sm font-medium text-gray-700">Age</label>
          <input type="number" id="age" name="age" value={farmerInfo.age} onChange={handleFarmerInfoChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" />
        </div>
        <div>
          <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
          <input type="text" id="state" name="state" value={farmerInfo.state} onChange={handleFarmerInfoChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" />
        </div>
        <div>
          <label htmlFor="district" className="block text-sm font-medium text-gray-700">District</label>
          <input type="text" id="district" name="district" value={farmerInfo.district} onChange={handleFarmerInfoChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500" />
        </div>
      </div>
      <button type="button" onClick={() => setStep(2)} disabled={!farmerInfo.name || !farmerInfo.age || !farmerInfo.district || !farmerInfo.state} className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50">Next</button>
    </div>
  );
};

export default Step1PersonalInfo;