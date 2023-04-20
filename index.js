const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const userRoutes = require('./routes/user');
const db = require('./db/connect');

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;


// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/users', userRoutes);

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
