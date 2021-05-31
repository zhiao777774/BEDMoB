import React, { Component } from 'react';
import Dropdown from '@/components/dropdown';
import BIoTCM, { web3 } from '@/utils/factory.js';


class Wallet extends Component {
    constructor(props) {
        super(props);

        this.state = { selected: this.props.data.prices[0] };
    }

    _transact = ({ target }) => {
        const { owner } = this.props.data;
        const price = Number(this.state.selected)

        if (confirm(`確定要轉帳 ${price} Wei 給 ${owner}?`)) {
            BIoTCM
            ethereum.request({ method: 'eth_requestAccounts' });
            web3.eth.sendTransaction({
                from: walletAddr,
                to: owner,
                value: web3.util.toWei(String(price), 'ether'),
                gas: 3000000
            }).then((txHash) => {
                console.log(txHash);
                alert('交易成功!');
            }).catch(() => {
                alert('交易已取消!');
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
        const { selected } = this.state;
        const { owner, consumer, description, prices, boundedErrors } = this.props.data;

        const selectedIdx = prices.indexOf(Number(selected));

        return (
            <div className="w-full h-full vertical-center">
                <div className="vertical-center rounded-xl font-oswald tracking-wide w-2/3 pt-6 pb-10" style={{ backgroundColor: 'rgba(53, 41, 82)' }}>
                    <div className="text-center my-5">
                        <span className="text-2xl text-white font-bold">資料集交易</span>
                    </div>
                    <div className="mt-10">
                        <div className="px-8 text-white font-bold">
                            <div className="grid grid-cols-2 grid-rows-2 gap-x-16 gap-y-6">
                                <div className="row-span-2">
                                    <span className="text-sm ml-1">資料集描述</span>
                                    <textarea readOnly rows={7} value={description} className="rounded-xl w-full text-sm bg-opacity-7 mt-1 p-3" style={{ backgroundColor: 'rgba(53, 41, 102)', resize: 'none' }}></textarea>
                                </div>
                                <div>
                                    <span className="text-sm ml-1">從</span>
                                    <div className="rounded-xl w-full text-center text-sm bg-opacity-7 mt-1 px-5 py-3" style={{ backgroundColor: 'rgba(53, 41, 102)' }}>{consumer}</div>
                                    <div className="text-xs text-center mt-3 opacity-70">請確認錢包位址</div>
                                </div>
                                <div>
                                    <span className="text-sm ml-1">轉帳至</span>
                                    <div className="rounded-xl w-full text-center text-sm bg-opacity-7 mt-1 px-5 py-3" style={{ backgroundColor: 'rgba(53, 41, 102)' }}>{owner}</div>
                                    <div className="text-xs text-center mt-3 opacity-70">請確認轉帳位址</div>
                                </div>
                            </div>
                            <hr className="my-10" />
                            <div className="text-left">
                                <div className="inline text-base">
                                    <Dropdown label="選擇希望支付的金額 (單位為 Wei) " items={prices}
                                        selectedIndex={selectedIdx}
                                        onSelected={this._setSelected} />
                                </div>
                                <div className="my-5 inline ml-5">
                                    <span className="text-base">{'->'}　資料有限誤差為：{boundedErrors[selectedIdx]} %</span>
                                </div>
                            </div>
                            <div className="mt-10">
                                <button className="btn rounded-2xl w-full text-center btn-lg bg-gradient-to-r from-red-300 via-purple-400 to-blue-300 hover:from-red-400 hover:via-purple-500 hover:to-blue-400"
                                    onClick={this._transact}>
                                    付款
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