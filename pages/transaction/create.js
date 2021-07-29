import { Component } from 'react';
import Link from 'next/link';
import { withRouter } from 'next/router';
import { withIronSession } from 'next-iron-session';
import Layout from '@/layouts/layout';
import cookieConfig from '@/constants/serverSideCookie';
import { numberRange } from '@/utils/range';


class Register extends Component {
    constructor(props) {
        super(props);

        this.state = {
            combinationSize: 1,
            disabled: false,
            prices: [],
            boundedErrors: []
        };
        this.initialData = {
            description: '',
            prices: [],
            boundedErrors: []
        };
    }

    _insert = async (event) => {
        event.preventDefault();

        if (this.state.disabled) return;

        const postData = {};
        ['description', 'prices', 'boundedErrors'].forEach((item) => {
            postData[item] = this.state[item];
        });

        if (!postData.prices.length || postData.prices.includes(0)) {
            alert('金額不可為0');
            return;
        }

        if (confirm('確定新增?')) {
            this.setState({ disabled: true });

            const privateKey = prompt('輸入您的錢包私鑰，以作為交易簽章使用');
            if (!privateKey) {
                alert('請輸入錢包私鑰');
                this.setState({ disabled: false });
                return;
            }

            const res = await fetch('/api/dataset', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    account: this.props.user.account,
                    privateKey,
                    ...postData
                })
            }).catch(() => {
                alert('資料集新增失敗，請稍後再試');
            });

            if (res.ok) {
                alert('資料集新增成功!');
                this.props.router.push({
                    pathname: '/'
                });
            } else {
                alert('資料集新增失敗，請稍後再試');
                this.setState({ disabled: false });
            }
        }
    };

    componentDidMount() {
        if (!this.props.user.publicKey) {
            alert('請先完成公鑰設定');
            this.props.router.push('/profile');
        }
    }

    render() {
        const { combinationSize, disabled } = this.state;
        const fieldStyle = 'shadow appearance-none border rounded w-full py-2 px-3 ' +
            'text-gray-700 leading-tight focus:outline-none focus:shadow-outline';

        return (
            <Layout user={this.props.user} selectedIdx={2}>
                <div className="border-4 rounded-3xl mx-3 mr-8">
                    <form className="px-8 py-10 w-1/2 m-center" onSubmit={this._insert}>
                        <span className="block text-gray-700 font-bold mb-2 text-2xl text-center">
                            新增資料集
                        </span>
                        <br />

                        <div className="mb-8">
                            <label className="text-gray-700 font-bold mb-2" htmlFor="account">
                                資料擁有者
                            </label>
                            <input id="account" name="account" className={fieldStyle + ' mt-2'} type="text" value={this.props.user.account} readOnly />
                        </div>

                        <div className="mb-8">
                            <label className="text-gray-700 font-bold mb-2" htmlFor="description">
                                描述 (最多20個字)
                            </label>
                            <button type="button" className="ml-4 mb-2 btn btn-sm btn-warning" onClick={() => this.setState({ description: '' })}>清空</button>
                            <input id="description" name="description" className={fieldStyle} type="text"
                                maxLength={20} value={this.state.description ?? this.initialData.description}
                                onChange={({ target }) => this.setState({ description: target.value })}
                                onKeyUp={({ target }) => target.value = target.value.slice(0, 500)}
                                required />
                        </div>

                        <div className="mb-12">
                            <label className="text-gray-700 font-bold mb-2">
                                有限誤差與金額 (單位為Wei)
                            </label>
                            <button type="button" className="ml-4 mb-2 btn btn-sm btn-warning"
                                onClick={() => this.setState({
                                    prices: this.initialData.prices,
                                    boundedErrors: this.initialData.boundedErrors,
                                    combinationSize: 1
                                })}>
                                重置
                            </button>
                            <button type="button" className="ml-6 mb-2 btn btn-sm btn-warning"
                                onClick={() => {
                                    if (combinationSize === 3) {
                                        alert('最多三種金額');
                                        return;
                                    } 
                                    this.setState({ combinationSize: combinationSize + 1 });
                                }}>
                                新增欄位
                            </button>
                            {
                                numberRange(0, combinationSize).map((n) => {
                                    return (
                                        <div key={n} className={'grid grid-cols-9 w-11/12 ' + (n ? 'mt-6' : 'mt-2')}>
                                            <div className="col-span-4 grid grid-cols-6 h-8">
                                                <div className="btn btn-primary rounded-r-none shadow text-center flex flex-col content-center justify-center">誤差</div>
                                                <input className={fieldStyle + ' rounded-l-none col-span-4 w-auto h-auto'} type="text"
                                                    onChange={({ target }) => {
                                                        const { boundedErrors } = this.state;
                                                        boundedErrors[n] = Number(target.value);
                                                        this.setState({ boundedErrors });
                                                    }}
                                                    value={this.state.boundedErrors && this.state.boundedErrors[n] ? this.state.boundedErrors[n] : 0}
                                                    required />
                                            </div>
                                            <div className="col-span-4 grid grid-cols-6 h-8">
                                                <div className="btn btn-primary rounded-r-none shadow text-center flex flex-col content-center justify-center">金額</div>
                                                <input className={fieldStyle + ' rounded-l-none col-span-4 w-auto h-auto'} type="text"
                                                    onChange={({ target }) => {
                                                        const { prices } = this.state;
                                                        prices[n] = Number(target.value);
                                                        this.setState({ prices });
                                                    }}
                                                    value={this.state.prices && this.state.prices[n] ? this.state.prices[n] : 0}
                                                    required />
                                            </div>
                                            <button type="button" className="btn btn-sm btn-danger h-10"
                                                onClick={() => {
                                                    if (combinationSize === 1) {
                                                        alert('至少要有一組有限誤差與價錢設定');
                                                        return;
                                                    }

                                                    const { prices, boundedErrors } = this.state;
                                                    this.setState({
                                                        prices: prices.filter((_, idx) => idx !== n),
                                                        boundedErrors: boundedErrors.filter((_, idx) => idx !== n),
                                                        combinationSize: combinationSize - 1
                                                    });
                                                }}>
                                                刪除欄位
                                            </button>
                                        </div>
                                    );
                                })
                            }
                        </div>

                        <div className="flex items-center justify-center">
                            <button type="submit" className={'btn btn-lg ' + (disabled ? 'bg-gray-300 cursor-not-allowed' : 'btn-success')}>新增資料集</button>
                            <button type="button" className={'btn btn-lg ml-6 ' + (disabled ? 'bg-gray-300 cursor-not-allowed' : 'btn-warning')}
                                onClick={() => {
                                    if (disabled) return;
                                    this.setState({ ...this.initialData });
                                }}>
                                全部重置
                                </button>
                            <span className={'btn btn-lg ml-6 ' + (disabled ? 'bg-gray-300 cursor-not-allowed' : 'btn-danger')}>
                                <Link prefetch href={disabled ? '#' : '/'}><a>取消</a></Link>
                            </span>
                        </div>
                    </form>
                </div>
            </Layout>
        );
    }
}

export default withRouter(Register);

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