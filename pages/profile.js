import { Component } from 'react';
import Router from 'next/router';
import { withIronSession } from 'next-iron-session';
import Layout from '@/layouts/layout';
import cookieConfig from '@/constants/serverSideCookie';


export default class Profile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            editMode: false,
            disabled: false,
            publicKey: this.props.user.publicKey || ''
        };
    }

    _edit = async (e) => {
        e.preventDefault();

        const { publicKey } = this.state;
        if (!publicKey) {
            alert('請輸入公鑰');
            return;
        }

        this.setState({ disabled: true });
        const res = await fetch('/api/accounts', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'cache-control': 'no-store, max-age=0'
            },
            body: JSON.stringify({
                condition: {
                    account: this.props.user.account
                },
                update: { publicKey }
            })
        });

        if (res.ok) {
            alert('更改成功!');
            this.setState({
                disabled: false,
                editMode: false
            });

            Router.reload();
        } else {
            alert('更改失敗，請稍後再試!');
            this.setState({ disabled: false });
        }
    };

    componentDidMount() {
        if (!this.props.user.publicKey) {
            alert('請完成公鑰的設定');
        }
    }

    render() {
        const { editMode, disabled, publicKey } = this.state;
        const fieldStyle = 'shadow appearance-none border rounded w-full py-2 px-3 ' +
            'text-gray-700 leading-tight focus:outline-none focus:shadow-outline';

        return (
            <Layout user={this.props.user} selectedIdx={3}>
                <div className="rounded-3xl vertical-center">
                    <div className="border-4 rounded-3xl w-2/3 bg-white">
                        <form className="px-8 py-10 w-2/3 m-center" onSubmit={this._edit}>
                            <span className="block text-gray-700 font-bold mb-4 text-2xl text-center">
                                個人資料
                            </span>
                            <br />

                            <div className="mb-8">
                                <label className="text-gray-700 font-bold mb-2" htmlFor="balance">
                                    錢包餘額：
                                </label>
                                <span id="balance" name="balance" className="ml-3 font-semibold">
                                    {this.props.user.balance + ' ETH'}
                                </span>
                            </div>

                            <div className="mb-8">
                                <label className="text-gray-700 font-bold mb-2" htmlFor="account">
                                    錢包地址
                                </label>
                                <input id="account" name="account" className={fieldStyle + ' mt-2 font-semibold'}
                                    type="text" value={this.props.user.account} readOnly />
                            </div>

                            <div className="mb-8">
                                <label className="text-gray-700 font-bold mb-2" htmlFor="public-key">
                                    公鑰
                                </label>
                                {
                                    !editMode && !this.props.user.publicKey ?
                                        <button type="button" className="ml-4 mb-2 btn btn-sm btn-danger"
                                            onClick={() => this.setState({ editMode: true })}>
                                            編輯
                                        </button>
                                        : null
                                }
                                <input id="public-key" name="public-key" className={fieldStyle + ' mt-2 font-semibold'}
                                    type="text" value={publicKey} readOnly={!editMode}
                                    onChange={({ target }) => this.setState({ publicKey: target.value })}
                                />
                            </div>

                            {
                                editMode && !this.props.user.publicKey ?
                                    <div className="flex items-center justify-center">
                                        <button type="submit" className={'btn btn-lg ' + (disabled ? 'bg-gray-300 cursor-not-allowed' : 'btn-success')}>
                                            變更
                                        </button>
                                        <button className={'btn btn-lg ml-6 ' + (disabled ? 'bg-gray-300 cursor-not-allowed' : 'btn-danger')}
                                            onClick={() => {
                                                this.setState({
                                                    editMode: false,
                                                    publicKey: this.props.user.publicKey || ''
                                                });
                                            }}>
                                            取消
                                        </button>
                                    </div>
                                    : null
                            }
                        </form>
                    </div>
                </div>
            </Layout >
        );
    }
}

export const getServerSideProps = withIronSession(
    async ({ req, res }) => {
        const user = req.session.get('user');

        if (!user) {
            return {
                redirect: {
                    permanent: false,
                    destination: '/'
                }
            };
        }

        return {
            props: { user }
        };
    },
    cookieConfig
);