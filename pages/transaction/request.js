import React, { Component } from 'react';
import Router from 'next/router';
import { withIronSession } from 'next-iron-session';
import Layout from '@/layouts/layout';
import Dropdown from '@/components/dropdown';
import cookieConfig from '@/constants/serverSideCookie';
import gas from '@/constants/contractMethodGas';
import BIoTCM, { web3 } from '@/utils/factory.js';
import { numberRange } from '@/utils/range';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortUp, faSortDown, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';


export default class Requester extends Component {
    constructor(props) {
        super(props);

        this.data = this.props.transactionData['owner'];
        this.dataSize = this.data.length;
        this.dropdownRef = React.createRef();

        this.state = {
            start: 0,
            end: 100 <= this.dataSize ? 99 : this.dataSize - 1,
            pageSize: 100,
            page: 1,
            selected: 100,
            orderby: '#',
            asc: true,
            display: 'owner',
            file: {},
            btnUpload: {}
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

    _setDataDisplay = ({ target }) => {
        const type = target.getAttribute('d-type');

        this.data = this.props.transactionData[type];
        this.dataSize = this.data.length;
        this.setState(({
            display: type,
            start: 0,
            end: 100 <= this.dataSize ? 99 : this.dataSize - 1,
            pageSize: 100,
            page: 1,
            selected: 100,
            orderby: '#',
            asc: true
        }));
    }

    _handleFileUpload = async ({ target }) => {
        const id = target.getAttribute('d-id');
        const tData = JSON.parse(target.getAttribute('d-data'));
        const content = await this._getFileContent(target.files[0]);

        this.setState({
            file: {
                ...this.state.file,
                [id]: {
                    ...tData,
                    content
                }
            }
        });
    };

    _upload = async ({ target }) => {
        const id = target.getAttribute('d-id');
        const data = this.state.file[id];

        if (!data) {
            alert('請上傳資料集');
            return;
        }

        this.setState({
            btnUpload: {
                ...this.state.btnUpload,
                [id]: { disabled: true }
            }
        });

        const res = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                data,
                _id: id
            })
        });

        if (res.ok) {
            alert('資料集傳送成功');
            Router.reload();
        } else {
            alert('資料集傳送失敗');
        }

        this.setState({
            btnUpload: {
                ...this.state.btnUpload,
                [id]: { disabled: false }
            }
        });
    };

    _queryProductHash = async (productCount, consumer) => {
        const metaMaskAccounts = await web3.eth.getAccounts();
        if (metaMaskAccounts.length && metaMaskAccounts[0] !== consumer) {
            alert('請先將 MetaMask 切換至您的帳戶： ' + consumer);
            return;
        }

        BIoTCM.methods.queryProductContent(productCount)
            .send({ from: consumer, gas: gas.queryProductContent })
            .then((queryRes) => {
                const fileHash = queryRes.events.ProductContentQuery.returnValues.fileHash;
                const datasetPath = `https://ipfs.infura.io/ipfs/${fileHash}`;
                alert(`資料集Hash值：\r\n${fileHash}\r\n\r\n資料集位址：\r\n${datasetPath}`);

                if (confirm('前往資料集下載位址嗎?')) {
                    window.open(datasetPath, '_blank');
                }
            })
            .catch(() => {
                alert('資料集查詢已取消');
                return;
            });
    };

    _getFileContent = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                resolve(reader.result);
            });
            reader.readAsText(file);
        })
    };

    render() {
        const { start, end, pageSize, page, selected, orderby, asc } = this.state;
        const { display, btnUpload } = this.state;
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
                case '資料有限誤差':
                    return (item1.boundedError - item2.boundedError) * (asc ? 1 : -1);
                case '資料集購買者':
                    const [c1, c2] = [item1.consumer.toUpperCase(), item2.consumer.toUpperCase()];
                    return (c1 < c2 ? -1 : 1) * (asc ? 1 : -1);
                case '資料集擁有者':
                    const [o1, o2] = [item1.owner.toUpperCase(), item2.owner.toUpperCase()];
                    return (o1 < o2 ? -1 : 1) * (asc ? 1 : -1);
                default:
                    break;
            }
        });

        return (
            <Layout user={this.props.user} selectedIdx={1}>
                <div className="p-20">
                    <div className="mb-4 font-bold text-sm relative">
                        <button className={'btn ' + (display === 'owner' ? 'btn-primary' : 'btn-secondary')} d-type="owner" onClick={this._setDataDisplay}>
                            Owner
                        </button>
                        <button className={'btn ml-5 ' + (display === 'consumer' ? 'btn-primary' : 'btn-secondary')} d-type="consumer" onClick={this._setDataDisplay}>
                            Consumer
                        </button>
                    </div>
                    <table className="min-w-full border border-l-0 border-r-0 border-gray-300 bg-white relative">
                        <thead>
                            <tr className="text-xs border-b border-gray-100 tracking-wider text-black">
                                <th className="sticky top-18 bg-indigo-50 z-40 p-3 text-left leading-4 cursor-pointer pl-9" d-val="#" onClick={this._sort}>
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
                                <th className="sticky top-18 bg-indigo-50 z-40 p-3 text-right leading-4 cursor-pointer" d-val="資料有限誤差" onClick={this._sort}>
                                    資料有限誤差
                                        {
                                        orderby === '資料有限誤差' ?
                                            <FontAwesomeIcon icon={asc ? faSortUp : faSortDown} size="lg" className={'ml-1 ' + (asc ? 'pt-1' : 'pb-1')} /> :
                                            null
                                    }
                                </th>
                                {
                                    display === 'owner' ?
                                        <th className="sticky top-18 bg-indigo-50 z-40 p-3 text-center leading-4 cursor-pointer" d-val="資料集購買者" onClick={this._sort}>
                                            資料集購買者
                                        {
                                                orderby === '資料集購買者' ?
                                                    <FontAwesomeIcon icon={asc ? faSortUp : faSortDown} size="lg" className={'ml-1 ' + (asc ? 'pt-1' : 'pb-1')} /> :
                                                    null
                                            }
                                        </th>
                                        : null
                                }
                                {
                                    display === 'consumer' ?
                                        <th className="sticky top-18 bg-indigo-50 z-40 p-3 text-center leading-4 cursor-pointer" d-val="資料集擁有者" onClick={this._sort}>
                                            資料集擁有者
                                        {
                                                orderby === '資料集擁有者' ?
                                                    <FontAwesomeIcon icon={asc ? faSortUp : faSortDown} size="lg" className={'ml-1 ' + (asc ? 'pt-1' : 'pb-1')} /> :
                                                    null
                                            }
                                        </th>
                                        : null
                                }
                                <th className="sticky top-18 bg-indigo-50 z-40 p-3 pr-9"></th>
                            </tr>
                        </thead>
                        <tbody className="font-bold text-sm">
                            {
                                data.map((({ _id, productCount, description, price, boundedError, owner, consumer,
                                    state = 'request', datasetHash = undefined, datasetPath = undefined }) => {
                                    return (
                                        <tr key={_id} className="hover:bg-gray-50 border-b text-right">
                                            <td className="p-3 whitespace-no-wrap text-left pl-9">
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
                                            <td className="p-3 whitespace-no-wrap leading-5">{price} Wei</td>
                                            <td className="p-3 whitespace-no-wrap leading-5">{boundedError}</td>
                                            <td className="p-3 whitespace-no-wrap leading-5 text-center">
                                                <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                                                    <span aria-hidden className="absolute inset-0 bg-green-200 opacity-50 rounded-full"></span>
                                                    <span className="relative text-xs">
                                                        {display === 'owner' ? consumer : owner}
                                                    </span>
                                                </span>
                                            </td>
                                            <td className="p-3 pr-9 whitespace-no-wrap border-b leading-5">
                                                {
                                                    display === 'owner' ?
                                                        (
                                                            state === 'done' ?
                                                                <button className="btn btn-danger"
                                                                    onClick={() => alert(`資料集Hash值：\r\n${datasetHash}\r\n\r\n資料集儲存位址：\r\n${datasetPath}`)}>
                                                                    查看資料集位址
                                                                </button>
                                                                :
                                                                <div>
                                                                    <input type="file" disabled={btnUpload[_id] && btnUpload[_id].disabled}
                                                                        onChange={this._handleFileUpload} d-id={_id}
                                                                        d-data={JSON.stringify({ productCount, owner, consumer })}
                                                                    />
                                                                    <button d-id={_id} className={'btn ' + (btnUpload[_id] && btnUpload[_id].disabled ? 'bg-gray-300 cursor-not-allowed' : 'btn-success')}
                                                                        onClick={this._upload}>
                                                                        {btnUpload[_id] && btnUpload[_id].disabled ? '上傳中' : '資料集上傳'}
                                                                    </button>
                                                                </div>
                                                        )
                                                        :
                                                        <div>
                                                            <button className={'btn ' + (state === 'done' ? 'btn-success' : 'bg-red-500 text-white cursor-default')}
                                                                onClick={
                                                                    state === 'done' ?
                                                                        () => this._queryProductHash(productCount, consumer)
                                                                        : null
                                                                }>
                                                                {state === 'done' ? '交易已完成' : '資料集請求中'}
                                                            </button>
                                                        </div>
                                                }
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
                                    if (i !== 1 && i >= lastPageNumber) return null;
                                    return <button key={`page-${i}`} className={'btn btn-primary rounded-lg px-3 py-2 mr-3 ' + (i === page ? '' : 'bg-white hover:bg-gray-100 text-black')} onClick={this._changePage}>{i}</button>;
                                })
                            }
                            {
                                this.dataSize / pageSize > page + 3 ?
                                    <button className="btn text-black rounded-lg px-3 py-2 mr-3">...</button> :
                                    null
                            }
                            {
                                lastPageNumber !== 1 ?
                                    <button className={'btn btn-primary rounded-lg px-3 py-2 mr-3 ' + (lastPageNumber === page ? '' : 'bg-white hover:bg-gray-100 text-black')} onClick={this._changePage}>{lastPageNumber}</button> :
                                    null
                            }
                            <FontAwesomeIcon icon={faChevronRight} size='lg' className="text-gray-700 ml-2 cursor-pointer" style={{ display: pageable ? '' : 'none' }} d-event="next" onClick={pageable ? this._switchPage : undefined} />
                        </span>
                        <span className="absolute -top-1.5 right-3">
                            <Dropdown label="每頁顯示" items={pageSizes}
                                selectedIndex={pageSizes.indexOf(selected)}
                                onSelected={this._setSelected} ref={this.dropdownRef} />
                        </span>
                    </div>
                </div>
            </Layout>
        );
    }
}

export const getServerSideProps = withIronSession(
    async ({ req, res }) => {
        const user = req.session.get('user');

        if (user) {
            const protocol = req.headers['x-forwarded-proto'] || 'http';
            const baseUrl = req ? `${protocol}://${req.headers.host}` : '';

            const [transactionData, dataset] = await Promise.all(
                [`/api/transaction?account=${user.account}`, '/api/dataset'].map(url =>
                    fetch(baseUrl + url).then(res => res.json())
                ));

            transactionData['owner'] = transactionData['owner'].map((data) => {
                return {
                    ...data,
                    description: dataset.filter(({ _id }) =>
                        _id === data.datasetID)[0].description
                };
            });

            transactionData['consumer'] = transactionData['consumer'].map((data) => {
                return {
                    ...data,
                    description: dataset.filter(({ _id }) =>
                        _id === data.datasetID)[0].description
                };
            });

            return {
                props: {
                    user: user || 'undefined',
                    transactionData
                }
            };
        }

        return {
            redirect: {
                permanent: false,
                destination: '/'
            }
        };
    },
    cookieConfig
);