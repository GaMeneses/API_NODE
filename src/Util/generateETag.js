function generateETag(data) {
    const crypto = require('crypto');
    const hash = crypto.createHash('md5').update(JSON.stringify(data)).digest('hex');
    return `${hash}`;
}

module.exports = generateETag;