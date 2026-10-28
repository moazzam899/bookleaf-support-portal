
const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    ticket_id: {
      type: String,
      unique: true,
    },
    author_id: {
      type: String,
      required: true,
      index: true,
    },
    book_id: {
      type: String,
      default: null,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: [
        "Royalty & Payments",
        "ISBN & Metadata Issues",
        "Printing & Quality",
        "Distribution & Availability",
        "Book Status & Production Updates",
        "General Inquiry",
      ],
      default: "General Inquiry",
    },
    priority: {
      type: String,
      enum: ["Critical", "High", "Medium", "Low"],
      default: "Medium",
    },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Resolved", "Closed"],
      default: "Open",
    },

    suggestedReply: {
      type: String,
      default: "",
    },

    adminResponse: {
      type: String,
      default: "",
    },
    internalNotes: {
      type: String,
      default: "",
    },
    assignedTo: {
      type: String,
      default: "",
    },

    attachment: {
    filename: {
      type: String,
      default: "",
    },
    originalName: {
      type: String,
      default: "",
    },
    mimeType: {
      type: String,
      default: "",
    },
    size: {
      type: Number,
      default: 0,
    },
    },
   },
  { timestamps: true }
);

module.exports = mongoose.model("Ticket", ticketSchema);
