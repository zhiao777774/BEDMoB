import nextConnect from 'next-connect';
import { ironSession } from 'next-iron-session';
import md5 from 'md5';
import cookieConfig from '@/constants/serverSideCookie';
import MongoDB from '@/database';


const db = new MongoDB({ dbName: 'bepdpp' });
const session = ironSession(cookieConfig);
const handler = nextConnect();

db.connect();
handler.use(db.middleware).use(session);

handler.post(async (req, res) => {
    const { account, password } = req.body;
    const bias = '^vfbvbtadso!mpy';

    const doc = await req.db.collection('account')
        .findOne({ account: md5(md5(account + bias)) });
    if (doc) return res.status(403).end();

    await req.db.collection('account').insertOne({
        account: md5(md5(account + bias)),
        password: md5(md5(password + bias))
    });
    req.session.set('user', { account });
    await req.session.save();

    return res.status(201).end();
});


handler.delete(async (req, res) => {
    const { condition } = req.body;
    const col = req.db.collection(collection);

    col.deleteOne(condition, (err, res) => {
        if (err) throw err;
        console.log(`has one document deleted on ${collection}`);
    });
    await req.session.destroy('user');

    return res.status(201).end();
});

export default handler;