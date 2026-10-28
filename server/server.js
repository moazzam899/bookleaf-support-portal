
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const { protect, allowRoles } = require("./middleware/authMiddleware");

const bookRoutes = require("./routes/bookRoutes");

const ticketRoutes = require("./routes/ticketRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/books", bookRoutes);

app.use("/api/tickets", ticketRoutes);

app.get("/", (req, res) => {
  res.json({ message: "BookLeaf backend is running!" });
});

app.get(
  "/api/admin/test",
  protect,
  allowRoles("admin"),
  (req, res) => {
    res.json({
      message: "Admin access granted!",
      user: req.user,
    });
  }
);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
