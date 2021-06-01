import nextConnect from 'next-connect';
import gas from '@/constants/contractMethodGas';
import MongoDB from '@/database';
import adapter from '@/api/database.adapter';
import BIoTCM, { web3 } from '@/utils/factory';


const db = new MongoDB({ dbName: 'bepdpp' });
const handler = nextConnect();

db.connect();
handler.use(db.middleware)

const collection = 'transaction';

handler.get(adapter.GET(collection))
    .delete(adapter.DELETE(collection));

handler.post(async (req, res) => {
    await req.db.collection(collection).insertOne(req.body);
    return res.status(201).end();
});

export default handler;