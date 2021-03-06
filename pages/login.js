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

    async _login(event) {
        event.preventDefault();

        const privateKey = event.target.privateKey.value;

        if (!privateKey) {
            alert('請輸入錢包私鑰字串');
            return;
        }

        this.setState({ disabled: true });
        const res = await fetch('/api/accounts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ privateKey })
        });

        if (res.ok) {
            return Router.push('/');
        } else {
            alert('登入失敗，請重新確認私鑰字串是否正確!');
            this.setState({ disabled: false });
        }
    }

    render() {
        const { disabled } = this.state;

        return (
            <div className="h-screen grid grid-rows-1 grid-flow-col bg-purple-50">
                <div className="place-self-center row-span-1">
                    <div className="ml-6 font-bold absolute top-3 left-1">
                        <Link prefetch href="/">
                            <a className="text-3xl cursor-pointer font-oswald">
                                <span className="relative ml-3 top-0.5">BEDMoB</span>
                            </a>
                        </Link>
                    </div>
                    <div className="group-modal inline-block pt-3" style={{ width: '450px' }}>
                        <div className="header">
                            <div className="title font-bold">登入</div>
                        </div>
                        <div className="px-10 py-6">
                            <form onSubmit={this._login}>
                                <div className="items-center mb-6">
                                    <label className="text-gray-700 text-sm font-bold mb-1" htmlFor="input-privateKey">錢包私鑰</label>
                                    <br />
                                    <input type="text" name="privateKey" id="input-privateKey"
                                        className="form-input w-full shadow appearance-none border rounded mt-3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        placeholder="請輸入私鑰字串" />
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