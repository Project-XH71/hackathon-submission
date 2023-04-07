const crypto = require('crypto');
const configuration = require('./config.json');

module.exports.decryptData = (encryptedData, secretKey, secretVI)=> {
    const key = Buffer.from(secretKey, 'hex')
    const iv = Buffer.from(secretVI, 'hex')
    
    const buff = Buffer.from(encryptedData, 'base64')
    const decipher = crypto.createDecipheriv(configuration.ENCRYPTION_METHOD, key, iv)
    return (
      decipher.update(buff.toString('utf8'), 'hex', 'utf8') +
      decipher.final('utf8')
    ) // Decrypts data and converts to utf8
}