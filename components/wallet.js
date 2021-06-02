import React, { Component } from 'react';
import Dropdown from '@/components/dropdown';
import gas from '@/constants/contractMethodGas';
import BIoTCM, { web3 } from '@/utils/factory.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';


class Wallet extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selected: this.props.data.prices[0],
            disabled: false
        };
    }

    _transact = async () => {
        const { owner, consumer, productCount,
            prices, boundedErrors, _id } = this.props.data;
        const price = Number(this.state.selected);

        web3.eth.defaultAccount = consumer;
        const metaMaskAccounts = await web3.eth.getAccounts();
        if (metaMaskAccounts.length && metaMaskAccounts[0] !== consumer) {
            alert('請先將 MetaMask 切換至您的帳戶： ' + consumer);
            return;
        }

        if (confirm(`確定要轉帳 ${price} Wei 給 ${owner}?`)) {
            this.setState({ disabled: true });

            await window.ethereum.request({ method: 'eth_requestAccounts' });
            BIoTCM.methods.purchaseProductContent(productCount).send({
                from: consumer,
                gas: gas.purchaseProductContent,
                value: web3.utils.toWei(String(price), 'ether')
            }).then((txHash) => {
                console.log(txHash);

                fetch('/api/transaction', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'cache-control': 'no-store, max-age=0'
                    },
                    body: JSON.stringify({
                        owner, consumer,
                        productCount, price,
                        boundedError: boundedErrors[prices.indexOf(price)],
                        datasetID: _id,
                        txHash
                    })
                }).then((res) => {
                    if (res.ok) {
                        alert('交易請求成功!');
                        this.props.closeEvent();
                    } else {
                        alert('交易請求失敗');
                        this.setState({ disabled: false });
                    }
                });
            }).catch(() => {
                alert('交易已取消');
                this.setState({ disabled: false });
            });
        }
    }

    _setSelected = ({ target }) => {
        const selected = target.getAttribute('d-val');

        if (this.state.selected !== selected) {
            this.setState({ selected });
        }

        return selected;
    }

    render() {
        const { selected, disabled } = this.state;
        const { owner, consumer, description, prices, boundedErrors } = this.props.data;

        const selectedIdx = prices.indexOf(Number(selected));

        return (
            <div className="w-full h-full vertical-center">
                <div className="relative vertical-center rounded-xl font-oswald tracking-wide w-2/3 pt-6 pb-10 bg-indigo-800">
                    <div className="text-center my-5">
                        <span className="text-2xl text-white font-bold">資料集交易</span>
                        <span className="-top-4 -right-4 absolute rounded-full bg-white w-10 h-10 text-xl leading-6 pt-2 cursor-pointer"
                            onClick={this.props.closeEvent}>
                            ✖
                        </span>
                    </div>
                    <div className="mt-10">
                        <div className="px-8 text-white font-bold">
                            <div className="grid grid-cols-2 grid-rows-2 gap-x-16 gap-y-5">
                                <div className="row-span-2">
                                    <span className="text-sm ml-1">資料集描述</span>
                                    <textarea readOnly rows={7} value={description} className="rounded-xl w-full text-sm text-gray-900 bg-opacity-7 mt-2 px-5 py-3 bg-white focus:outline-none" style={{ resize: 'none' }}></textarea>
                                </div>
                                <div>
                                    <span className="text-sm ml-1">從</span>
                                    <div className="rounded-xl w-full text-center text-sm text-gray-900 bg-opacity-7 mt-2 px-5 py-3 bg-white">{consumer}</div>
                                    <div className="text-xs text-center mt-3 opacity-90">請確認錢包位址</div>
                                </div>
                                <div>
                                    <span className="text-sm ml-1">轉帳至</span>
                                    <div className="rounded-xl w-full text-center text-sm text-gray-900 bg-opacity-7 mt-2 px-5 py-3 bg-white">{owner}</div>
                                    <div className="text-xs text-center mt-3 opacity-90">請確認轉帳位址</div>
                                </div>
                            </div>
                            <hr className="my-10" />
                            <div className="text-left">
                                <div className="inline text-base">
                                    <Dropdown label="選擇希望支付的金額 (Wei)：" items={prices}
                                        selectedIndex={selectedIdx}
                                        onSelected={this._setSelected} />
                                </div>
                                <div className="my-5 inline ml-5">
                                    <FontAwesomeIcon icon={faArrowRight} />
                                    <span className="text-base ml-5">資料有限誤差值：{boundedErrors[selectedIdx]} %</span>
                                </div>
                            </div>
                            <div className="mt-10 vertical-center flex-row">
                                <button className={'btn  btn-lg rounded-xl w-max ' + (disabled ? 'bg-gray-300 cursor-not-allowed' : 'btn-success')}
                                    onClick={this._transact}>
                                    {disabled ? '交易處理中...' : '付款'}
                                </button>
                                <button className={'btn btn-lg rounded-xl w-max ml-6 ' + (disabled ? 'bg-gray-300 cursor-not-allowed' : 'btn-danger')}
                                    onClick={this.props.closeEvent}>
                                    取消交易
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Wallet;