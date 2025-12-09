const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema({
  Sn: Number,
  clientType: String,
  clientName: String,
  issue: String,

  complainDate: String,
  complainTime: String,
  solvedTime: String,
  solvedDate: String,

  sTime: String,
  engName: String,
  engNameAnother: String,

  // change remarks to array of objects
  remarks: [
    {
      text: String,          // the remark text
      user: {                // who added it
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      timestamp: {           // when added
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
});

module.exports = mongoose.model("Ticket", TicketSchema);
