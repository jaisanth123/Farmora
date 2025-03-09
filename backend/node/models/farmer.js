import mongoose from 'mongoose';
const farmerSchema = new mongoose.Schema({
  userId: { type: String, required: true },

  personalInfo: {  
    name: { type: String, required: true },
    age: { type: Number, required: true },
    state: { type: String, required: true },
    district: { type: String, required: true }
  },

  landInfo: {  
    district: { type: String, required: true },
    state: { type: String, required: true },
    crops: [String],
    location: {
      type: { type: String, enum: ['Point'], required: true },
      coordinates: { type: [Number], required: true }
    },
    soilProperties: {
      soilColor: String,
      nitrogen: Number,
      phosphorous: Number,
      potassium: Number,
      pH: Number
    },
    environmentalConditions: {
      temperature: Number,
      humidity: Number,
      rainfall: Number
    },
  
  createdAt: { type: Date, default: Date.now }
  }
});

// Index for geospatial queries
farmerSchema.index({ "landInfo.location": "2dsphere" });

export default mongoose.model('Farmer', farmerSchema);
