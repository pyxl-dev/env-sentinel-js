# env-sentinel

env-sentinel is a TypeScript-compatible npm package that automatically detects and verifies environment variables used in your Node.js project. It helps prevent runtime errors by ensuring all required environment variables are set before your application starts.

## Features

- Automatically scans your project for `process.env` usage
- Throws an error if required environment variables are missing
- Warns about empty environment variables
- TypeScript support
- Verbose mode for detailed logging

## Installation

Install env-sentinel using npm:

```
npm install env-sentinel
```

## Usage

1. Import the `envSentinel` function from the `env-sentinel` package:

```javascript
const envSentinel = require('env-sentinel');
```

2. Call the `envSentinel` function before starting your application:

```javascript
envSentinel();
```

This will scan your project for `process.env` usage and throw an error if any required environment variables are missing.

3. To enable verbose mode for detailed logging, pass an options object with `verbose` set to `true`:

```javascript
envSentinel({ verbose: true });
```

## Example

```javascript
const envSentinel = require('env-sentinel');

envSentinel();

// Rest of your application code
console.log(`Server running on port ${process.env.PORT}`);
console.log(`Database URL: ${process.env.DATABASE_URL}`);
console.log(`API Key: ${process.env.API_KEY}`);
console.log(`Node Environment: ${process.env.NODE_ENV}`);
```

## License

env-sentinel is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request on the [env-sentinel GitHub repository](https://github.com/YoanAncelly/env-sentinel).

## Author

env-sentinel was created by [Yoan Ancelly](https://github.com/YoanAncelly).
