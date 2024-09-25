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