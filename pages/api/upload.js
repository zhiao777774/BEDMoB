import nextConnect from 'next-connect';
import md5 from 'md5';
import { ObjectId } from 'mongodb';
import gas from '@/constants/contractMethodGas';
import { upload } from '@/api/ipfsAPI/ipfsAPI';
import MongoDB from '@/database';
import BIoTCM from '@/utils/factory.js';


const db = new MongoDB({ dbName: 'bepdpp' });
const handler = nextConnect();

db.connect();
handler.use(db.middleware);

const collection = 'transaction';

handler.post(async (req, res) => {
    const { _id, data } = req.body;
    const { file, productCount, consumer, owner } = data;

    const bias = '^vfbvbtadso!mpy';
    const doc = await req.db.collection('account').findOne({
        account: md5(md5(consumer + bias))
    });
    const ipfsRes = await upload(file, doc.publicKey);

    await BIoTCM.methods.sendProductContent(
        productCount, ipfsRes.hash, consumer
    ).send({ from: owner, gas: gas.sendProductContent });

    await req.db.collection(collection)
        .updateOne({ _id: new ObjectId(_id) }, {
            $set: {
                datasetHash: ipfsRes.hash,
                datasetPath: ipfsRes.path,
                privateKey: ipfsRes.privateKey || '',
                state: 'done'
            }
        });

    const doc = await req.db.collection('dataset')
        .findOne({ productCount });
        
    req.db.collection('dataset')
        .updateOne({ productCount }, {
            $set: {
                volume: doc.volume + 1
            }
        });

    return res.status(201).end();
});

export default handler;