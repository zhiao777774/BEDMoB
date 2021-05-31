import { ObjectId } from 'mongodb';


export default {
    GET: (collection) => {
        return async (req, res) => {
            const doc = await req.db.collection(collection).find({}).toArray();
            res.json(doc);
        };
    },
    POST: (collection) => {
        return async (req, res) => {
            const { condition } = req.body;

            if (condition._id) {
                condition._id = new ObjectId(condition._id);
            }

            const doc = await req.db.collection(collection).findOne(condition);
            res.json(doc);
        };
    },
    PATCH: (collection) => {
        return async (req, res) => {
            const { condition, update, muti = false } = req.body;
            const col = req.db.collection(collection);

            if (condition._id) {
                condition._id = new ObjectId(condition._id);
            }

            if (muti) {
                col.updateMany(condition, { $set: update },
                    (err, res) => {
                        if (err) throw err;
                        console.log(`number of document updated on ${collection}: ${res.result.nModified}`);
                    });
            } else {
                col.updateOne(condition, { $set: update },
                    (err, res) => {
                        if (err) throw err;
                        console.log(`has one document updated on ${collection}`);
                    });
            }

            res.statusCode = 200;
            res.end();
        };
    },
    DELETE: (collection) => {
        return async (req, res) => {
            const { condition, muti = false } = req.body;
            const col = req.db.collection(collection);

            if (condition._id) {
                condition._id = new ObjectId(condition._id);
            }

            if (muti) {
                col.deleteMany(condition, (err, res) => {
                    if (err) throw err;
                    console.log(`number of document deleted on ${collection}: ${res.result.n}`);
                });
            } else {
                col.deleteOne(condition, (err, res) => {
                    if (err) throw err;
                    console.log(`has one document deleted on ${collection}`);
                });
            }

            res.statusCode = 200;
            res.end();
        };
    }
};