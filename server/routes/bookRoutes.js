
const express = require("express");
const { getMyBooks } = require("../controllers/bookController");
const { protect, allowRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/my-books", protect, allowRoles("author"), getMyBooks);

module.exports = router;
