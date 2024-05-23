// This script generates a random private key

const crypto = require('crypto');
const key = crypto.randomBytes(64).toString('hex');
console.log(key);
