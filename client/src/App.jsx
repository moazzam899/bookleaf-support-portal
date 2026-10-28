
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("Logging in...");

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      console.log("Logged-in user:", data.user); //temporary 

      setMessage("Login successful!");
      window.location.reload();
    } catch (error) {
      setMessage(error.message || "Unable to connect to server");
    }
  };


  const [books, setBooks] = useState([]);
const [booksMessage, setBooksMessage] = useState("");

const [tickets, setTickets] = useState([]);
const [ticketsMessage, setTicketsMessage] = useState("");


const [selectedBook, setSelectedBook] = useState("");
const [ticketSubject, setTicketSubject] = useState("");
const [ticketDescription, setTicketDescription] = useState("");
const [ticketMessage, setTicketMessage] = useState("");
const [submittingTicket, setSubmittingTicket] = useState(false);

const [adminTickets, setAdminTickets] = useState([]);
const [adminMessage, setAdminMessage] = useState("");

const [updatingTicket, setUpdatingTicket] = useState("");
const [adminActionMessage, setAdminActionMessage] = useState("");

const [statusFilter, setStatusFilter] = useState("All");
const [categoryFilter, setCategoryFilter] = useState("All");
const [priorityFilter, setPriorityFilter] = useState("All");

const [searchQuery, setSearchQuery] = useState("");

const [startDate, setStartDate] = useState("");
const [endDate, setEndDate] = useState("");

const [ticketAttachment, setTicketAttachment] = useState(null);

useEffect(() => {
  const token = localStorage.getItem("token");

  if (!token) return;

  fetch("http://localhost:5000/api/books/my-books", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(async (response) => {
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load books");
      }

      setBooks(data.books || []);
      setBooksMessage("");
    })
    .catch((error) => {
      setBooksMessage(error.message);
    });

   fetch("http://localhost:5000/api/tickets/my-tickets", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
})
  .then(async (response) => {
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to load tickets");
    }

    setTickets(data.tickets || []);
    setTicketsMessage("");
  })
  .catch((error) => {
    setTicketsMessage(error.message);
  });

const user = JSON.parse(localStorage.getItem("user") || "{}");

if (user.role === "admin") {
  const token = localStorage.getItem("token");

  fetch("http://localhost:5000/api/tickets", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(async (response) => {
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load admin tickets");
      }

      setAdminTickets(data.tickets || []);
      setAdminMessage("");
    })
    .catch((error) => setAdminMessage(error.message));
}


}, []);



const handleCreateTicket = async (e) => {
  e.preventDefault();
  setTicketMessage("");
  setSubmittingTicket(true);

  try {
    const token = localStorage.getItem("token");

    
const formData = new FormData();

formData.append("subject", ticketSubject);
formData.append("description", ticketDescription);

if (selectedBook) {
  formData.append("book_id", selectedBook);
}

if (ticketAttachment) {
  formData.append("attachment", ticketAttachment);
}

const response = await fetch("http://localhost:5000/api/tickets", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
  },
  body: formData,
});


    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to create ticket");
    }

    setTicketMessage(`Ticket created successfully! ID: ${data.ticket.ticket_id}`);
    setTicketSubject("");
    setTicketDescription("");
    setTicketAttachment(null);
    e.target.reset();
    setSelectedBook("");

    const ticketsResponse = await fetch(
      "http://localhost:5000/api/tickets/my-tickets",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const ticketsData = await ticketsResponse.json();

    if (ticketsResponse.ok) {
      setTickets(ticketsData.tickets || []);
    }
  } catch (error) {
    setTicketMessage(error.message || "Unable to create ticket");
  } finally {
    setSubmittingTicket(false);
  }
};


const handleDownloadAttachment = async (ticket) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `http://localhost:5000/api/tickets/${ticket.ticket_id}/attachment`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Failed to download attachment");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = ticket.attachment.originalName || "attachment";
    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(url);
  } catch (error) {
    alert(error.message || "Unable to download attachment");
  }
};


