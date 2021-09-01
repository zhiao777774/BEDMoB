import JSEncrypt from 'node-jsencrypt';
import MultisigHMAC from 'multisig-hmac';
import crypto from 'crypto';
import eccrypto from 'eccrypto';
import { encryptLong, decryptLong } from '../../utils/encrypter';


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

export function multiSigEncrypt(message) {
    const data = Buffer.from(message);
    const multisigHmac = new MultisigHMAC();

    const k1 = multisigHmac.keygen(0);
    const k2 = multisigHmac.keygen(1);
    const s1 = multisigHmac.sign(k1, data);
    const s2 = multisigHmac.sign(k2, data);

    const signatures = [s1, s2];
    const signature = multisigHmac.combine(signatures);

    return {
        keys: [k1, k2],
        signature,
        signatures
    };
}

export function multiSigVerify(message, keys, signature, threshold = 2) {
    const data = Buffer.from(message);
    const multisigHmac = new MultisigHMAC();

    return multisigHmac.verify(keys, signature, data, threshold);
}

export async function ecdsaEncrypt(message, privateKey = undefined) {
    privateKey = privateKey || eccrypto.generatePrivate();
    const publicKey = eccrypto.getPublic(privateKey);

    const msg = crypto.createHash('sha256').update(message).digest();
    const signature = await eccrypto.sign(privateKey, msg);

    return { publicKey, signature, msgHash: msg };
}

export async function ecdsaVerify(message, publicKey, sig) {
    const msg = crypto.createHash('sha256').update(message).digest();

    const isValid = await eccrypto.verify(publicKey, msg, sig)
        .then(() => true)
        .catch(() => false);

    return isValid;
}