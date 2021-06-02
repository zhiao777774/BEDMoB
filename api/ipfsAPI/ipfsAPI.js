import ipfsClient from 'ipfs-http-client';


export async function upload(buffer) {
    const ipfs = new ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

    const productContentAdded = await ipfs.add(buffer);
    const productContentHash = productContentAdded.path;

    return {
        hash: productContentHash,
        path: `https://ipfs.infura.io/ipfs/${productContentHash}`
    };
}