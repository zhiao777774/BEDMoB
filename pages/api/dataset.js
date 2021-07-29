import nextConnect from 'next-connect';
import gas from '@/constants/contractMethodGas';
import MongoDB from '@/database';
import adapter from '@/api/database.adapter';
import BIoTCM, { web3 } from '@/utils/factory';


const db = new MongoDB({ dbName: 'bepdpp' });
const handler = nextConnect();

db.connect();
handler.use(db.middleware)

const collection = 'dataset';

handler.get(adapter.GET(collection))
    .delete(adapter.DELETE(collection));

handler.post(async (req, res) => {
    const { account, description, prices, boundedErrors, privateKey } = req.body;

    /*
    await BIoTCM.methods.dataOwnerCreateContentProduct(
        description,
        prices.map((price) => web3.utils.toWei(String(price), 'ether')),
        boundedErrors
    ).send({ from: account, gas: gas.dataOwnerCreateContentProduct });
    */

    const data = await BIoTCM.methods.dataOwnerCreateContentProduct(
        description,
        prices.map((price) => web3.utils.toWei(String(price), 'ether')),
        boundedErrors
    ).encodeABI();
    const signedTx = await web3.eth.accounts.signTransaction(
        { from: account, to: BIoTCM.options.address, gas: gas.dataOwnerCreateContentProduct, data },
        privateKey
    );
    const txResult = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    console.log(txResult);

    const productCount = await BIoTCM.methods.ContentProductCount().call();

    await req.db.collection(collection).insertOne({
        owner: account,
        description,
        prices,
        boundedErrors,
        volume: 0,
        productCount: Number(productCount)
    });

    return res.status(201).end();
});

export default handler;