import { decryptLongContent } from '@/api/encryptAPI/encrptAPI';


export default async (req, res) => {
    if (req.method === 'POST') {
        const { privateKey, fileContent } = req.body;
        res.json({
            decryptedResult: decryptLongContent(privateKey, fileContent)
        });
    }

    return res.status(500).end();
}