const express = require('express');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('./database/db');
const authRoutes = require('./routes/authRoutes');
const habitRoutes = require('./routes/habits'); // ✅ Mount this

const app = express();

// Connect to DB
connectDB();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true 
}));
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

app.use(flash());

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/habits', habitRoutes);

app.get('/', (req, res) => res.send('API Running'));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
