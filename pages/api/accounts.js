import nextConnect from 'next-connect';
import { ironSession } from 'next-iron-session';
import md5 from 'md5';
import cookieConfig from '@/constants/serverSideCookie';
import gas from '@/constants/contractMethodGas';
import MongoDB from '@/database';
import BIoTCM, { web3 } from '@/utils/factory.js';


const db = new MongoDB({ dbName: 'bepdpp' });
const session = ironSession(cookieConfig);
const handler = nextConnect();

db.connect();
handler.use(db.middleware).use(session);

handler.post(async (req, res) => {
    let { privateKey } = req.body;
    if (!privateKey.startsWith('0x')) privateKey = '0x' + privateKey;
    const accountData = web3.eth.accounts.privateKeyToAccount(privateKey);

    if (accountData) {
        const account = accountData.address;
        const balance = await web3.eth.getBalance(account, 'latest');
        let balanceWei = web3.utils.fromWei(balance.toString(), 'ether').toString();
        balanceWei = parseFloat(balanceWei).toFixed(2);

        const bias = '^vfbvbtadso!mpy';
        const col = req.db.collection('account');
        const doc = await col.findOne({ account: md5(md5(account + bias)) });
        if (!doc) await col.insertOne({ account: md5(md5(account + bias)) });

        req.session.set('user', {
            account,
            balance: balanceWei,
            publicKey: (doc && doc.publicKey) || undefined
        });
        await req.session.save();
        return res.status(201).end();
    }

    return res.status(403).end();
});

handler.delete(async (req, res) => {
    await req.session.destroy('user');
    return res.status(201).end();
});

handler.patch(async (req, res) => {
    const { condition, update, privateKey } = req.body;

    if (update.publicKey) {
        /*
        await BIoTCM.methods.consumerRegisterProduct(update.publicKey)
            .send({ from: condition.account, gas: gas.consumerRegisterProduct })
            .catch((err) => {
                console.error(err);
                return res.status(403).end();
            });
        */

        const data = await BIoTCM.methods.consumerRegisterProduct(update.publicKey).encodeABI();
        const signedTx = await web3.eth.accounts.signTransaction(
            {
                from: condition.account,
                to: BIoTCM.options.address,
                gas: gas.consumerRegisterProduct,
                data
            },
            privateKey
        ).catch((err) => {
            console.error(err);
            return res.status(403).end();
        });
        const txResult = await web3.eth
            .sendSignedTransaction(signedTx.rawTransaction)
            .catch((err) => {
                console.error(err);
                return res.status(403).end();
            });
        console.log(txResult);

        const origin = req.session.get('user');
        await req.session.destroy('user');

        req.session.set('user', {
            publicKey: update.publicKey,
            ...origin
        });
        await req.session.save();
    }

    const bias = '^vfbvbtadso!mpy';
    condition['account'] && (condition['account'] = md5(md5(condition['account'] + bias)));

    await req.db.collection('account')
        .updateOne(condition, { $set: update });

    return res.status(201).end();
});

export default handler;