# BookLeaf Author Support & Communication Portal

A full-stack web application that helps authors raise support tickets and enables administrators to manage requests with AI-assisted ticket classification and response suggestions.

## Live Demo

- **Author & Admin Portal:** https://myaibookleafpublisher.vercel.app/
- **Backend API:** https://bookleaf-support-portal-z2so.onrender.com
- **Private Repository:** https://github.com/moazzam899/bookleaf-support-portal

## Test Credentials

**Admin Account**
- Email: `admin@bookleaf.com`
- Password: `Admin@12345`

**Author Account**
- Email: `priya.sharma@email.com`
- Password: `Author@12345`

These credentials are provided for assignment evaluation only.

## Project Overview

The portal provides separate experiences for authors and administrators. Authors can view their books, submit support tickets, attach relevant files, and track ticket status and responses. Administrators can review tickets, manage priorities and statuses, add internal notes, and use AI-generated classifications and response suggestions.

The application uses role-based access control to restrict features and data according to the logged-in user's role.

## Key Features

### Author Portal
- Secure login using JWT authentication.
- View books associated with the logged-in author.
- Create support tickets with a subject, description, category, and optional book selection.
- Upload supporting PDF, PNG, JPG, or JPEG attachments.
- View personal tickets, ticket status, and administrator responses.
- Download authorized ticket attachments.

### Admin Portal
- View and manage author support tickets.
- Filter and search tickets by status, category, priority, and other available criteria.
- Review AI-generated category, priority, and suggested response.
- Edit the suggested response before sending it to an author.
- Update ticket status and priority.
- Add internal notes that are not visible to authors.
- View dashboard statistics.

### AI-Assisted Support
The AI integration helps administrators process support requests by generating:
- A suggested ticket category.
- A priority recommendation.
- A suggested response based on the ticket details and available BookLeaf support guidance.

Supported categories:
- Royalty & Payments
- ISBN & Metadata Issues
- Printing & Quality
- Distribution & Availability
- Book Status & Production Updates
- General Inquiry

Supported priorities:
- Critical
- High
- Medium
- Low

AI output is intended to assist the administrator, not replace human review. Administrators can review and edit the suggested response before sending it.

## Technology Stack

**Frontend**
- React
- Vite
- JavaScript
- CSS

**Backend**
- Node.js
- Express.js
- REST APIs
- JWT authentication
- Multer for file uploads

**Database**
- MongoDB Atlas

**AI Integration**
- Groq API
- `openai/gpt-oss-120b` model

**Deployment**
- Vercel for the frontend
- Render for the backend
- MongoDB Atlas for database hosting

## Architecture and Design Decisions

### Frontend and Backend Separation
The application uses separate React and Express applications. This keeps the user interface independent of backend business logic and makes the components easier to maintain and deploy.

### REST API Design
The backend exposes REST endpoints for authentication, book access, ticket creation, ticket retrieval, and ticket management. This separation makes the API easier to test and extend.

### MongoDB
MongoDB stores author, book, and ticket data. Its document-based structure fits ticket records that can contain classification results, responses, status information, and attachment metadata.

### JWT and Role-Based Authorization
JWT authentication is used to identify logged-in users. Protected endpoints enforce role and ownership checks so authors can access their own tickets and books, while administrators can manage support tickets.

### AI-Assisted Rather Than Fully Automated Responses
AI generates classification and response suggestions, while administrators retain control over the final response. This reduces the risk of sending an incorrect or unsuitable answer automatically.

## Project Structure

```text
bookleaf-support-portal/
├── client/
│   ├── public/
│   └── src/
│       └── App.jsx
├── server/
│   ├── uploads/
│   │   └── tickets/
│   ├── bookleaf_sample_data.json
│   ├── server.js
│   ├── package.json
│   └── ...
└── README.md
```

The structure above highlights the main application areas. Other source files and configuration files are maintained in their respective directories.

## Local Setup

### Prerequisites
- Node.js and npm
- A MongoDB Atlas connection string or another accessible MongoDB database
- A Groq API key for AI-assisted classification and responses

### 1. Clone the Repository

```bash
git clone https://github.com/moazzam899/bookleaf-support-portal.git
cd bookleaf-support-portal
```

Repository access requires permission because the repository is private.

### 2. Configure the Backend

```bash
cd server
npm install
```

Create a `.env` file inside the `server` directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
GROQ_API_KEY=your_groq_api_key
```

Replace the placeholder values with your own credentials. Do not commit `.env` files or expose API keys.

Start the backend using the development script configured in `server/package.json`:

```bash
npm run dev
```

The local backend is expected to run at:

`http://localhost:5000`

