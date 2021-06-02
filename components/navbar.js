import { Component } from 'react';
import Link from 'next/link';
import Blocker from '@/components/blocker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';


export default class Navbar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            openPanel: false,
            searchRecord: [],
            searchValue: ''
        };
        this._toggleSearchPanel = this._toggleSearchPanel.bind(this);
        this._searchCourse = this._searchCourse.bind(this);
    }

    _toggleSearchPanel() {
        this.setState({
            openPanel: !this.state.openPanel
        });
    }

    _activateSelected(target = 0) {
        return this.props.selectedIdx == target ?
            'bg-indigo-500 text-white' : 'text-gray-700 hover:text-blue-800';
    }

    _loginChecked() {
        return this.props.user !== 'undefined';
    }

    async _searchCourse(event) {
        event.preventDefault();

        const val = event.target.search.value.toLowerCase();
        if (!val) return;

        this.setState({
            searchValue: val
        });
    }

    componentDidMount() {
        document.onkeydown = (event) => {
            if (event.ctrlKey && event.key === 'k') {
                event.preventDefault();
                this._toggleSearchPanel();
            }
        };
    }

    render() {
        const basicLinkStyle = ' px-3 py-2 rounded-md text-sm font-semibold font-mono ';
        const { user } = this.props;

        return (
            <div className="fixed w-screen z-50">
                <nav className="bg-white pb-2 border-b">
                    <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
                        <div className="relative flex items-center justify-between h-16">
                            <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                                <div className="flex-shrink-0 flex items-center -ml-20 relative -top-1">
                                    <Link prefetch href="/">
                                        <a className="mt-2 p-1 rounded-xl font-oswald">
                                            <span className="p-4 relative top-1 text-black text-2xl font-bold cursor-pointer">BEDMoB</span>
                                        </a>
                                    </Link>
                                </div>
                                <div className="flex-auto flex items-center ml-10" onClick={this._toggleSearchPanel} onFocus={this._toggleSearchPanel}>
                                    <button className="relative top-1 group leading-6 font-medium flex items-center space-x-3 sm:space-x-4 text-gray-500 hover:text-black transition-colors duration-200 w-full py-2">
                                        <svg width="24" height="24" fill="none">
                                            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                        </svg>
                                        <span>查詢</span>
                                        <span className="hidden sm:block text-sm leading-5 py-0.5 px-1.5 mt-0.5 border border-gray-700 rounded-md font-oswald">
                                            <span className="sr-only">Press </span>
                                            <kbd className="font-sans"><abbr title="Control" style={{ textDecoration: 'none' }}>Ctrl </abbr></kbd><span className="sr-only"> and </span><kbd className="font-sans">K</kbd><span className="sr-only"> to search</span>
                                        </span>
                                    </button>
                                </div>
                            </div>
                            <div className="hidden mt-2 sm:block sm:ml-6 relative sm:-right-16">
                                <div className="flex space-x-4 last:ml-20" style={{ font: '400 13.3333px Arial' }}>
                                    <Link prefetch href="/"><a className={this._activateSelected(0) + basicLinkStyle}>主頁</a></Link>
                                    <Link prefetch href="/transaction/request">
                                        <a className={this._activateSelected(1) + basicLinkStyle + (this._loginChecked() ? 'block' : 'hidden')}>
                                            資料集請求
                                        </a>
                                    </Link>
                                    <Link prefetch href="/transaction/create">
                                        <a className={this._activateSelected(2) + basicLinkStyle + (this._loginChecked() ? 'block' : 'hidden')}>
                                            資料集登記
                                        </a>
                                    </Link>
                                    <Link prefetch href="/profile">
                                        <a className={this._activateSelected(3) + basicLinkStyle + (this._loginChecked() ? 'block' : 'hidden')}>
                                            個人資料
                                        </a>
                                    </Link>
                                    <Link prefetch href="/login"><a className={this._activateSelected(-1) + basicLinkStyle + (this._loginChecked() ? 'hidden' : 'block')}>登入</a></Link>
                                    <Link prefetch href="/logout"><a className={this._activateSelected(-1) + basicLinkStyle + (this._loginChecked() ? 'block' : 'hidden')}>登出</a></Link>
                                    <Link prefetch href="/signup"><a className={basicLinkStyle + (this._loginChecked() ? 'hidden' : 'block') + ' bg-green-600 hover:bg-green-500 text-white'}>註冊</a></Link>
                                    <span className={`${basicLinkStyle} ${this._loginChecked() ? 'block' : 'hidden'}`}>|</span>
                                    {
                                        /*
                                        this._loginChecked() ?
                                            <span className={basicLinkStyle}>
                                                錢包地址：{user.account}
                                            </span>
                                            : null
                                        */
                                    }
                                    {
                                        this._loginChecked() ?
                                            <span className={basicLinkStyle}>
                                                餘額：{user.balance} ETH
                                            </span>
                                            : null
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
                <Blocker display={this.state.openPanel} style={{ backgroundColor: 'rgba(0, 0, 0, .2)' }}>
                    <div className="relative z-60 w-96 h-80 p-3 px-5 bg-white inline-block position-center rounded-2xl -top-16" onClick={(e) => e.stopPropagation()}>
                        <header className="grid grid-cols-7 gap-0 border-b-2">
                            <FontAwesomeIcon icon={faSearch} size={'lg'} className="mt-1 ml-1" />
                            <form onSubmit={this._searchCourse} className="col-span-6">
                                <input type="text" name="search" className="w-full py-2 -ml-2 -mt-1 text-gray-700 outline-none" autoComplete="off" />
                                <input type="submit" className="hidden" />
                            </form>
                        </header>
                        <main className="pt-3 text-left">
                            <span className="text-lg font-bold">
                                {this.state.searchRecord.length ? '紀錄' : '無搜尋紀錄'}
                            </span>
                            <div>
                                <ul>
                                    {
                                        this.state.searchRecord.map((record) => {
                                            return (
                                                <li>
                                                    <Link>
                                                        <a>
                                                            {record}
                                                        </a>
                                                    </Link>
                                                </li>
                                            );
                                        })
                                    }
                                </ul>
                            </div>
                        </main>
                    </div>
                </Blocker>
            </div >
        );
    }
}