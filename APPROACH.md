# BookLeaf Author Support Portal — Approach & Trade-offs

## 1. Approach and Priorities

My primary goal was to build a functional support portal that makes it easy for authors to raise queries and for administrators to manage them efficiently. I prioritized the core workflow first: authentication, role-based access, author-specific books and tickets, ticket creation, status management, and administrator responses.

After establishing the core workflow, I integrated AI-assisted ticket classification and response suggestions to reduce repetitive administrative work while keeping the administrator in control of the final response.

## 2. Architecture and Technical Decisions

I used React with Vite for the frontend, Node.js and Express.js for the backend, and MongoDB Atlas for data storage. Keeping the frontend and backend separate provides a clear division between the user interface, API logic, and data layer, while making independent deployment possible.

I used REST APIs for communication between the frontend and backend. JWT authentication and role-based authorization restrict access to protected features. Author ownership checks help ensure that authors can access only their own books, tickets, and authorized attachments.

MongoDB was selected for its flexible document model, which suits ticket records containing descriptions, status, priority, AI suggestions, responses, and attachment information.

## 3. AI Integration and Error Handling

The Groq API is used to suggest a ticket category, priority, and response based on ticket details and BookLeaf support guidance. The system supports categories such as Royalty & Payments, ISBN & Metadata Issues, Printing & Quality, Distribution & Availability, Book Status & Production Updates, and General Inquiry.

AI suggestions are reviewed by administrators before being sent to authors. This human-review step helps reduce the risk of incorrect or inappropriate automated responses. Fallback handling helps preserve the core ticket workflow when AI processing fails.

To manage costs, AI is used for targeted classification and response suggestions rather than unnecessary calls throughout the application.

## 4. Trade-offs and Limitations

I prioritized a working end-to-end workflow and clear role separation within the assignment timeline. The current implementation uses a straightforward REST-based architecture rather than introducing additional infrastructure.

The application would benefit from automated test coverage, stronger upload validation, monitoring, and more comprehensive AI-output validation. Local-disk attachment storage is also less suitable for a horizontally scaled production deployment. The current deployment may experience slower initial requests when the free-tier backend wakes from inactivity.

## 5. Production Roadmap

For production, I would move attachment storage to Amazon S3, introduce automated unit and integration tests, and add rate limiting, structured logging, audit trails, and monitoring. I would also consider WebSockets or server-sent events for real-time ticket updates, pagination for larger ticket volumes, and a maintainable knowledge base to improve AI response relevance.

My overall design principle was to make the essential support workflow reliable first, then use AI as an assistive feature that improves efficiency without removing human oversight.