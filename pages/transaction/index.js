import { Component } from 'react';
import Router from 'next/router';


export default class DefaultTransactionPage extends Component {
    async redirect() {
        return Router.push('/');
    }

    render() {
        this.redirect();
        return (<div></div >);
    }
}