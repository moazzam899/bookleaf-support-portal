
const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    book_id: { type: String, required: true, unique: true },
    author_id: { type: String, required: true, index: true },
    title: { type: String, required: true },
    isbn: { type: String, default: null },
    genre: { type: String, default: "" },
    publication_date: { type: Date, default: null },
    status: { type: String, required: true },
    mrp: { type: Number, default: null },
    total_copies_sold: { type: Number, default: 0 },
    total_royalty_earned: { type: Number, default: 0 },
    royalty_paid: { type: Number, default: 0 },
    royalty_pending: { type: Number, default: 0 },
    last_royalty_payout_date: { type: Date, default: null },
    print_partner: { type: String, default: "" },
    available_on: { type: [String], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Book", bookSchema);
