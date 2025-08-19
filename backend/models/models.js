const mongoose = require("mongoose");

const credentialsSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const Credentials = mongoose.model("Credentials", credentialsSchema);
module.exports = Credentials;
