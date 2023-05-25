const crypto = require('crypto');
const configuration = require('./config.json');


// Encrypt data
module.exports.encryptData = (data) => {
    // const key = crypto.createHash('sha512').update(configuration.SECRET_KEY).digest('hex').substring(0, 32)
    // const encryptionIV = crypto.createHash('sha512').update(configuration.SECRET_IV).digest('hex').substring(0, 16)
    
    const key = crypto.randomBytes(32); // 256-bit key
    const encryptionIV = crypto.randomBytes(16); // 128-bit IV

    console.log("Ecy Key:",key);
    console.log("Ecy IV:",encryptionIV);

    
    const cipher = crypto.createCipheriv(configuration.ENCRYPTION_METHOD, key, encryptionIV)
    return {
        cipher: Buffer.from(cipher.update(data, 'utf8', 'hex') + cipher.final('hex')).toString('base64'),
        secretKey: key.toString('hex'),
        secretVI: encryptionIV.toString('hex')
    }
    
    // return Buffer.from(
    //   cipher.update(data, 'utf8', 'hex') + cipher.final('hex')
    // ).toString('base64') // Encrypts data and converts to hex and base64
}

