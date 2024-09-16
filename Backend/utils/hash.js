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

function createId(algorithm = 'sha256') {
  const uniqueId = crypto.randomBytes(16).toString('hex');

    const orderId = crypto.createHash(algorithm).update(uniqueId).digest('hex')

    return orderId.slice(0,12);
}

module.exports = {
  hash,
  createId,
}
