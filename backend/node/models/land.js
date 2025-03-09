    const landSchema = new Schema({
    ownerId: String, // Firebase Auth UID
    crops: [String],
    soilColor: String,
    district: String,
    state: String,
    location: {
        type: { type: String },
        coordinates: [Number], // [longitude, latitude]
    },
    soilProperties: {
        nitrogen: Number,
        phosphorous: Number,
        potassium: Number,
    },
    environmentalConditions: {
        humidity: Number,
        rainfall: Number,
    },
    });

    module.exports = mongoose.model("Land", landSchema);
