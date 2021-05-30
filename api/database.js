import nextConnect from 'next-connect';
import { MongoClient } from 'mongodb';
import dbConfig from '@/constants/dbConfig';


export default class MongoDB {
    constructor(config) {
        if (!config.dbName)
            throw new Error('Database Name must be enteried.');

        const {
            dbName,
            userName = dbConfig.userName,
            password = dbConfig.password
        } = config;

        this._config = config;
        this.client = new MongoClient(
            `mongodb+srv://${userName}:${password}@bepdpp.ugq6q.mongodb.net/${dbName}?retryWrites=true&w=majority`,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        );
    }

    connect() {
        const middleware = nextConnect();
        middleware.use(async (req, res, next) => {
            if (!this.client.isConnected())
                await this.client.connect();

            req.dbClient = this.client;
            req.db = this.client.db(this._config.dbName);

            return next();
        });

        this.middleware = middleware;
    }

    close() {
        this.client.close();
    }
}