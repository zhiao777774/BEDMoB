import nextConnect from 'next-connect';
import MongoDB from '@/database';
import dbAdapter from '@/api/database.adapter';


const db = new MongoDB({ dbName: 'bepdpp' });
db.connect();

export default nextConnect()
    .use(db.middleware)
    .post(dbAdapter.POST('dataset'));