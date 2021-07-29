import React, { Component } from 'react';
import Link from 'next/link';
import { withRouter } from 'next/router';
import { withIronSession } from 'next-iron-session';
import Layout from '@/layouts/layout';
import cookieConfig from '@/constants/serverSideCookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as faHollowStar } from '@fortawesome/free-regular-svg-icons';


class WatchList extends Component {
    constructor(props) {
        super(props);

        this.data = this.props.watchList;
        this.dataSize = this.data.length;
        this.dropdownRef = React.createRef();

        this.state = {
            start: 0,
            end: 100 <= this.dataSize ? 99 : this.dataSize - 1,
            pageSize: 100,
            page: 1,
            selected: 100,
            orderby: '#',
            asc: true
        };
    }

    _setSelected = ({ target }) => {
        const selected = target.getAttribute('d-val') ||
            target.parentNode.getAttribute('d-val');
        const pageSize = Number(selected);

        if (this.state.selected !== selected) {
            this.setState({
                start: 0,
                end: pageSize <= this.dataSize ? pageSize - 1 : this.dataSize - 1,
                pageSize,
                page: 1
            });
        }

        return selected;
    };

    _switchPage = ({ target }) => {
        const event = target.getAttribute('d-event') ||
            target.parentNode.getAttribute('d-event');
        const { start, end, pageSize, page } = this.state;

        if (event === 'next' && start + pageSize <= this.dataSize) {
            this.setState({
                start: start + pageSize,
                end: end + pageSize > this.dataSize ? this.dataSize - 1 : end + pageSize,
                page: page + 1
            });
        } else if (event === 'prev' && start - pageSize >= 0) {
            this.setState({
                start: start - pageSize,
                end: start - 1,
                page: page - 1
            });
        }
    };

    _changePage = ({ target }) => {
        const page = Number(target.innerText);

        if (page !== this.state.page) {
            const { pageSize } = this.state;
            this.setState({
                start: page * pageSize - pageSize,
                end: page * pageSize - 1 > this.dataSize ? this.dataSize - 1 : page * pageSize - 1,
                page
            });
        }
    };

    _sort = ({ target }) => {
        const orderby = target.getAttribute('d-val');
        this.setState({
            orderby,
            asc: !this.state.asc
        });
    };

