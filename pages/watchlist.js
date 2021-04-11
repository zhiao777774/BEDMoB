import { Component } from 'react';
import Link from 'next/link';
import { withRouter } from 'next/router';
import { withIronSession } from 'next-iron-session';
import Navbar from '@/components/navbar.js';
import PageTopButton from '@/components/pagetop';
import cookieConfig from '@/constants/serverSideCookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as faHollowStar } from '@fortawesome/free-regular-svg-icons';


class WatchList extends Component {
    render() {
        return (
            <div id="page-top">
                <Navbar user={this.props.user} />
                <main className="p-7 pt-28">
                    <div className="p-20">
                        <div className="mb-6 font-bold text-sm relative">
                            <button className="group absolute -bottom-2 left-3 btn btn-sm pt-2 text-blue-600 bg-indigo-100 hover:bg-indigo-200">
                                <Link href="/watchlist">
                                    <a>
                                        <FontAwesomeIcon icon={faHollowStar} size="sm" className="relative -top-0.5" />
                                        <span className="ml-2 relative -top-0.5">關注列表</span>
                                    </a>
                                </Link>
                            </button>
                        </div>
                        {
                            this.props.user === 'undefined' ?
                                <div>

                                </div> :
                                <table></table>
                        }
                    </div>
                    <PageTopButton />
                </main>
            </div >
        );
    }
}

export default withRouter(WatchList);

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