import React, { Component } from 'react';

class Wallet extends Component {
    constructor(props) {
        super(props);

        this.state = {
            status: 'send'
        };
    }

    _toggle = ({ target }) => {
        const status = target.getAttribute('d-val') ||
            target.parentNode.getAttribute('d-val');
        this.setState({ status });
    }

    render() {
        const { status } = this.state;
        const { payto } = this.props.data;

        return (
            <div className="rounded-xl grid grid-rows-4 w-96 font-oswald tracking-wide" style={{ backgroundColor: 'rgba(53, 41, 82)', height: '490px' }}>
                <div className="flex justify-center items-center">
                    <span className="text-2xl text-white font-bold">Transfer</span>
                </div>
                <div className="row-span-3">
                    <div className="grid grid-cols-2">
                        <button className="text-sm text-white font-bold focus:outline-none" d-val="send" onClick={this._toggle}>
                            <span className="pl-8">Send</span>
                            <div className={'h-0.5 ml-8 mt-2 ' + (status === 'send' ? 'bg-gradient-to-r from-red-300 via-purple-400 to-blue-300' : 'bg-white bg-opacity-30')} />
                        </button>
                        <button className="text-sm text-white font-bold focus:outline-none" d-val="applyFor" onClick={this._toggle}>
                            <span className="pr-8">Apply for</span>
                            <div className={'h-0.5 mr-8 mt-2 ' + (status === 'applyFor' ? 'bg-gradient-to-r from-red-300 via-purple-400 to-blue-300' : 'bg-white bg-opacity-30')} />
                        </button>
                    </div>
                    {
                        status === 'send' ?
                            (
                                <div className="px-8 text-white font-bold relative">

                                    <div className="relative top-6">
                                        <span className="text-xs ml-1">Pay to</span>
                                        <div className="rounded-xl w-full text-center text-sm bg-opacity-7 mt-1 py-2" style={{ backgroundColor: 'rgba(53, 41, 102)' }}>{payto}</div>
                                        <div className="text-xs text-center mt-3 opacity-70">Please enter the Wallet ID.</div>
                                    </div>
                                    <div className="relative top-12 grid grid-cols-2 gap-3">
                                        <div>
                                            <span className="text-xs ml-1">Amount</span>
                                            <div className="rounded-xl w-full text-left text-sm bg-opacity-75 mt-1 py-2 pl-4" style={{ backgroundColor: 'rgb(53, 41, 102)' }}>123456789</div>
                                        </div>
                                        <div>
                                            <span className="text-xs ml-1">Reason</span>
                                            <div className="rounded-xl w-full text-left text-sm bg-opacity-75 mt-1 py-2 pl-4" style={{ backgroundColor: 'rgb(53, 41, 102)' }}>123456789</div>
                                        </div>
                                    </div>
                                    <div className="relative top-20 grid grid-cols-3 text-xs">
                                        <div className="position-center">
                                            <span className="ml-4">Commision:</span>
                                            <span className="ml-3">$3</span>
                                        </div>
                                        <div className="position-center">|</div>
                                        <div className="position-center">
                                            <span className="-ml-6">Total:</span>
                                            <span className="ml-3">300.00</span>
                                        </div>
                                    </div>
                                    <div className="relative" style={{ top: '5.7rem' }}>
                                        <button className="btn rounded-2xl w-full text-center btn-lg bg-gradient-to-r from-red-300 via-purple-400 to-blue-300 bg-opacity-90">
                                            Send
                                        </button>
                                    </div>
                                </div>
                            )
                            :
                            (
                                <div className="px-8 text-white font-bold relative">

                                </div>
                            )
                    }
                </div>
            </div>
        );
    }
}

export default Wallet;