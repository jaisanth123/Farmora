import axios from 'axios';

export const getLocationDataUtil = async (landInfo, setLandInfo, setMessage, setIsLoading) => {
  try {
    setIsLoading(true);
    setMessage("Fetching location and weather data...");
    const placeQuery = `${landInfo.district}, ${landInfo.state}, India`;
    const coordResponse = await axios.get(`http://localhost:8000/api/coordinates?place=${encodeURIComponent(placeQuery)}`);
    if (coordResponse.data.error) throw new Error(coordResponse.data.error);
    const { latitude, longitude } = coordResponse.data;
    const weatherResponse = await axios.get(`http://localhost:8000/api/environmental_conditions?latitude=${latitude}&longitude=${longitude}`);
    if (weatherResponse.data.error) throw new Error(weatherResponse.data.error);
    setLandInfo(prev => ({
      ...prev,
      location: { type: 'Point', coordinates: [parseFloat(longitude), parseFloat(latitude)] },
      environmentalConditions: {
        temperature: weatherResponse.data.temperature || '',
        humidity: weatherResponse.data.humidity || '',
        rainfall: weatherResponse.data.rainfall || ''
      }
    }));
    setMessage("Location and weather data updated successfully!");
  } catch (error) {
    console.error("Error fetching location and weather data:", error);
    setMessage(error.message || "Failed to fetch location and weather data. Please try again.");
  } finally {
    setIsLoading(false);
  }
};