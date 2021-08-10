import JSEncrypt from 'node-jsencrypt';
import MultisigHMAC from 'multisig-hmac';
import crypto from 'crypto';
import eccrypto from 'eccrypto';
import { encryptLong, decryptLong } from '@/utils/encrypter';


JSEncrypt.prototype.encryptLong = encryptLong;
JSEncrypt.prototype.decryptLong = decryptLong;

export function encryptLongContent(publicKey, message) {
    const encrypter = new JSEncrypt();
    encrypter.setPublicKey(publicKey);

    return encrypter.encryptLong(message);
}

export function decryptLongContent(privateKey, message) {
    const decrypter = new JSEncrypt();
    decrypter.setPrivateKey(privateKey);

    return decrypter.decryptLong(message);
}

export function multiSigEncrypt(message, ownerKey = undefined, consumerKey = undefined) {
    const data = Buffer.from(message);
    const multisigHmac = new MultisigHMAC();

    const randomIndex = (max) => Math.floor(Math.random() * max) + 1;
    const maxRange = Math.pow(2, 32) - 1;
    
    const k1 = multisigHmac.keygen(ownerKey || randomIndex(maxRange));
    const k2 = multisigHmac.keygen(consumerKey || randomIndex(maxRange));
    const s1 = multisigHmac.sign(k1, data);
    const s2 = multisigHmac.sign(k2, data);

    const signature = multisigHmac.combine([s1, s2]);

    return {
        keys: [k1, k2],
        signature
    };
}

export function multiSigVerify(message, keys, signature, threshold = 2) {
    const data = Buffer.from(message);
    const multisigHmac = new MultisigHMAC();

    return multisigHmac.verify(keys, signature, data, threshold);
}

export async function ecdsaEncrypt(message, privateKey = undefined) {
    privateKey ||= eccrypto.generatePrivate();
    const publicKey = eccrypto.getPublic(privateKey);

    const msg = crypto.createHash('sha256').update(message).digest('hex');
    const sig = await eccrypto.sign(privateKey, msg);

    return { publicKey, sig, msgHash: msg };
}

export function ecdsaVerify(message, publicKey, sig) {
    const msg = crypto.createHash('sha256').update(message).digest('hex');
    const isValid = false;

    eccrypto.verify(publicKey, msg, sig)
        .then(() => isValid = true)
        .catch(() => isValid = false);

    return isValid;
}