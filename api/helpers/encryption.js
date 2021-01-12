const crypto = require('crypto');

const config = require('../../config/config');

exports.encrypt = word => {
    let cipher = crypto.createCipheriv(
        'aes-256-cbc',
        Buffer.from(Buffer.from(config.encryption.key,"hex")),
        Buffer.from(config.encryption.iv, "hex")
    );
    let encrypted = cipher.update(word);
    encrypted = Buffer.concat([encrypted, cipher.final()]);;
    return encrypted.toString('hex');
}

exports.decrypt = word => {
 	let decipher = crypto.createDecipheriv(
        'aes-256-cbc', 
        Buffer.from(Buffer.from(config.encryption.key,"hex")),
        Buffer.from(config.encryption.iv, "hex")
    );
 	let decrypted = decipher.update(Buffer.from(word, 'hex'));
 	decrypted = Buffer.concat([decrypted, decipher.final()]);
 	return decrypted.toString();
}
