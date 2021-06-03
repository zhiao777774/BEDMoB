import JSEncrypt from 'node-jsencrypt';
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