### 3. Configure the Frontend

Open a second terminal:

```bash
cd client
npm install
npm run dev
```

Open the local frontend URL displayed by Vite, typically:

`http://localhost:5173`

Ensure the frontend API configuration points to your local backend when running locally.

### 4. Sample Data

The repository includes `server/bookleaf_sample_data.json` containing sample author and book data for the assignment. The evaluation environment should be populated with the required sample records before testing author-specific book access and ticket workflows. Use the project's existing data-loading process; no separate automated seed command is documented here.

## API Documentation

All endpoints below use the `/api` prefix. Protected endpoints require a valid JWT in the authorization header, according to the application's authentication implementation.

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/login` | Authenticate a user |
| GET | `/api/books/my-books` | Retrieve books for the logged-in author |
| POST | `/api/tickets` | Create a support ticket |
| GET | `/api/tickets/my-tickets` | Retrieve tickets belonging to the logged-in author |
| GET | `/api/tickets` | Retrieve tickets for admin management |
| GET | `/api/tickets/:ticketId/attachment` | Download an authorized ticket attachment |
| PATCH | `/api/tickets/:ticketId` | Update supported ticket fields as an administrator |
| GET | `/api/admin/test` | Test access to a protected admin endpoint |

### Authentication

Login through `POST /api/auth/login`. Use the authentication token returned by the API for subsequent protected requests, following the application's expected authorization format.

### Ticket Creation

Use `POST /api/tickets` to submit a ticket. When an attachment is included, the request uses `multipart/form-data` with the field name `attachment`.

### Attachments

Supported file types:
- PDF
- PNG
- JPG
- JPEG

Maximum supported file size: **5 MB**.

Attachment access is checked so that users cannot download files belonging to other authors unless authorized as an administrator.

## AI Integration Strategy

### Prompt Strategy
The AI receives ticket information and relevant BookLeaf support guidance. The prompt asks it to classify the request into one of the supported categories, recommend a priority, and generate a relevant suggested response.

The output is expected in a structured format so the application can use the classification and response suggestion in the ticket workflow.

### Error Handling
AI responses may fail because of API errors, unavailable models, invalid output, or network problems. The application includes fallback handling so an AI failure does not need to prevent the core support-ticket workflow from being used. AI-generated content should be reviewed before it is sent to an author.

### Cost Management
- AI is used for ticket classification and response suggestions rather than every page interaction.
- The application uses a configured model rather than making unnecessary model calls throughout the UI.
- AI output is used to assist administrators, avoiding an additional automatic response-generation step after administrator review.

### Limitations
AI output may occasionally be incomplete, inaccurate, or unsuitable for a particular case. Production use should include stronger output validation, monitoring, rate limiting, and more comprehensive tests for AI failures.

## Security Considerations

- JWT-based authentication protects restricted functionality.
- Role and ownership checks limit access to author-specific data.
- Uploaded files have an allowed-type and file-size restriction.
- Attachment downloads are subject to authorization checks.
- Internal notes are intended for administrators and are not displayed in the author portal.
- Secrets and database credentials should be stored in environment variables, not committed to source control.

For production deployment, additional hardening should include stronger upload-content validation, rate limiting, audit logging, and a dedicated secure object-storage service for attachments.

## Known Limitations and Future Improvements

- **Real-time updates:** A production version could use WebSockets or server-sent events to deliver ticket updates without manual refreshes.
- **Attachment storage:** Local disk storage is not ideal for a horizontally scaled deployment. Object storage such as Amazon S3 would be more suitable.
- **AI reliability:** Add stricter schema validation, retries where appropriate, usage limits, and monitoring for AI requests.
- **Testing:** Add automated unit, integration, and end-to-end tests for authentication, authorization, ticket workflows, uploads, and AI failure scenarios.
- **Observability:** Add structured logs, error monitoring, and audit trails for administrative actions.
- **Scalability:** Add pagination and indexing for large ticket collections, along with appropriate caching where useful.
- **Knowledge base:** Move support guidance into a maintainable knowledge-base system and retrieve relevant content for more grounded AI suggestions.

## Current Status

The frontend and backend are deployed separately. The live portal has been tested for author and administrator login, ticket creation and management, and AI-assisted classification and response suggestions.

The backend is hosted on Render's free tier, so an initial request may take longer if the service needs to wake from inactivity. Live availability and performance may vary.

## Confidentiality

This project was created for the BookLeaf Full Stack Developer assignment. The repository is private. Assignment materials and implementation details should not be shared publicly without permission.
