import { Component } from 'react';
import { withRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleUp } from '@fortawesome/free-solid-svg-icons';


class PageTopButton extends Component {
    constructor(props) {
        super(props);
        this.state = { showPageTop: false };
    }

    _removeAnchors = () => {
        const { router } = this.props;
        router.push(router.asPath.split('#')[0]);
    };

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
                href="#page-top" onClick={this._removeAnchors} >
                <FontAwesomeIcon icon={faAngleUp} size="lg" />
            </a>
        );
    }
}

export default withRouter(PageTopButton);