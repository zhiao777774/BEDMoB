import { Component } from 'react';
import { withRouter } from 'next/router';
import { withIronSession } from 'next-iron-session';
import Navbar from '@/components/navbar.js';
import cookieConfig from '@/constants/serverSideCookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleUp } from '@fortawesome/free-solid-svg-icons';


class TransactionPage extends Component {
    _removeAnchors = () => {
        const { router } = this.props;
        router.push(router.asPath.split('#')[0]);
    };

    render() {
        const { owner, code } = this.props.router.query;
        return (
            <div id="page-top">
                <Navbar user={this.props.user} />
                <main className="p-7 pt-28">
                    {owner}:{code}
                    <a className="scroll-to-top rounded hover:bg-gray-700"
                        href="#page-top" onClick={this._removeAnchors} >
                        <FontAwesomeIcon icon={faAngleUp} size="lg" />
                    </a>
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