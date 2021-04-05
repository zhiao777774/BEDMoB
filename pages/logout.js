import { Component } from 'react';
import Router from 'next/router';
import { withIronSession } from 'next-iron-session';
import cookieConfig from '@/constants/serverSideCookie';


export default class Logout extends Component {
    async _logout() {
        await fetch('/api/accounts', { method: 'DELETE' });
        return Router.push('/login');
    }

    render() {
        this._logout();
        return (<div>登出中...</div>);
    }
}

export const getServerSideProps = withIronSession(
    async ({ req, res }) => {
        const user = req.session.get('user');

        if (!user) {
            return {
                redirect: {
                    permanent: false,
                    destination: '/login'
                }
            };
        }

        return { props: {} };
    },
    cookieConfig
);