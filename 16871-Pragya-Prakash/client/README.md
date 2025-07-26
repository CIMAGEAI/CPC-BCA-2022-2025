# Parampara Foods Frontend

This is the frontend for the Parampara Foods e-commerce platform, built with React and Vite.

## Features
- Modern, responsive UI for traditional Indian foods e-commerce
- Product catalog, search, and filtering
- Shopping cart and checkout
- User authentication and profile management
- Order history and product reviews
- Admin dashboard for product, order, and user management

## Tech Stack
- React
- Vite
- Tailwind CSS
- React Router
- Axios

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation
1. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
2. Create a `.env` file in this directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
   (See `.env.example` for details)

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure
```
src/
├── components/   # UI components
├── contexts/     # React Context providers
├── pages/        # Page components
├── utils/        # Utility functions and API config
```

## Environment Variables
- `VITE_API_URL`: The base URL for the backend API.

## Useful Scripts
- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm run preview` — Preview production build

## License
MIT
