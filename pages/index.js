import React, { Component } from 'react';
import Link from 'next/link';
import { withRouter } from 'next/router';
import { withIronSession } from 'next-iron-session';
import Navbar from '@/components/navbar.js';
import PageTopButton from '@/components/pagetop';
import Dropdown from '@/components/dropdown';
import cookieConfig from '@/constants/serverSideCookie';
import { numberRange } from '@/utils/range';
import testData from '@/data/test.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortUp, faSortDown, faChevronLeft, faChevronRight, faStar as faSolidStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as faHollowStar } from '@fortawesome/free-regular-svg-icons';


class Index extends Component {
    constructor(props) {
        super(props);

        this.data = generateTestData(210) || testData;
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

    _collect = ({ target }) => {
        if (this.props.user === 'undefined') {
            this.props.router.push('/login');
        }
    };

    _buy = ({ target }) => {
        const url = target.getAttribute('d-code');
        this.props.router.push(`/transaction/${url}`);
    };

    render() {
        const { start, end, pageSize, page, selected, orderby, asc } = this.state;
        const pageSizes = [100, 50, 20];
        const pageable = this.dataSize / pageSize > 1;

        const data = this.data.slice(start, end + 1);
        data.sort((item1, item2) => {
            switch (orderby) {
                case '#':
                    return (item1.code - item2.code) * (asc ? 1 : -1);
                case '名稱':
                    const [n1, n2] = [item1.name.toUpperCase(), item2.name.toUpperCase()];
                    return (n1 < n2 ? -1 : 1) * (asc ? 1 : -1);
                case '價格(Wei)':
                    return (item1.price - item2.price) * (asc ? 1 : -1);
                case '擁有者':
                    const [o1, o2] = [item1.owner.toUpperCase(), item2.owner.toUpperCase()];
                    return (o1 < o2 ? -1 : 1) * (asc ? 1 : -1);
                case '交易量(24小時)':
                    return (item1.volume - item2.volume) * (asc ? 1 : -1);
                default:
                    break;
            }
        });

        return (
            <div id="page-top" className="pb-24">
                <Navbar user={this.props.user} />
                <main className="p-7 pt-28">
                    <div className="p-20">
                        <div className="mb-6 font-bold text-sm relative">
                            <button className="group absolute -bottom-2 left-3 btn btn-sm pt-2 bg-gray-200 hover:bg-gray-300">
                                <Link href="/watchlist">
                                    <a>
                                        <FontAwesomeIcon icon={faHollowStar} size="sm" className="relative -top-0.5 text-gray-500 group-hover:text-black" />
                                        <span className="ml-2 relative -top-0.5">關注列表</span>
                                    </a>
                                </Link>
                            </button>
                        </div>
                        <table className="min-w-full border border-l-0 border-r-0 border-gray-300 bg-white relative">
                            <thead>
                                <tr className="text-xs border-b border-gray-100 tracking-wider text-black">
                                    <th className="sticky top-18 bg-indigo-50 z-50 p-3 pl-9 text-left"></th>
                                    <th className="sticky top-18 bg-indigo-50 z-50 p-3 text-left leading-4 cursor-pointer" d-val="#" onClick={this._sort}>
                                        #
                                        {
                                            orderby === '#' ?
                                                <FontAwesomeIcon icon={asc ? faSortUp : faSortDown} size="lg" className={'ml-1 ' + (asc ? 'pt-1' : 'pb-1')} /> :
                                                null
                                        }
                                    </th>
                                    <th className="sticky top-18 bg-indigo-50 z-50 p-3 text-right leading-4 cursor-pointer" d-val="名稱" onClick={this._sort}>
                                        名稱
                                        {
                                            orderby === '名稱' ?
                                                <FontAwesomeIcon icon={asc ? faSortUp : faSortDown} size="lg" className={'ml-1 ' + (asc ? 'pt-1' : 'pb-1')} /> :
                                                null
                                        }
                                    </th>
                                    <th className="sticky top-18 bg-indigo-50 z-50 p-3 text-right leading-4 cursor-pointer" d-val="價格(Wei)" onClick={this._sort}>
                                        價格(Wei)
                                        {
                                            orderby === '價格(Wei)' ?
                                                <FontAwesomeIcon icon={asc ? faSortUp : faSortDown} size="lg" className={'ml-1 ' + (asc ? 'pt-1' : 'pb-1')} /> :
                                                null
                                        }
                                    </th>
                                    <th className="sticky top-18 bg-indigo-50 z-50 p-3 text-center leading-4 cursor-pointer" d-val="擁有者" onClick={this._sort}>
                                        擁有者
                                        {
                                            orderby === '擁有者' ?
                                                <FontAwesomeIcon icon={asc ? faSortUp : faSortDown} size="lg" className={'ml-1 ' + (asc ? 'pt-1' : 'pb-1')} /> :
                                                null
                                        }
                                    </th>
                                    <th className="sticky top-18 bg-indigo-50 z-50 p-3 text-right leading-4 cursor-pointer" d-val="交易量(24小時)" onClick={this._sort}>
                                        交易量(24小時)
                                        {
                                            orderby === '交易量(24小時)' ?
                                                <FontAwesomeIcon icon={asc ? faSortUp : faSortDown} size="lg" className={'ml-1 ' + (asc ? 'pt-1' : 'pb-1')} /> :
                                                null
                                        }
                                    </th>
                                    <th className="sticky top-18 bg-indigo-50 z-50 p-3 pr-9"></th>
                                </tr>
                            </thead>
                            <tbody className="font-bold text-sm">
                                {
                                    data.map((({ code, name, price, volume, owner }) => {
                                        return (
                                            <tr key={`${owner}-${code}`} className="hover:bg-gray-50 border-b text-right">
                                                <td className="p-3 pl-9 text-gray-400 text-left">
                                                    <FontAwesomeIcon icon={faHollowStar} size="sm" className="cursor-pointer hover:text-yellow-400" onClick={this._collect} />
                                                </td>
                                                <td className="p-3 whitespace-no-wrap text-left">
                                                    <div className="flex items-center">
                                                        <div>
                                                            <div className="leading-5 text-gray-800">{code}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-3 whitespace-no-wrap leading-5">{name}</td>
                                                <td className="p-3 whitespace-no-wrap leading-5">{price}</td>
                                                <td className="p-3 whitespace-no-wrap leading-5 text-center">
                                                    <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                                                        <span aria-hidden className="absolute inset-0 bg-green-200 opacity-50 rounded-full"></span>
                                                        <span className="relative text-xs">{owner}</span>
                                                    </span>
                                                </td>
                                                <td className="p-3 whitespace-no-wrap leading-5">{volume}</td>
                                                <td className="p-3 pr-9 whitespace-no-wrap border-b leading-5">
                                                    <button className="btn btn-success btn-base" d-code={`${owner}/${code}`} onClick={this._buy}>購買</button>
                                                </td>
                                            </tr>
                                        );
                                    }))
                                }
                            </tbody>
                        </table>
                        <div className="mt-6 font-bold text-sm relative">
                            <span className="absolute top-0 left-3">顯示 {this.dataSize} 中的 {start + 1}-{end + 1}</span>
                            <span className="absolute position-center">
                                <FontAwesomeIcon icon={faChevronLeft} size='lg' className="text-gray-700 mr-5 cursor-pointer" style={{ display: pageable ? '' : 'none' }} d-event="prev" onClick={pageable ? this._switchPage : undefined} />
                                <button className={'btn btn-primary rounded-lg px-3 py-2 mr-3 ' + (page === 1 ? '' : 'bg-white hover:bg-gray-100 text-black')} onClick={this._changePage}>1</button>
                                {
                                    page - 3 > 1 ?
                                        <button className="btn text-black rounded-lg px-3 py-2 mr-3">...</button> :
                                        null
                                }
                                {
                                    numberRange(page - 3 >= 2 ? 3 + page - 5 : 2, page <= 3 ? 7 : 7 + page - 4).map((i) => {
                                        if (i !== 1 && i >= Math.ceil(this.dataSize / pageSize)) return null;
                                        return <button key={`page-${i}`} className={'btn btn-primary rounded-lg px-3 py-2 mr-3 ' + (i === page ? '' : 'bg-white hover:bg-gray-100 text-black')} onClick={this._changePage}>{i}</button>;
                                    })
                                }
                                {
                                    this.dataSize / pageSize > page + 3 ?
                                        <button className="btn text-black rounded-lg px-3 py-2 mr-3">...</button> :
                                        null
                                }
                                <button className={'btn btn-primary rounded-lg px-3 py-2 mr-3 ' + (Math.ceil(this.dataSize / pageSize) === page ? '' : 'bg-white hover:bg-gray-100 text-black')} onClick={this._changePage}>{Math.ceil(this.dataSize / pageSize)}</button>
                                <FontAwesomeIcon icon={faChevronRight} size='lg' className="text-gray-700 ml-2 cursor-pointer" style={{ display: pageable ? '' : 'none' }} d-event="next" onClick={pageable ? this._switchPage : undefined} />
                            </span>
                            <span className="absolute -top-1.5 right-3">
                                <Dropdown lable="每頁顯示" items={pageSizes}
                                    selectedIndex={pageSizes.indexOf(selected)}
                                    onSelected={this._setSelected} ref={this.dropdownRef} />
                            </span>
                        </div>
                    </div>
                    <PageTopButton />
                </main>
            </div>
        );
    }
}

export default withRouter(Index);

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


function generateTestData(size = 0, owners) {
    owners = owners || ['unknown1', 'unknown2', 'unknown3', 'unknown4', 'unknown5'];
    return new Array(size).fill().map((_, i) => {
        return {
            code: String(i + 1),
            name: `test${i + 1}`,
            price: Math.random().toFixed(2),
            owner: owners[Math.floor(Math.random() * owners.length)],
            volume: Math.floor(Math.random() * 10000) + 1
        };
    });
}