const express = require("express");
const Ticket = require("../models/TicketSchema");
const auth = require("../middleware/auth");

const router = express.Router();

// CREATE Ticket
router.post("/create", auth, async (req, res) => {
  const last = await Ticket.findOne().sort({ Sn: -1 });
  const nextSn = last ? last.Sn + 1 : 1;

  const ticket = await Ticket.create({
    Sn: nextSn,
    ...req.body,
    createdBy: req.user.id,
  });

  res.json(ticket);
});


// GET all
router.get("/all", async (req, res) => {
  const tickets = await Ticket.find();
  res.json(tickets);
});

// GET by user
router.get("/my", auth, async (req, res) => {
  const tickets = await Ticket.find({ createdBy: req.user.id });
  res.json(tickets);
});

// Add remark to a ticket


// router.put("/:id/update", auth, async (req, res) => {
//   try {
//     const { text, status } = req.body;
//     if (!text)
//       return res.status(400).json({ message: "Remark text is required" });

//     const ticket = await Ticket.findById(req.params.id);
//     if (!ticket)
//       return res.status(404).json({ message: "Ticket not found" });

//     // --- Bangladesh Date & Time ---
//     const nowBD = new Date(
//       new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" })
//     );

//     const solvedTime = nowBD.toTimeString().slice(0, 5);

//     // 🔹 Add remark
//     ticket.remarks.unshift({
//       text,
//       user: req.user.id,
//       timestamp: nowBD,
//       status: status || "Open",
//     });

//     // 🔹 ADD engineer name EVERY TIME (duplicates allowed)
//     ticket.engNameAnother.push({
//       name: req.user.name,
//     });

//     // 🔹 Status logic
//     if (status === "Closed") {
//       ticket.closed = "Yes";
//       ticket.pending = "";
//       ticket.solvedDate = nowBD;
//       ticket.solvedTime = solvedTime;
//     } else if (status === "Pending") {
//       ticket.pending = "Pending";
//       ticket.closed = "";
//     } else {
//       ticket.closed = "";
//       ticket.pending = "";
//     }

//     await ticket.save();

//     const updatedTicket = await Ticket.findById(req.params.id)
//       .populate("remarks.user", "name");

//     res.json(updatedTicket);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: err.message });
//   }
// });

router.put("/:id/update", auth, async (req, res) => {
  try {
    const { text, status } = req.body;
    if (!text) {
      return res.status(400).json({ message: "Remark text is required" });
    }

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // 🇧🇩 Bangladesh Date & Time
    const nowBD = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" })
    );

    const solvedTime = nowBD.toTimeString().slice(0, 5);

    // 🔹 Add remark
    ticket.remarks.unshift({
      text,
      user: req.user.id,
      timestamp: nowBD,
    });

    // 🔹 UPDATE engNameAnother (ALLOW DUPLICATES)
    ticket.engNameAnother.push({
      name: req.user.name,
    });

    // 🔹 Status handling
    if (status === "Closed") {
      ticket.closed = "Yes";
      ticket.pending = "";
      ticket.solvedDate = nowBD;
      ticket.solvedTime = solvedTime;
    } else if (status === "Pending") {
      ticket.pending = "Pending";
      ticket.closed = "";
    } else {
      ticket.closed = "";
      ticket.pending = "";
    }

    await ticket.save();

    const updatedTicket = await Ticket.findById(req.params.id)
      .populate("remarks.user", "name");

    res.json(updatedTicket);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});



// DELETE
router.delete("/:id", auth, async (req, res) => {
  await Ticket.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});


// Get ticket by ID
router.get("/:id", auth, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate("remarks.user", "name"); // populate remark user
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
