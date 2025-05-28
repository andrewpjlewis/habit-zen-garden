# Habit Zen Garden

Repository for developing the Habit Zen Garden app – a MERN stack application for tracking and growing daily habits like a zen garden.

---

## 🛠 Tech Stack

- **Frontend**: React, CSS Modules
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Other**: dotenv

---

## 🚀 Getting Started

### 1. Clone the repository
### 2. Install dependencies
Commands to run in terminal to setup project:
<!-- in the root directory -->
npm install concurrently
replace code in package.json with the following:

{
  "name": "habit-zen-garden",
  "version": "1.0.0",
  "scripts": {
    "start": "concurrently \"npm run start:frontend\" \"npm run start:backend\"",
    "start:frontend": "cd frontend && npm start",
    "start:backend": "cd backend && npm start"
  },
  "devDependencies": {
    "concurrently": "^9.1.2"
  }
}

<!-- navigate to backend folder -->
cd backend
npm install
npm install bcrypt express-session connect-flash
<!-- navigate to frontend folder -->
cd ../frontend
npm install

### 3. Set up environment variables (.env)
MONGO_URI=mongodb+srv://lewiand1234:tX6QLLyQ0onsrBBy@habit-api-cluster.gyzdbsr.mongodb.net/

### 4. Deploy Link
FRONTEND - https://habit-zen-garden-frontend.onrender.com
BACKEND - https://habit-zen-garden.onrender.com/
