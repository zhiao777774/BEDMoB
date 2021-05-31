import { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleUp } from '@fortawesome/free-solid-svg-icons';


export default class PageTopButton extends Component {
    constructor(props) {
        super(props);
        this.state = { showPageTop: false };
    }

    _jumpToPageTop(e) {
        e.preventDefault();

        const { target } = e;
        const href = target.getAttribute('href') ||
            target.parentNode.getAttribute('href') ||
            target.parentNode.parentNode.getAttribute('href');

        document.querySelector(href).scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }

    componentDidMount() {
        document.addEventListener('scroll', () => {
            this.setState({
                showPageTop: window.scrollY >= window.innerHeight / 3
            });
        })
    }

    render() {
        return (
            <a className={'scroll-to-top rounded hover:bg-gray-700 ' + (this.state.showPageTop ? 'block' : 'hidden')}
                href="#page-top" onClick={this._jumpToPageTop} >
                <FontAwesomeIcon icon={faAngleUp} size="lg" />
            </a>
        );
    }
}