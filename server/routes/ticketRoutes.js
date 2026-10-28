
const express = require("express");
const upload = require("../middleware/uploadMiddleware");

const {
  createTicket,
  getMyTickets,
  getAllTickets,
  updateTicket,
  downloadTicketAttachment,
} = require("../controllers/ticketController");

const { protect, allowRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/",
  protect,
  allowRoles("author"),
  upload.single("attachment"),
  createTicket
);

router.get(
  "/my-tickets",
  protect,
  allowRoles("author"),
  getMyTickets
);

router.get(
  "/",
  protect,
  allowRoles("admin"),
  getAllTickets
);

router.get(
  "/:ticketId/attachment",
  protect,
  allowRoles("author", "admin"),
  downloadTicketAttachment
);

router.patch(
  "/:ticketId",
  protect,
  allowRoles("admin"),
  updateTicket
);

module.exports = router;
