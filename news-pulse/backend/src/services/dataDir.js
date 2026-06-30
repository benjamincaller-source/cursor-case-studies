const path = require('path');
const os = require('os');

function getDataDir() {
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return path.join(os.tmpdir(), 'pulse-foot-data');
  }
  return path.join(__dirname, '../../data');
}

module.exports = { getDataDir };
