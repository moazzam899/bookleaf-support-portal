
const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema(
  {
    author_id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, default: "" },
    city: { type: String, default: "" },
    joined_date: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Author", authorSchema);
