const ENV = process.env;

export default {
    userName: ENV.DB_USERNAME,
    password: ENV.DB_PASSWORD
};