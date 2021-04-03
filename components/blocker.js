import { Component } from 'react';


export default class Blocker extends Component {
    static defaultProps = {
        display: false,
        clickable: true,
        style: {}
    };

    constructor(props) {
        super(props);

        this.state = { display: this.props.display };
    }

    _disabled = (event) => {
        this.setState({ display: false });
    };

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.display !== this.props.display) {
            this.setState({ display: this.props.display });
        }
    }

    render() {
        const { display } = this.state;

        return (
            <div style={{ ...this.props.style }} className={'blocker ' + (display ? 'block' : 'hidden')}
                onClick={this.props.clickable ? this._disabled : null}>
                {this.props.children}
            </div>
        );
    }
}