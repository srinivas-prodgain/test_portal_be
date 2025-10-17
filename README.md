# Test Portal Backend

Backend API for Test Portal built with Node.js, Express, TypeScript, and MongoDB.

## Tech Stack

- **Node.js** with **Express**
- **TypeScript**
- **MongoDB** with **Mongoose**
- **Zod** for validation
- **Morgan** for logging
- **CORS** enabled

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration

4. Run development server:
```bash
npm run dev
```

## Scripts

- `npm run dev` - Start development server with nodemon
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Run production server
- `npm run clean` - Clean dist folder

## Project Structure

```
src/
├── config/          # Configuration files
├── middlewares/     # Express middlewares
├── utils/           # Utility functions
└── index.ts         # Entry point
```