const handleAdminTicketUpdate = async (ticketId, updates) => {
  setUpdatingTicket(ticketId);
  setAdminActionMessage("");

  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `http://localhost:5000/api/tickets/${ticketId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update ticket");
    }

    setAdminActionMessage(`Ticket ${ticketId} updated successfully.`);

    const refreshResponse = await fetch(
      "http://localhost:5000/api/tickets",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const refreshData = await refreshResponse.json();

    if (!refreshResponse.ok) {
      throw new Error(refreshData.message || "Ticket updated, but refresh failed.");
    }

    setAdminTickets(refreshData.tickets || []);
  } catch (error) {
    setAdminActionMessage(error.message || "Unable to update ticket.");
  } finally {
    setUpdatingTicket("");
  }
};


  
return (
  <div style={{ maxWidth: "1000px", margin: "40px auto", padding: "24px" }}>
    {localStorage.getItem("token") ? (
  JSON.parse(localStorage.getItem("user") || "{}").role === "admin" ? (
    <div style={{ maxWidth: "1000px", margin: "40px auto", padding: "24px" }}>
      <div className="dashboard-header">
  <div>
    <p className="eyebrow">AUTHOR SUPPORT PORTAL</p>
    <h1>Support Dashboard</h1>
    <p className="page-subtitle">
      Welcome back, Admin. Here’s your support overview.
    </p>
  </div>

  <div className="admin-badge">
    <span className="status-dot"></span>
    Administrator
  </div>
</div>
      <p>Welcome, Admin!</p>
      <h2>Support Ticket Management</h2>

      <div className="analytics-grid">
  {[
    { label: "Total Tickets", count: adminTickets.length, color: "#2563eb" },
    {
      label: "Open",
      count: adminTickets.filter((t) => t.status === "Open").length,
      color: "#dc2626",
    },
    {
      label: "In Progress",
      count: adminTickets.filter((t) => t.status === "In Progress").length,
      color: "#d97706",
    },
    {
      label: "Resolved",
      count: adminTickets.filter((t) => t.status === "Resolved").length,
      color: "#16a34a",
    },
  ].map((item) => (
    <div
  key={item.label}
  className="analytics-card"
  style={{ "--card-accent": item.color }}
>
      <p style={{ margin: "0 0 8px", color: "#6b7280" }}>
        {item.label}
      </p>
      <h2 style={{ margin: 0, color: item.color }}>
        {item.count}
      </h2>
    </div>
  ))}
</div>
      
<p className="page-subtitle">
  Search, filter, and manage author support requests.
</p>


<div className="ticket-filters">

  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "6px",
      flex: "1",
      minWidth: "200px",
    }}
  >
    <label htmlFor="search-tickets">Search Tickets</label>
    <input
      id="search-tickets"
      type="text"
      placeholder="Search by ID, subject, or author..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      style={{
        padding: "10px",
        width: "100%",
        boxSizing: "border-box",
      }}
    />
  </div>

  <select
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
    style={{ padding: "10px", flex: "1", minWidth: "150px" }}
  >
    <option value="All">All Statuses</option>
    <option value="Open">Open</option>
    <option value="In Progress">In Progress</option>
    <option value="Resolved">Resolved</option>
    <option value="Closed">Closed</option>
  </select>

  <select
    value={categoryFilter}
    onChange={(e) => setCategoryFilter(e.target.value)}
    style={{ padding: "10px", flex: "1", minWidth: "200px" }}
  >
    <option value="All">All Categories</option>
    <option value="Royalty & Payments">Royalty & Payments</option>
    <option value="ISBN & Metadata Issues">ISBN & Metadata Issues</option>
    <option value="Printing & Quality">Printing & Quality</option>
    <option value="Distribution & Availability">Distribution & Availability</option>
    <option value="Book Status & Production Updates">Book Status & Production Updates</option>
    <option value="General Inquiry">General Inquiry</option>
  </select>

  <select
    value={priorityFilter}
    onChange={(e) => setPriorityFilter(e.target.value)}
    style={{ padding: "10px", flex: "1", minWidth: "150px" }}
  >
    <option value="All">All Priorities</option>
    <option value="Critical">Critical</option>
    <option value="High">High</option>
    <option value="Medium">Medium</option>
    <option value="Low">Low</option>
  </select>


<div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: "1", minWidth: "150px" }}>
  <label htmlFor="start-date">From Date</label>
  <input
    id="start-date"
    type="date"
    value={startDate}
    onChange={(e) => setStartDate(e.target.value)}
    style={{ padding: "10px", width: "100%", boxSizing: "border-box" }}
  />
</div>

<div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: "1", minWidth: "150px" }}>
  <label htmlFor="end-date">To Date</label>
  <input
    id="end-date"
    type="date"
    value={endDate}
    min={startDate || undefined}
    onChange={(e) => setEndDate(e.target.value)}
    style={{ padding: "10px", width: "100%", boxSizing: "border-box" }}
  />
</div>


</div>


{adminMessage && <p style={{ color: "red" }}>{adminMessage}</p>}

{adminTickets.length === 0 && !adminMessage && (
  <p>Loading tickets, ya abhi koi ticket nahi hai...</p>
)}

{adminTickets
  .filter((ticket) =>
    statusFilter === "All" || ticket.status === statusFilter
  )

  .filter((ticket) => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return true;

    return (
      ticket.ticket_id?.toLowerCase().includes(query) ||
      ticket.subject?.toLowerCase().includes(query) ||
      ticket.author_id?.toLowerCase().includes(query)
    );
  })

  .filter((ticket) =>
    categoryFilter === "All" || ticket.category === categoryFilter
  )
  .filter((ticket) =>
    priorityFilter === "All" || ticket.priority === priorityFilter
  )

  .filter((ticket) => {
  const ticketDate = new Date(ticket.createdAt);
  ticketDate.setHours(0, 0, 0, 0);

  if (startDate) {
    const fromDate = new Date(`${startDate}T00:00:00`);
    if (ticketDate < fromDate) return false;
  }

  if (endDate) {
    const toDate = new Date(`${endDate}T00:00:00`);
    if (ticketDate > toDate) return false;
  }

  return true;
})

  .map((ticket) => (

  
<div
  key={ticket.ticket_id}
  className="ticket-card"
  style={{
    "--ticket-accent":
      ticket.priority === "Critical" || ticket.priority === "High"
        ? "#dc2626"
        : ["Open", "In Progress"].includes(ticket.status) &&
          Date.now() - new Date(ticket.createdAt).getTime() >
            3 * 24 * 60 * 60 * 1000
        ? "#f97316"
        : "#94a3b8",
  }}
>

    <h3>{ticket.subject}</h3>
    <p><strong>Ticket ID:</strong> {ticket.ticket_id}</p>
    <p><strong>Author ID:</strong> {ticket.author_id}</p>
    <p><strong>Description:</strong> {ticket.description}</p>
    
{ticket.attachment?.originalName && (
  <p>
    <strong>Author Attachment:</strong>{" "}
    {ticket.attachment.originalName}{" "}
    <button
      type="button"
      onClick={() => handleDownloadAttachment(ticket)}
    >
      Download
    </button>
  </p>
)}

    <p><strong>Category:</strong> {ticket.category}</p>
    <p><strong>Priority:</strong> {ticket.priority}</p>
    <p><strong>Status:</strong> {ticket.status}</p>
    <p><strong>Created:</strong> {new Date(ticket.createdAt).toLocaleString()}</p>
    
{ticket.suggestedReply && (
  <div className="ticket-info-panel ai-panel">
    <h4>AI Suggested Reply</h4>
    <p>{ticket.suggestedReply}</p>
  </div>
)}

    

{ticket.adminResponse && (
  <div className="ticket-info-panel reply-panel">
    <h4>Admin Reply</h4>
    <p>{ticket.adminResponse}</p>
  </div>
)}



<div className="manage-ticket">
  <div className="manage-ticket-heading">
    <div>
      <h4>Manage Ticket</h4>
      <p>Update the ticket and respond to the author.</p>
    </div>
    <span className="manage-ticket-badge">Admin Controls</span>
  </div>


  <label>Status</label>
  <select
    id={`status-${ticket.ticket_id}`}
    defaultValue={ticket.status}
    style={{ display: "block", width: "100%", padding: "8px", margin: "6px 0 12px" }}
  >
    {["Open", "In Progress", "Resolved", "Closed"].map((status) => (
      <option key={status} value={status}>{status}</option>
    ))}
  </select>

  <label>Priority</label>
  <select
    id={`priority-${ticket.ticket_id}`}
    defaultValue={ticket.priority}
    style={{ display: "block", width: "100%", padding: "8px", margin: "6px 0 12px" }}
  >
    {["Critical", "High", "Medium", "Low"].map((priority) => (
      <option key={priority} value={priority}>{priority}</option>
    ))}
  </select>

  <label>Response to Author</label>
  <textarea
    id={`reply-${ticket.ticket_id}`}
    defaultValue={ticket.adminResponse || ticket.suggestedReply || ""}
    rows={4}
    placeholder="Write a response to the author..."
    style={{ display: "block", width: "100%", padding: "8px", margin: "6px 0 12px" }}
  />

  <label>Internal Notes (Admin Only)</label>
  <textarea
    id={`notes-${ticket.ticket_id}`}
    defaultValue={ticket.internalNotes || ""}
    rows={3}
    placeholder="Add private notes for the support team..."
    style={{ display: "block", width: "100%", padding: "8px", margin: "6px 0 12px" }}
  />

  <button
    disabled={updatingTicket === ticket.ticket_id}
    onClick={() => {
      const status = document.getElementById(`status-${ticket.ticket_id}`).value;
      const priority = document.getElementById(`priority-${ticket.ticket_id}`).value;
      const adminResponse = document.getElementById(`reply-${ticket.ticket_id}`).value;
      const internalNotes = document.getElementById(`notes-${ticket.ticket_id}`).value;

      handleAdminTicketUpdate(ticket.ticket_id, {
        status,
        priority,
        adminResponse,
        internalNotes,
        assignedTo: "Admin",
      });
    }}
    style={{ padding: "10px 16px", cursor: "pointer" }}
  >
    {updatingTicket === ticket.ticket_id ? "Saving..." : "Save Changes & Send Reply"}
  </button>
</div>

  </div>
))}

{adminActionMessage && <p>{adminActionMessage}</p>}

      <button
        onClick={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.reload();
        }}
      >
        Logout
      </button>
    </div>
  ) : (
      <>
        <h1>Welcome to BookLeaf</h1>
        <p>Author Support Portal</p>

        <h2>Dashboard</h2>

        <div className="author-dashboard-grid">
          <div className="author-panel books-panel">
  <h3>My Books</h3>

  {booksMessage && <p>{booksMessage}</p>}

  {books.length === 0 && !booksMessage && <p>Loading books...</p>}

  {books.map((book) => (
    <div
      key={book.book_id}
      style={{ borderTop: "1px solid #ddd", padding: "12px 0" }}
    >
      <h4>{book.title}</h4>
      <p>Genre: {book.genre}</p>
      <p>Status: {book.status}</p>
      <p>Copies Sold: {book.total_copies_sold}</p>
      <p>Royalty Earned: ₹{book.total_royalty_earned}</p>
      <p>Royalty Paid: ₹{book.royalty_paid}</p>
      <p>Royalty Pending: ₹{book.royalty_pending}</p>
    </div>
  ))}
</div>

          
<div className="author-panel tickets-panel">
  <h3>My Tickets</h3>

  {ticketsMessage && <p>{ticketsMessage}</p>}

  {tickets.length === 0 && !ticketsMessage && (
    <p>Loading tickets...</p>
  )}

  {tickets.map((ticket) => (
    <div
      key={ticket.ticket_id}
      style={{ borderTop: "1px solid #ddd", padding: "12px 0" }}
    >
      <h4>{ticket.subject}</h4>
      <p>Ticket ID: {ticket.ticket_id}</p>
      <p>Category: {ticket.category}</p>
      <p>Priority: {ticket.priority}</p>
      <p>Status: {ticket.status}</p>
      <p>Description: {ticket.description}</p>
      {ticket.attachment?.originalName && (
  <p>
    <strong>Attachment:</strong> {ticket.attachment.originalName}
    {" "}
    <button
      type="button"
      onClick={() => handleDownloadAttachment(ticket)}
    >
      Download
    </button>
  </p>
)}
      {ticket.adminResponse && (
        <p>Support Reply: {ticket.adminResponse}</p>
      )}
    </div>
  ))}
</div>


          <div className="author-panel create-ticket-panel">
            
<h3>Create Ticket</h3>

<form onSubmit={handleCreateTicket}>
  <label htmlFor="book">Select Book (optional)</label>
  <select
    id="book"
    value={selectedBook}
    onChange={(e) => setSelectedBook(e.target.value)}
    style={{ display: "block", width: "100%", padding: "10px", margin: "8px 0 16px" }}
  >
    <option value="">General / Account Query</option>
    {books.map((book) => (
      <option key={book.book_id} value={book.book_id}>
        {book.title}
      </option>
    ))}
  </select>

  <label htmlFor="subject">Subject</label>
  <input
    id="subject"
    type="text"
    value={ticketSubject}
    onChange={(e) => setTicketSubject(e.target.value)}
    placeholder="e.g. Royalty payment query"
    required
    maxLength={150}
    style={{ display: "block", width: "100%", padding: "10px", margin: "8px 0 16px" }}
  />

  <label htmlFor="description">Description</label>
  <textarea
    id="description"
    value={ticketDescription}
    onChange={(e) => setTicketDescription(e.target.value)}
    placeholder="Explain your query..."
    required
    rows={5}
    maxLength={3000}
    style={{ display: "block", width: "100%", padding: "10px", margin: "8px 0 16px" }}
  />

  <label htmlFor="attachment">Attach File (Optional)</label>
  <input
    id="attachment"
    type="file"
    accept=".pdf,.png,.jpg,.jpeg"
    onChange={(e) => setTicketAttachment(e.target.files?.[0] || null)}
    style={{
      display: "block",
      width: "100%",
      padding: "10px",
      margin: "8px 0 16px",
    }}
  />
  <p style={{ fontSize: "13px", color: "#666" }}>
    Supported formats: PDF, PNG, JPG, JPEG.
  </p>

  <button
    type="submit"
    disabled={submittingTicket}
    style={{ padding: "12px 20px", cursor: "pointer" }}
  >
    {submittingTicket ? "Submitting..." : "Submit Ticket"}
  </button>

  {ticketMessage && <p>{ticketMessage}</p>}
</form>

          </div>
        </div>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.reload();
          }}
          style={{ marginTop: "24px", padding: "10px 20px", cursor: "pointer" }}
        >
          Logout
        </button>
      </>
  )
    ) : (
      
<>
  
<div className="login-page">
  <div className="login-card">
    <div className="login-brand">B</div>
    <p className="login-eyebrow">BOOKLEAF PUBLISHING</p>
    <h1>Author Support Portal</h1>
    <p className="login-description">
      Sign in to manage your books and support tickets.
    </p>


  <form onSubmit={handleLogin}>
    <label htmlFor="email">Email</label>
    <input
      id="email"
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      placeholder="Enter your email"
      required
      style={{ display: "block", width: "100%", padding: "10px", margin: "8px 0 16px" }}
    />

    <label htmlFor="password">Password</label>
    <input
      id="password"
      type="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      placeholder="Enter your password"
      required
      style={{ display: "block", width: "100%", padding: "10px", margin: "8px 0 16px" }}
    />

    <button type="submit" style={{ padding: "12px 20px", cursor: "pointer" }}>
      Sign In
    </button>
  </form>

  {message && <p>{message}</p>}
    </div>
</div>
</>

    )}
  </div>
);

}

export default App;
