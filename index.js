const fs = require('fs');
const path = require('path');
const glob = require('glob');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

function log(message, verbose) {
  if (verbose) {
    console.log(message);
  }
}

function findProcessEnvCalls(directory, verbose = false) {
  const envVars = new Set();
  const files = glob.sync('**/*.js', {
    cwd: directory,
    ignore: ['node_modules/**', 'index.js']
  });

  log(`Scanning files: ${files.join(', ')}`, verbose);

  files.forEach(file => {
    const filePath = path.join(directory, file);
    log(`Scanning file: ${filePath}`, verbose);
    const content = fs.readFileSync(filePath, 'utf-8');
    const ast = parser.parse(content, { sourceType: 'module' });

    traverse(ast, {
      MemberExpression(path) {
        if (
          path.node.object.type === 'MemberExpression' &&
          path.node.object.object.name === 'process' &&
          path.node.object.property.name === 'env' &&
          path.node.property.type === 'Identifier'
        ) {
          const varName = path.node.property.name;
          if (varName !== 'varName' && !path.parent.type.includes('Assignment')) {
            log(`Found env var: ${varName} in file: ${filePath}`, verbose);
            envVars.add(varName);
          }
        }
      }
    });
  });

  log(`Detected environment variables: ${Array.from(envVars).join(', ')}`, verbose);
  return Array.from(envVars);
}

function envGuard(options = {}) {
  const { directory = process.cwd(), verbose = false } = options;
  log(`Scanning directory: ${directory}`, verbose);

  const requiredEnvVars = [
    ...findProcessEnvCalls(directory, verbose),
    ...findProcessEnvCalls(path.join(directory, 'test-project'), verbose)
  ];
  const missingVars = [];
  const emptyVars = [];

  for (const varName of requiredEnvVars) {
    const value = process.env[varName];
    log(`Checking var: ${varName}, value: ${value}`, verbose);

    if (value === undefined || value === null) {
      missingVars.push(varName);
    } else if (value === '') {
      emptyVars.push(varName);
    }
  }

  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }

  if (emptyVars.length > 0) {
    console.warn(`Warning: The following environment variables are empty: ${emptyVars.join(', ')}`);
  }

  log('Environment check completed successfully', verbose);
}

module.exports = envGuard;