const farmerSchema = new Schema({
  uid: String, // Firebase Auth UID
  //email: String,
  name: String,
  age: Number,
  district: String,
  state: String,
  lands: [
    {
      type: Schema.Types.ObjectId,
      ref: "Land",
    },
  ],
});

module.exports = mongoose.model("Farmer", farmerSchema);
