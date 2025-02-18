# Hono API

## Overview
This is a simple API built with Hono, using Prisma with Accelerate for database interactions. The API provides authentication and blog management functionality.

## Setup

### Environment Variables
Create a `.env` file and configure the following environment variables:

```env
DATABASE_URL=<your_database_url>
JWT_SECRET=<your_jwt_secret>
```

### Installation

```sh
yarn install  # or npm install
```

### Running the Server

```sh
yarn dev  # or npm run dev
```

## API Endpoints

### User Routes

#### **Signup**
`POST /api/v1/user/signup`

- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword",
    "name": "John Doe"
  }
  ```
- **Response:**
  ```json
  "<JWT Token>"
  ```
- **Errors:**
  - 411: Inputs are not correct
  - 411: Invalid

#### **Signin**
`POST /api/v1/user/signin`

- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword"
  }
  ```
- **Response:**
  ```json
  "<JWT Token>"
  ```
- **Errors:**
  - 411: Inputs are not correct
  - 403: User not found

### Blog Routes

#### **Create a Blog** *(Requires Authentication)*
`POST /api/v1/blog`

- **Headers:**
  ```json
  {
    "Authorization": "Bearer <JWT Token>"
  }
  ```
- **Request Body:**
  ```json
  {
    "title": "My First Blog",
    "content": "This is the content of the blog."
  }
  ```
- **Response:**
  ```json
  {
    "id": "<blog_id>"
  }
  ```
- **Errors:**
  - 411: Inputs are not correct
  - 403: You are not logged in

#### **Update a Blog** *(Requires Authentication)*
`PUT /api/v1/blog`

- **Headers:**
  ```json
  {
    "Authorization": "Bearer <JWT Token>"
  }
  ```
- **Request Body:**
  ```json
  {
    "id": "<blog_id>",
    "title": "Updated Title",
    "content": "Updated content."
  }
  ```
- **Response:**
  ```json
  {
    "id": "<blog_id>"
  }
  ```
- **Errors:**
  - 411: Inputs are not correct

#### **Get All Blogs** *(Public)*
`GET /api/v1/blog/bulk`

- **Response:**
  ```json
  {
    "blogs": [
      {
        "id": "1",
        "title": "Blog Title",
        "content": "Blog content",
        "author": {
          "name": "John Doe"
        }
      }
    ]
  }
  ```

#### **Get Blog by ID** *(Public)*
`GET /api/v1/blog/:id`

- **Response:**
  ```json
  {
    "blog": {
      "id": "1",
      "title": "Blog Title",
      "content": "Blog content",
      "author": {
        "name": "John Doe"
      }
    }
  }
  ```
- **Errors:**
  - 404: Error while fetching blog post

## Middleware
- **CORS** enabled for all routes.
- **JWT Authentication** required for blog-related POST and PUT requests.

## Tech Stack
- **Hono** (Lightweight web framework)
- **Prisma** (ORM for database management)
- **JWT** (Authentication and authorization)
- **Zod** (Input validation)
- **Edge functions** (For serverless compatibility)

