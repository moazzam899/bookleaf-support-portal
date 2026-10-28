
const Ticket = require("../models/Ticket");
const path = require("path");

const { classifyTicket } = require("../services/aiService");

const createTicket = async (req, res) => {
  try {
    const { book_id, subject, description } = req.body;

    const attachment = req.file
  ? {
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
    }
  : undefined;

    if (!subject || !description) {
      return res.status(400).json({
        message: "Subject and description are required",
      });
    }


let aiResult = {
  category: "General Inquiry",
  priority: "Medium",
  suggestedReply:
    "Thank you for contacting BookLeaf. Our support team will review your query and get back to you.",
};

try {
  aiResult = await classifyTicket({
    subject: subject.trim(),
    description: description.trim(),
  });
} catch (error) {
  console.error("AI classification failed:", error.message);
}


   
const ticket = await Ticket.create({
  ticket_id: `TKT-${Date.now()}`,
  author_id: req.user.author_id,
  book_id: book_id || null,
  subject: subject.trim(),
  description: description.trim(),
  attachment,
  category: aiResult.category,
  priority: aiResult.priority,
  suggestedReply: aiResult.suggestedReply,
});

    return res.status(201).json({
      message: "Support ticket created successfully",
      ticket: {
        ticket_id: ticket.ticket_id,
        subject: ticket.subject,
        description: ticket.description,
        category: ticket.category,
        priority: ticket.priority,
        suggestedReply: ticket.suggestedReply,
        status: ticket.status,
        createdAt: ticket.createdAt,
      },
    });
  } catch (error) {
    console.error("Create ticket error:", error.message);

    return res.status(500).json({
      message: "Failed to create support ticket",
    });
  }
};


const getMyTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({
      author_id: req.user.author_id,
    })
      .select("+internalNotes")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: tickets.length,
      tickets,
    });
  } catch (error) {
    console.error("Get tickets error:", error.message);

    return res.status(500).json({
      message: "Failed to fetch support tickets",
    });
  }
};




const getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find()
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: tickets.length,
      tickets,
    });
  } catch (error) {
    console.error("Get all tickets error:", error.message);

    return res.status(500).json({
      message: "Failed to fetch tickets",
    });
  }
};



const updateTicket = async (req, res) => {
  try {
    const { status, priority, adminResponse, assignedTo, internalNotes } =
      req.body;

    const ticket = await Ticket.findOne({
      ticket_id: req.params.ticketId,
    });

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }

    if (status !== undefined) ticket.status = status;
    if (priority !== undefined) ticket.priority = priority;
    if (adminResponse !== undefined) ticket.adminResponse = adminResponse;
    if (assignedTo !== undefined) ticket.assignedTo = assignedTo;
    if (internalNotes !== undefined) ticket.internalNotes = internalNotes;

    await ticket.save();

    return res.status(200).json({
      message: "Ticket updated successfully",
      ticket: {
        ticket_id: ticket.ticket_id,
        status: ticket.status,
        priority: ticket.priority,
        adminResponse: ticket.adminResponse,
        assignedTo: ticket.assignedTo,
        updatedAt: ticket.updatedAt,
      },
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: error.message,
      });
    }

    console.error("Update ticket error:", error.message);
    return res.status(500).json({
      message: "Failed to update ticket",
    });
  }
};



const downloadTicketAttachment = async (req, res) => {
  try {
    const ticket = await Ticket.findOne({
      ticket_id: req.params.ticketId,
    });

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }

    // Authors can access attachments only on their own tickets.
    if (
      req.user.role === "author" &&
      ticket.author_id !== req.user.author_id
    ) {
      return res.status(403).json({
        message: "You are not allowed to access this attachment",
      });
    }

    if (!ticket.attachment?.filename) {
      return res.status(404).json({
        message: "No attachment found for this ticket",
      });
    }

    const filename = path.basename(ticket.attachment.filename);
    const filePath = path.join(
      __dirname,
      "..",
      "uploads",
      "tickets",
      filename
    );

    return res.download(
      filePath,
      ticket.attachment.originalName || filename,
      (error) => {
        if (error && !res.headersSent) {
          console.error("Attachment download error:", error.message);
          res.status(404).json({
            message: "Attachment file could not be found",
          });
        }
      }
    );
  } catch (error) {
    console.error("Download attachment error:", error.message);

    if (!res.headersSent) {
      return res.status(500).json({
        message: "Failed to download attachment",
      });
    }
  }
};



module.exports = {
  createTicket,
  getMyTickets,
  getAllTickets,
  updateTicket,
  downloadTicketAttachment,

};