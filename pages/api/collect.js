import nextConnect from 'next-connect';
import md5 from 'md5';
import MongoDB from '@/database';


const db = new MongoDB({ dbName: 'bepdpp' });
const handler = nextConnect();

db.connect();
handler.use(db.middleware)
    .post(async (req, res) => {
        const { condition, update } = req.body;

        const bias = '^vfbvbtadso!mpy';
        condition['account'] = md5(md5(condition['account'] + bias));

        const doc = await req.db.collection('watch').findOne({
            account: condition['account']
        });

        if (doc) {
            await req.db.collection('watch')
                .updateOne(condition, { $set: update });
        } else {
            await req.db.collection('watch')
                .insertOne({
                    account: condition['account'],
                    watchList: condition['watchList']
                });
        }

        return res.status(201).end();
    });

export default handler;