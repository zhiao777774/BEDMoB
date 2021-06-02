import nextConnect from 'next-connect';
import md5 from 'md5';
import MongoDB from '@/database';


const db = new MongoDB({ dbName: 'bepdpp' });
const handler = nextConnect();

db.connect();
handler.use(db.middleware);

handler.get(async (req, res) => {
    const { account } = req.query;

    const bias = '^vfbvbtadso!mpy';

    const doc = await req.db.collection('collection').findOne({
        account: md5(md5(account + bias))
    });

    res.json((doc && doc.watchList) || []);
});

handler.post(async (req, res) => {
    const { condition, update } = req.body;

    const bias = '^vfbvbtadso!mpy';
    condition['account'] = md5(md5(condition['account'] + bias));

    const doc = await req.db.collection('collection').findOne({
        account: condition['account']
    });

    if (doc) {
        await req.db.collection('collection')
            .updateOne(condition, { $set: update });
    } else {
        await req.db.collection('collection')
            .insertOne({
                account: condition['account'],
                watchList: update['watchList']
            });
    }

    return res.status(201).end();
});

export default handler;