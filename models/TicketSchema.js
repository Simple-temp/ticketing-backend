const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema(
  {
    Sn: Number,
    clientType: String,
    clientName: String,
    issue: String,

    // Complaint Date & Time
    complainDate: {
      type: Date,
      default: Date.now, // current date when ticket is created
    },
    complainTime: String,

    // Solved Date & Time
    solvedDate: {
      type: Date,
    },
    solvedTime: String,

    sTime: String,
    engName: String,
    engNameAnother: String,

    remarks: [
      {
        text: String,
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    closed: String,
    pending: String,

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true, // 👈 adds createdAt & updatedAt automatically
  }
);

module.exports = mongoose.model("Ticket", TicketSchema);
