const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");



dotenv.config();
const app = express();
connectDB(); // connect to MongoDB

app.use(cors());
app.use(express.json());


// Routes
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/ticket", require("./routes/ticketRoutes"));

app.use("/",(req, res)=>{
  res.send("it's work")
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
