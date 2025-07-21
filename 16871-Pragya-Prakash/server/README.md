# Parampara Foods Backend

This is the backend API for the Parampara Foods e-commerce platform, built with Node.js, Express, and MongoDB.

## Features
- RESTful API for products, categories, orders, users, and reviews
- JWT-based authentication and role-based access
- Email notifications (configurable)
- Image uploads with Cloudinary
- Admin dashboard endpoints

## Tech Stack
- Node.js
- Express
- MongoDB (Mongoose)
- JWT
- Cloudinary

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation
1. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
2. Create a `.env` file in this directory (see `.env.example` for details):
   ```env
   MONGODB_URI=mongodb://localhost:27017/parampara-foods
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRE=30d
   NODE_ENV=development
   EMAIL_USER=your_email@example.com
   EMAIL_PASSWORD=your_email_password
   CLIENT_URL=http://localhost:5173
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   PORT=5000
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. The API will be available at [http://localhost:5000](http://localhost:5000)

## Project Structure
```
models/      # Mongoose schemas
routes/      # API route handlers
middleware/  # Custom middleware
uploads/     # File uploads
```

## Environment Variables
See `.env.example` for all required variables.

## Useful Scripts
- `npm run dev` — Start development server with nodemon
- `npm start` — Start production server

## License
MIT 