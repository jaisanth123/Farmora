import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext'; // Import useAuth to access currentUser
import { useNavigate } from 'react-router-dom'; // Import useNavigate instead of useHistory

function CropRecommendationForm() {
  const { currentUser } = useAuth(); // Get the current user from AuthContext
  const [formData, setFormData] = useState({
    N: 0,
    P: 0,
    K: 0,
    temperature: 0,
    humidity: 0,
    rainfall: 0,
  });
  const [recommendations, setRecommendations] = useState([]);
  const navigate = useNavigate(); // Use useNavigate instead of useHistory

  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) {
        navigate('/login'); // Redirect to login page if no user is signed in
        return;
      }

      const token = await currentUser.getIdToken(); // Get Firebase ID token

      try {
        const response = await fetch(`http://localhost:5000/api/farmer/data/${currentUser.uid}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        // Populate formData with user data
        setFormData({
          N: data.landInfo.soilProperties.nitrogen,
          P: data.landInfo.soilProperties.phosphorous,
          K: data.landInfo.soilProperties.potassium,
          temperature: data.environmentalConditions.temperature,
          humidity: data.environmentalConditions.humidity,
          rainfall: data.environmentalConditions.rainfall,
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [currentUser, navigate]); // Add currentUser and navigate to the dependency array

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = await currentUser.getIdToken(); // Get Firebase ID token

    try {
      const response = await fetch(`http://localhost:5000/api/farmer/data/${currentUser.uid}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          soilProperties: {
            nitrogen: formData.N,
            phosphorous: formData.P,
            potassium: formData.K,
          },
          environmentalConditions: {
            temperature: formData.temperature,
            humidity: formData.humidity,
            rainfall: formData.rainfall,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update user data');
      }

      console.log('User data updated successfully');
      // Optionally, show a success message or redirect
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  const handleRecommendationSubmit = async (e) => {
    e.preventDefault();

    const user = currentUser;
    if (!user) {
      navigate('/login'); // Redirect if the user is not authenticated
      return;
    }

    const token = await user.getIdToken();

    try {
      const response = await fetch('http://127.0.0.1:8000/api/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setRecommendations(data.recommendations || []);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };

  if (!currentUser) {
    return <div className="text-center">Loading user data...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold text-center mb-6">Crop Recommendation Form</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nitrogen */}
        <div>
          <label htmlFor="N" className="block text-sm font-medium text-gray-700">N (Nitrogen)</label>
          <input
            type="number"
            id="N"
            name="N"
            value={formData.N}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        {/* Phosphorus */}
        <div>
          <label htmlFor="P" className="block text-sm font-medium text-gray-700">P (Phosphorus)</label>
          <input
            type="number"
            id="P"
            name="P"
            value={formData.P}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        {/* Potassium */}
        <div>
          <label htmlFor="K" className="block text-sm font-medium text-gray-700">K (Potassium)</label>
          <input
            type="number"
            id="K"
            name="K"
            value={formData.K}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        {/* Temperature */}
        <div>
          <label htmlFor="temperature" className="block text-sm font-medium text-gray-700">Temperature (°C)</label>
          <input
            type="number"
            id="temperature"
            name="temperature"
            value={formData.temperature}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        {/* Humidity */}
        <div>
          <label htmlFor="humidity" className="block text-sm font-medium text-gray-700">Humidity (%)</label>
          <input
            type="number"
            id="humidity"
            name="humidity"
            value={formData.humidity}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        {/* Rainfall */}
        <div>
          <label htmlFor="rainfall" className="block text-sm font-medium text-gray-700">Rainfall (mm)</label>
          <input
            type="number"
            id="rainfall"
            name="rainfall"
            value={formData.rainfall}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        {/* Submit button */}
        <div className="text-center">
          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
          >
            Update Crop Recommendations
          </button>
        </div>
      </form>

      <form onSubmit={handleRecommendationSubmit} className="mt-8 space-y-6">
        {/* Submit button */}
        <div className="text-center">
          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
          >
            Get Crop Recommendations
          </button>
        </div>
      </form>

      {recommendations.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-medium">Recommended Crops:</h2>
          <ul className="list-disc pl-5 space-y-2">
            {recommendations.map((crop, index) => (
              <li key={index} className="text-lg">{crop.crop} - {crop.probability * 100}%</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default CropRecommendationForm;