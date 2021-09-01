import nextConnect from 'next-connect';
import md5 from 'md5';
import { ObjectId } from 'mongodb';
import gas from '@/constants/contractMethodGas';
import { upload } from '@/api/ipfsAPI/ipfsAPI';
import { calculateBE } from '@/api/boundedErrorCalcAPI/boundedErrorCalcAPI';
import MongoDB from '@/database';
import BIoTCM, { web3 } from '@/utils/factory.js';


const db = new MongoDB({ dbName: 'bepdpp' });
const handler = nextConnect();

db.connect();
handler.use(db.middleware);

const collection = 'transaction';

handler.post(async (req, res) => {
    const { _id, data, privateKey } = req.body;
    const { content, productCount, consumer, owner, boundedError } = data;

    const bias = '^vfbvbtadso!mpy';
    const accountDoc = await req.db.collection('account').findOne({
        account: md5(md5(consumer + bias))
    });

    const result = calculateBE(content.split('\r\n').map((d) => Number(d)), boundedError * 0.01);
    const ipfsRes = await upload(result, accountDoc.publicKey, privateKey);

    /*
    await BIoTCM.methods.sendProductContent(
        productCount, ipfsRes.hash, consumer
    ).send({ from: owner, gas: gas.sendProductContent });
    */

    const methodData = await BIoTCM.methods.sendProductContent(
        productCount, ipfsRes.hash, consumer
    ).encodeABI();
    const signedTx = await web3.eth.accounts.signTransaction(
        { from: owner, to: BIoTCM.options.address, gas: gas.sendProductContent, data: methodData },
        privateKey
    );
    const txResult = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    console.log(txResult);

    await req.db.collection(collection)
        .updateOne({ _id: new ObjectId(_id) }, {
            $set: {
                datasetHash: ipfsRes.hash,
                datasetPath: ipfsRes.path,
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