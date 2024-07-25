const fs = require('fs');
const path = require('path');
const glob = require('glob');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

function findProcessEnvCalls(directory) {
  const envVars = new Set();
  const files = glob.sync('**/*.js', {
    cwd: directory,
    ignore: ['node_modules/**', 'index.js'] // Ignore index.js as well
  });

  console.log('Scanning files:', files);

  files.forEach(file => {
    const filePath = path.join(directory, file);
    console.log('Scanning file:', filePath);
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
          // Exclude 'varName' and ensure it's not part of a larger expression
          if (varName !== 'varName' && !path.parent.type.includes('Assignment')) {
            console.log('Found env var:', varName, 'in file:', filePath);
            envVars.add(varName);
          }
        }
      }
    });
  });

  console.log('Detected environment variables:', Array.from(envVars));
  return Array.from(envVars);
}

function envGuard(directory = process.cwd()) {
  console.log('Scanning directory:', directory);
  const requiredEnvVars = findProcessEnvCalls(directory);
  const missingVars = [];
  const emptyVars = [];

  for (const varName of requiredEnvVars) {
    const value = process.env[varName];
    console.log('Checking var:', varName, 'value:', value);

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

  console.log('Environment check completed successfully');
}

module.exports = envGuard;