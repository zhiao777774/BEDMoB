import { Component } from 'react';
import { withRouter } from 'next/router';
import { withIronSession } from 'next-iron-session';
import Navbar from '@/components/navbar.js';
import PageTopButton from '@/components/pagetop';
import Wallet from '@/components/wallet';
import cookieConfig from '@/constants/serverSideCookie';


class TransactionPage extends Component {
    render() {
        const { owner, code } = this.props.router.query;
        return (
            <div id="page-top">
                <Navbar user={this.props.user} />
                <main className="p-7 pt-28">
                    <Wallet data={{ payto: owner }} />
                    <PageTopButton />
                </main>
            </div >
        );
    }
}

export default withRouter(TransactionPage);

export const getServerSideProps = withIronSession(
    async ({ req, res }) => {
        return {
            props: {
                user: req.session.get('user') || 'undefined'
            }
        };
    },
    cookieConfig
);