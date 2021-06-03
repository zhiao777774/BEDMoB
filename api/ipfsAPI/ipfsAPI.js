import ipfsClient from 'ipfs-http-client';
import { encryptLongContent } from '@/api/encryptAPI/encrptAPI';


export async function upload(content, publicKey = undefined) {
    const ipfs = new ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

    if (publicKey) {
        content = encryptLongContent(publicKey, content);
        content = Buffer.from(content, 'utf-8');
    }

    const productContentAdded = await ipfs.add(content);
    const productContentHash = productContentAdded.path;

    return {
        hash: productContentHash,
        path: `https://ipfs.infura.io/ipfs/${productContentHash}`
    };
}