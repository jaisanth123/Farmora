import Farmer from '../models/farmer.js'; // Ensure this import is correct

// Get farmer data by userId
export const getFarmerData = async (req, res) => {
  const userId = req.params.userId;
  console.log(userId)
  try {
    console.log("farmer")
    const farmer = await Farmer.findOne({ userId: userId });
    if (!farmer) {
      return res.status(404).json({ message: 'Farmer not found' });
    }
    res.status(200).json(farmer);
  } catch (error) {
    console.error('Error fetching farmer data:', error);
    res.status(500).json({ message: 'Server error' });
  }
};