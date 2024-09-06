const crypto = require('crypto')

/**
 * @function hash
 * @param {string} data
 * @param {string} salt
 * @param {string} algorithm
 * @return {string} Hashed Value
 */
function hash(data, salt, algorithm = 'sha256') {
  return crypto.createHmac(algorithm, salt).update(data).digest('hex')
}

module.exports = {
  hash,
}
