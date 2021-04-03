const ENV = process.env;

export default {
    cookieName: ENV.COOKIE_NAME,
    cookieOptions: {
        secure: ENV.NODE_ENV === 'production'
    },
    password: ENV.APPLICATION_SECRET
};