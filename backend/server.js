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
const allowedOrigins = [
  'http://localhost:3000', 
  'https://habit-zen-garden-frontend.onrender.com'
]
app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
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
  console.error('Error:', err); // print full error object
  res.status(500).json({ message: err.message || 'Something broke!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
