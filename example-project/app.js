require('dotenv').config(); // If you're using dotenv
const envSentinel = require('../index'); // Adjust the path to point to the env-sentinel package

// Call envSentinel with verbose option
envSentinel({ verbose: true });

// Rest of your application code
console.log(`Server running on port ${process.env.PORT}`);
console.log(`Database URL: ${process.env.DATABASE_URL}`);
console.log(`API Key: ${process.env.API_KEY}`);
console.log(`Node Environment: ${process.env.NODE_ENV}`);

// Example of using an environment variable with a default value
const debugMode = process.env.DEBUG_MODE || 'false';
console.log(`Debug Mode: ${debugMode}`);

// Example of using an environment variable in a condition
if (process.env.ENABLE_FEATURE === 'true') {
  console.log('Special feature enabled');
} else {
  console.log('Special feature disabled');
}