import { Component } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import { withIronSession } from 'next-iron-session';
import cookieConfig from '@/constants/serverSideCookie';


export default class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            disabled: false
        };

        this._login = this._login.bind(this);
    }

    _inputRestrictions(e) {
        if (e.keyCode === 13 || e.which === 13)
            e.preventDefault();

        e = e.target;
        if (!/^\w+$/.test(e.value)) {
            e.value = /^\w+/.exec(e.value);
        } else if (e.value.length > 12) {
            e.value = e.value.substring(0, e.value.length - 1);
        }
        return false;
    }

    async _login(event) {
        event.preventDefault(); // don't redirect the page

        let { account, password } = event.target;
        account = account.value;
        password = password.value;

        if (!account || !password) {
            alert('請輸入帳號及密碼');
            return;
        }

        this.setState({ disabled: true });
        const res = await fetch('/api/accounts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ account, password })
        });

        if (res.ok) {
            return Router.push('/');
        } else {
            alert('登入失敗，請重新確認帳號密碼!');
            this.setState({ disabled: false });
        }
    }

    render() {
        const { disabled } = this.state;

        return (
            <div className="h-screen grid grid-rows-1 grid-cols-3 grid-flow-col bg-purple-50">
                <div className="place-self-center col-span-2 row-span-1">
                    <div className="ml-6 font-bold absolute top-3 left-1">
                        <Link prefetch href="/">
                            <a className="text-3xl cursor-pointer font-oswald">
                                <span className="relative ml-3 top-0.5">BEPDPP</span>
                            </a>
                        </Link>
                    </div>
                    <div className="ml-12 font-bold absolute top-4 left-11/20">
                        <span className="text-gray-600 inline-block">沒有帳戶?</span>
                        <Link href="/signup"><a className="ml-2 text-blue-700 hover:underline">註冊</a></Link>
                    </div>
                    <div className="group-modal inline-block">
                        <div className="header">
                            <div className="title font-bold">登入</div>
                        </div>
                        <div className="body">
                            <form onSubmit={this._login}>
                                <div className="inline-flex items-center mb-6">
                                    <label className="text-gray-700 text-sm font-bold mb-1" htmlFor="input-account">帳號</label>
                                    <input type="text" name="account" id="input-account" className="form-input shadow appearance-none border rounded ml-4 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="請輸入帳號" onKeyUp={this._inputRestrictions} />
                                    <small className="warning hidden">帳號或密碼錯誤</small>
                                </div>
                                <div className="inline-flex items-center mb-8">
                                    <label className="text-gray-700 text-sm font-bold mb-1" htmlFor="input-password">密碼</label>
                                    <input type="password" name="password" id="input-password" className="form-input shadow appearance-none border rounded ml-4 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="請輸入密碼" onKeyUp={this._inputRestrictions} />
                                    <small className="warning hidden">帳號或密碼錯誤</small>
                                </div>
                                <div className="flex items-center justify-between">
                                    <button type="submit" className={'btn ' + (disabled ? 'bg-gray-300 cursor-not-allowed' : 'btn-primary')} disabled={disabled}>
                                        {disabled ? '登入中' : '登入'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="border-l-2">
                </div>
            </div>
        );
    }
}

export const getServerSideProps = withIronSession(
    async ({ req, res }) => {
        const user = req.session.get('user');

        if (user) {
            return {
                redirect: {
                    permanent: false,
                    destination: '/'
                }
            };
        }

        return { props: {} };
    },
    cookieConfig
);