const ENV = process.env.NODE_END || 'development';
const environmentsPath = './environments/' + ENV.toLowerCase()

const config = require(environmentsPath);
module.exports = config;