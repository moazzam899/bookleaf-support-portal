# BookLeaf Author Support & Communication Portal

A full-stack web application designed to help authors manage their books and support requests while enabling administrators to review, categorize, prioritize, and respond to tickets efficiently.

## Features

### Author Portal
- Secure login using JWT authentication.
- View books associated with the logged-in author.
- Create support tickets with an optional book reference.
- Upload supporting attachments in PDF, PNG, JPG, and JPEG formats (maximum 5 MB).
- Track ticket status, priority, and support responses.
- Download authorized ticket attachments.

### Admin Dashboard
- View and manage author support tickets.
- Search and filter tickets by status, category, priority, and date.
- Review AI-generated ticket classifications and suggested replies.
- Update ticket status and priority.
- Send responses to authors.
- Add internal notes visible only to administrators.
- Download ticket attachments with authorization checks.

### AI Integration
The application integrates with the Groq API to assist with ticket classification and response suggestions.

AI assistance recommends a ticket category, priority, and suggested reply based on the ticket details. Administrators can review and edit these suggestions before responding to authors.

AI-generated content is advisory and should be reviewed by an administrator before being sent.

## Technology Stack

### Frontend
- React
- Vite
- JavaScript
- CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)
- bcryptjs
- Multer
- Groq SDK

## Project Structure

```text
bookleaf-support-portal/
├── client/                      # React frontend
├── server/                      # Express backend
│   ├── uploads/                  # Uploaded ticket attachments
│   ├── bookleaf_sample_data.json # Sample evaluation dataset
│   └── server.js                 # Backend entry point
└── README.md
```

## Prerequisites

Make sure you have the following installed or configured:

- Node.js and npm
- MongoDB Atlas account or a compatible MongoDB instance
- Groq API key

## Local Setup

### 1. Clone the Repository

```bash
git clone YOUR_PRIVATE_REPOSITORY_URL
cd bookleaf-support-portal
```

Replace `YOUR_PRIVATE_REPOSITORY_URL` with the URL of your private GitHub repository.

### 2. Configure the Backend

Open a terminal in the project directory and run:

```bash
cd server
npm install
```

Create a `.env` file inside the `server` directory and add:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_strong_jwt_secret
GROQ_API_KEY=your_groq_api_key
```

Replace the placeholder values with your own credentials. Do not commit your `.env` file or expose API keys.

Start the backend:

```bash
npm run dev
```

The backend runs on port `5000` by default.

### 3. Configure the Frontend

Open a second terminal in the project root and run:

```bash
cd client
npm install
npm run dev
```

Open the local URL displayed by Vite, usually:

`http://localhost:5173`

### 4. Configure Sample Data

The `server/bookleaf_sample_data.json` file contains the sample dataset provided for development and evaluation.

Ensure the sample authors and books have been imported into MongoDB before testing the application. Use the project's existing data-loading process.

## API Documentation

Protected endpoints require a valid JWT token. Role-based authorization restricts access to the appropriate user roles.

### Authentication

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/login` | Public | Authenticate a user and log in |

### Books

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/books/my-books` | Author | Retrieve books associated with the logged-in author |

### Tickets

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/tickets` | Author | Create a support ticket with an optional attachment |
| GET | `/api/tickets/my-tickets` | Author | Retrieve the logged-in author's tickets |
| GET | `/api/tickets` | Admin | Retrieve all support tickets |
| GET | `/api/tickets/:ticketId/attachment` | Author or Admin | Download an authorized ticket attachment |
| PATCH | `/api/tickets/:ticketId` | Admin | Update ticket status, priority, response, and internal notes |

### Admin

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/admin/test` | Admin | Verify administrator access |

### Attachment Upload

The ticket creation endpoint accepts attachments using `multipart/form-data`.

- Form field: `attachment`
- Supported formats: PDF, PNG, JPG, JPEG
- Maximum file size: 5 MB

### Authentication and Authorization

Protected endpoints require a valid JWT token. Authors can access their own books, tickets, and authorized attachments. Administrators can access the ticket management features and update support tickets.

## Security

- Passwords are hashed using bcryptjs.
- JWT-based authentication protects restricted endpoints.
- Role-based authorization separates author and administrator permissions.
- Authors are restricted to their own authorized resources.
- Attachment downloads include authorization checks.
- Uploaded files are handled by the server.
- Environment variables are used for secrets and configuration.
- Sensitive files and dependencies are excluded from version control.

## AI Strategy and Limitations

The application uses the Groq API to assist with ticket classification and suggested replies.

AI recommendations are intended to help administrators process support requests more efficiently. They are not guaranteed to be accurate and should be reviewed before use.

AI functionality depends on the availability of the configured API provider and model. API errors, service availability, and model output quality may affect the results.

## Current Status

The application includes author authentication, book listing, ticket creation, ticket management, attachment handling, role-based access control, and AI-assisted ticket classification and reply suggestions.

## Live Demo

**Live Application URL:** [Add deployed frontend URL here]

**Backend API URL:** [Add deployed backend URL here]

*Replace these placeholders after deployment.*

## Repository

**GitHub Repository:** [https://github.com/moazzam899/bookleaf-support-portal/]

The repository must remain private in accordance with the assignment's confidentiality requirements.

## License and Confidentiality

This project was developed for confidential technical evaluation. The assignment materials and solution must not be redistributed or published publicly.