    render() {
        const { start, end, pageSize, page, selected, orderby, asc } = this.state;
        const { openPanel, datasetInfo } = this.state;
        const pageSizes = [100, 50, 20];
        const pageable = this.dataSize / pageSize > 1;
        const lastPageNumber = Math.ceil(this.dataSize / pageSize);

        const data = this.data.slice(start, end + 1);
        data.sort((item1, item2) => {
            switch (orderby) {
                case '#':
                    return (item1.productCount - item2.productCount) * (asc ? 1 : -1);
                case '描述':
                    const [n1, n2] = [item1.description.toUpperCase(), item2.description.toUpperCase()];
                    return (n1 < n2 ? -1 : 1) * (asc ? 1 : -1);
                case '價格(Wei)':
                    return (item1.price - item2.price) * (asc ? 1 : -1);
                case '擁有者':
                    const [o1, o2] = [item1.owner.toUpperCase(), item2.owner.toUpperCase()];
                    return (o1 < o2 ? -1 : 1) * (asc ? 1 : -1);
                case '歷史交易量':
                    return (item1.volume - item2.volume) * (asc ? 1 : -1);
                default:
                    break;
            }
        });

        return (
            <Layout user={this.props.user}>
                <div className="p-20">
                    <div className="mb-6 font-bold text-sm relative">
                        <button className="group absolute -bottom-2 left-3 btn btn-sm pt-2 text-blue-600 bg-indigo-100 hover:bg-indigo-200">
                            <Link prefetch={false} href="/watchlist">
                                <a>
                                    <FontAwesomeIcon icon={faHollowStar} size="sm" className="relative -top-0.5" />
                                    <span className="ml-2 relative -top-0.5">關注列表</span>
                                </a>
                            </Link>
                        </button>
                    </div>
                </div>
                <table className="min-w-full border border-l-0 border-r-0 border-gray-300 bg-white relative">
                    <thead>
                        <tr className="text-xs border-b border-gray-100 tracking-wider text-black">
                            <th className="sticky top-18 bg-indigo-50 z-40 p-3 pl-9 text-left"></th>
                            <th className="sticky top-18 bg-indigo-50 z-40 p-3 text-left leading-4 cursor-pointer" d-val="#" onClick={this._sort}>
                                #
                                        {
                                    orderby === '#' ?
                                        <FontAwesomeIcon icon={asc ? faSortUp : faSortDown} size="lg" className={'ml-1 ' + (asc ? 'pt-1' : 'pb-1')} /> :
                                        null
                                }
                            </th>
                            <th className="sticky top-18 bg-indigo-50 z-40 p-3 text-right leading-4 cursor-pointer" d-val="描述" onClick={this._sort}>
                                描述
                                        {
                                    orderby === '描述' ?
                                        <FontAwesomeIcon icon={asc ? faSortUp : faSortDown} size="lg" className={'ml-1 ' + (asc ? 'pt-1' : 'pb-1')} /> :
                                        null
                                }
                            </th>
                            <th className="sticky top-18 bg-indigo-50 z-40 p-3 text-right leading-4 cursor-pointer" d-val="價格(Wei)" onClick={this._sort}>
                                價格(Wei)
                                        {
                                    orderby === '價格(Wei)' ?
                                        <FontAwesomeIcon icon={asc ? faSortUp : faSortDown} size="lg" className={'ml-1 ' + (asc ? 'pt-1' : 'pb-1')} /> :
                                        null
                                }
                            </th>
                            <th className="sticky top-18 bg-indigo-50 z-40 p-3 text-center leading-4 cursor-pointer" d-val="擁有者" onClick={this._sort}>
                                擁有者
                                        {
                                    orderby === '擁有者' ?
                                        <FontAwesomeIcon icon={asc ? faSortUp : faSortDown} size="lg" className={'ml-1 ' + (asc ? 'pt-1' : 'pb-1')} /> :
                                        null
                                }
                            </th>
                            <th className="sticky top-18 bg-indigo-50 z-40 p-3 text-right leading-4 cursor-pointer" d-val="歷史交易量" onClick={this._sort}>
                                歷史交易量
                                        {
                                    orderby === '歷史交易量' ?
                                        <FontAwesomeIcon icon={asc ? faSortUp : faSortDown} size="lg" className={'ml-1 ' + (asc ? 'pt-1' : 'pb-1')} /> :
                                        null
                                }
                            </th>
                            <th className="sticky top-18 bg-indigo-50 z-40 p-3 pr-9"></th>
                        </tr>
                    </thead>
                    <tbody className="font-bold text-sm">
                        {
                            data.map(((datasetInfo) => {
                                const { _id, productCount, owner, description, prices, volume } = datasetInfo;

                                return (
                                    <tr key={_id} className="hover:bg-gray-50 border-b text-right">
                                        <td className="p-3 pl-9 text-gray-400 text-left">
                                            <FontAwesomeIcon icon={watchList.includes(_id) ? faSolidStar : faHollowStar}
                                                size="sm" className={'cursor-pointer ' + (watchList.includes(_id) ? 'text-yellow-400' : 'hover:text-yellow-400')}
                                                d-code={_id} onClick={this._collect} />
                                        </td>
                                        <td className="p-3 whitespace-no-wrap text-left">
                                            <div className="flex items-center">
                                                <div className="leading-5 text-gray-800">{productCount}</div>
                                            </div>
                                        </td>
                                        <td className="p-3 whitespace-no-wrap leading-5">
                                            {
                                                description.length > 10 ?
                                                    description.substring(0, 10) + '...' : description
                                            }
                                        </td>
                                        <td className="p-3 whitespace-no-wrap leading-5">{prices[0]} Wei {prices.length > 1 ? '...' : ''}</td>
                                        <td className="p-3 whitespace-no-wrap leading-5 text-center">
                                            <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                                                <span aria-hidden className="absolute inset-0 bg-green-200 opacity-50 rounded-full"></span>
                                                <span className="relative text-xs">{owner}</span>
                                            </span>
                                        </td>
                                        <td className="p-3 whitespace-no-wrap leading-5">{volume}</td>
                                        <td className="p-3 pr-9 whitespace-no-wrap border-b leading-5">
                                            <button className="btn btn-success btn-base" d-data={JSON.stringify(datasetInfo)} onClick={this._buy}>購買</button>
                                        </td>
                                    </tr>
                                );
                            }))
                        }
                    </tbody>
                </table>
            </Layout>
        );
    }
}

export default withRouter(WatchList);

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

        const protocol = req.headers['x-forwarded-proto'] || 'http';
        const baseUrl = req ? `${protocol}://${req.headers.host}` : '';

        const watchListRes = await fetch(
            baseUrl + `/api/collect?account=${(user && user.account) || 'undefined'}`);
        const watchList = await watchListRes.json();

        return {
            props: {
                user: user || 'undefined',
                watchList
            }
        };
    },
    cookieConfig
);