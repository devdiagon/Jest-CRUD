# MongoDB Implementation

This is a separate MongoDB implementation of the CRUD API. The original in-memory implementation remains untouched in the `src/` folder.

## Quick Start

1. **Install dependencies** (if mongoose is not already installed):
   ```bash
   pnpm install
   ```

2. **Set your MongoDB URI** as an environment variable:
   ```bash
   export MONGODB_URI="mongodb://localhost:27017/zoo"
   ```
   
   Or for MongoDB Atlas:
   ```bash
   export MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/zoo"
   ```

3. **Start the server**:
   ```bash
   pnpm run start:mongodb
   ```
   
   Or directly:
   ```bash
   MONGODB_URI="your-uri-here" node server-mongodb.js
   ```

## Structure

- `src-mongodb/` - MongoDB implementation folder
  - `models/` - Mongoose models (Animal, User, Zookeeper, Habitat)
  - `controllers/` - Controllers using MongoDB
  - `routes/` - Express routes
  - `utils/` - Validation utilities (same as original)
  - `db/connection.js` - MongoDB connection handler
- `app-mongodb.js` - Express app with MongoDB
- `server-mongodb.js` - Server entry point

## API Endpoints

Same as the original implementation:
- `/api/users` - User CRUD operations
- `/api/zookeepers` - Zookeeper CRUD operations
- `/api/habitats` - Habitat CRUD operations
- `/api/animals` - Animal CRUD operations

## Notes

- The original implementation in `src/` is completely untouched
- All validation logic remains the same
- MongoDB uses `_id` instead of `id` for document identifiers
- The API still accepts `id` in requests, but MongoDB will use its own `_id`

