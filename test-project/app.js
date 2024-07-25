require('dotenv').config(); // If you're using dotenv
const envGuard = require('../index.js');

// Call envGuard with verbose option
envGuard({ verbose: true });

// Rest of your application code
const express = require('express');
const app = express();

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});