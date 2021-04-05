import { withIronSession } from 'next-iron-session';
import cookieConfig from '@/constants/serverSideCookie';


const VALID_ACCOUNTS = ['owner', 'consumer'];
const VALID_PASSWORDS = ['owner', 'consumer'];

function _validate(account, password) {
    const idx = VALID_ACCOUNTS.indexOf(account);
    return idx !== -1 && VALID_PASSWORDS[idx] === password;
}

export default withIronSession(
    async (req, res) => {
        if (req.method === 'POST') {
            const { account, password } = req.body;

            if (_validate(account, password)) {
                req.session.set('user', { account });
                await req.session.save();
                return res.status(201).send('');
            }

            return res.status(403).send('');
        } else if (req.method === 'DELETE') {
            await req.session.destroy('user');
            return res.status(201).send('');
        }

        return res.status(404).send('');
    },
    cookieConfig
);