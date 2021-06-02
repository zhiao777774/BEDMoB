import nextConnect from 'next-connect';
import { ironSession } from 'next-iron-session';
import cookieConfig from '@/constants/serverSideCookie';
import MongoDB from '@/database';
import adapter from '@/api/database.adapter';
import { web3 } from '@/utils/factory.js';


const db = new MongoDB({ dbName: 'bepdpp' });
const session = ironSession(cookieConfig);
const handler = nextConnect();

db.connect();
handler.use(db.middleware).use(session);

const collection = 'transaction';

handler.delete(adapter.DELETE(collection));

handler.get(async (req, res) => {
    const { account } = req.query;
    const resultData = {};

    resultData['owner'] = await req.db.collection(collection).find({
        owner: account
    }).toArray();

    resultData['consumer'] = await req.db.collection(collection).find({
        consumer: account
    }).toArray();

    res.json(resultData);
});

handler.post(async (req, res) => {
    await req.db.collection(collection).insertOne(req.body);

    const balance = await web3.eth.getBalance(req.body.consumer, 'latest');
    let balanceWei = web3.utils.fromWei(balance.toString(), 'ether').toString();
    balanceWei = parseFloat(balanceWei).toFixed(2);

    const origin = req.session.get('user');
    await req.session.destroy('user');

    req.session.set('user', {
        balance: balanceWei,
        ...origin
    });
    await req.session.save();

    return res.status(201).end();
});

export default handler;