import { Component } from 'react';


export default class Dropdown extends Component {
    constructor(props) {
        super(props);

        this.state = {
            expanded: false,
            selected: this.props.items[this.props.selectedIndex || 0]
        };
    }

    componentDidMount() {
        this.setState({ expanded: this.props.expanded || false });
    }

    _toggleMenu = ({ target }) => {
        const status = target.getAttribute('aria-expanded');

        if (status === 'true' || status === 'menu') {
            target.removeAttribute('aria-expanded');
            this.setState({ expanded: false });
        } else {
            target.setAttribute('aria-expanded', 'true');
            this.setState({ expanded: true });
        }
    };

    _closeMenu = ({ target }) => {
        setTimeout(() => {
            target.removeAttribute('aria-expanded');
            this.setState({ expanded: false });
        }, 300);
    }

    render() {
        return (
            <div className="relative inline-block text-left">
                <span>{this.props.lable || '下拉式選單'}</span>
                <div className="inline-block ml-2">
                    <button type="button" className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500" id="options-menu" aria-expanded={this.state.expanded ? 'true' : 'false'}
                        aria-haspopup="true" onClick={this._toggleMenu} onBlur={this._closeMenu}>
                        {this.state.selected}
                        <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
                <div className={'origin-top-right z-50 absolute right-0 mt-2 w-auto rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none ' + (this.state.expanded ? 'block' : 'hidden')}
                    role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                    <div className="py-1" role="none">
                        {
                            this.props.items.map((item) => {
                                return (
                                    <a key={item} d-val={item}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
                                        role="menuitem" onClick={(event) => {
                                            const selected = this.props.onSelected(event);
                                            this.setState({ selected });
                                        }}>{item}</a>
                                );
                            })
                        }
                    </div>
                </div>
            </div>
        );
    }
}