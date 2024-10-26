# Movie Streaming Authentication Service

## Overview

This is a microservice for handling user authentication in a movie streaming application. It provides functionalities for user signup, signin, token management, and logging.

## Features

- User Signup: Register new users with a secure password.
- User Signin: Authenticate users and provide JWT for secure access.
- Token Management: Issue and validate JWT tokens for secure access.
- Logging and Monitoring: Centralized logging for tracking user actions and errors.

## Technologies Used

- Node.js
- Express
- JWT (JSON Web Tokens)
- bcrypt for password hashing
- Sequelize for ORM (if applicable)
- Axios for logging service communication
- HTTP Status Codes for standardized response codes

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>


2. Configure your environment variables (create a `.env `file if necessary):

```bash
PORT=<Your_port_address>
JWT_KEY=<your_jwt_secret_key>
```

## Date and Time Management

This application uses **Moment.js** for date and time manipulation. All timestamps are handled in **UTC** to ensure consistency across different platforms (Windows, Mac, Linux).

### Key Features:
- **UTC Standardization**: All date and time operations are performed in UTC to eliminate discrepancies caused by local time zones.
- **Unix Timestamps**: The application utilizes Unix timestamps (seconds since January 1, 1970) for storing and comparing expiration times, ensuring uniform behavior regardless of the operating system.

By adopting this approach, we ensure that the application behaves consistently across various environments and avoids common pitfalls related to time zone differences.
