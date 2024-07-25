require('dotenv').config(); // If you're using dotenv
const envGuard = require('../index.js');

envGuard(); // This will automatically check all process.env calls in your project

// Rest of your application code
const express = require('express');
const app = express();

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});