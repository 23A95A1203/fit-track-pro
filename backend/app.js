require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const Routes = require('./routes/Routes.js');

const app = express();

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ MongoDB Connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ View Engine Setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// ✅ Middleware
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Routes
app.use('/', Routes);

// ✅ 404 Error Handling
app.use((req, res, next) => {
  res.status(404).json({ error: 'Route not found' });
});

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Server error:", err.message);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

// ✅ Server Start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

module.exports = app;
