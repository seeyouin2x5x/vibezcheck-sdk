#!/usr/bin/env node

// Forward execution with 'examples' as default command
if (!process.argv.slice(2).some(arg => ['examples', 'example'].includes(arg))) {
  process.argv.splice(2, 0, 'examples');
}

require('../dist/cli/index.js');
